import { z } from 'zod';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, mkdir, writeFile, rename, open, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JsonResumeSchema } from '@portfolio/resume-adapter';

export const ResumeMetadataSchema = z.object({
  id: z.string().min(1), name: z.string().min(1), slug: z.string().min(1),
  tags: z.array(z.string()), isPublic: z.boolean(), isLocked: z.boolean(),
  createdAt: z.string().datetime(), updatedAt: z.string().datetime(),
}).passthrough();
export const ResumeResponseSchema = ResumeMetadataSchema.extend({
  data: z.object({
    basics: z.object({ name: z.string(), headline: z.string(), email: z.string() }).passthrough(),
    sections: z.object({ projects: z.object({ items: z.array(z.object({ name: z.string(), description: z.string() }).passthrough()) }).passthrough() }).passthrough(),
  }).passthrough(),
});
const ErrorSchema = z.object({ code: z.string(), status: z.number().int() }).passthrough();
const JournalSchema = z.object({ fingerprint: z.string(), status: z.enum(['pending', 'complete']), beforeIds: z.array(z.string()), resumeId: z.string().optional() });

export class ReactiveResumeError extends Error {
  constructor(code, status = 0) { super(`Reactive Resume request failed (${code}${status ? `, HTTP ${status}` : ''}).`); this.code = code; this.status = status; }
}
export class AmbiguousWriteError extends ReactiveResumeError {
  constructor() { super('AMBIGUOUS_WRITE'); this.message = 'Resume import may have completed. Re-fetch and reconcile the journal before another import; no automatic write retry was made.'; }
}

export function readEnvironment(env = process.env) {
  if (!env.REACTIVE_RESUME_API_URL || !env.REACTIVE_RESUME_API_KEY) throw new ReactiveResumeError('MISSING_ENV');
  let instance;
  try { instance = new URL(env.REACTIVE_RESUME_API_URL); } catch { throw new ReactiveResumeError('INVALID_API_URL'); }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(instance.hostname);
  if (instance.username || instance.password || instance.search || instance.hash || (instance.protocol !== 'https:' && !(instance.protocol === 'http:' && local))) throw new ReactiveResumeError('INVALID_API_URL');
  const timeoutMs = Number(env.REACTIVE_RESUME_TIMEOUT_MS || 45000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 120000) throw new ReactiveResumeError('INVALID_TIMEOUT');
  const pathname = instance.pathname.replace(/\/$/, '');
  instance.pathname = pathname.endsWith('/api/openapi') ? pathname : `${pathname}/api/openapi`;
  return { baseUrl: instance.toString().replace(/\/$/, ''), apiKey: env.REACTIVE_RESUME_API_KEY, timeoutMs,
    stateDir: env.REACTIVE_RESUME_STATE_DIR || fileURLToPath(new URL('../.state/', import.meta.url)) };
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
export const contentFingerprint = value => createHash('sha256').update(JSON.stringify(canonical(JsonResumeSchema.parse(value)))).digest('hex');
const normalizeText = value => value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
function importedContentMatches(remote, expected) {
  if (remote.data.basics.name !== expected.basics.name || remote.data.basics.headline !== expected.basics.label || remote.data.basics.email !== (expected.basics.email || '')) return false;
  const items = remote.data.sections.projects.items;
  if (items.length !== expected.projects.length) return false;
  return expected.projects.every(project => items.some(item => item.name === project.name && project.highlights.every(highlight => normalizeText(item.description).includes(normalizeText(highlight)))));
}

export function createReactiveResumeClient({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
  const { baseUrl, apiKey, timeoutMs, stateDir } = readEnvironment(env);
  async function request(path, { method = 'GET', body, schema, binary = false } = {}) {
    for (let attempt = 0; attempt < (method === 'GET' ? 2 : 1); attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const multipart = body instanceof FormData;
        const response = await fetchImpl(`${baseUrl}${path}`, { method, redirect: 'error', signal: controller.signal,
          headers: { 'x-api-key': apiKey, ...(body && !multipart ? { 'Content-Type': 'application/json' } : {}) },
          ...(body ? { body: multipart ? body : JSON.stringify(body) } : {}) });
        if (!response.ok) {
          let code = 'HTTP_ERROR';
          try { const parsed = ErrorSchema.safeParse(await response.json()); if (parsed.success) code = /^[A-Z_]+$/.test(parsed.data.code) ? parsed.data.code : code; } catch {}
          const error = new ReactiveResumeError(code, response.status);
          if (method === 'GET' && attempt === 0 && (response.status === 429 || response.status >= 500)) continue;
          throw error;
        }
        if (binary) {
          if (!(response.headers.get('content-type') || '').toLowerCase().includes('application/pdf')) throw new ReactiveResumeError('INVALID_PDF_CONTENT_TYPE');
          const bytes = new Uint8Array(await response.arrayBuffer());
          if (bytes.length < 128 || bytes.length > 50 * 1024 * 1024 || Buffer.from(bytes.subarray(0, 5)).toString() !== '%PDF-' || !Buffer.from(bytes.subarray(Math.max(0, bytes.length - 2048))).includes(Buffer.from('%%EOF'))) throw new ReactiveResumeError('INVALID_PDF_BYTES');
          return bytes;
        }
        let json;
        try { json = await response.json(); } catch { throw new ReactiveResumeError('INVALID_JSON_RESPONSE'); }
        const parsed = schema.safeParse(json);
        if (!parsed.success) throw new ReactiveResumeError('INVALID_RESPONSE_SCHEMA');
        return parsed.data;
      } catch (error) {
        if (error instanceof ReactiveResumeError) throw error;
        if (method === 'GET' && attempt === 0) continue;
        throw new ReactiveResumeError(controller.signal.aborted ? 'TIMEOUT' : 'NETWORK_ERROR');
      } finally { clearTimeout(timer); }
    }
    throw new ReactiveResumeError('READ_RETRY_EXHAUSTED');
  }
  const readResume = id => request(`/resumes/${encodeURIComponent(z.string().min(1).parse(id))}`, { schema: ResumeResponseSchema });
  async function listResumes() {
    const results = [];
    for (let offset = 0; offset <= 10000; offset += 100) {
      const page = await request(`/resumes?limit=100&offset=${offset}`, { schema: z.array(ResumeMetadataSchema) });
      results.push(...page);
      if (page.length < 100) return results;
    }
    throw new ReactiveResumeError('PAGINATION_LIMIT');
  }
  async function writeJournal(path, value) {
    await mkdir(stateDir, { recursive: true });
    const temporary = `${path}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(JournalSchema.parse(value), null, 2), { mode: 0o600 });
    await rename(temporary, path);
  }
  async function setMetadata(id, patch) {
    const desired = z.object({ name: z.string().min(1).optional(), tags: z.array(z.string()).optional(), isPublic: z.boolean().optional() }).strict().parse(patch);
    const matches = resource => Object.entries(desired).every(([key, value]) => JSON.stringify(resource[key]) === JSON.stringify(value));
    const existing = await readResume(id);
    if (matches(existing)) return existing;
    try { return await request(`/resumes/${encodeURIComponent(id)}/metadata`, { method: 'PATCH', body: desired, schema: ResumeResponseSchema }); }
    catch (error) {
      // The service ignores Idempotency-Key. An uncertain write must be inspected.
      const latest = await readResume(id);
      if (matches(latest)) return latest;
      if (['TIMEOUT', 'NETWORK_ERROR', 'INVALID_RESPONSE_SCHEMA', 'INVALID_JSON_RESPONSE'].includes(error.code) || error.status >= 500) throw new AmbiguousWriteError();
      throw error;
    }
  }
  async function reconcile(journal, expected) {
    const resources = await listResumes();
    const operationTag = `portfolio:${journal.fingerprint}`;
    const tagged = resources.filter(item => item.tags.includes(operationTag));
    if (tagged.length > 1) throw new AmbiguousWriteError();
    if (tagged.length === 1) return readResume(tagged[0].id);
    if (journal.resumeId) return readResume(journal.resumeId);
    const newCandidates = resources.filter(item => !journal.beforeIds.includes(item.id));
    const matches = [];
    for (const resource of newCandidates) {
      const full = await readResume(resource.id);
      if (importedContentMatches(full, expected)) matches.push(full);
    }
    if (matches.length !== 1) throw new AmbiguousWriteError();
    return matches[0];
  }
  async function importJsonResumeUnlocked(input, { name } = {}) {
    const resume = JsonResumeSchema.parse(input);
    const fingerprint = contentFingerprint(resume);
    const journalPath = resolve(stateDir, `${fingerprint}.json`);
    let journal;
    try { journal = JournalSchema.parse(JSON.parse(await readFile(journalPath, 'utf8'))); }
    catch (error) { if (error.code !== 'ENOENT') throw new ReactiveResumeError('INVALID_IMPORT_JOURNAL'); }
    const resumed = Boolean(journal);
    let imported;
    if (journal) imported = await reconcile(journal, resume);
    else {
      const resources = await listResumes();
      const existing = resources.filter(item => item.tags.includes(`portfolio:${fingerprint}`));
      if (existing.length > 1) throw new AmbiguousWriteError();
      if (existing.length === 1) return { id: existing[0].id, reused: true, fingerprint };
      journal = { fingerprint, status: 'pending', beforeIds: resources.map(item => item.id) };
      await writeJournal(journalPath, journal);
      const form = new FormData();
      form.set('format', 'JSON_RESUME');
      form.set('file', new Blob([JSON.stringify(resume)], { type: 'application/json' }), 'resume.json');
      try {
        journal.resumeId = await request('/resumes/file-imports', { method: 'POST', body: form, schema: z.string().min(1) });
      } catch (error) {
        if (error.status >= 400 && error.status < 500) {
          await rm(journalPath, { force: true });
          throw error;
        }
        imported = await reconcile(journal, resume);
        journal.resumeId = imported.id;
        await writeJournal(journalPath, journal);
      }
      if (journal.resumeId) {
        await writeJournal(journalPath, journal);
        imported = await readResume(journal.resumeId);
      }
    }
    await setMetadata(imported.id, { ...(name ? { name } : {}), tags: [...new Set([...imported.tags, `portfolio:${fingerprint}`])], isPublic: false });
    await writeJournal(journalPath, { ...journal, resumeId: imported.id, status: 'complete' });
    return { id: imported.id, reused: resumed, fingerprint };
  }
  async function importJsonResume(input, options = {}) {
    const fingerprint = contentFingerprint(input);
    await mkdir(stateDir, { recursive: true });
    const lockPath = resolve(stateDir, `${fingerprint}.lock`);
    let lock;
    try { lock = await open(lockPath, 'wx', 0o600); }
    catch (error) { if (error.code === 'EEXIST') throw new ReactiveResumeError('IMPORT_BUSY'); throw new ReactiveResumeError('IMPORT_JOURNAL_UNAVAILABLE'); }
    try { return await importJsonResumeUnlocked(input, options); }
    finally { await lock.close(); await rm(lockPath, { force: true }); }
  }
  async function downloadPdf(id) {
    // Verify ownership/schema through the read endpoint before exporting.
    await readResume(id);
    return request(`/resumes/${encodeURIComponent(id)}/exports/pdf`, { binary: true });
  }
  return { listResumes, readResume, setMetadata, importJsonResume, downloadPdf };
}

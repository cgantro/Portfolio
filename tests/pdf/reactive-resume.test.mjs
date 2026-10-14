import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { careerData } from '../../packages/career-data/src/index.ts';
import { toJsonResume } from '../../packages/resume-adapter/src/index.mjs';
import { createReactiveResumeClient, readEnvironment, contentFingerprint } from '../../integrations/reactive-resume/src/client.mjs';

const env = { REACTIVE_RESUME_API_URL: 'https://resume.example.test', REACTIVE_RESUME_API_KEY: 'unit-test-secret', REACTIVE_RESUME_TIMEOUT_MS: '100' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
function resource(resume, tags = []) {
  return { id: 'resume-1', name: 'Test Resume', slug: 'test-resume', tags, isPublic: false, isLocked: false, createdAt: '2026-10-15T00:00:00.000Z', updatedAt: '2026-10-15T00:00:00.000Z',
    data: { basics: { name: resume.basics.name, headline: resume.basics.label, email: resume.basics.email }, sections: { projects: { items: resume.projects.map(project => ({ name: project.name, description: project.highlights.join(' ') })) } } } };
}

test('credentials are environment-only and unsafe URLs fail without exposing secrets', () => {
  assert.throws(() => readEnvironment({}), /MISSING_ENV/);
  assert.throws(() => readEnvironment({ ...env, REACTIVE_RESUME_API_URL: 'https://user:password@resume.example.test' }), /INVALID_API_URL/);
  assert.throws(() => readEnvironment({ ...env, REACTIVE_RESUME_API_URL: 'http://remote.example.test' }), /INVALID_API_URL/);
  assert.equal(readEnvironment({ ...env, REACTIVE_RESUME_API_URL: 'http://localhost:3000' }).baseUrl, 'http://localhost:3000/api/openapi');
});

test('invalid API response is rejected and server error messages cannot disclose a token', async () => {
  const malformed = createReactiveResumeClient({ env, fetchImpl: async () => json([{ id: 'incomplete' }]) });
  await assert.rejects(malformed.listResumes(), /INVALID_RESPONSE_SCHEMA/);
  const privateError = createReactiveResumeClient({ env, fetchImpl: async () => json({ code: 'UNAUTHORIZED', status: 401, message: env.REACTIVE_RESUME_API_KEY }, 401) });
  await assert.rejects(privateError.listResumes(), error => error.code === 'UNAUTHORIZED' && !error.message.includes(env.REACTIVE_RESUME_API_KEY));
});

test('read timeout is bounded and retries exactly once', async () => {
  let calls = 0;
  const client = createReactiveResumeClient({ env, fetchImpl: async (_, options) => {
    calls++;
    return new Promise((_, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted'))));
  } });
  await assert.rejects(client.listResumes(), /TIMEOUT/);
  assert.equal(calls, 2);
});

test('ambiguous import re-fetches resource before any retry and repeated calls reuse it', async () => {
  const state = await mkdtemp(resolve(tmpdir(), 'portfolio-rr-'));
  const { resume } = toJsonResume(careerData, 'cpp-software');
  const full = resource(resume);
  let imported = false;
  let posts = 0;
  const methods = [];
  try {
    const client = createReactiveResumeClient({ env: { ...env, REACTIVE_RESUME_STATE_DIR: state }, fetchImpl: async (url, options) => {
      methods.push(options.method);
      assert.equal(options.headers['x-api-key'], env.REACTIVE_RESUME_API_KEY);
      assert.equal(options.headers['Idempotency-Key'], undefined);
      if (options.method === 'POST') { posts++; imported = true; throw new Error('socket closed after commit'); }
      if (options.method === 'PATCH') { const desired = JSON.parse(options.body); Object.assign(full, desired); return json(full); }
      if (url.includes('?limit=')) return json(imported ? [full] : []);
      return json(full);
    } });
    const result = await client.importJsonResume(resume, { name: 'C++ 응용 소프트웨어' });
    assert.equal(result.id, 'resume-1');
    assert.ok(methods.indexOf('GET', methods.indexOf('POST') + 1) > methods.indexOf('POST'));
    assert.ok(full.tags.includes(`portfolio:${contentFingerprint(resume)}`));
    await client.importJsonResume(resume);
    assert.equal(posts, 1);
  } finally { await rm(state, { recursive: true, force: true }); }
});

test('definitive import rejection clears the pending journal so a corrected retry can proceed', async () => {
  const state = await mkdtemp(resolve(tmpdir(), 'portfolio-rr-retry-'));
  const { resume } = toJsonResume(careerData, 'cpp-software');
  const full = resource(resume);
  let posts = 0;
  try {
    const client = createReactiveResumeClient({ env: { ...env, REACTIVE_RESUME_STATE_DIR: state }, fetchImpl: async (url, options) => {
      if (options.method === 'POST') {
        posts++;
        if (posts === 1) return json({ code: 'INVALID_IMPORT', status: 400 }, 400);
        return json('resume-1');
      }
      if (options.method === 'PATCH') { Object.assign(full, JSON.parse(options.body)); return json(full); }
      if (url.includes('/resumes/resume-1')) return json(full);
      return json([]);
    } });
    await assert.rejects(client.importJsonResume(resume), /HTTP 400/);
    const result = await client.importJsonResume(resume);
    assert.equal(result.id, 'resume-1');
    assert.equal(posts, 2);
  } finally { await rm(state, { recursive: true, force: true }); }
});

test('unresolved ambiguous import journal blocks repeated duplicate writes', async () => {
  const state = await mkdtemp(resolve(tmpdir(), 'portfolio-rr-ambiguous-'));
  const { resume } = toJsonResume(careerData);
  let posts = 0;
  try {
    const client = createReactiveResumeClient({ env: { ...env, REACTIVE_RESUME_STATE_DIR: state }, fetchImpl: async (_, options) => {
      if (options.method === 'POST') { posts++; throw new Error('unknown outcome'); }
      return json([]);
    } });
    await assert.rejects(client.importJsonResume(resume), /may have completed/);
    await assert.rejects(client.importJsonResume(resume), /may have completed/);
    assert.equal(posts, 1);
  } finally { await rm(state, { recursive: true, force: true }); }
});

test('uncertain metadata write re-fetches and accepts an already committed result', async () => {
  const { resume } = toJsonResume(careerData);
  const full = resource(resume);
  let patches = 0;
  let reads = 0;
  const client = createReactiveResumeClient({ env, fetchImpl: async (_, options) => {
    if (options.method === 'PATCH') { patches++; full.name = 'Updated'; throw new Error('timeout after commit'); }
    reads++; return json(full);
  } });
  const result = await client.setMetadata(full.id, { name: 'Updated' });
  assert.equal(result.name, 'Updated');
  assert.equal(patches, 1);
  assert.equal(reads, 2);
});

test('PDF download fails for HTML response, even with a successful HTTP status', async () => {
  const { resume } = toJsonResume(careerData);
  const full = resource(resume);
  const client = createReactiveResumeClient({ env, fetchImpl: async url => url.endsWith('/exports/pdf') ? new Response('<html>error</html>', { headers: { 'content-type': 'text/html' } }) : json(full) });
  await assert.rejects(client.downloadPdf(full.id), /INVALID_PDF_CONTENT_TYPE/);
});

test('concurrent imports sharing the journal cannot both create a resume', async () => {
  const state = await mkdtemp(resolve(tmpdir(), 'portfolio-rr-lock-'));
  const { resume } = toJsonResume(careerData);
  const full = resource(resume);
  let markStarted;
  const started = new Promise(resolveStarted => { markStarted = resolveStarted; });
  let release;
  const released = new Promise(resolveReleased => { release = resolveReleased; });
  let posts = 0;
  try {
    const client = createReactiveResumeClient({ env: { ...env, REACTIVE_RESUME_STATE_DIR: state }, fetchImpl: async (url, options) => {
      if (options.method === 'POST') { posts++; markStarted(); await released; return json(full.id); }
      if (options.method === 'PATCH') { Object.assign(full, JSON.parse(options.body)); return json(full); }
      if (url.includes('?limit=')) return json([]);
      return json(full);
    } });
    const first = client.importJsonResume(resume);
    await started;
    await assert.rejects(client.importJsonResume(resume), /IMPORT_BUSY/);
    release();
    await first;
    assert.equal(posts, 1);
  } finally { release?.(); await rm(state, { recursive: true, force: true }); }
});

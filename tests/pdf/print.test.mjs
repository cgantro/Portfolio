import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, access, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { careerData } from '../../packages/career-data/src/index.ts';
import { selectEdition } from '../../packages/resume-adapter/src/index.mjs';
import { renderPortfolio, preparePortfolio, escapeHtml } from '../../apps/print/src/render.mjs';
import { validatePdf } from '../../apps/print/src/pdf.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
test('print document retains Korean project content, edu/cert entries and evidence IDs', () => {
  const selected = selectEdition(careerData);
  const html = renderPortfolio(selected, '');
  assert.match(html, /lang="ko"/);
  assert.match(html, /광운대학교/);
  assert.match(html, /OPIc IH/);
  assert.match(html, /아카데미 14기/);
  for (const project of selected.projects) {
    assert.ok(html.includes(project.title));
    assert.ok(html.includes(project.contributions[0].evidenceIds[0]));
  }
  assert.equal(escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;');
});

test('offline prepare maps /assets/ to tracked asset/ and writes honest adapter losses', async () => {
  const output = await mkdtemp(resolve(tmpdir(), 'portfolio-print-'));
  try {
    await preparePortfolio(careerData, 'video-software', { root, outputDir: output });
    const selected = selectEdition(careerData, 'video-software');
    for (const project of selected.projects) await access(resolve(output, 'assets', `${project.id}-architecture${project.architecture.src.slice(project.architecture.src.lastIndexOf('.'))}`));
    const html = await readFile(resolve(output, 'portfolio.html'), 'utf8');
    assert.ok(html.includes('assets/robotpal-architecture'));
    const report = JSON.parse(await readFile(resolve(output, 'resume.loss-report.json'), 'utf8'));
    assert.equal(report.edition, 'video-software');
    assert.ok(report.omitted.length > 0);
  } finally { await rm(output, { recursive: true, force: true }); }
});

test('PDF validation rejects missing output and renamed HTML instead of claiming export success', async () => {
  const output = await mkdtemp(resolve(tmpdir(), 'portfolio-bad-pdf-'));
  try {
    await assert.rejects(validatePdf(resolve(output, 'missing.pdf')), /ENOENT/);
    const fake = resolve(output, 'not-a-pdf.pdf');
    await writeFile(fake, '<html>not a PDF</html>');
    await assert.rejects(validatePdf(fake), /not a real PDF/);
  } finally { await rm(output, { recursive: true, force: true }); }
});

test('resume export returns nonzero when there is no configured live resume', () => {
  const result = spawnSync(process.execPath, ['--import', 'tsx', resolve(root, 'packages/resume-adapter/src/cli.mjs'), 'export'], {
    cwd: root, encoding: 'utf8', windowsHide: true,
    env: { ...process.env, REACTIVE_RESUME_ID: '', REACTIVE_RESUME_API_URL: '', REACTIVE_RESUME_API_KEY: '' },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /MISSING_RESUME_ID_ENV/);
  assert.ok(!result.stdout.includes('PDF exists'));
});

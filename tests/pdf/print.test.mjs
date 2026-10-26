import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, access, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { careerData } from '../../packages/career-data/src/index.ts';
import { selectEdition } from '../../packages/resume-adapter/src/index.mjs';
import { renderPortfolio, preparePortfolio, escapeHtml } from '../../apps/print/src/render.mjs';
import { validatePdf } from '../../apps/print/src/pdf.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
test('print document presents Korean project narratives without internal audit markers', () => {
  const selected = selectEdition(careerData);
  const html = renderPortfolio(selected, '');
  assert.match(html, /lang="ko"/);
  assert.match(html, /광운대학교/);
  assert.match(html, /OPIc IH/);
  assert.match(html, /아카데미 14기/);
  for (const project of selected.projects) {
    assert.ok(html.includes(project.title));
    assert.ok(html.includes(project.summary[0]));
  }
  assert.match(html, /접촉 처리의 반복 안정성/);
  assert.match(html, /메인 스레드에서는 프레임을 인코딩 큐에 넣고 바로 돌아오도록 바꿨습니다/);
  assert.match(html, /프로젝트 개요[\s\S]*주요 기능[\s\S]*담당 역할[\s\S]*트러블슈팅[\s\S]*결과/);
  assert.match(html, /게이트 도착 메시지 처리 중 서버가 차량을/);
  assert.doesNotMatch(html, /프로젝트 근거|검증 범위|dronesim-source|robotpal-benchmark/);
  assert.equal(escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
test('offline prepare maps /assets/ to tracked asset/ and writes honest adapter losses', async () => {
  const output = await mkdtemp(resolve(tmpdir(), 'portfolio-print-'));
  try {
    await preparePortfolio(careerData, 'general', { root, outputDir: output });
    const selected = selectEdition(careerData, 'general');
    for (const project of selected.projects) await access(resolve(output, 'assets', `${project.id}-architecture${project.architecture.src.slice(project.architecture.src.lastIndexOf('.'))}`));
    const html = await readFile(resolve(output, 'portfolio.html'), 'utf8');
    assert.ok(html.includes('assets/robotpal-architecture'));
    const report = JSON.parse(await readFile(resolve(output, 'resume.loss-report.json'), 'utf8'));
    assert.equal(report.edition, 'general');
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

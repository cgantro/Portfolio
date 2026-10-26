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
  assert.match(html, /접촉 판정이 반복마다 달라짐/);
  assert.match(html, /워커 4개/);
  assert.match(html, /마이크 입력 버퍼/);
  assert.match(html, /오래된 MQTT 상태가 최신 값을 덮음/);
  assert.match(html, /데이터베이스 반영 전에 차량 명령이 발행될 수 있음/);
  assert.match(html, /Redis Streams/);
  assert.match(html, /프로젝트 개요[\s\S]*주요 기능[\s\S]*담당 역할[\s\S]*트러블슈팅[\s\S]*결과/);
  assert.match(html, /<strong>문제<\/strong>/);
  assert.doesNotMatch(html, /\*\*문제\*\*/);
  assert.doesNotMatch(html, /오래된 음성 대기열|게이트 도착 메시지 처리 중 서버가|커밋 전에 운행 명령이 먼저 발행/);
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

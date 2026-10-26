import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CareerDataSchema, ProjectSchema, EvidenceSchema, PartialDateSchema } from '../../packages/schema/src/index';
import { careerData, editions, getProject, getProjectsForEdition, serializeCareerData } from '../../packages/career-data/src/index';
import { defaultContentDirectory, discoverContentDirectory, loadCareerData, parseFactsYaml } from '../../packages/career-data/src/loader';

const root = fileURLToPath(new URL('../../', import.meta.url));
test('content discovery supports a relocated Astro module from app and package directories', () => {
  const bundledUrl = new URL('../../apps/web/dist/.prerender/chunk.mjs', import.meta.url).href;
  for (const cwd of [root, join(root, 'apps', 'web'), join(root, 'packages', 'career-data')]) {
    assert.equal(resolve(discoverContentDirectory(cwd, bundledUrl)), resolve(defaultContentDirectory));
  }
});
test('shared facts load all four projects and one general edition', () => {
  assert.equal(CareerDataSchema.safeParse(careerData).success, true);
  assert.deepEqual(new Set(careerData.projects.map((project) => project.id)), new Set(['robotpal', 'autowingcar', 'mausoleum', 'dronesim']));
  assert.deepEqual(editions.map((edition) => edition.id), ['general']);
  assert.equal(getProjectsForEdition('general').length, 4);
  assert.equal(getProjectsForEdition('general')[0].id, 'dronesim');
  assert.throws(() => getProjectsForEdition('not-an-edition'), /Unknown career edition/);
  assert.deepEqual(JSON.parse(serializeCareerData()), careerData);
});

test('reported benchmark values retain conditions and their original limits', () => {
  const robotpal = getProject('robotpal')!;
  const simulation = robotpal.metrics.find((metric) => metric.id === 'simulation-streaming-fps')!;
  const camera = robotpal.metrics.find((metric) => metric.id === 'camera-send-fps')!;
  assert.equal(simulation.value, 96.01);
  assert.equal(simulation.baseline, 66.70);
  assert.equal(camera.value, 40.05);
  assert.equal(camera.baseline, 26.95);
  assert.equal(camera.status, 'reported');
  assert.equal(robotpal.team, '4인');
  assert.deepEqual(
    robotpal.narrativeMarkdown.match(/^## .+$/gm),
    ['## 프로젝트 개요', '## 주요 기능', '## 역할', '## 트러블슈팅', '## 결과'],
  );
  assert.match(camera.conditions.join(' '), /1232×832/);
  assert.match(camera.conditions.join(' '), /5회/);
  assert.match(robotpal.narrativeMarkdown, /목표 60 FPS에 도달하지 못했습니다/);
  assert.match(robotpal.narrativeMarkdown, /2026년 10월 8일/);
  for (const id of ['dronesim', 'mausoleum', 'autowingcar']) {
    assert.deepEqual(
      getProject(id)!.narrativeMarkdown.match(/^## .+$/gm),
      ['## 프로젝트 개요', '## 주요 기능', '## 역할', '## 트러블슈팅', '## 결과'],
    );
  }
  const autowingcar = getProject('autowingcar')!;
  assert.equal(autowingcar.metrics.length, 0);
  assert.ok(autowingcar.limitations.some((text) => text.includes('집계 기준')));
});

test('schema rejects dangling provenance, duplicate evidence, and confidence inflation', () => {
  const missing = structuredClone(getProject('robotpal')!);
  missing.metrics[0].evidenceIds = ['missing-evidence'];
  assert.equal(ProjectSchema.safeParse(missing).success, false);
  const duplicate = structuredClone(getProject('robotpal')!);
  duplicate.evidence.push(duplicate.evidence[0]);
  assert.equal(ProjectSchema.safeParse(duplicate).success, false);
  const inflated = structuredClone(getProject('robotpal')!);
  inflated.metrics[0].status = 'verified';
  assert.equal(ProjectSchema.safeParse(inflated).success, false);
});

test('schema rejects contradictory dates and unrecognized fields', () => {
  const project = structuredClone(getProject('robotpal')!);
  project.endDate = '2024-01';
  assert.equal(ProjectSchema.safeParse(project).success, false);
  assert.equal(ProjectSchema.safeParse({ ...getProject('dronesim'), endDate: '2026-09' }).success, false);
  assert.equal(ProjectSchema.safeParse({ ...getProject('robotpal'), secretNotes: 'untracked' }).success, false);
  assert.equal(PartialDateSchema.safeParse('2026-02-31').success, false);
  assert.equal(PartialDateSchema.safeParse('2024-02-29').success, true);
  assert.equal(PartialDateSchema.safeParse('2026-08').success, true);
});

test('parser rejects duplicate keys and YAML aliases', () => {
  assert.throws(() => parseFactsYaml('id: robotpal\nid: dronesim\n'), /Invalid career YAML/);
  assert.throws(() => parseFactsYaml('a: &data [1, 2]\nb: *data\n'), /alias/i);
});

test('loader rejects mismatch between YAML ID and its selected filename', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'portfolio-facts-'));
  try {
    cpSync(defaultContentDirectory, temporary, { recursive: true });
    const filename = join(temporary, 'projects', 'robotpal.yaml');
    writeFileSync(filename, readFileSync(filename, 'utf8').replace(/^id: robotpal\r?\n/, 'id: dronesim\n'));
    assert.throws(() => loadCareerData(temporary), /does not match ID/);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

test('all public asset references and local evidence sources are tracked files', () => {
  const tracked = new Set(execFileSync('git', ['-c', 'core.quotepath=false', 'ls-files', '-z', 'asset', 'data/projects', 'portfolio'], { cwd: root, encoding: 'utf8' }).split('\0'));
  for (const project of careerData.projects) {
    for (const asset of [project.cover, project.architecture]) {
      const path = `asset/${asset.src.replace(/^\/assets\//, '')}`;
      assert.ok(tracked.has(path), `Asset must already be publicly tracked: ${path}`);
      assert.ok(existsSync(resolve(root, path)));
    }
  }
  const portrait = careerData.profile.portrait;
  if (portrait) assert.ok(tracked.has(`asset/${portrait.src.replace(/^\/assets\//, '')}`));
  for (const record of [careerData.profile, ...careerData.projects, ...careerData.timeline, ...careerData.activities]) {
    for (const evidence of record.evidence) if (!evidence.source.startsWith('https://')) {
      assert.ok(tracked.has(evidence.source), `Evidence must already be publicly tracked: ${evidence.source}`);
    }
  }
});

test('private, absolute, and traversal paths cannot be encoded as public evidence', () => {
  for (const source of ['career-db/project.yaml', 'PRIVATE_NOT_FOR_GITHUB/notes.md', 'D:\\Projects\\Portfolio\\career-db\\record.md', 'C:\\Users\\Owner\\Documents\\private-note.md', '..\\outside\\private-note.md', '/etc/passwd']) {
    assert.equal(EvidenceSchema.safeParse({ id: 'bad', label: 'bad', source, kind: 'public-source', status: 'reported' }).success, false);
  }
});

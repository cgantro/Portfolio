import test from 'node:test';
import assert from 'node:assert/strict';
import { assetUrl, localUrl, projectUrl, evidenceUrl, matchesProject } from '../src/lib/urls.mjs';

test('repository base applies to routes and Korean original asset names', () => {
  assert.equal(localUrl(), '/Portfolio/');
  assert.equal(localUrl('/documents/'), '/Portfolio/documents/');
  assert.equal(assetUrl('/assets/로봇팔 시연.webp'), '/Portfolio/로봇팔 시연.webp');
  assert.equal(assetUrl('/assets/coi-serviceworker.min.js'), '/Portfolio/coi-serviceworker.min.js');
  assert.equal(projectUrl('grasplink'), '/Portfolio/projects/grasplink/');
  assert.equal(assetUrl('https://example.com/a.webp'), 'https://example.com/a.webp');
});

test('evidence URLs distinguish public URLs, assets and repository locators', () => {
  assert.equal(evidenceUrl({ source: 'https://github.com/cgantro/GraspLink', kind: 'repository' }), 'https://github.com/cgantro/GraspLink');
  assert.equal(evidenceUrl({ source: '/assets/grasplink-system-architecture.svg', kind: 'asset' }), '/Portfolio/grasplink-system-architecture.svg');
  assert.equal(evidenceUrl({ source: 'career-db/08_SOURCES/records.json', kind: 'public-source' }), null);
});

test('project search combines title, summary, technologies and category', () => {
  const project = { title: 'GraspLink', subtitle: '로봇 시뮬레이터', category: '로보틱스', summary: ['관절 이동과 충돌 검사'], stack: ['C++17', 'OpenGL'] };
  assert.equal(matchesProject(project, ' opengl ', 'all'), true);
  assert.equal(matchesProject(project, '관절', '로보틱스'), true);
  assert.equal(matchesProject(project, '', '서버'), false);
  assert.equal(matchesProject(project, 'sticker', 'all'), false);
});

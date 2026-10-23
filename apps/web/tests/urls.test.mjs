import test from 'node:test';
import assert from 'node:assert/strict';
import { assetUrl, localUrl, projectUrl, evidenceUrl, matchesProject } from '../src/lib/urls.mjs';

test('repository base applies to routes and Korean original asset names', () => {
  assert.equal(localUrl(), '/Portfolio/');
  assert.equal(localUrl('/documents/'), '/Portfolio/documents/');
  assert.equal(assetUrl('/assets/로봇팔 시연.webp'), '/Portfolio/로봇팔 시연.webp');
  assert.equal(assetUrl('/assets/coi-serviceworker.min.js'), '/Portfolio/coi-serviceworker.min.js');
  assert.equal(projectUrl('dronesim'), '/Portfolio/projects/dronesim/');
  assert.equal(assetUrl('https://example.com/a.webp'), 'https://example.com/a.webp');
});

test('evidence URLs distinguish public URLs, assets and repository locators', () => {
  assert.equal(evidenceUrl({ source: 'https://github.com/cgantro/DroneSim', kind: 'repository' }), 'https://github.com/cgantro/DroneSim');
  assert.equal(evidenceUrl({ source: '/assets/dronesim-system-architecture.svg', kind: 'asset' }), '/Portfolio/dronesim-system-architecture.svg');
  assert.equal(evidenceUrl({ source: 'career-db/08_SOURCES/records.json', kind: 'public-source' }), null);
});

test('project search combines title, summary, technologies and category', () => {
  const project = { title: 'DroneSim', subtitle: '드론 시뮬레이터', category: '시뮬레이션', summary: ['고정 Tick과 시나리오 검증'], stack: ['C++20', 'AirSim'] };
  assert.equal(matchesProject(project, ' airsim ', 'all'), true);
  assert.equal(matchesProject(project, '드론', '시뮬레이션'), true);
  assert.equal(matchesProject(project, '', '서버'), false);
  assert.equal(matchesProject(project, 'sticker', 'all'), false);
});

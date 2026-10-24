import test from 'node:test';
import assert from 'node:assert/strict';
import { assetUrl, localUrl, projectUrl } from '../src/lib/urls.mjs';

test('repository base applies to routes and Korean original asset names', () => {
  assert.equal(localUrl(), '/Portfolio/');
  assert.equal(localUrl('/documents/'), '/Portfolio/documents/');
  assert.equal(assetUrl('/assets/로봇팔 시연.webp'), '/Portfolio/로봇팔 시연.webp');
  assert.equal(assetUrl('/assets/coi-serviceworker.min.js'), '/Portfolio/coi-serviceworker.min.js');
  assert.equal(projectUrl('dronesim'), '/Portfolio/projects/dronesim/');
  assert.equal(assetUrl('https://example.com/a.webp'), 'https://example.com/a.webp');
});

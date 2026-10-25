import test from 'node:test';
import assert from 'node:assert/strict';
import { implementationNarrative } from '../src/lib/narrative.mjs';

test('case-study prose excludes duplicated overview and keeps canonical implementation', () => {
  const markdown = '# Project\n\n## 개요\nOverview\n\n## 구현\n### Queue\nCode\n\n## 문제 해결 과정\n### Bottleneck\nDecision\n\n## 검증 범위와 한계\nLimits';
  const result = implementationNarrative(markdown);
  assert.match(result, /### 구현\n#### Queue\nCode/);
  assert.match(result, /### 문제 해결 과정\n#### Bottleneck\nDecision/);
  assert.doesNotMatch(result, /Overview|Limits|# Project/);
});

test('project-specific technical headings keep their content', () => {
  const markdown = '# DroneSim\n\n## 개요\nOverview\n\n## 충돌 후보 계산 줄이기\nCandidate pruning';
  const result = implementationNarrative(markdown);
  assert.match(result, /### 충돌 후보 계산 줄이기\nCandidate pruning/);
  assert.doesNotMatch(result, /Overview|# DroneSim/);
});

test('a page-specific case study can keep its section headings at the page level', () => {
  const markdown = '# DroneSim\n\n## 고정 Tick과 물리 모델\nDetails\n\n## 시나리오 결과\nResults';
  const result = implementationNarrative(markdown, { headingOffset: 0 });
  assert.match(result, /## 고정 Tick과 물리 모델\nDetails/);
  assert.match(result, /## 시나리오 결과\nResults/);
});

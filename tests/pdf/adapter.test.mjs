import test from 'node:test';
import assert from 'node:assert/strict';
import { careerData } from '../../packages/career-data/src/index.ts';
import { toJsonResume, JsonResumeSchema, selectEdition, eligibleClaims } from '../../packages/resume-adapter/src/index.mjs';

test('the general edition produces a validated JSON Resume with canonical project order', () => {
  for (const id of ['general']) {
    const selected = selectEdition(careerData, id);
    const { resume, lossReport } = toJsonResume(careerData, id);
    assert.ok(JsonResumeSchema.safeParse(resume).success);
    assert.equal(resume.basics.label, selected.edition.headline);
    assert.deepEqual(resume.projects.map(project => project.name), selected.projects.map(project => project.title));
    assert.ok(lossReport.omitted.some(item => item.path.endsWith('.architecture')));
    assert.ok(lossReport.omitted.some(item => item.path.endsWith('.metrics')));
    assert.equal(lossReport.evidence.length, selected.projects.length);
  }
});
test('KWU and SSAFY education, OPIc and Samsung credentials survive without invented precision', () => {
  const { resume } = toJsonResume(careerData);
  assert.ok(resume.education.some(item => item.institution.includes('광운대학교') && item.startDate === '2019-03'));
  assert.ok(resume.education.some(item => item.institution.includes('아카데미 14기') && item.startDate === '2025-07'));
  assert.ok(resume.certificates.some(item => item.name.includes('OPIc IH') && item.date === '2026-02'));
  assert.ok(resume.certificates.some(item => item.name.includes('삼성 SW') && item.date === '2026-03'));
  assert.deepEqual(resume.work, []);
});

test('ongoing project does not invent an end date and no metric loses its conditions into highlights', () => {
  const { resume } = toJsonResume(careerData);
  const grasp = resume.projects.find(project => project.name === careerData.projects.find(project => project.id === 'grasplink').title);
  assert.equal(grasp.endDate, undefined);
  for (const project of resume.projects) assert.equal(project.metrics, undefined);
});

test('unverified claims are excluded and their omission is recorded', () => {
  const input = structuredClone(careerData);
  const project = input.projects[0];
  project.contributions[0].status = 'unverified';
  const claim = project.contributions[0];
  const { resume, lossReport } = toJsonResume(input);
  assert.ok(!resume.projects.find(item => item.name === project.title).highlights.includes(claim.text));
  assert.ok(lossReport.omitted.some(item => item.path.endsWith(claim.id)));
});

test('missing evidence blocks public claims and invalid editions fail before output', () => {
  const project = structuredClone(careerData.projects[0]);
  project.evidence = [];
  assert.deepEqual(eligibleClaims(project), []);
  assert.throws(() => toJsonResume(careerData, '../../escape'), /Unknown edition/);
});

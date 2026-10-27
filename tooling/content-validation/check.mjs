import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { careerData } from '../../packages/career-data/src/index.ts';
import { CareerDataSchema } from '../../packages/schema/src/index.ts';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const errors = [];
CareerDataSchema.parse(careerData);
const tracked = new Set(execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean));
const publicRecords = [careerData.profile, ...careerData.projects, ...careerData.timeline, ...careerData.activities];
for (const record of publicRecords) {
  for (const evidence of record.evidence) {
    if (!evidence.source.startsWith('https://')) {
      const source = evidence.source.startsWith('/assets/') ? `asset/${evidence.source.slice('/assets/'.length)}` : evidence.source;
      if (!tracked.has(source)) errors.push(`Untracked public evidence source: ${evidence.source}`);
    }
  }
  for (const asset of [record.portrait, record.cover, record.architecture].filter(Boolean)) {
    const source = asset.src.replace(/^\/assets\//, 'asset/');
    if (!source.startsWith('https://') && !tracked.has(source)) errors.push(`Untracked public asset source: ${asset.src}`);
  }
}

const projectSections = ['프로젝트 개요', '담당 역할', '주요 기능', '트러블슈팅', '결과'];
for (const project of careerData.projects) {
  const { detail, narrativeMarkdown } = project;
  const headings = [...narrativeMarkdown.matchAll(/^##\s+(.+)$/gm)].map(match => match[1].trim());
  if (projectSections.some((heading, index) => headings[index] !== heading) || headings.length !== projectSections.length) {
    errors.push(`${project.id}: generated narrative must contain the five portfolio sections in order`);
  }
  for (const [index, feature] of detail.features.entries()) {
    if (!feature.title?.trim() || !feature.description?.trim()) errors.push(`${project.id}: feature ${index + 1} is missing its title or description`);
  }
  for (const [index, issue] of detail.troubleshooting.entries()) {
    for (const field of ['symptom', 'cause', 'solution', 'verification']) {
      if (!issue[field]?.trim()) errors.push(`${project.id}: troubleshooting ${index + 1} is missing ${field}`);
    }
  }
  const publicText = [
    ...project.summary, ...detail.features.map(feature => `${feature.title} ${feature.description}`),
    ...detail.roleAreas.flatMap(area => [area.title, ...area.items.map(item => item.text)]),
    ...detail.troubleshooting.flatMap(issue => [issue.title, issue.symptom, issue.cause, issue.solution, issue.verification]),
    ...project.outcomes.map(outcome => outcome.text),
  ].join('\n');
  if (/\b(?:TODO|TBD|FIXME|lorem ipsum)\b/i.test(publicText)) errors.push(`${project.id}: contains a draft placeholder`);
  if (/(^|[/\\])(?:career-db|PRIVATE_NOT_FOR_GITHUB)([/\\]|$)/i.test(publicText)) errors.push(`${project.id}: contains a private source path`);
  if (/(검증 상태|근거 ID|감사 보고서)/.test(publicText)) errors.push(`${project.id}: exposes internal audit wording`);
}

if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Content audit passed: ${careerData.projects.length} structured project details, evidence relations schema-checked.`);
}

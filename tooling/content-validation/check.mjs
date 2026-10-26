import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { careerData } from '../../packages/career-data/src/index.ts';
import { CareerDataSchema } from '../../packages/schema/src/index.ts';

const contentRoot = resolve(fileURLToPath(new URL('../../packages/career-data/content/', import.meta.url)));
const errors = [];
CareerDataSchema.parse(careerData);
const tracked = new Set(execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean));
const publicRecords = [careerData.profile, ...careerData.projects, ...careerData.timeline, ...careerData.activities];
for (const record of publicRecords) {
  for (const evidence of record.evidence) {
    if (evidence.source.startsWith('https://')) continue;
    const source = evidence.source.startsWith('/assets/') ? `asset/${evidence.source.slice('/assets/'.length)}` : evidence.source;
    if (!tracked.has(source)) errors.push(`Untracked public evidence source: ${evidence.source}`);
  }
  for (const asset of [record.portrait, record.cover, record.architecture].filter(Boolean)) {
    const source = asset.src.replace(/^\/assets\//, 'asset/');
    if (!source.startsWith('https://') && !tracked.has(source)) errors.push(`Untracked public asset source: ${asset.src}`);
  }
}
const projectFiles = (await readdir(resolve(contentRoot, 'projects'))).filter(name => name.endsWith('.md'));
const projectTopics = {
  robotpal: /^###\s+.*JPEG 압축/m,
  dronesim: /^###\s+.*(?:상태 보고|충돌 후보)/m,
  mausoleum: /^###\s+.*음성/m,
  autowingcar: /^###\s+.*(?:상태 변경|DB 반영)/m,
};
const projectSections = ['프로젝트 개요', '주요 기능', '역할', '트러블슈팅', '결과'];
for (const filename of projectFiles) {
  const projectId = filename.replace(/\.md$/, '');
  const text = await readFile(resolve(contentRoot, 'projects', filename), 'utf8');
  if (!careerData.projects.some(project => project.id === projectId)) errors.push(`${filename}: no matching canonical YAML project`);
  const headings = [...text.matchAll(/^##\s+(.+)$/gm)].map(match => match[1].trim());
  if (projectSections.some((heading, index) => headings[index] !== heading) || headings.length !== projectSections.length) {
    errors.push(`${filename}: expected the five portfolio sections in order`);
  }
  if (!projectTopics[projectId]?.test(text)) errors.push(`${filename}: missing its project-specific technical section`);
  if (text.length < 500) errors.push(`${filename}: narrative is unexpectedly short (${text.length} characters)`);
  if (/\b(?:TODO|TBD|FIXME|lorem ipsum)\b/i.test(text)) errors.push(`${filename}: contains a draft placeholder`);
  if (/(^|[/\\])(?:career-db|PRIVATE_NOT_FOR_GITHUB)([/\\]|$)/i.test(text)) errors.push(`${filename}: contains a private source path`);
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim();
    if (!/^(https?:\/\/|mailto:|#|\/)/i.test(target)) errors.push(`${filename}: unsupported link target ${target}`);
  }
}
if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Content audit passed: ${projectFiles.length} narratives, ${careerData.projects.length} canonical projects, evidence relations schema-checked.`);
}

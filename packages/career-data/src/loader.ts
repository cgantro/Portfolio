import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';
import { CareerDataSchema, CareerFactsSchema, ProjectFactsSchema, type CareerData, type ProjectFacts } from '@portfolio/schema';

/** Bundlers relocate import.meta.url; discover the same package from a workspace CWD. */
export function discoverContentDirectory(cwd = process.cwd(), moduleUrl = import.meta.url): string {
  const moduleContent = fileURLToPath(new URL('../content/', moduleUrl));
  const hasContent = (directory: string) => existsSync(join(directory, 'career.yaml')) && existsSync(join(directory, 'projects'));
  if (hasContent(moduleContent)) return moduleContent;
  let directory = resolve(cwd);
  while (true) {
    const candidate = join(directory, 'packages', 'career-data', 'content');
    if (hasContent(candidate)) return candidate;
    const parent = dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
  throw new Error(`Public career content not found from ${cwd}. Pass its directory explicitly to loadCareerData.`);
}
export const defaultContentDirectory = discoverContentDirectory();
export function parseFactsYaml(source: string): unknown {
  const document = parseDocument(source, { uniqueKeys: true });
  if (document.errors.length) throw new Error(`Invalid career YAML: ${document.errors.map((error) => error.message).join('; ')}`);
  return document.toJS({ maxAliasCount: 0 });
}
/** Build-time loader: no browser access to the filesystem or source notes. */
export function loadCareerData(contentDirectory = defaultContentDirectory): CareerData {
  const facts = CareerFactsSchema.parse(parseFactsYaml(readFileSync(join(contentDirectory, 'career.yaml'), 'utf8')));
  const projectIds = [...new Set(facts.editions.flatMap((edition) => edition.projectIds))];
  const projects = projectIds.map((id) => {
    // IDs are already validated by EditionSchema; they cannot escape contentDirectory.
    const project = ProjectFactsSchema.parse(parseFactsYaml(readFileSync(join(contentDirectory, 'projects', `${id}.yaml`), 'utf8')));
    if (project.id !== id) throw new Error(`Project filename ${id} does not match ID ${project.id}`);
    const narrativeMarkdown = renderProjectNarrative(project);
    return { ...project, narrativeMarkdown };
  });
  return CareerDataSchema.parse({ ...facts, projects });
}

/** Build print-ready Markdown from the same structured project source used by the web page. */
function renderProjectNarrative(project: ProjectFacts): string {
  const featureLines = project.detail.features.flatMap((item) => [
    `- **${item.title}:** ${item.description}`,
    ...(item.implementation ? [`  ${item.implementation}`] : []),
  ]);
  const roleLines = project.role.map((item) => `- ${item}`);
  const troubleshooting = project.detail.troubleshooting.flatMap((item) => {
    const blocks = [
      `### ${item.title}`,
      `**문제**\n\n${item.symptom}`,
      `**원인**\n\n${item.cause}`,
      `**해결**\n\n${item.solution}`,
      `**확인**\n\n${item.verification}`,
    ];
    if (item.comparison) {
      blocks.push([
        `| 항목 | ${item.comparison.columns.join(' | ')} |`,
        `| --- | ${item.comparison.columns.map(() => '---').join(' | ')} |`,
        ...item.comparison.rows.map((row) => `| ${row.label} | ${row.values.join(' | ')} |`),
        '', item.comparison.caption,
      ].join('\n'));
    }
    if (item.code) blocks.push(`\`\`\`${item.code.language} title="${item.code.path}"\n${item.code.source}\n\`\`\``);
    return blocks;
  });

  return [
    `# ${project.title}`,
    '## 프로젝트 개요', project.detail.overview,
    '## 담당 역할', ...roleLines,
    '## 주요 기능', ...featureLines,
    '## 트러블슈팅', ...troubleshooting,
    '## 결과', ...project.outcomes.map((outcome) => `- ${outcome.text}`),
  ].join('\n\n');
}

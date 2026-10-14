import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';
import { CareerDataSchema, CareerFactsSchema, ProjectFactsSchema, type CareerData } from '@portfolio/schema';

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
    const narrativeMarkdown = readFileSync(join(contentDirectory, 'projects', `${id}.md`), 'utf8');
    return { ...project, narrativeMarkdown };
  });
  return CareerDataSchema.parse({ ...facts, projects });
}

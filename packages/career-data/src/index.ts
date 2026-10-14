import { loadCareerData } from './loader';
import type { Edition, Project } from '@portfolio/schema';

export { loadCareerData, parseFactsYaml } from './loader';
export const careerData = loadCareerData();
export const { profile, projects, timeline, skills, activities, editions } = careerData;
export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}
export function getEdition(id: string): Edition | undefined {
  return editions.find((edition) => edition.id === id);
}
export function getProjectsForEdition(id: string): Project[] {
  const edition = getEdition(id);
  if (!edition) throw new Error(`Unknown career edition: ${id}`);
  return edition.projectIds.map((projectId) => getProject(projectId)!);
}
export function serializeCareerData(): string {
  return JSON.stringify(careerData, null, 2);
}

import { z } from 'zod';
import { CareerDataSchema } from '@portfolio/schema';

const date = z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/);
const publicUrl = z.string().url().refine(value => /^https?:\/\//.test(value));
const strings = z.array(z.string());
const dated = { startDate: date.optional(), endDate: date.optional() };

// Zod validation for the JSON Resume fields emitted by this adapter.
// Custom fields are deliberately kept in the separate loss/evidence report.
export const JsonResumeSchema = z.object({
  basics: z.object({
    name: z.string().min(1), label: z.string(), summary: z.string(),
    email: z.string().email().optional(), url: publicUrl.optional(),
    location: z.object({ city: z.string() }).optional(),
    profiles: z.array(z.object({ network: z.string(), username: z.string(), url: publicUrl })),
  }).strict(),
  projects: z.array(z.object({
    name: z.string(), description: z.string(), highlights: strings,
    keywords: strings, roles: strings, url: publicUrl.optional(), ...dated,
  }).strict()),
  education: z.array(z.object({ institution: z.string(), area: z.string(), ...dated }).strict()),
  certificates: z.array(z.object({ name: z.string(), date: date.optional() }).strict()),
  work: z.array(z.object({ name: z.string(), position: z.string(), summary: z.string(), ...dated }).strict()),
  skills: z.array(z.object({ name: z.string(), keywords: strings }).strict()),
  meta: z.object({ version: z.literal('1.0.0') }).strict(),
}).strict();

export const LossReportSchema = z.object({
  version: z.literal(1), edition: z.string(),
  omitted: z.array(z.object({ path: z.string(), reason: z.string() })),
  flattened: z.array(z.object({ path: z.string(), target: z.string(), reason: z.string() })),
  evidence: z.array(z.object({ projectId: z.string(), claims: z.array(z.object({
    id: z.string(), status: z.string(), evidenceIds: strings,
  })), sources: z.array(z.object({ id: z.string(), label: z.string(), source: z.string(), status: z.string() })) })),
});

export function selectEdition(input, editionId = 'cpp-software') {
  const data = CareerDataSchema.parse(input);
  const edition = data.editions.find(item => item.id === editionId);
  if (!edition) throw new Error(`Unknown edition: ${editionId}`);
  const projects = edition.projectIds.map(id => {
    const project = data.projects.find(item => item.id === id);
    if (!project) throw new Error(`Edition ${editionId} references missing project ${id}`);
    return project;
  });
  return { data, edition, projects };
}

export function eligibleClaims(project) {
  const evidence = new Map(project.evidence.map(item => [item.id, item]));
  return [...project.contributions, ...project.outcomes].filter(claim =>
    claim.status !== 'unverified' && claim.evidenceIds.length > 0 &&
    claim.evidenceIds.every(id => evidence.has(id) && evidence.get(id).status !== 'unverified'));
}

export function eligibleMetrics(project) {
  const evidence = new Map(project.evidence.map(item => [item.id, item]));
  return project.metrics.filter(metric => metric.status !== 'unverified' && metric.conditions.length > 0 &&
    metric.evidenceIds.length > 0 && metric.evidenceIds.every(id => evidence.has(id) && evidence.get(id).status !== 'unverified'));
}

export function toJsonResume(input, editionId = 'cpp-software') {
  const { data, edition, projects } = selectEdition(input, editionId);
  const report = { version: 1, edition: editionId, omitted: [], flattened: [], evidence: [] };
  const dates = (entry, path) => {
    const result = {};
    for (const key of ['startDate', 'endDate']) {
      if (entry[key] && date.safeParse(entry[key]).success) result[key] = entry[key];
      else if (entry[key]) report.omitted.push({ path: `${path}.${key}`, reason: 'Date does not have a supported ISO precision.' });
    }
    return result;
  };
  const resumeProjects = projects.map(project => {
    const path = `projects.${project.id}`;
    const claims = eligibleClaims(project);
    for (const claim of [...project.contributions, ...project.outcomes]) {
      if (!claims.includes(claim)) report.omitted.push({ path: `${path}.claims.${claim.id}`, reason: 'Claim is unverified or has missing/unverified evidence.' });
    }
    report.omitted.push(...['cover', 'architecture', 'narrativeMarkdown', 'limitations', 'team'].map(key => ({
      path: `${path}.${key}`, reason: 'JSON Resume has no equivalent structured field; retained in canonical portfolio data.',
    })));
    if (project.metrics.length) report.omitted.push({ path: `${path}.metrics`, reason: 'Metric conditions, baselines, and evidence cannot be represented faithfully by JSON Resume highlights.' });
    report.flattened.push({ path: `${path}.contributions/outcomes`, target: 'projects.highlights', reason: 'Separate role and outcome categories become plain text highlights.' });
    report.evidence.push({ projectId: project.id, claims: claims.map(({ id, status, evidenceIds }) => ({ id, status, evidenceIds })), sources: project.evidence.map(({ id, label, source, status }) => ({ id, label, source, status })) });
    return { name: project.title, description: project.summary.join(' '), highlights: claims.map(claim => claim.text),
      keywords: project.stack, roles: project.role, ...(project.links.github ? { url: project.links.github } : {}), ...dates(project, path) };
  });
  const profile = data.profile;
  for (const link of profile.links.filter(link => !publicUrl.safeParse(link.url).success)) {
    report.omitted.push({ path: `profile.links.${link.kind}`, reason: 'This auxiliary link is not an HTTP(S) URL; email is mapped separately to basics.email.' });
  }
  report.omitted.push({ path: 'activities', reason: 'Activity record types do not consistently supply JSON Resume volunteer dates or organization fields.' });
  report.omitted.push({ path: 'profile.evidence/limitations', reason: 'Profile provenance and verification limitations have no standard JSON Resume field.' });
  report.omitted.push({ path: 'timeline.evidence/note/tags', reason: 'Timeline provenance and supplemental annotations have no equivalent standard structured field.' });
  report.omitted.push({ path: 'skills.items.detail/evidence/projectIds', reason: 'Skill explanations and project evidence are reduced to name/keywords; no proficiency is inferred.' });
  for (const group of data.skills.filter(group => edition.skillCategories?.length && !edition.skillCategories.includes(group.category))) {
    report.omitted.push({ path: `skills.${group.category}`, reason: 'This skill category is outside the chosen edition focus.' });
  }
  report.flattened.push({ path: 'timeline.education.detail', target: 'education.area', reason: 'Canonical education description is retained without inferring a degree or qualification.' });
  const username = profile.github.replace(/\/$/, '').split('/').at(-1);
  const resume = JsonResumeSchema.parse({
    basics: { name: profile.name, label: edition.headline, summary: profile.summary.join(' '),
      ...(profile.email ? { email: profile.email } : {}), ...(profile.github ? { url: profile.github } : {}),
      ...(profile.location ? { location: { city: profile.location } } : {}),
      profiles: profile.github ? [{ network: 'GitHub', username, url: profile.github }] : [] },
    projects: resumeProjects,
    education: data.timeline.filter(item => item.type === 'edu').map(item => ({ institution: item.title, area: item.detail, ...dates(item, `timeline.${item.id}`) })),
    certificates: data.timeline.filter(item => item.type === 'cert').map(item => ({ name: item.title, ...(item.startDate ? { date: item.startDate } : {}) })),
    work: data.timeline.filter(item => item.type === 'work').map(item => ({ name: item.title, position: item.detail, summary: item.note || '', ...dates(item, `timeline.${item.id}`) })),
    skills: data.skills.filter(group => !edition.skillCategories?.length || edition.skillCategories.includes(group.category)).map(group => ({ name: group.category, keywords: group.items.filter(item => item.projectIds.some(id => edition.projectIds.includes(id))).map(item => item.name) })).filter(group => group.keywords.length),
    meta: { version: '1.0.0' },
  });
  return { resume, lossReport: LossReportSchema.parse(report) };
}

/** Prepared API import plan. v6's JSON_RESUME file importer maps this to ResumeData. */
export function toReactiveResumeImport(input, editionId = 'cpp-software') {
  const { data, edition } = selectEdition(input, editionId);
  const { resume, lossReport } = toJsonResume(data, editionId);
  return { editionId, name: `${data.profile.name} · ${edition.label}`, format: 'JSON_RESUME', resume, lossReport };
}

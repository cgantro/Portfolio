import { z } from 'zod';

const NonEmpty = z.string().trim().min(1);
export const EvidenceStatusSchema = z.enum(['verified', 'reported', 'unverified']);
const PublicSource = NonEmpty.refine((value) => {
  if (/^https:\/\//i.test(value)) {
    try { const url = new URL(value); return !url.username && !url.password; }
    catch { return false; }
  }
  const path = value.startsWith('/assets/') ? value.slice(1) : value;
  if (!path || path.startsWith('/') || path.includes('\\') || /^[A-Za-z]:/.test(path)) return false;
  const segments = path.split('/');
  return segments.every(segment => segment && segment !== '.' && segment !== '..')
    && !/(^|\/)(career-db|PRIVATE_NOT_FOR_GITHUB)(\/|$)/i.test(path);
}, 'Expected HTTPS or a safe repository-relative public path');
const LinkTarget = NonEmpty.refine((value) => /^(https?:\/\/|mailto:|\/[^/])/.test(value), 'Expected a public URL or internal path');
// Dates preserve source precision: a reported month is not turned into an invented day.
export const PartialDateSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/).refine((value) => {
  if (value.length === 7) return true;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Invalid calendar date');
export const EvidenceSchema = z.object({
  id: NonEmpty,
  label: NonEmpty,
  source: PublicSource,
  kind: z.enum(['public-source', 'repository', 'demo', 'asset']),
  status: EvidenceStatusSchema,
  locator: NonEmpty.optional(),
  note: NonEmpty.optional(),
}).strict();
export const ClaimSchema = z.object({
  id: NonEmpty,
  text: NonEmpty,
  evidenceIds: z.array(NonEmpty).min(1),
  status: EvidenceStatusSchema,
}).strict();
export const MetricSchema = z.object({
  id: NonEmpty,
  label: NonEmpty,
  value: z.number().finite(),
  unit: NonEmpty,
  baseline: z.number().finite().optional(),
  conditions: z.array(NonEmpty).min(1),
  evidenceIds: z.array(NonEmpty).min(1),
  status: EvidenceStatusSchema,
}).strict();
const ProjectFeatureSchema = z.object({
  title: NonEmpty,
  description: NonEmpty,
  implementation: NonEmpty.optional(),
  codeSnippets: z.array(z.object({
    language: z.enum(['cpp', 'java', 'json']), title: NonEmpty, source: NonEmpty,
  }).strict()).min(1).optional(),
  processSteps: z.array(NonEmpty).min(2).optional(),
  diagram: z.object({
    src: PublicSource, alt: NonEmpty, caption: NonEmpty,
    width: z.number().int().positive(), height: z.number().int().positive(),
  }).strict().optional(),
  packetDiagram: z.object({
    summary: NonEmpty, src: PublicSource, alt: NonEmpty, caption: NonEmpty,
    width: z.number().int().positive(), height: z.number().int().positive(),
  }).strict().optional(),
  verification: NonEmpty.optional(),
  evidenceIds: z.array(NonEmpty).min(1),
}).strict();
const ProjectDiagramSchema = z.object({ src: PublicSource, alt: NonEmpty, caption: NonEmpty, width: z.number().int().positive(), height: z.number().int().positive() }).strict();
const ProjectRoleAreaSchema = z.object({
  title: NonEmpty,
  items: z.array(z.object({ text: NonEmpty, evidenceIds: z.array(NonEmpty).min(1) }).strict()).min(1),
  diagram: ProjectDiagramSchema.optional(),
}).strict();
const ProjectCodeSchema = z.object({
  path: NonEmpty, language: z.enum(['cpp', 'java']), title: NonEmpty,
  source: NonEmpty, url: z.string().url(),
}).strict();
const ProjectComparisonSchema = z.object({
  caption: NonEmpty,
  columns: z.array(NonEmpty).min(1),
  rows: z.array(z.object({ label: NonEmpty, values: z.array(NonEmpty) }).strict()).min(1),
  evidenceIds: z.array(NonEmpty).min(1),
}).strict().superRefine((comparison, ctx) => {
  comparison.rows.forEach((row, index) => {
    if (row.values.length !== comparison.columns.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['rows', index, 'values'], message: 'Comparison row must match its columns' });
    }
  });
});
const ProjectTroubleshootingSchema = z.object({
  title: NonEmpty, symptom: NonEmpty, cause: NonEmpty, solution: NonEmpty, verification: NonEmpty,
  evidenceIds: z.array(NonEmpty).min(1), metricIds: z.array(NonEmpty),
  comparison: ProjectComparisonSchema.optional(), diagram: ProjectDiagramSchema.optional(), code: ProjectCodeSchema.optional(),
}).strict();
export const ProjectDetailSchema = z.object({
  layout: z.enum(['robotpal', 'dronesim', 'mausoleum', 'autowingcar']),
  overview: NonEmpty,
  verificationScope: z.array(NonEmpty).max(2).optional(),
  features: z.array(ProjectFeatureSchema).min(1),
  postProjectImprovement: ProjectFeatureSchema.optional(),
  roleAreas: z.array(ProjectRoleAreaSchema).min(1),
  troubleshooting: z.array(ProjectTroubleshootingSchema),
}).strict();
export const AssetSchema = z.object({ src: PublicSource, alt: NonEmpty }).strict();
export const LinkSchema = z.object({
  label: NonEmpty, url: LinkTarget, kind: z.enum(['github', 'demo', 'resume', 'contact', 'website']),
}).strict();
export const ProfileSchema = z.object({
  id: NonEmpty, name: NonEmpty, nameEn: NonEmpty, role: NonEmpty, tagline: NonEmpty,
  summary: z.array(NonEmpty).min(1), email: z.string().email(), github: z.string().url(),
  location: NonEmpty, portrait: AssetSchema.optional(), links: z.array(LinkSchema),
  evidence: z.array(EvidenceSchema).min(1), limitations: z.array(NonEmpty),
}).strict();

const ProjectFields = {
  id: z.enum(['robotpal', 'autowingcar', 'mausoleum', 'dronesim']),
  title: NonEmpty, subtitle: NonEmpty, category: NonEmpty,
  summary: z.array(NonEmpty).min(1), period: NonEmpty,
  startDate: PartialDateSchema, endDate: PartialDateSchema.nullable(),
  status: z.enum(['complete', 'ongoing']), team: NonEmpty, role: z.array(NonEmpty).min(1),
  stack: z.array(NonEmpty).min(1), cover: AssetSchema,
  architecture: AssetSchema.extend({ summary: z.array(NonEmpty) }).strict(),
  detail: ProjectDetailSchema,
  links: z.object({ github: z.string().url().nullable(), demo: z.string().url().nullable() }).strict(),
  contributions: z.array(ClaimSchema).min(1), outcomes: z.array(ClaimSchema), metrics: z.array(MetricSchema),
  evidence: z.array(EvidenceSchema).min(1), limitations: z.array(NonEmpty).min(1),
};
function validateProject(project: z.infer<typeof ProjectFactSchema>, ctx: z.RefinementCtx) {
  const ids = new Set<string>();
  project.evidence.forEach((evidence, index) => {
    if (ids.has(evidence.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['evidence', index, 'id'], message: 'Duplicate evidence ID' });
    ids.add(evidence.id);
  });
  for (const field of ['contributions', 'outcomes', 'metrics'] as const) {
    const claimIds = new Set<string>();
    project[field].forEach((claim, index) => {
      if (claimIds.has(claim.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field, index, 'id'], message: 'Duplicate claim ID' });
      claimIds.add(claim.id);
      claim.evidenceIds.forEach((id) => {
        const evidence = project.evidence.find((item) => item.id === id);
        if (!evidence) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field, index, 'evidenceIds'], message: `Unknown evidence: ${id}` });
        else if (claim.status === 'verified' && evidence.status !== 'verified') ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field, index, 'status'], message: 'Verified claims require verified evidence' });
      });
    });
  }
  const detailClaims = [
    ...project.detail.features.map((feature) => feature.evidenceIds),
    ...project.detail.roleAreas.flatMap((area) => area.items.map((item) => item.evidenceIds)),
    ...project.detail.troubleshooting.flatMap((item) => [item.evidenceIds, ...(item.comparison ? [item.comparison.evidenceIds] : [])]),
  ];
  detailClaims.flat().forEach((id) => {
    if (!ids.has(id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['detail'], message: `Unknown detail evidence: ${id}` });
  });
  project.detail.troubleshooting.forEach((item, index) => item.metricIds.forEach((id) => {
    if (!project.metrics.some((metric) => metric.id === id)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['detail', 'troubleshooting', index, 'metricIds'], message: `Unknown metric: ${id}` });
    }
  }));
  if (project.endDate && project.endDate < project.startDate) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'End date precedes start date' });
  if (project.status === 'complete' && !project.endDate) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'Completed projects need an end date' });
  if (project.status === 'ongoing' && project.endDate) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'Ongoing projects must use a null end date' });
}
export const ProjectFactSchema = z.object(ProjectFields).strict();
export const ProjectFactsSchema = ProjectFactSchema.superRefine(validateProject);
export const ProjectSchema = ProjectFactSchema.extend({ narrativeMarkdown: NonEmpty }).strict().superRefine(validateProject);
export const TimelineEntrySchema = z.object({
  id: NonEmpty, type: z.enum(['edu', 'cert', 'work', 'etc']), title: NonEmpty,
  detail: NonEmpty, period: NonEmpty, tags: z.array(NonEmpty), note: NonEmpty.optional(),
  startDate: PartialDateSchema, endDate: PartialDateSchema.nullable(), evidence: z.array(EvidenceSchema).min(1),
}).strict();
export const SkillGroupSchema = z.object({
  category: z.enum(['Languages (프로그래밍 언어)', 'Tech Stack (기술 스택)', 'Tools (개발 도구)']), evidence: NonEmpty,
  items: z.array(z.object({
    name: NonEmpty,
    detail: NonEmpty,
    rating: z.number().int().min(1).max(3),
    projectIds: z.array(ProjectFields.id).min(1),
  }).strict()).min(1),
}).strict();
export const ActivitySchema = z.object({
  id: NonEmpty, title: NonEmpty, subtitle: NonEmpty, period: NonEmpty,
  category: NonEmpty, items: z.array(NonEmpty).min(1), evidence: z.array(EvidenceSchema).min(1),
}).strict();
export const EditionSchema = z.object({
  id: z.enum(['general']), label: NonEmpty, headline: NonEmpty,
  projectIds: z.array(ProjectFields.id).min(1), skillCategories: z.array(NonEmpty),
}).strict();
export const CareerFactsSchema = z.object({
  version: z.literal(2), profile: ProfileSchema, timeline: z.array(TimelineEntrySchema),
  skills: z.array(SkillGroupSchema).length(3), activities: z.array(ActivitySchema), editions: z.array(EditionSchema).min(1),
}).strict();
export const CareerDataSchema = CareerFactsSchema.extend({ projects: z.array(ProjectSchema).min(1) }).strict().superRefine((data, ctx) => {
  const ids = data.projects.map((project) => project.id);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['projects'], message: 'Duplicate project ID' });
  const editionIds = data.editions.map((edition) => edition.id);
  if (new Set(editionIds).size !== editionIds.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['editions'], message: 'Duplicate edition ID' });
  const skillCategories = data.skills.map((group) => group.category);
  if (new Set(skillCategories).size !== skillCategories.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['skills'], message: 'Duplicate skill category' });
  data.editions.forEach((edition, index) => edition.projectIds.forEach((id) => {
    if (!ids.includes(id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['editions', index, 'projectIds'], message: `Missing project: ${id}` });
  }));
  data.editions.forEach((edition, index) => {
    if (new Set(edition.projectIds).size !== edition.projectIds.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['editions', index, 'projectIds'], message: 'Duplicate project within edition' });
    for (const category of edition.skillCategories) {
      if (!data.skills.some((group) => group.category === category)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['editions', index, 'skillCategories'], message: `Missing skill category: ${category}` });
    }
  });
  data.skills.forEach((group, index) => group.items.forEach((skill) => skill.projectIds.forEach((id) => {
    if (!ids.includes(id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['skills', index], message: `Missing project: ${id}` });
  })));
});
export type Evidence = z.infer<typeof EvidenceSchema>;
export type EvidenceStatus = z.infer<typeof EvidenceStatusSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type Metric = z.infer<typeof MetricSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectFacts = z.infer<typeof ProjectFactsSchema>;
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type Edition = z.infer<typeof EditionSchema>;
export type CareerData = z.infer<typeof CareerDataSchema>;

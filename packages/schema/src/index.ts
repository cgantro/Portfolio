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
  id: z.enum(['robotpal', 'autowingcar', 'mausoleum', 'grasplink']),
  title: NonEmpty, subtitle: NonEmpty, category: NonEmpty,
  summary: z.array(NonEmpty).min(1), period: NonEmpty,
  startDate: PartialDateSchema, endDate: PartialDateSchema.nullable(),
  status: z.enum(['complete', 'ongoing']), team: NonEmpty, role: z.array(NonEmpty).min(1),
  stack: z.array(NonEmpty).min(1), cover: AssetSchema,
  architecture: AssetSchema.extend({ summary: z.array(NonEmpty) }).strict(),
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
  category: NonEmpty, evidence: NonEmpty,
  items: z.array(z.object({ name: NonEmpty, detail: NonEmpty, projectIds: z.array(ProjectFields.id).min(1) }).strict()).min(1),
}).strict();
export const ActivitySchema = z.object({
  id: NonEmpty, title: NonEmpty, subtitle: NonEmpty, period: NonEmpty,
  category: NonEmpty, items: z.array(NonEmpty).min(1), evidence: z.array(EvidenceSchema).min(1),
}).strict();
export const EditionSchema = z.object({
  id: z.enum(['cpp-software', 'simulation', 'video-software']), label: NonEmpty, headline: NonEmpty,
  projectIds: z.array(ProjectFields.id).min(1), skillCategories: z.array(NonEmpty),
}).strict();
export const CareerFactsSchema = z.object({
  version: z.literal(2), profile: ProfileSchema, timeline: z.array(TimelineEntrySchema),
  skills: z.array(SkillGroupSchema), activities: z.array(ActivitySchema), editions: z.array(EditionSchema).min(1),
}).strict();
export const CareerDataSchema = CareerFactsSchema.extend({ projects: z.array(ProjectSchema).min(1) }).strict().superRefine((data, ctx) => {
  const ids = data.projects.map((project) => project.id);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['projects'], message: 'Duplicate project ID' });
  const editionIds = data.editions.map((edition) => edition.id);
  if (new Set(editionIds).size !== editionIds.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['editions'], message: 'Duplicate edition ID' });
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

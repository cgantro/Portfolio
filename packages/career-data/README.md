# Public career data

`content/career.yaml` contains shared profile, education, credentials, skill groups,
activities, and edition ordering. `content/projects/*.yaml` is the canonical source
for project facts, user-facing features, implementation areas, troubleshooting cases,
measurements, outcomes, and evidence. The loader validates the structured content
before the website or print renderer can use it, then creates print-ready Markdown from
the same project data. Project pages use semantic Astro layouts rather than rendering
the same Markdown template for every project.

The package exports `careerData`, `profile`, `projects`, `timeline`, `skills`,
`activities`, `editions`, `getProject`, `getEdition`, `getProjectsForEdition`,
`loadCareerData`, `parseFactsYaml`, and `serializeCareerData`.

This is a build-time Node package. Astro and print tools load the same facts.
Browser UI receives serializable data through rendered props or an export endpoint.
`@portfolio/schema` exports the runtime Zod schemas and inferred TypeScript types.

## Evidence policy

- `reported`: an existing public portfolio source reports the statement. This is
  the status of the migrated implementation descriptions and measurements.
- `verified`: a reproducible public artifact independently supports the statement.
  No migrated project measurement is assigned this status.
- `unverified`: the source or interpretation needs confirmation.

Every claim and metric names project-local evidence IDs. Schema validation rejects
dangling IDs, duplicate evidence, and a verified claim backed by weaker evidence.
Metric conditions remain attached to the metric. Configuration values such as an
Opus bitrate are described as configuration, rather than measured improvements.

Canonical facts and narratives live only in this package. Public source records for
active projects are retained under `data/projects/` and cited by evidence entries;
they are provenance, not a second runtime content store. Editable architecture
diagrams live under `data/diagrams/`, while the web site uses separately maintained
SVG files referenced by project YAML. The Mermaid notes and SVGs are maintained
separately; no build step keeps them synchronized. Retired, uncited notes live in
`data/archive/`.
No private database is read by this package. Source links are recorded as repository
paths or public URLs. Private source paths are rejected.
External repository and demo links are recorded from public sources; their current
availability has not been verified during the migration.

RobotPal's team size is user-confirmed as four; older source notes that say two
describe an earlier portfolio record and are no longer used for the public team
count. Its initial development period is retained, and differing follow-up dates
remain documented in `limitations`. AutoWing Car's load figures retain their
report caveats and do not claim a response percentile.

## Editing

Edit the project YAML when a project statement changes. Keep evidence locators and
measurement conditions current. An edition changes the order and emphasis of the
same projects; it does not create a new factual profile.

Focused schema, loader, evidence, and tracked asset tests live in `tests/unit`.
Run from the repository root with `pnpm run test:unit`.

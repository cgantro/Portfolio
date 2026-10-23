# Portfolio V2 working rules

## Source of truth

- Public career facts live in `packages/career-data/content/`; validate them with the workspace Zod schema before using them in the site, resume, or PDFs.
- Keep project facts, evidence status, dates, units, and measurement conditions faithful to real source code, project logs, benchmark records, and user-confirmed career experience. Do not upgrade reported or unverified claims to verified claims, or invent roles, timelines, measured values, technical methods, or results.
- Keep private research under `career-db/` or `PRIVATE_NOT_FOR_GITHUB/`. Never copy private career data, credentials, contact details, or private paths into public content, generated pages, or screenshots.
- The V2 portfolio shell is Astro; React islands provide project search/filter. DroneSim is a separate deployed Emscripten/WebAssembly app. Open it in a new tab only after the visitor launches it. Its WebAssembly build uses the kinematic baseline; native AirSim rigid-body physics is a separate Windows execution path. Do not import the simulator runtime into the portfolio.

## Design and writing

- Follow `apps/web/DESIGN.md` and `apps/web/src/styles/tokens.css`. Use the editorial technical direction, clear evidence hierarchy, responsive layout, and restrained motion.
- Keep primary content readable without JavaScript. Add JavaScript only for a real interaction.
- Korean copy should sound like clear technical documentation. For resumes and cover letters, use a professional connected technical register; preserve the author's voice, technical terms, numbers, and claims.
- Prefer a specific issue, cause, implementation, and measured result over generic claims. Include measurement conditions and evidence links wherever a number appears. Keep measured facts separate from plans, hypotheses, and intended implementations.
- Do not add decorative card grids, fake controls, invented performance claims, or animation without a user benefit.

## Validation and delivery

- After content changes, run `pnpm validate:content` and `pnpm validate:resume`.
- Before a release, run `pnpm run build`, `pnpm run test:unit`, `pnpm run test:e2e`, `pnpm run test:visual`, and `pnpm validate:pdf`.
- For visual review, capture 375px, 768px, and 1440px viewports and save findings with page, state, evidence, and a concrete fix. Use Playwright evidence, separate subjective taste from reproducible defects, and do not claim checks passed unless the commands or reviews actually ran.
- Do not break GitHub Pages routing or production deployment.
- Work on `rebuild/portfolio-v2`; keep `main` unchanged until the user explicitly asks to merge or publish.

## Skills and agents

- Read only the relevant project skill in `.agents/skills/`. Setup instructions are in `docs/CODEX_SKILLS_SETUP.md`. Skill files provide workflow guidance; they do not replace browser, build, or PDF evidence.
- Reusable user-wide skills live under `%USERPROFILE%\\.codex\\skills\\`; portfolio-specific skills and reviewer agents stay under `.agents/skills/` and `.codex/agents/` in this repository. Keep local Vale policy here; the Vale executable itself is user-wide.
- Subagents are optional. Use configured review agents only when their independent review is useful, and report their verification limits.

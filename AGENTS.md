# Portfolio V2 working rules

## Source of truth

- Public career facts live in `packages/career-data/content/`; validate them with the workspace Zod schema before using them in the site, resume, or PDFs.
- Keep project facts, evidence status, dates, units, and measurement conditions faithful to the source. Do not upgrade reported or unverified claims to verified claims.
- Keep private research under `career-db/` or `PRIVATE_NOT_FOR_GITHUB/`. Never copy their paths or contents into public content, generated pages, or screenshots.
- The V2 portfolio shell is Astro; React islands provide project search/filter. GraspLink is a separate deployed Emscripten/WebAssembly app. Open it in a new tab only after the visitor launches it; the live app renders in a top-level page but stays blank in an iframe.

## Design and writing

- Follow `apps/web/DESIGN.md` and `apps/web/src/styles/tokens.css`. Use the editorial technical direction, clear evidence hierarchy, responsive layout, and restrained motion.
- Keep primary content readable without JavaScript. Add JavaScript only for a real interaction.
- Korean copy should sound like clear technical documentation. Correct awkward phrasing lightly; preserve the author's voice, technical terms, numbers, and claims.
- Prefer a specific issue, cause, implementation, and measured result over generic claims. Include measurement conditions and evidence links wherever a number appears.
- Do not add decorative card grids, fake controls, invented performance claims, or animation without a user benefit.

## Validation and delivery

- After content changes, run `pnpm validate:content` and `pnpm validate:resume`.
- Before a release, run `pnpm run build`, `pnpm run test:unit`, `pnpm run test:e2e`, `pnpm run test:visual`, and `pnpm validate:pdf`.
- For visual review, capture 375px, 768px, and 1440px viewports and save findings with page, state, evidence, and a concrete fix.
- Do not mark a check as passing unless the command ran and its output supports that result.
- Work on `rebuild/portfolio-v2`; keep `main` unchanged until the user explicitly asks to merge or publish.

## Skills and agents

- Use only the relevant project skill for the task. Skill files provide workflow guidance; they do not replace browser, build, or PDF evidence.
- Reusable user-wide skills live under `%USERPROFILE%\.codex\skills\` and can be used across repositories. Portfolio-specific skills and reviewer agents stay under `.agents/skills/` and `.codex/agents/` in this repository. Keep local Vale policy here; the Vale executable itself is user-wide.
- Call configured review agents only when their task is independent and useful. Do not run every agent on every change.

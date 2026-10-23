---
name: portfolio-design-review
description: Review a developer portfolio website and its PDFs using reproducible browser and renderer evidence, responsive layout, accessibility, and actionable findings.
---

# Portfolio design review

Do not claim a visual, accessibility, interaction, or PDF check passed unless the real browser or PDF renderer was used.

1. Identify the audience, target recruiting role, core content hierarchy, and primary action.
2. Run `pnpm build:portfolio`, start the documented local preview, then capture Playwright screenshots at 375px, 768px, and 1440px with images and fonts loaded. Check browser errors and real WebAssembly demo behavior when present. For before/after work, keep route, viewport, scroll position, and UI state identical; record timestamp and working-tree or commit identifier in a manifest.
3. Review the home, project list, each project detail, and document pages. Check hierarchy, typography, spacing, contrast, overflow, image captions, content density, interactive states, keyboard support, mobile reading order, and reduced motion behavior.
4. Exercise visible interactions, including project search/filter, downloads, keyboard navigation, and explicit GraspLink launch/close.
5. Run automated axe checks and inspect keyboard focus manually. Run `pnpm validate:pdf`, render each relevant edition with `pnpm --filter @portfolio/print exec node --import tsx src/cli.mjs render --edition cpp-software`, and inspect every rendered page for clipping, missing Korean glyphs, broken images, orphan lines, tables and figures, unreadable density, and page-break continuity. Repeat rendering for other editions when reviewing a release.
6. Report each finding as route + viewport/state + evidence + user impact + observable target + severity. Fix functional and accessibility defects first, then responsive and reading issues, then visual polish. Do not assign arbitrary numeric scores; separate reproducible defects from subjective suggestions.
7. Fix confirmed defects, recapture the same states, and rerun the same browser/PDF checks. Save screenshots, page renders, a manifest, and findings under `artifacts/design-review/` or `artifacts/pdf-review/` as appropriate. Report unresolved findings as unresolved.
8. Use reviewer agents selectively; their feedback does not replace real browser, accessibility, or PDF evidence. Do not use numerical scores without a defined, reproducible rubric.

No local LLMs, Figma MCP, or remote design services are required.

## PDF review limits
Treat Vivliostyle and Typst comparisons as engine comparisons, not controlled typography benchmarks. Report font or renderer limitations and do not claim checks passed unless the corresponding command and visual inspection actually ran.

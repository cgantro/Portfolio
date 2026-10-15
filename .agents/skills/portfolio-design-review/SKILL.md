---
name: portfolio-design-review
description: Review a developer portfolio website or PDF using rendered screenshots, layout/typography/accessibility evidence and a practical independent defect list. Does not use Figma MCP or a local LLM.
---
# Portfolio Design Review
Do not claim a visual check passed unless the real browser or PDF renderer was used.

1. Identify the purpose, target recruiting role, core content hierarchy and desired primary action.
2. Capture mobile 375px, tablet 768px and desktop 1440px screenshots using Playwright (and save evidence). Check browser errors and real Wasm demo behavior if present.
3. Audit hierarchy, typography, spacing, contrast, overflows, image captions, content density, unhelpful card repetition, interactive states, keyboard support, mobile reading order and reduced-motion behavior.
4. Open every PDF page as an image; check orphan lines, overflow, tables/figure clarity and page-break continuity.
5. Review implementation and rendered screenshots. Report only source-backed defects with route/viewport/screenshot/observed/expected/severity/recommended fix.
6. Separate P0 functional blockers, P1 reading/interaction issues, and P2 editorial style suggestions. Subjective preferences must remain suggestions.
7. Patch a minimal set of issues, recapture at the same viewport, and run functional regression checks.
8. Use the anti-ui-slop-reviewer and ui-ux-tester subagents selectively; they should not replace real browser evidence.

No local LLMs, Figma MCP or remote design services required.

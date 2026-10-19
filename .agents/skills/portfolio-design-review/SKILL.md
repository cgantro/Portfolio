---
name: portfolio-design-review
description: Review a developer portfolio website or PDF using rendered browser evidence, layout, typography, accessibility, and a practical defect list.
---

# Portfolio design review

Do not claim a visual, accessibility, interaction, or PDF check passed unless the real browser or PDF renderer was used.

1. Identify the audience, target recruiting role, core content hierarchy, and primary action.
2. Build the production site and start its preview server. Capture Playwright screenshots at 375px, 768px, and 1440px, with images loaded. Check browser errors and real WebAssembly demo behavior when present.
3. Review the home, project list, each project detail, and document pages. Check hierarchy, typography, spacing, contrast, overflow, image captions, content density, interactive states, keyboard support, mobile reading order, and reduced motion behavior.
4. Exercise visible interactions, including project search/filter, downloads, keyboard navigation, and explicit GraspLink launch/close.
5. Use automated axe checks and inspect keyboard focus manually. Open every PDF page as an image; check clipping, orphan lines, tables and figures, and page-break continuity.
6. Report only source-backed defects with route, viewport, screenshot evidence, observed and expected behavior, severity, and a concrete fix. Separate functional blockers and reading/interaction issues from subjective style suggestions.
7. Fix confirmed defects, recapture the same states, and run functional regression checks. Keep a report with route, viewport, state, evidence, impact, repair, and verification.
8. Use the anti-ui-slop-reviewer and ui-ux-tester subagents selectively; they do not replace real browser or PDF evidence.

No local LLMs, Figma MCP, or remote design services are required.

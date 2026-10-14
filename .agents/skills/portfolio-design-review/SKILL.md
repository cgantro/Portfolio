---
name: portfolio-design-review
description: Review the rendered portfolio in Playwright across mobile, tablet, and desktop, then fix concrete visual and interaction defects.
---

# Portfolio design review

1. Build the production site and start its preview server.
2. Review the home, project list, each project detail, and document pages at 375px, 768px, and 1440px.
3. Capture actual browser screenshots with images loaded. Check overflow, hierarchy, typography, spacing, contrast, project imagery, controls, and navigation.
4. Exercise each visible interaction, including project search/filter, downloads, keyboard navigation, and explicit GraspLink launch/close.
5. Use automated axe checks and inspect keyboard focus manually.
6. Fix confirmed defects, re-capture the same states, and keep a report with route, viewport, evidence, impact, repair, and verification.
7. Never claim a screenshot, accessibility check, interaction, or fix was verified unless it was actually run.

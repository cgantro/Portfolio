---
name: portfolio-screenshot-review
description: Capture consistent before and after browser screenshots while implementing portfolio UI changes.
---

# Portfolio screenshot workflow

1. Start the built site with the repository's documented local command.
2. Capture the same route, viewport, scroll position, and UI state before and after a change.
3. Use 375px, 768px, and 1440px viewports. Wait for images and fonts; disable animations for comparison.
4. Save screenshots and a short manifest under `artifacts/design-review/` with route, viewport, state, timestamp, and commit/working-tree identifier.
5. Compare hierarchy, overflow, spacing, contrast, image crop, focus, and interaction state.
6. Record observed defects and fixes in the review report. Never call a mockup or source inspection a rendered screenshot.

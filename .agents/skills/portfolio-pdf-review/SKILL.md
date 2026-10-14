---
name: portfolio-pdf-review
description: Build and review the portfolio and resume PDFs for content, Korean text extraction, page count, links, and visual clipping.
---

# PDF review

1. Build canonical PDFs with `pnpm build:portfolio`.
2. Parse every edition with `pnpm validate:pdf`; confirm profile, headline, project names, links, and page count.
3. Render all pages with `pnpm --filter @portfolio/print exec node --import tsx src/cli.mjs render --edition cpp-software` (repeat for each edition when reviewing a release).
4. Inspect rendered pages for clipped text, missing Korean glyphs, broken images, poor page breaks, and unreadable density.
5. Keep a comparison between Vivliostyle and Typst as an engine comparison, not a controlled typography benchmark.
6. Save screenshots/page renders and findings under `artifacts/pdf-review/`. Report any engine or font limitation accurately.

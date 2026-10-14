---
name: portfolio-content-audit
description: Audit canonical portfolio facts and narratives for traceable evidence, engineering clarity, Korean prose, and resume accuracy.
---

# Portfolio content audit

1. Validate YAML with `pnpm validate:content` and the JSON Resume adapter with `pnpm validate:resume`.
2. Pair every narrative claim and metric with canonical project facts and evidence IDs.
3. Check problem, cause, decision, implementation, measurement conditions, result, verification, and limitations.
4. Check dates and numbers against source precision; do not infer day-level dates or convert reported measurements into independently verified results.
5. Review Korean copy lightly using the `im-not-ai` skill. Keep fact edits separate from prose edits.
6. Check all public Markdown links and ensure private source paths do not appear in generated output.
7. Report findings with file, section/claim ID, evidence, and a specific correction. Do not silently rewrite uncertain facts.

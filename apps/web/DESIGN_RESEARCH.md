# Portfolio design research

## Audience and goal

The site needs to help a recruiter identify the candidate and strongest work quickly, while giving an engineering lead enough depth to judge implementation choices. The visual treatment should make real systems and evidence prominent without turning the page into a generic software dashboard.

## Patterns from reviewed portfolios

| Pattern | Example and evidence | Application here |
| --- | --- | --- |
| Fast scan, then deeper reading | Diana Grafl's 2025 portfolio case study separates quick orientation from process depth. It puts core facts and direct contact up front, then uses secondary navigation for detailed sections. The author reports that recruiters scan for clarity while technical reviewers want process depth. | Keep the opening compact: role, engineering focus, strongest project, and contact/resume links. Put implementation detail on project pages with in-page section links. |
| Let the work set the visual tone | Creative Bloq's 2026 portfolio review includes both image-led collage work and quiet, project-focused layouts. It notes that a clean presentation can fit work whose value is functional rather than decorative. | Use the robot simulator and project photography as the visual anchor. Keep cards and labels restrained so evidence, diagrams, and real interfaces carry the page. |
| State ownership and evidence plainly | The reviewed case studies make role, scope, process, and outcomes visible rather than relying on a visual thumbnail alone. | For each project, surface the author's role, constraints, implementation, evidence, and limits. Keep reported measurements labelled with their conditions. |

These examples support layout patterns, not a claim that any one style guarantees interviews or recruiter engagement.

## Recommended direction for this portfolio

1. **Home:** one strong statement of role and engineering focus; place the best working system and clear resume/contact actions near the top.
2. **Project index:** consistent image ratios and concise summaries; show role, stack, and the most concrete verified result without inventing a score or metric.
3. **Project detail:** use a repeatable sequence: problem and constraints, system design, implementation decisions, evidence and results, limitations, and demo/source links.
4. **Visual system:** keep a quiet neutral canvas, a single restrained accent, strong heading/body contrast, and mono labels only for metadata. Reserve large dark panels for actual technical demos.
5. **Responsive and accessible behavior:** preserve one-dimensional reading at narrow widths, visible keyboard focus, readable contrast, and useful target sizes. Treat motion as optional enhancement.

## Accessibility baseline

Use WCAG 2.2 AA as the forward-looking target. W3C sets 4.5:1 contrast for ordinary text and requires reflow at a 320 CSS-pixel viewport without two-dimensional scrolling, except where a two-dimensional layout is essential. The current automated suite targets WCAG 2.1 AA, so adopting 2.2 should be tracked as a separate validation update rather than implied by the existing results.

## Sources

- [Diana Grafl — portfolio case study](https://dianagrafl.de/en/projekt_portfolio.html)
- [Creative Bloq — design portfolio examples, January 2026](https://www.creativebloq.com/portfolios/examples-712368)
- [W3C — Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)

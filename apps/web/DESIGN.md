# Portfolio design system

The site is a Korean project showcase for C++ simulation, modeling, and real-time communication roles. Recruiters should understand the work and contribution at a glance; technical interviewers can follow the project link into architecture, implementation, and measurements.

## Page hierarchy

- The home page introduces the candidate briefly and leads with the DroneSim simulator image, one implementation detail, a case-study link, and the separate web launch.
- The four projects use one editorial index pattern: project image, field, title, concise summary, specific implementation, and detail link. AutoWingCar remains a full project entry.
- The project archive is a static list. Four entries do not need search or category controls; every project remains readable with JavaScript disabled.
- Project detail pages retain their project-specific facts, architecture, implementation narratives, and relevant measurements. Do not expose evidence IDs or internal audit language.
- Technology is organized by the existing skill groups and linked to projects that use it. Avoid decorative tag clouds and repeated stack summaries.
- Resume pages and downloadable documents are not part of the site.

## Visual system

- Use the warm light canvas, dark readable text, restrained rust accent, and shared dimensions defined in `src/styles/tokens.css`.
- Use large project imagery and typography to establish hierarchy. Avoid repeating card shells, decorative micro-labels, and rules that do not separate meaningful content.
- Keep Korean labels concise and natural. Do not translate English heading patterns literally.
- At 375px, 768px, and 1440px, preserve reading order, useful text size, visible navigation, and a page width with no horizontal overflow.
- Maintain visible keyboard focus, reduced-motion support, semantic headings, and readable content without JavaScript.

## Runtime and deployment

Astro renders the pages and project data. The site does not hydrate a project search/filter. DroneSim remains on its own deployed origin because its WebAssembly, SharedArrayBuffer, and COI worker behavior requires a top-level page; visitors open it only through an explicit link.

`/Portfolio/` is the GitHub Pages base. The root `asset/` directory is Astro's public directory; shared `/assets/` identifiers are normalized by `assetUrl()`.

## Review

Capture the home page, project archive, and all four detail routes at 375px, 768px, and 1440px. Check responsive reading order, image loading, keyboard focus, contrast, links, and page errors in a browser. Save review artifacts and findings under `artifacts/design-review/`.

# Portfolio V2 design direction

The public portfolio is a **project showcase for C++ simulation and real-time communication work**. A hiring manager should find a project and its contribution quickly; a technical interviewer should be able to continue into architecture, implementation, and measured results.

## Visual and content system

- Use a deep blue-green header and DroneSim feature area, a quiet pale canvas for reading, and orange as the action accent. Shared color and layout values live in `src/styles/tokens.css`.
- The home page introduces the candidate through a featured DroneSim case, then gives RobotPal, Mausoleum, and AutoWingCar full project entries. AutoWingCar includes a specific contribution in the same card structure as the other cases.
- Project cards show a short summary, one assigned implementation, and a compact plain-text technology line. The home page groups the existing skill data by category and links each group to its related projects; technology names do not become decorative tag clouds.
- The project archive supports search and category filters. Project detail pages retain their project facts, full technology list, contribution, architecture, implementation narrative, and relevant measurements.
- At 375px, 768px, and 1440px, content keeps a clear reading order, useful text size, visible navigation, and no horizontal overflow. Core content and links render without JavaScript; search and filtering remain the only hydrated controls.
- The portfolio does not publish resume or portfolio downloads. DroneSim opens its separate deployed app only through an explicit new-tab link.

## Runtime boundaries

Astro renders content and routes. React hydrates project search and filtering only. DroneSim remains on its own deployed origin because its WebAssembly, SharedArrayBuffer, and COI worker behavior requires a top-level page. Its simulator bundle is not imported into the portfolio.

`/Portfolio/` is the deployment base. The root `asset/` directory is Astro's public directory; shared `/assets/` identifiers are normalized by `assetUrl()`.

## Review and validation

Playwright captures the home page, project archive, and four project detail pages at 375px, 768px, and 1440px. Browser checks cover routes, accessibility, keyboard use, filters, no-download behavior, asset loading, and explicit simulator launch. Screenshots and findings are stored in `artifacts/design-review/` as review artifacts rather than committed image snapshots.

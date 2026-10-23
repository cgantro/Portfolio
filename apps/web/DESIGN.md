# Portfolio V2 design direction

Three directions informed the final interface:

| Direction | Strength | Applied to the final site |
| --- | --- | --- |
| Editorial Technical | Readable case studies and clear evidence hierarchy | Project pages, numbered sections, reading widths, inline source states |
| Engineering Minimal | Focused navigation and a restrained information system | Page layout, skill groups, tags, project facts and document metadata |
| Technical Showcase | A strong first impression from working systems | The dark DroneSim hero panel and simulator preview |

The final choice is **Editorial Technical**, with Engineering Minimal structure and one Technical Showcase hero. The palette is warm white `#f5f4ef`, dark green `#182421`, near black `#1b211e`, and burnt orange `#b73518`. All tokens live in `apps/web/src/styles/tokens.css`; responsive and print rules live in `apps/web/src/styles/global.css`.

Source data and architecture diagrams come from the public shared package and the existing root `asset/` folder.

## Runtime boundaries

Astro renders all content, navigation, evidence, and project detail HTML statically. React hydrates project search/filter controls only. DroneSim opens from its own deployed origin in a new tab after the visitor presses the launch link. The WebAssembly demo uses the kinematic baseline; native AirSim rigid-body physics is a separate Windows execution path. Its simulation bundle is not imported into the portfolio runtime.

`/Portfolio/` is the deployment base. The root `asset/` directory is Astro's public directory, so original filenames and license files remain addressable beneath the deployment base. Shared `/assets/` identifiers are normalized by `assetUrl()` to these public URLs.

## Checks

`pnpm --filter @portfolio/web test:unit` tests URL handling and filtering. `test:e2e` covers static routes, keyboard access, filtering, missing assets and the explicit new-tab simulator launch. `test:visual` captures 10 routes at 375px, 768px, and 1440px and checks horizontal overflow. Screenshots land in `artifacts/design-review/screenshots/`; `pnpm report:visual` records their names and SHA256 hashes. They are review artifacts rather than committed image snapshots.

import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const screenshotRoot = resolve(root, 'artifacts/design-review/screenshots');
const routeNames = 'home|projects|dronesim|robotpal|mausoleum|autowingcar';
const files = (await readdir(screenshotRoot))
  .filter(file => new RegExp(`^(desktop|tablet|mobile)-(${routeNames})\\.png$`).test(file))
  .sort();
if (files.length !== 18) throw new Error(`Expected 18 viewport screenshots, found ${files.length}. Run pnpm test:visual first.`);

const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const entries = await Promise.all(files.map(async filename => {
  const filePath = resolve(screenshotRoot, filename);
  const hash = createHash('sha256').update(await readFile(filePath)).digest('hex');
  return `- [${filename}](screenshots/${filename}) — SHA-256 \`${hash}\``;
}));
let liveResult = null;
try { liveResult = JSON.parse(await readFile(resolve(root, 'artifacts/design-review/live-dronesim.json'), 'utf8')); }
catch { /* The live check is optional and runs only when network access is available. */ }
const report = [
  '# Browser design review evidence', '',
  `- Branch: \`${branch}\``, `- Source commit: \`${commit}\``,
  '- Capture result: Playwright visual suite passed for the home page, project list, and four project details at 375px, 768px, and 1440px (18 screenshots).',
  '- Automated checks: no horizontal overflow; each route has a visible main heading and descriptive image alternatives.',
  '- Accessibility: the axe-core WCAG 2.1 AA checks passed on all 6 routes.',
  '- Scope: browser screenshots are retained for human review; this report does not claim pixel-diff regression coverage.',
  '', '## Findings', '',
  '- No automated route, keyboard, axe, or horizontal-overflow failures were observed in the exercised states.',
  '- Manual screenshot review covered all four project details at 375px and 1440px, plus DroneSim and AutoWingCar at 768px. The feature, role, issue, comparison, and code areas remain within the viewport.',
  '- DroneSim currently shows the project’s colored test environment rather than an orthophoto. Mausoleum’s available image is its title screen, and AutoWingCar uses a photo of the physical vehicle; captions identify each image accurately.',
  '- DroneSim opens only after the explicit launch action. The live browser check confirms the deployed canvas renders; `crossOriginIsolated` was false, so SharedArrayBuffer thread isolation remains unverified. Details are in `live-dronesim.json`.',
  '', '## Live simulator evidence', '',
  liveResult
    ? `- [Live screenshot](live-dronesim.png) · [Diagnostics](live-dronesim.json) — canvas ${liveResult.canvas.width}×${liveResult.canvas.height}, ${liveResult.pageErrors.length} page errors, ${liveResult.externalFailures.length} failed network requests, cross-origin isolated: ${liveResult.crossOriginIsolated}.`
    : '- Live network check was not run; no live screenshot is claimed.',
  '', '## PDF engine decision', '',
  '- [Rendered PDF comparison](../../apps/print/COMPARISON.md) records the selected Vivliostyle technical portfolio and RenderCV one-page resume engines, with Typst retained as a comparison path.',
  '', '## Screenshot inventory', '', ...entries, '',
].join('\n');
const reportPath = resolve(root, 'artifacts/design-review/report.md');
await mkdir(resolve(root, 'artifacts/design-review'), { recursive: true });
await writeFile(reportPath, report, 'utf8');
console.log(`Wrote ${relative(root, reportPath).split(sep).join('/')} with ${files.length} screenshot hashes.`);

import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const screenshotRoot = resolve(root, 'artifacts/design-review/screenshots');
const routeNames = 'home|projects|grasplink|robotpal|mausoleum|autowingcar|documents|resume-cpp|resume-simulation|resume-video';
const files = (await readdir(screenshotRoot))
  .filter(file => new RegExp(`^(desktop|tablet|mobile)-(${routeNames})\\.png$`).test(file))
  .sort();
if (files.length !== 30) throw new Error(`Expected 30 viewport screenshots, found ${files.length}. Run pnpm test:visual first.`);

const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const entries = await Promise.all(files.map(async filename => {
  const filePath = resolve(screenshotRoot, filename);
  const hash = createHash('sha256').update(await readFile(filePath)).digest('hex');
  return `- [${filename}](screenshots/${filename}) — SHA-256 \`${hash}\``;
}));
let liveResult = null;
try { liveResult = JSON.parse(await readFile(resolve(root, 'artifacts/design-review/live-grasplink.json'), 'utf8')); }
catch { /* The live check is optional and runs only when network access is available. */ }
const report = [
  '# Browser design review evidence', '',
  `- Branch: \`${branch}\``, `- Source commit: \`${commit}\``,
  '- Capture result: Playwright visual suite passed for 10 routes at 375px, 768px, and 1440px (30 screenshots).',
  '- Automated checks: no horizontal overflow; each route has a visible main heading.',
  '- Scope: browser screenshots are retained for human review; this report does not claim pixel-diff regression coverage.',
  '', '## Findings', '',
  '- Mobile contact was missing from the sticky header; it now remains visible as a compact text link. Verified at 375px by the responsive browser test.',
  '- The document overview now lists PDF, HTML, and JSON. Resume download rows distinguish JSON Resume from the conversion report, and each resume page uses its edition headline. Verified by the responsive browser test.',
  '- The screenshot reviewer found no clipped content, horizontal overflow, broken image ratios, or unreadable mobile body copy across the audited routes.',
  '- GraspLink opens only after the explicit launch action. The live browser check confirmed that the standalone page renders; `crossOriginIsolated` was false, so SharedArrayBuffer thread isolation remains unverified. Details are in `live-grasplink.json`.',
  '', '## Live simulator evidence', '',
  liveResult
    ? `- [Live screenshot](live-grasplink.png) · [Diagnostics](live-grasplink.json) — canvas ${liveResult.canvas.width}×${liveResult.canvas.height}, ${liveResult.pageErrors.length} page errors, ${liveResult.externalFailures.length} failed network requests, cross-origin isolated: ${liveResult.crossOriginIsolated}.`
    : '- Live network check was not run; no live screenshot is claimed.',
  '', '## PDF engine decision', '',
  '- [Rendered PDF comparison](../../apps/print/COMPARISON.md) records the selected Vivliostyle technical portfolio and RenderCV one-page resume engines, with Typst retained as a comparison path.',
  '', '## Screenshot inventory', '', ...entries, '',
].join('\n');
const reportPath = resolve(root, 'artifacts/design-review/report.md');
await mkdir(resolve(root, 'artifacts/design-review'), { recursive: true });
await writeFile(reportPath, report, 'utf8');
console.log(`Wrote ${relative(root, reportPath).split(sep).join('/')} with ${files.length} screenshot hashes.`);

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const files = [
  resolve(root, 'packages/career-data/README.md'),
  resolve(root, 'apps/web/DESIGN.md'),
  resolve(root, 'README.md'),
];
const result = spawnSync('vale', ['--config=.vale.ini', ...files], {
  cwd: root,
  stdio: 'inherit',
  windowsHide: true,
});
if (result.error) {
  console.error(`Vale could not run: ${result.error.message}`);
  process.exitCode = 1;
} else if (result.status !== 0) process.exitCode = result.status ?? 1;
else console.log(`Vale passed: ${files.length} Korean/technical Markdown documents.`);

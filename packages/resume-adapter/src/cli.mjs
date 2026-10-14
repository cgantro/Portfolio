import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile, rename, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { createReactiveResumeClient, ReactiveResumeError } from '../../../integrations/reactive-resume/src/client.mjs';
import { validatePdf } from '../../../apps/print/src/pdf.mjs';

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command !== 'export') throw new Error('Expected export command.');
  if (!process.env.REACTIVE_RESUME_ID) throw new ReactiveResumeError('MISSING_RESUME_ID_ENV');
  const index = args.indexOf('--output');
  const output = resolve(index < 0 ? fileURLToPath(new URL('../../../apps/print/dist/reactive-resume/resume.pdf', import.meta.url)) : args[index + 1]);
  const directory = resolve(output, '..');
  await mkdir(directory, { recursive: true });
  const temporary = resolve(directory, `.resume-${randomUUID()}.pending.pdf`);
  try {
    const bytes = await createReactiveResumeClient().downloadPdf(process.env.REACTIVE_RESUME_ID);
    await writeFile(temporary, bytes, { mode: 0o600 });
    const checked = await validatePdf(temporary);
    await rename(temporary, output);
    console.log(`Reactive Resume PDF exists: ${output} (${checked.pages} pages, ${checked.bytes} bytes)`);
  } catch (error) { await rm(temporary, { force: true }); throw error; }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });

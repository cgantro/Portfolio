import { fileURLToPath } from 'node:url';
import { resolve, dirname, basename, extname } from 'node:path';
import { readFile, rename, writeFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { careerData } from '@portfolio/career-data';
import { CareerDataSchema } from '@portfolio/schema';
import { toJsonResume, selectEdition } from '@portfolio/resume-adapter';
import { preparePortfolio } from './render.mjs';
import { validatePdf, renderPdfPages } from './pdf.mjs';

const appRoot = fileURLToPath(new URL('../', import.meta.url));
const root = resolve(appRoot, '../..');
const require = createRequire(import.meta.url);
const [command = 'validate', ...args] = process.argv.slice(2);
function option(name, fallback) { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; }
const editionIds = args.includes('--all') ? careerData.editions.map(edition => edition.id) : [option('--edition', 'general')];
const outputRoot = resolve(option('--output', resolve(appRoot, 'dist')));
const engine = option('--engine', 'vivliostyle');

function run(binary, argumentsList) {
  const result = spawnSync(binary, argumentsList, { cwd: appRoot, stdio: 'inherit', windowsHide: true, timeout: 180000, env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' } });
  if (result.error || result.status !== 0) throw new Error(`PDF engine failed: ${result.error?.code || `exit ${result.status}`}`);
}
async function buildPdf(prepared) {
  const temporary = resolve(prepared.outputDir, '.portfolio-pending.pdf');
  const target = resolve(prepared.outputDir, engine === 'typst' ? 'portfolio.typst.pdf' : 'portfolio.pdf');
  try {
    if (engine === 'typst') run('typst', ['compile', resolve(prepared.outputDir, 'portfolio.typ'), temporary]);
    else if (engine === 'vivliostyle') {
      const packagePath = require.resolve('@vivliostyle/cli/package.json');
      const manifest = JSON.parse(await readFile(packagePath, 'utf8'));
      const binary = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin.vivliostyle;
      const selected = selectEdition(careerData, prepared.editionId);
      const configPath = resolve(prepared.outputDir, 'vivliostyle.config.mjs');
      await writeFile(configPath, `export default ${JSON.stringify({ title: `${careerData.profile.name} | ${selected.edition.headline}`, author: careerData.profile.name, language: 'ko', size: 'A4', entry: prepared.htmlPath, output: temporary }, null, 2)};\n`);
      run(process.execPath, [resolve(dirname(packagePath), binary), 'build', '-c', configPath, '-o', temporary]);
    } else throw new Error(`Unknown PDF engine: ${engine}`);
    const selected = selectEdition(careerData, prepared.editionId);
    const validated = await validatePdf(temporary, { expectedTexts: [careerData.profile.name, selected.edition.headline, ...selected.projects.map(project => project.title)] });
    await rename(temporary, target);
    await writeFile(resolve(prepared.outputDir, `${engine}.validation.json`), JSON.stringify({ engine, file: target, bytes: validated.bytes, pages: validated.pages }, null, 2));
    console.log(`PDF exists: ${target} (${validated.pages} pages, ${validated.bytes} bytes)`);
  } catch (error) { await rm(temporary, { force: true }); throw error; }
}
async function main() {
  CareerDataSchema.parse(careerData);
  if (command === 'validate') {
    for (const edition of careerData.editions) {
      const { resume, lossReport } = toJsonResume(careerData, edition.id);
      console.log(`Validated ${edition.id}: ${resume.projects.length} projects, ${resume.education.length} education records, ${resume.certificates.length} certificates, ${lossReport.omitted.length} explicit losses`);
    }
    return;
  }
  if (!['build', 'pdf', 'validate:pdf', 'render', 'resume:typst', 'resume:rendercv'].includes(command)) throw new Error(`Unknown command: ${command}`);
  for (const editionId of editionIds) {
    const outputDir = resolve(outputRoot, editionId);
    selectEdition(careerData, editionId);
    if (command === 'build' || command === 'pdf' || command === 'resume:typst' || command === 'resume:rendercv') {
      const prepared = await preparePortfolio(careerData, editionId, { root, outputDir });
      if (command === 'pdf') await buildPdf(prepared);
      if (command === 'resume:typst') {
        const temporary = resolve(outputDir, '.resume-pending.pdf');
        try {
          run('typst', ['compile', resolve(outputDir, 'resume.typ'), temporary]);
          const validated = await validatePdf(temporary, { expectedTexts: [careerData.profile.name, '광운대학교', 'OPIc', '삼성'], maxPages: 1 });
          await rename(temporary, resolve(outputDir, 'resume.typst.pdf'));
          console.log(`One-page Typst resume exists (${validated.bytes} bytes): ${outputDir}`);
        } catch (error) { await rm(temporary, { force: true }); throw error; }
      }
      if (command === 'resume:rendercv') {
        const temporary = resolve(outputDir, '.rendercv-pending.pdf');
        try {
          run('uv', ['tool', 'run', '--from', 'rendercv[full]==2.8', 'rendercv', 'render', resolve(outputDir, 'resume.rendercv.yaml'), '--output-folder', resolve(outputDir, 'rendercv'), '--pdf-path', temporary, '--dont-generate-markdown', '--dont-generate-png', '--quiet']);
          const validated = await validatePdf(temporary, { expectedTexts: [careerData.profile.name, '광운대학교', 'OPIc', '삼성'], maxPages: 1 });
          await rename(temporary, resolve(outputDir, 'resume.rendercv.pdf'));
          console.log(`One-page RenderCV resume exists (${validated.bytes} bytes): ${outputDir}`);
        } catch (error) { await rm(temporary, { force: true }); throw error; }
      }
      if (command === 'build') console.log(`Prepared offline HTML and JSON Resume: ${outputDir}`);
    } else if (command === 'validate:pdf') {
      const selected = selectEdition(careerData, editionId);
      const result = await validatePdf(resolve(outputDir, engine === 'typst' ? 'portfolio.typst.pdf' : 'portfolio.pdf'), { expectedTexts: [careerData.profile.name, selected.edition.headline, ...selected.projects.map(project => project.title)] });
      console.log(`Validated PDF: ${editionId}, ${result.pages} pages, ${result.bytes} bytes`);
    } else {
      const target = option('--file', resolve(outputDir, engine === 'typst' ? 'portfolio.typst.pdf' : 'portfolio.pdf'));
      const previewDir = resolve(outputDir, 'preview', basename(target, extname(target)));
      const paths = await renderPdfPages(target, previewDir);
      console.log(`Rendered ${paths.length} pages to ${previewDir}`);
    }
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });

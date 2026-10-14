import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function validatePdf(filePath, { expectedTexts = [], maxPages } = {}) {
  const bytes = new Uint8Array(await readFile(filePath));
  const byteLength = bytes.length;
  if (bytes.length < 128 || Buffer.from(bytes.subarray(0, 5)).toString() !== '%PDF-') throw new Error('Output is not a real PDF.');
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const document = await getDocument({ data: bytes, useSystemFonts: true, verbosity: 0 }).promise;
  try {
    if (!document.numPages) throw new Error('PDF contains no pages.');
    if (maxPages && document.numPages > maxPages) throw new Error(`PDF has ${document.numPages} pages; expected at most ${maxPages}.`);
    let text = '';
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str || '').join(' ') + '\n';
    }
    for (const expected of expectedTexts) if (!text.replace(/\s+/g, '').includes(expected.replace(/\s+/g, ''))) throw new Error(`PDF text missing: ${expected}`);
    return { path: filePath, bytes: byteLength, pages: document.numPages, text };
  } finally { await document.destroy(); }
}

export async function renderPdfPages(filePath, outputDir, { scale = 1.1 } = {}) {
  const { createCanvas, DOMMatrix, ImageData, Path2D } = await import('@napi-rs/canvas');
  globalThis.DOMMatrix ||= DOMMatrix;
  globalThis.ImageData ||= ImageData;
  globalThis.Path2D ||= Path2D;
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const document = await getDocument({ data: new Uint8Array(await readFile(filePath)), useSystemFonts: true, verbosity: 0 }).promise;
  const paths = [];
  await mkdir(outputDir, { recursive: true });
  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      const context = canvas.getContext('2d');
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      const target = resolve(outputDir, `page-${String(pageNumber).padStart(2, '0')}.png`);
      await writeFile(target, canvas.toBuffer('image/png'));
      paths.push(target);
    }
  } finally { await document.destroy(); }
  return paths;
}

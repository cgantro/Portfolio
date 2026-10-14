import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { existsSync, cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Generated documents are build artifacts; source asset folders stay untouched.
const documents = {
  name: 'portfolio-documents',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const source = fileURLToPath(new URL('../print/dist/', import.meta.url));
      if (!existsSync(source)) return;
      const target = fileURLToPath(new URL('downloads/', dir));
      mkdirSync(target, { recursive: true });
      for (const edition of ['cpp-software', 'simulation', 'video-software']) {
        const editionSource = `${source}/${edition}`;
        if (!existsSync(editionSource)) continue;
        mkdirSync(`${target}/${edition}`, { recursive: true });
        for (const filename of ['portfolio.pdf', 'portfolio.html', 'resume.rendercv.pdf', 'resume.json', 'resume.loss-report.json']) {
          if (existsSync(`${editionSource}/${filename}`)) cpSync(`${editionSource}/${filename}`, `${target}/${edition}/${filename}`);
        }
        const editionAssets = `${editionSource}/assets`;
        if (existsSync(editionAssets)) cpSync(editionAssets, `${target}/${edition}/assets`, { recursive: true });
      }
    },
  },
};

export default defineConfig({
  site: 'https://cgantro.github.io',
  base: '/Portfolio/',
  trailingSlash: 'always',
  output: 'static',
  publicDir: '../../asset',
  integrations: [react(), documents],
  build: { format: 'directory' },
  server: { host: '127.0.0.1' },
});

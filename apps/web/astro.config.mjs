import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://cgantro.github.io',
  base: '/Portfolio/',
  trailingSlash: 'always',
  output: 'static',
  publicDir: '../../asset',
  integrations: [react()],
  build: { format: 'directory' },
  server: { host: '127.0.0.1' },
});

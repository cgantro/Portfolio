# Portfolio

Personal project portfolio built with React and Vite. The site presents project summaries, implementation details, and project specific media.

## Run locally

```sh
npm ci
npm run dev
```

Create a production build with:

```sh
npm run build
```

## Project pages

Project metadata lives in `src/data/projects.js`; detailed page content lives in `src/data/projectDetailPages.js`. Media used by the site is stored under `asset/`.

The GraspLink browser demo is served from `asset/minibcg/index.html` and embedded on the MiniBCG project page. It is a single-file Emscripten build. The root page registers `asset/coi-serviceworker.min.js` so the threaded demo can use the browser's cross-origin isolation support on static hosting.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, builds the site, and deploys the contents of `dist/` to GitHub Pages. Vite uses `/Portfolio/` as the production base path.

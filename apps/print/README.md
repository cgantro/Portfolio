# Korean print portfolio

The print application reads Zod-validated `@portfolio/career-data` and supports the `cpp-software`, `simulation`, and `video-software` editions. It uses only tracked project assets and canonical content. Each edition contains a cover, project overview, implementation pages, education and credentials, and a source appendix. Claims with unverified or missing evidence are excluded. A metric is printed only with its conditions and evidence IDs; reported measurements remain described by the canonical limitations.

From the workspace root after `pnpm install`:

```powershell
pnpm resume:prepare
pnpm build:portfolio
pnpm validate:pdf
pnpm --filter @portfolio/print pdf:typst
pnpm --filter @portfolio/print exec node --import tsx src/cli.mjs resume:typst --all
pnpm --filter @portfolio/print resume:rendercv
pnpm --filter @portfolio/print exec node --import tsx src/cli.mjs render --edition cpp-software
```

`resume:prepare` is an offline content/HTML/JSON build; it does not imply that a PDF exists. `build:portfolio` invokes the installed Vivliostyle CLI and accepts success only after PDF parsing confirms pages and expected Korean project text. Engine output is temporary until validation succeeds. A failed renderer exits nonzero and does not replace an existing artifact. The optional Typst path produces `portfolio.typst.pdf`; the separate `resume:typst` command produces a real one-page resume candidate or fails if the layout spans more than one page. Set `--edition ID`, `--output DIR`, and, for portfolio PDFs, `--engine typst` as needed. No API credentials are needed.

Outputs live under `apps/print/dist/{edition}/`: `portfolio.html`, `portfolio.pdf`, `resume.json`, `resume.loss-report.json`, `portfolio.data.json`, copied assets, and comparative Typst sources. The root/web build may copy generated download files into its own public output. Source documents never link to a PDF as existing solely because a file name has been planned.

Korean text uses locally available Malgun Gothic or Noto Sans KR. On Linux install Noto Sans CJK before rendering (`fonts-noto-cjk` on Debian/Ubuntu); ensure Typst can discover the installed fonts. Windows system fonts are used locally without copying their copyrighted files into the repository. For reproducible production rendering, pin the runtime and provide the same licensed fonts in the build environment.

Vivliostyle is the selected HTML/CSS portfolio engine because its input matches the shared web/content pipeline and supports paged media. Typst is a real comparative implementation using the same validated JSON. RenderCV 2.8 is the selected one-page resume renderer; `resume:rendercv` runs it through `uv tool run` and generates `resume.rendercv.pdf`. Its first run downloads the Python tool and fonts into uv's cache. RenderCV input is generated as JSON-compatible YAML, with dates preserving source precision, two supported highlights per project, and each project's first summary sentence. The direct Typst resume keeps longer project summaries and a smaller body size as the comparison candidate. Both resume engines enforce a single page and parse the resulting PDF before success. Korean Windows console encoding is set for the renderer subprocess.

The rendered candidates were inspected on 2026-10-15: Korean glyphs, contacts, education, credentials and project content are present without clipping. RenderCV was selected for its clearer section spacing and scan hierarchy; Typst remains available for its more detailed one-page alternative. This is a comparison of actual editable outputs, not a controlled typography benchmark. Full project evidence and limitations remain in the portfolio. The local career data and print pipeline are the canonical source and do not depend on Reactive Resume. Its connector is an optional path for people who want to edit or export account documents there; portfolio builds never create or update account content.

References: [Vivliostyle CLI](https://docs.vivliostyle.org/publications/cli-en/en/cli/getting-started/), [Typst CLI](https://typst.app/docs/reference/), [JSON Resume schema](https://jsonresume.org/schema).

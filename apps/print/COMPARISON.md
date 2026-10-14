# PDF engine decisions and rendered candidates

Date: 2026-10-15. Content: the same validated Hong Yoonpyo career data, with `cpp-software`, `simulation`, and `video-software` editions.

| Path | Actual result | Scope and observations |
| --- | --- | --- |
| Reactive Resume v6 | Three private edition drafts were imported and read back; no PDF export was used for these candidates | Optional account editor. REST connector and JSON Resume file-import mapping are implemented. Export requires an existing owned resume ID and environment authentication. |
| RenderCV 2.8 | Three actual one-page PDFs | Classic theme, Korean system font, selected first summary sentence and two supported project highlights. Dates retain month/day precision. Input is `resume.rendercv.yaml`. |
| Direct Typst 0.15.1 | Three actual one-page PDFs | Longer project description and roles, compact body text, the same two supported highlights. Input is `resume.typ`. |
| Vivliostyle CLI 11.3.3 | Three actual 12-page project PDFs | Full role lists, architecture images, supported implementation claims, conditional metrics, limitations, and source appendix. Input is `portfolio.html`. |

## Selected outputs

- **Technical portfolio: Vivliostyle.** It is the default build engine and produces the tested 12-page project portfolio from the same HTML and CSS content pipeline as the website. The generated documents keep architecture images, implementation evidence, metric conditions, limitations, and source references. Typst remains a reproducible alternative, but its project portfolio needed denser pages in the reviewed output.
- **One-page resume: RenderCV 2.8.** The rendered candidate was easier to scan because its section spacing and type hierarchy were clearer. It uses a concise summary and two supported highlights per project. The direct Typst candidate preserves more detail but its body text is smaller and denser. Both are real one-page PDFs and remain available for comparison.

These files are generated under `apps/print/dist/{edition}/`. Text validation checks PDF parsing, page count, name, and credential/project content. Image previews verified Korean glyphs and checked for clipping. The choice is based on the actual outputs reviewed on 2026-10-15, not a controlled typography benchmark.

The two locally rendered resume candidates intentionally include only the first two supported highlights per project and omit full metric condition tables, architecture and the source appendix. `resume.loss-report.json` documents the canonical-to-JSON Resume losses. Consult the full portfolio before citing any measured value outside its original test conditions. The local career data and renderers are sufficient for the Korean portfolio; Reactive Resume is optional and is not on the public site's build or runtime path.

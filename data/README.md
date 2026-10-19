# Data and source files

The web and print builds read canonical facts from `packages/career-data/content/`.
Each project has one YAML record for validated facts and one Markdown narrative for
the longer implementation story. These files serve different purposes and are not
parallel copies of a second runtime database.

`projects/agv.md`, `projects/mausoleum.md`, and `projects/robotpal.md` are retained
source records cited by evidence entries in the canonical YAML. The build does not
load them as portfolio content. Keep a source record here only while canonical
evidence refers to it.

`diagrams/` contains editable Mermaid architecture notes for current projects.
The public site separately uses SVG diagrams referenced by canonical project YAML;
there is no automatic Mermaid-to-SVG build, so the Mermaid files are not guaranteed
to match those SVGs exactly.

`archive/` contains older project notes and diagrams that are not loaded by the
current web portfolio and are not cited by its canonical records. New retired
material belongs here. Do not copy active facts into this archive.

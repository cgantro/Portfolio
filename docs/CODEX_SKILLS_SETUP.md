# Codex Career Skills Setup

This branch adds original project skills plus a Windows installer for the verified third-party skills. It does not modify the main branch.

## Windows VS Code setup

Run in the repository root (PowerShell):

    powershell -ExecutionPolicy Bypass -File .\scripts\install-codex-skills.ps1
    python .\scripts\check-codex-skills.py

Then use VS Code Developer: Reload Window, open a new Codex chat, and check /skills.

For browser design QA, install Playwright in the project if it is not already available:

    npm install --save-dev playwright
    npx playwright install chromium
    node scripts/visual_audit.mjs http://localhost:5173/ artifacts/design-review

The audit script captures mobile, tablet and desktop screenshots plus a JSON report. Run your real dev server first, and change the port when necessary.

The installer clones the public sources into the local app-data cache and copies their skill directories into .agents/skills. It copies selected reviewer definitions into .codex/agents and removes fixed model IDs and sandbox metadata (actual permissions follow Codex host policy). Existing installed skills are skipped; the -Force switch overwrites them. Review source changes before future updates.

## Bundled original skills (available by checking out branch)
- korean-technical-resume: factual and professionally written Korean C++ engineering resume
- korean-technical-portfolio: project narratives for web/PDF, technical decision + measurement proof
- career-evidence-retrieval: evidence-first search of a local career-db without vectors
- portfolio-design-review: screenshot-based design QA with local Playwright

## Installed third-party skills
- write-korean-cover-letter: seolbbb, Korean cover letters
- job-application-tailor: kgyujin, role/JD tailoring
- portfolio-build, hiring-prep-doc-feedback, hiring-sim-resume-review, hiring-sim-resume-redteam, hiring-sim-portfolio-review, hiring-sim-portfolio-redteam: techeer-sv/Career-Skills
- humanize-korean: epoko77-ai/im-not-ai, with materialized references and Python scripts
- design-first-ui-prompting, editorial-tech, split-layout-technical, workflow-progress-screenshots, workflow-score-to-target: MengTo/Skills
- six reviewers: VoltAgent/awesome-codex-subagents

## Sequence
1. career-evidence-retrieval, then job-application-tailor when a JD exists.
2. korean-technical-resume OR write-korean-cover-letter OR korean-technical-portfolio.
3. humanize-korean only on approved prose, conservative style.
4. appropriate hiring-sim-* redteam only for substantive fact auditing.
5. portfolio-design-review on actual rendered screenshots, not theoretical design.

Do not invoke all skills for every task. The skills reuse the Codex model and its usage budget; none installs an additional local LLM, cloud proofreading API, or remote MCP.

## Source attribution and constraints
- https://github.com/seolbbb/write-korean-cover-letter
- https://github.com/kgyujin/job-application-tailor-skill
- https://github.com/techeer-sv/Career-Skills
- https://github.com/epoko77-ai/im-not-ai
- https://github.com/MengTo/Skills
- https://github.com/VoltAgent/awesome-codex-subagents
- https://github.com/garrytan/gstack/tree/main/design-review (methodology only)

The original resume-craft skill is not automatically copied because its repository lacks a verified root license; use the original project-local korean-technical-resume skill here. gstack itself is not installed because its Codex support involves an additional experimental runtime. The in-repo portfolio-design-review is a small original implementation, not a copy of gstack.

Career data may contain private details. Never add that data to the public website or Git without checking disclosure. Third-party skills are instructions/code from outside the project; inspect them before executing scripts or accepting modifications. All copied sources retain their source licenses.

The techeer portfolio-build templates are large. Check Git status before committing generated or installed third-party files.

This package has not been executed on the user's Windows PC. The manifest checker verifies presence, not functional correctness.

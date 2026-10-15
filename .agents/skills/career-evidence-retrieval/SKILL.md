---
name: career-evidence-retrieval
description: Find and rank evidence in Korean career Markdown databases and source repositories for targeted resumes, cover letters and project portfolios, without embeddings or local LLMs.
---
# Career Evidence Retrieval
Read the real original evidence repository before drafting. Convert the current JD and question into task/skill requirements and search exact project names, code symbols, tags and alternative Korean terms using files and ripgrep. Favor experience episodes over whole project summaries but read parent project context. Rank candidates by question relevance, personal judgment, concrete action, measured evidence, and verified status.

For each candidate, provide source path or stable ID, evidence excerpt, verification status, relevant JD duty, uncertainty and whether the user personally implemented it. Reject conflicts and do not treat a found note as independently verified.

Prefer native file search or lightweight SQLite FTS5 if needed; do not build Vector DB as a prerequisite. Exclude sensitive or private data from public generated outputs. After drafting, trace each key claim back to the actual source and record unsupported assertions separately.

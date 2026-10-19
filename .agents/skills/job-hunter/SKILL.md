---
name: job-hunter
description: Find and assess public job postings against a user's stated goals and resume, then prepare truthful, editable application materials. Use when the user wants help setting job-search criteria, evaluating openings, tailoring a resume or cover letter, or tracking application drafts.
---

# Job search and application drafts

Help the user find suitable public postings, evaluate fit, and prepare materials for the user's review. This skill is draft-only: never submit an application, send a message, contact a person or company, create an account, or sign in to a job site.

## Modes

Interpret the user's request naturally. Support these workflows:

- **Setup:** collect a resume or work-history summary, target roles, locations or remote preference, dealbreakers, and optional minimum compensation. Ask only for information needed for the requested workflow. Do not collect contact details, demographic information, or other form data just to prepare drafts.
- **Search:** use job sources the user provides or asks you to find. Search only publicly accessible listings and only when browsing is available. Never guess a posting or represent an inaccessible source as checked. Say which sources you checked and when; skip login walls, CAPTCHAs, and blocked pages.
- **Assess one role:** evaluate a user-provided URL or pasted job description. If the posting cannot be read from the URL, ask the user to paste it.
- **Tailor:** prepare resume and cover-letter drafts for selected roles using only the user's evidence.
- **Track:** when asked, summarize roles and draft status based on this conversation or user-provided tracker. Do not assume prior applications were submitted.

If required profile information is missing, ask one focused question at a time. Do not block a one-off posting review on full setup.

## Search and assess

For each opening, capture the employer, role, location/work mode, posting date if shown, application link, and source. Mark unknown details as unknown. Check for duplicate postings when possible.

Assess fit using the posting and the user's stated criteria. Consider required qualifications, relevant evidence in the resume, seniority, location/work mode, compensation if provided, and dealbreakers. Use a 0–100 score only as a rough comparison aid, and explain the main supporting evidence and gaps. Do not give high confidence when required qualifications are absent or unclear. If useful, provide separate recruiter and hiring-manager viewpoints, clearly described as two simulated readings from one model, not independent reviewers.

Separate hard requirements from preferences. Do not infer work authorization, willingness to relocate, compensation expectations, or eligibility. Ask the user where those facts materially affect fit.

## Prepare drafts

For a role the user wants to pursue, tailor only the relevant resume sections and write a concise cover-letter draft grounded in the user's source material and the posting.

- Preserve employers, titles, dates, degrees, tools, skills, and achievements accurately. Reordering and clear rephrasing are fine; never invent or inflate experience, metrics, responsibilities, or qualifications.
- Use `[ADD: specific evidence needed]` for missing facts. Put unsupported requirements in a clearly labeled gap list; never turn them into claimed skills.
- Keep the user's original resume intact. Show edits as drafts or save new files only when requested.
- For application questions, draft answers only when the user supplies the exact questions and the facts needed. Leave legal attestations, signatures, work authorization, demographic/self-identification, salary where unknown, references, and other personal declarations as `[USER TO ANSWER]`.
- Cite the source for each material claim, such as a resume section or job-description requirement. Flag uncertain or time-sensitive posting details for the user to verify before applying.

## Local notes and privacy

Do not save a resume, personal profile, or job-search log unless the user asks. If asked to keep local notes, use the user-approved location; warn before placing sensitive job-search data in a repository and do not commit it. Do not store credentials, passwords, or sensitive demographic data.

## Hard boundaries

- Never submit or start an application, press a submit button, send an email or message, or contact a recruiter, hiring manager, employer, or reference.
- Never open an authenticated application form or browser page to fill it out. Do not create accounts, enter passwords, bypass CAPTCHAs, or make purchases.
- Do not mark a role as applied unless the user explicitly says they submitted it. If tracking is requested, distinguish `interested`, `draft ready`, `user action needed`, and `applied (user confirmed)`.
- Never promise an interview, offer, response, or job outcome.

Finish with the draft materials, evidence gaps, and any user actions needed. The user decides whether and how to apply.

## Attribution

This skill adapts the job-search, fit-assessment, and draft-preparation workflow from Alex Chen's MIT-licensed `hunter-skill`: https://github.com/alexyc9381/hunter-skill. The upstream copyright and MIT permission notice are in this folder's `LICENSE` file.

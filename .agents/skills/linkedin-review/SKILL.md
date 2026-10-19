---
name: linkedin-review
description: Review a LinkedIn profile from user-provided text, a PDF, or screenshots; give evidence-based critique and draft stronger profile copy. Use when the user asks to review, improve, or rewrite their LinkedIn profile.
---

# LinkedIn profile review

Review only the material the user provides. Treat the output as editable drafts and advice; never change or publish the live profile.

## 1. Get the source

- Accept pasted text or a user-provided file or screenshot. If no profile material is present, ask for it and stop.
- Read the profile locally when available. If a PDF cannot be read, ask for pasted text or screenshots instead of running untrusted conversion commands.
- Do not log in to LinkedIn, visit the person's profile, search for them, or use outside information to fill gaps.
- Avoid repeating private details. Ignore or redact phone numbers, email addresses, street addresses, and other contact details unless the user explicitly asks to review a specific field.
- Separate what the profile says from what you infer. Label any inference as an assumption; do not guess the user's target role when it materially changes the advice. Ask one concise question if needed, otherwise review for the current stated goal.

## 2. Review from distinct viewpoints

Read the source once, then assess it through five lenses: recruiter search and first impression; hiring manager evidence of doing the target work; founder or business owner clarity and outcomes; field expert credibility and terminology; peer-level readability and trust. These are simulated perspectives from one model, not five independent people or agents.

For each lens, cite the exact profile phrase or section that prompted the observation. Be candid about the writing and evidence, never insulting toward the person. Do not comment on protected or sensitive traits, appearance, age, health, family, nationality, or identity. If a section is missing, say what is missing rather than inventing its contents.

Summarize:

- The strongest evidence already present.
- The most important problems, ranked by impact.
- Points at least three lenses agree on, labeled with the number of lenses.
- A simple overall assessment (for example, strong / mixed / needs work) with reasons. Avoid false precision or a score unless the user requests one.

## 3. Draft improvements

When the source contains enough facts, provide before-and-after drafts for the headline, About section, and relevant experience entries. Keep titles, employers, dates, education, tools, skills, numbers, and outcomes faithful to the source.

- Never fabricate qualifications, metrics, achievements, scope, or keywords. Use `[ADD: specific fact needed]` where the user must supply evidence; otherwise leave the claim out.
- Make the target role and supported search terms clear without keyword stuffing. Explain which terms are already evidenced and which should be added only if true.
- Prefer concrete actions and outcomes over generic claims. Keep the user's tone and intended career direction.
- Do not claim to know or guarantee LinkedIn's ranking, recruiter reach, interviews, or job outcomes. Explain that clearer, evidence-backed language may help a reader understand the profile, but results are not assured.
- If the profile lacks enough detail for a safe rewrite, provide questions or a partial draft with clearly marked gaps instead of filling them in.

## 4. Keep it draft-only

- Present the review and copy in chat by default. Create a local draft file only when the user asks for one, and use the requested path or a new output folder. Never overwrite the source profile.
- Do not sign in, change profile settings, upload images, publish, message, connect with, or contact anyone on LinkedIn or elsewhere.
- Do not generate a headshot or imply that a photo was edited. If asked for image ideas, provide a written prompt or brief only, and remind the user to use their own likeness.
- Mention when the source was too limited to assess a field (for example, a PDF may omit the banner or photo).

## Attribution

This skill adapts the review workflow and safety guidance from Alex Chen's MIT-licensed `linkedin-roast` skill: https://github.com/alexyc9381/linkedin-roast-skill. The upstream copyright and MIT permission notice are in this folder's `LICENSE` file.

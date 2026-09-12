# 0001 — Stack

Status: accepted
Date: 2026-09-12
Supersedes: audit §12 (platform decision: "Stay on Wix, upgrade to Studio")

## Context

The audit recommended staying on Wix and upgrading to Studio, on the grounds that
migration costs weekends and hands John a platform he cannot edit himself. That
reasoning still holds on its own terms — it was a recommendation about a Wix site.

The decision has since been made to rebuild in a repo instead, for the performance
ceiling, the content model, and the CI guardrails that make the audit's findings
mechanically un-regressable (`docs/02-project-structure.md` §8).

## Decision

Rebuild as a static site in this repository.

| Layer | Choice |
|---|---|
| Framework | Astro (version per ADR 0004) |
| Styling | Tailwind + CSS custom properties |
| Language | TypeScript, strict |
| Content | Markdown in `src/content/`, zod-validated collections |
| Package manager | npm |

Everything in the audit except §8.3 (Wix global CSS selectors) and §9 (Velo
snippets) carries over verbatim. Those two sections are translated, not copied —
the behaviours are right, the APIs are not. See `docs/02-project-structure.md` §3
Rule 3 for the mapping.

## Consequences

- Audit §12 no longer describes the plan. Read this ADR in its place.
- The audit's Wix-specific tooling notes (Wix CMS collections, Wix Automations,
  Wix structured-data panel, Accessibility Wizard) have repo equivalents that do
  not exist yet. They are follow-up work, not scaffold work.
- John can no longer edit the site himself. This is the one real risk called out
  in `docs/02-project-structure.md` §0 and it is **unresolved** until `0002-cms.md`
  is decided. Do not go to cutover before then.

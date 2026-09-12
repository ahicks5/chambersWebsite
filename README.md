# coachingwithjc.com

Rebuild of the JC Coaching & Consulting website — a static Astro site, content in
markdown, deployed from this repo.

Currently: **scaffold only.** Structure, config, content schemas and design tokens
are in place. No page content yet.

## Setup

```bash
npm install
npm run dev          # http://localhost:4321
```

Node 22.12+ (Astro 7 requires it — see `docs/decisions/0004-astro-7.md`). CI runs Node 22.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run check` | `astro check` — TypeScript and content-collection schema validation |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output locally |

CI runs `check` then `build` on every push and pull request.

## How this repo is organised

```
docs/           the spec. 01-audit.md is frozen; decisions/ supersedes it
src/config/     single sources of truth — site facts, nav, CTAs
src/content/    markdown content, zod-validated (schemas in src/content.config.ts)
src/styles/     tokens.css is the only place colours exist
src/components/ layout, sections, ui, seo, islands
src/pages/      routes
```

Read `CLAUDE.md` before making changes — it holds the rules that keep the audit's
findings from regressing (one H1 per page, no hardcoded CTAs, no stray hexes,
testimonial consent).

## Before this can launch

Two things are deliberately unfinished and tracked as decisions, not bugs:

1. **Bitter is not self-hosted yet.** The palette and typeface are extracted from
   the live site and live in `src/styles/tokens.css`, but the font falls back to
   Georgia until subset woff2 files land in `public/fonts/` — `docs/brand/tokens.md`
   has the detail.
2. **John cannot edit this site.** He can edit Wix. See `docs/decisions/0002-cms.md`;
   this blocks cutover.

## Where things point

- Live site (still Wix): https://www.coachingwithjc.com
- Scheduling: Calendly, two public event types (`intro-call`, `consultation`)

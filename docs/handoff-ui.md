# Handoff — visual design pass

Paste the prompt below into a fresh session. Everything it needs is in the repo.

---

## Prompt

I want a visual design pass on a coaching website. It's structurally finished
and well-tested, but it looks plain and I want it to feel considered.

**Repo:** `ahicks5/chambersWebsite` · **Live:** https://famous-sorbet-282f6f.netlify.app
(staging, `noindex` until DNS cutover)

### Read these first, in this order

1. `CLAUDE.md` — the hard rules. They are not negotiable and several are
   enforced by a linter that fails the build.
2. `docs/01-audit.md` §8 (design system), §5.2–5.6 (page blueprints), §10
   (performance and accessibility targets). The audit is the frozen spec.
3. `docs/decisions/` — ADRs supersede the audit where they conflict.
4. `docs/brand/tokens.md` — where the palette came from and the contrast maths.
5. `docs/parity-checklist.md` — what's deliberately unfinished, so you don't
   "fix" a placeholder.

### Do this first, before judging anything

**The site is rendering in the wrong typeface.** `--font-heading` and
`--font-body` name `Bitter` — John's actual brand face, confirmed from the live
Wix site — but it is never delivered: zero `@font-face` rules, zero Google Fonts
links, `public/fonts/` is empty. Everything falls back to Georgia.

So self-host Bitter first (400 and 900, subset woff2 in `public/fonts/`,
`font-display: swap`, preload the H1 weight), rebuild, and look again. A 900
Bitter heading and a Georgia bold heading are not the same design. Judge the
layout only after that.

### The constraints that matter

- **Colour comes only from `src/styles/tokens.css`.** A hex anywhere else fails
  `npm run lint:content`. The palette was extracted from John's live site and
  the audit's constraint is *"no change to the colour vibe"* — you may adjust
  lightness to fix a contrast failure, and must record it in
  `docs/brand/tokens.md`, but do not introduce new hues.
- **CTA labels and URLs come only from `src/config/cta.ts`.** Exactly two
  primary CTAs exist site-wide. `Button.astro` has no `label` prop by design.
- **One `<h1>` per page.** Tested.
- **Ship zero client JS unless the feature genuinely needs it.** The site
  currently emits **0 KB of JS bundles**; the two islands (Calendly, sticky CTA)
  inline. Keep it that way — audit §10 budgets 100 KB and the current total page
  weight is ~40 KB.
- **Copy lives in `src/content/`, not in components.** If you find yourself
  typing a sentence of prose into a `.astro` file, it belongs in a content file.

### Where the design is weakest (my read, not gospel)

- **Typography hierarchy.** Once Bitter loads, the type scale wants revisiting —
  it was set from tokens without ever seeing the real face.
- **The hero** is a headline, a subhead, a button and a photo slot. It carries
  the whole first impression and is currently the plainest section on the page.
- **Section rhythm.** Everything alternates white / `--c-surface` at identical
  vertical padding, which reads as flat. Audit §8.4 asks for rhythm, not just
  alternation.
- **Cards** (symptoms, offers, testimonials) are all one treatment — same
  border, radius, shadow. The offer cards in particular carry a pricing decision
  and should not look like the symptom cards.
- **The proof strip** is plain text; audit §3.3 wants it to read as credentials.
- **Colour use.** The deep green `#365347` is currently almost only on buttons.
  It clears 4.5:1 as body-size text on both backgrounds (see
  `docs/brand/tokens.md`), so it can carry more of the design than it does.

### Deliberately unfinished — do not "fix" these

- **Three photo slots** render dashed placeholders at 4:5. John hasn't supplied
  photos. Keep the reserved boxes; they exist so the real images cause no layout
  shift, and the hero photo is the LCP element per audit §10.
- **65 blog posts are `draft: true`** pending John's category review. Empty blog
  listings are correct, not a bug.
- **`/for-organizations`** has a dashed placeholder block for a format table
  that needs facts from John.

### How to verify your work

```bash
npm run check          # types + content schemas
npm run build
npm run lint:content   # the CLAUDE.md rules, mechanically
npm test               # 34 Playwright tests incl. axe on every route
```

All four must pass. `npm test` runs axe at wcag2a/aa and 21a/aa and fails on
serious or critical — a design change that breaks contrast will be caught.

**Look at your work.** There is a `scripts/serve-dist.mjs` foreground static
server and Playwright is available; screenshot at 375, 768 and 1440 before
claiming something looks right. Several real bugs in this project were found
only by rendering — an FAQ that displayed "Details" ten times instead of the
questions, a mobile header eating 40% of the viewport, and site-wide links that
were distinguishable by colour alone.

### Working style that suits this repo

Small PRs against `main`, each one green before merging. Every non-obvious
decision so far is an ADR in `docs/decisions/`; if you deviate from the audit,
add one rather than silently diverging. Commit messages cite the audit section
they implement.

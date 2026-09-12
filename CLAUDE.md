# JC Coaching — agent instructions

## Spec

`docs/01-audit.md` is the spec. It is frozen and read-only.
`docs/decisions/` supersedes it where they conflict — read the ADRs second, and
they win.

Cite the section you are implementing in commit messages:
`feat(hero): implement audit §5.2 §6`.

## Before starting any task

1. Read the relevant audit section in full, not the summary.
2. Read `docs/brand/voice.md` if the task touches copy.
3. Check `src/config/` — nav, CTA labels and site facts come from there. Never
   hardcode them.

## Hard rules

- **Colours only from `src/styles/tokens.css`.** Never introduce a hex anywhere
  else. Never change a hue — the audit's constraint is "no change to the colour
  vibe." Adjust lightness only, and only to clear a 4.5:1 contrast failure, and
  note it in `docs/brand/tokens.md`.
- **CTA labels and URLs only from `src/config/cta.ts`.** Exactly two primary CTAs
  exist site-wide (`intro` for individuals, `consult` for organizations) plus one
  soft secondary (`lead`). No component contains the strings "Book a",
  "Schedule", or "calendly.com".
- **One `<h1>` per page.**
- **Ship zero client JS unless the feature genuinely needs it.** The four that do
  are listed in audit §9 — implement them as Astro islands, not by copying the
  Velo snippets.
- **Audit §8.3 and §9 contain Wix-specific code.** Use the intent, not the API.
  See `docs/02-project-structure.md` §3 Rule 3 for the translation table.
- **Prices, quotes, FAQs and page copy are content files**, not components. If you
  are typing a sentence of user-facing prose into a `.astro` file, stop.
- **Testimonials render `firstName` only when `consent === 'named'`.** Otherwise
  role + industry only. This is a promise made to real clients.

## Voice

Warm, second person, plain. Sixth-to-eighth grade reading level. Short sentences.
No em-dash asides, no "not X but Y", no coach-speak — see the cut list in
`docs/brand/voice.md`.

## Definition of done for a page

- [ ] Section order matches the audit blueprint
- [ ] Unique title + description in frontmatter, per audit §7.2
- [ ] Primary CTA in hero, mid-page and footer — same label each time
- [ ] Lighthouse mobile: performance ≥ 90, accessibility 100, SEO 100
- [ ] Renders correctly at 375px, 768px and 1440px
- [ ] `npm run check` and `npm run build` both clean

## Commands

```
npm run dev      # local dev server
npm run check    # astro check — types and content schema validation
npm run build    # production build
```

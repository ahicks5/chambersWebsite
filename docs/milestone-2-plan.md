# Milestone 2 — Coaching + For Organizations

Execution plan, written after a fresh-eyes pass over PR #2. Work top to bottom.
Every item cites the audit section it implements; commit messages should too.

## 0. Before any page work

### 0a. `scripts/lint-content.mjs` — do this first

The CLAUDE.md hard rules have been checked by hand with grep on every push so
far. Milestone 2 adds three pages, and "unique description per page" only
starts meaning something at page two. Make the rules mechanical now
(`docs/02-project-structure.md` §8), running against `dist/` after build:

1. Exactly one `<h1>` per built page
2. Every page has a `<meta name="description">` of 50–160 chars, unique
   across pages — audit §2.8 bug 3
3. No `calendly.com`, `"Book a`, `"Schedule` in `src/` outside `src/config/cta.ts`
4. No raw hex outside `src/styles/tokens.css` (skip `public/`)
5. Banned words from `docs/brand/voice.md` in `src/content/` — **warn only**
6. Every `<img>` has non-empty alt that isn't a filename
7. FAQ JSON-LD `acceptedAnswer.text` equals the rendered answer text exactly
8. Every post has `pillar` or is one — skip until Milestone 3

Wire as `npm run lint:content` and add to `.github/workflows/ci.yml` and
`netlify.toml` after `build`. Rules 1–4 fail; 5 warns.

### 0b. CI: add `npm audit --audit-level=high`

Astro 5 shipped with a critical advisory and nothing caught it until a human ran
audit. One line in `ci.yml`, before `npm run check`.

### 0c. Two small fixes to carry into the first Milestone 2 push

- `TestimonialBand.astro` hardcodes "Read all nine →". Compute the count from
  `getCollection('testimonials')` so a tenth quote doesn't make it a lie.
- `docs/parity-checklist.md`, Needs Andrew: **Netlify form detection is off by
  default on new sites.** Site configuration → Forms → Enable. Without it the
  lead-magnet form silently does nothing. Add the line.

## 1. Decisions

| Question | Call | Why |
|---|---|---|
| Build `/for-organizations`? (§11 q6) | **Yes, lean.** | Four real org testimonials already exist, the 12-years-HR angle is the strongest B2B differentiator (audit §5.4 step 2), and the real copy is recovered in `docs/migration/live-copy-services.txt`. Collapsing later is deleting one page; needing it later is a week. Skip the PDF and the format-facts table until John supplies facts. |
| Pricing Option A / B (§4.4) | **Park. Render current prices.** | Changes `src/content/offers/*.md` only, whichever way it lands. Not a structural dependency. |
| FAQ answers (§4.5) | **Draft all ten, mark for John.** | The audit supplies enough for most: Q2 refers out + EMDR credibility, Q3 Austin / virtual by default, Q4 no pitch (from §6 step 1), Q6 invoice + one-line L&D description, Q10 ICF ACC. Q7 cancellation policy and Q9 payment plans are John's alone — draft the shape, flag the facts. Add `reviewed: boolean` (default `false`) to the `faqs` schema so unreviewed answers are visible in frontmatter; don't gate rendering on it. |

## 2. Content

**`src/content/pages/`**
- `coaching.md` — title/description from audit §7.2, `h1: Individual coaching`,
  `forWho[]` / `notForWho[]` from §3.1 verbatim.
- `for-organizations.md` — §7.2 title/description,
  `h1: Resilience, leadership, and burnout work for teams`.
- `testimonials.md` — archive page; fixes audit §2.8 bug 6 (H5/H6 headings) and
  un-404s a footer link for the cost of one page. Description must be unique.

**`src/content/offers/`** — two new, `segment: organization`, `cta: consult`:
- `workshops.md` — copy from the live page: *"custom workshops and facilitated
  learning experiences that help leaders, teams, and organizations work through
  the challenges most important to their success."* `includes[]` = the seven
  topics: sustainable success · performing with purpose · beating burnout ·
  resilient leadership · navigating change and uncertainty · psychological
  safety · building stronger, more collaborative teams. No price — `priceDisplay:
  "Scoped per engagement"`, no `priceValue`.
- `partnerships.md` — *"For leaders and organizations seeking ongoing, strategic
  support… a customized partnership that may combine coaching, consulting,
  facilitation, and targeted development."*

**`src/content/faqs/`** — ten files, `order` 1–10 in the §4.5 sequence,
`page: coaching`. Replace `example-coaching-vs-therapy.md`.

## 3. Components

| Component | Notes |
|---|---|
| `sections/ForWho.astro` | Two columns from `pages` frontmatter — audit §3.1. Renders nothing if both arrays are empty. |
| `sections/OfferCards.astro` | Add props `segment` and `page` (currently hardcodes `individual` / `home`). Decision row only for `individual`. |
| `sections/TestimonialBand.astro` | Add prop `segment`. Org page gets the four org quotes. |
| `sections/HowItWorks.astro` | Add prop `expanded` — coaching page shows the five-stage version from §5.3 step 5 (intro call → plan → sessions → between-session support → review). Two extra `steps` entries with a `stage` field, or a second collection; prefer a `variant: 'short' \| 'full'` field on `steps` and filter. |
| `sections/FaqAccordion.astro` | Native `<details>`/`<summary>`, zero JS — audit §9.5. One `<h2>`, each question a `<summary>` inside an `<h3>`. |
| `seo/SchemaFaq.astro` | `FAQPage` JSON-LD built from the same collection entries, using the **rendered** answer text — that is what lint rule 7 compares against. Put the builder in `src/lib/schema.ts`. |
| `sections/OrgHowToBringMeIn.astro` | Optional per §5.4 step 8: call → proposal → delivery. Three items, static content file or inline `steps` with `variant: 'org'`. |

## 4. Pages

- `src/pages/coaching.astro` — §5.3 order exactly: h1 + positioning line ·
  ForWho · OfferCards(individual) · decision row · HowItWorks(expanded) ·
  TestimonialBand(individual) · FaqAccordion + SchemaFaq · FinalCta(intro).
- `src/pages/for-organizations.astro` — §5.4: h1 · positioning paragraph (HR +
  ICF + positive psychology + neuroscience) · OfferCards(organization) ·
  TestimonialBand(organization) · OrgHowToBringMeIn · FinalCta(**consult**).
  Format table and PDF: placeholder section with a dashed box like the photo
  slots, listed in the checklist as Needs John.
- `src/pages/testimonials.astro` — h1, intro, two h2s (Individual /
  Organizations), all nine via `Quote.astro`, CTA at the end.

`FinalCta.astro` needs a `cta` prop; it hardcodes `intro` today.

## 5. Acceptance — run before the PR

- `npm ci && npm run check && npm run build && npm run lint:content` clean
- Screenshots at 375 / 768 / 1440 via the file:// preview trick in
  `scratchpad/` — no horizontal overflow, cards equal height in every grid
- Coaching page emits **one** Calendly event type; org page emits **one**, and
  it is `consultation`
- FAQ: `grep -c '<details' dist/coaching/index.html` = 10, and the JSON-LD
  parses with `node -e` and has ten `mainEntity` items
- `/current-services` redirect already in `public/_redirects` — verify it
  survives in `dist/_redirects`

## 6. Not in this milestone

About, Contact, Blog (Milestone 3). JSON-LD `ProfessionalService` (Milestone 4).
Sticky-header scroll state and mobile CTA strip (§9.1). Bitter self-hosting,
Netlify connect, ESP — all Andrew, all in the checklist.

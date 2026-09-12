# JC Coaching — Project Structure & Build Guide

**Companion to:** `docs/01-audit.md` (the deep-dive findings doc)
**Purpose:** how to lay this out in a repo, and how to use the audit as a living spec instead of a document you read once.
**Date:** September 12, 2026

---

## 0. Read this first: the one real risk

The audit recommended *staying on Wix* for a specific reason — John can edit Wix himself. If you rebuild in a repo, you own the site forever unless you solve editing for him.

So decide this before writing any code:

| Option | What John can edit | Your ongoing load |
|---|---|---|
| **A. Repo + git-based CMS** (recommended) | Blog posts, testimonials, FAQs, prices, copy — through a web UI that commits to the repo | Low. He edits, CI deploys. |
| **B. Repo only, you make all changes** | Nothing | You are the bottleneck for every typo. Fine for a month, bad by month six. |
| **C. Repo + hosted CMS** (Sanity/Contentful) | Same as A, nicer UI | Low, but a second vendor and a second set of credentials |

Pick A. Astro + **Keystatic** or **Sveltia CMS** gives John a `/admin` UI that reads and writes the markdown files in `src/content/`. No database, no extra hosting, and if the CMS ever dies the content is still plain markdown in git.

Write this down as `docs/decisions/0002-cms.md` before you start, because it determines your content model.

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5** | Ships zero JS by default, which is the whole ballgame for the Core Web Vitals targets in audit §10. Content collections are a native fit for testimonials/offers/FAQs/posts. |
| Styling | **Tailwind** + CSS custom properties | Tokens live in CSS vars (audit §8.2), Tailwind reads them. Keeps the palette in exactly one place. |
| Content | Markdown/MDX in `src/content/` | Git-versioned, diffable, CMS-editable |
| Editing UI | **Keystatic** (or Sveltia) | Commits to git, runs on the same host |
| Interactivity | Astro islands (Svelte or vanilla) | Only 4 interactive pieces exist (audit §9). None needs a framework; one or two might want Svelte. |
| Forms | Host-native (**Netlify Forms**) or Formspree | No backend to run |
| Scheduling | Calendly inline embed | Already his tool; don't replace it |
| Email/lead magnet | ConvertKit or Buttondown | Embedded form + automation for the burnout check |
| Host | **Netlify** or Cloudflare Pages | Netlify if you want its Forms + redirects; CF Pages if you want speed and don't mind Formspree |
| Analytics | GA4 + Plausible (optional) | Audit §11 events |

If you'd rather use Next.js because you know it: fine, everything below maps over. But for a 7-page content site with a blog, Astro is less machinery and faster output.

---

## 2. Repo layout

```
coachingwithjc/
├─ README.md                      # setup, commands, deploy, who to call
├─ CLAUDE.md                      # agent instructions (see §9)
├─ astro.config.mjs
├─ tailwind.config.mjs
├─ package.json
├─ .env.example                   # CALENDLY_*, GA4_ID, FORM_ENDPOINT
├─ docs/
│  ├─ 01-audit.md                 # ← the deep-dive doc. FROZEN. Never edit.
│  ├─ 02-project-structure.md     # ← this file
│  ├─ decisions/                  # ADRs: what we chose and why
│  │  ├─ 0001-stack.md
│  │  ├─ 0002-cms.md
│  │  ├─ 0003-pricing-presentation.md
│  │  └─ 0004-nav-and-urls.md
│  ├─ brand/
│  │  ├─ tokens.md                # extracted palette + type scale, with hexes
│  │  ├─ voice.md                 # audit §3.4, expanded into a style guide
│  │  └─ keywords.md              # audit §7.1 keyword map
│  ├─ parity-checklist.md         # audit §2.8 bugs + content migration
│  └─ content-inventory.csv       # every page/post on the old site → new home
├─ public/
│  ├─ fonts/                      # self-hosted, subset, woff2
│  ├─ downloads/
│  │  ├─ burnout-check.pdf
│  │  └─ jc-team-capabilities.pdf
│  ├─ favicon.svg
│  └─ robots.txt
├─ src/
│  ├─ config/
│  │  ├─ site.ts                  # name, NAP, credentials, social, calendly URLs
│  │  ├─ nav.ts                   # audit §5.1 — single source of truth
│  │  └─ cta.ts                   # audit §4.3 — labels + URLs + UTMs
│  ├─ content/
│  │  ├─ config.ts                # zod schemas (see §4)
│  │  ├─ offers/                  # 5 files: 3-month, pivot, single, partnerships, workshops
│  │  ├─ testimonials/            # 9 files, one per quote
│  │  ├─ faqs/                    # 10 files, audit §4.5
│  │  ├─ symptoms/                # 4 files, "sound familiar" cards
│  │  ├─ steps/                   # 3 files, how-it-works
│  │  ├─ credentials/             # 6 files, proof strip
│  │  ├─ pages/                   # home.md, about.md, coaching.md, orgs.md, contact.md
│  │  └─ posts/                   # blog, migrated from Wix
│  ├─ components/
│  │  ├─ layout/                  # Header, Footer, Nav, StickyCta, Section
│  │  ├─ sections/                # Hero, ProofStrip, SymptomGrid, HowItWorks,
│  │  │                           #   OfferCards, DecisionRow, TestimonialBand,
│  │  │                           #   MeetJohn, OrgBand, LeadMagnet, FinalCta
│  │  ├─ ui/                      # Button, Card, Quote, Badge, Accordion, Prose
│  │  ├─ seo/                      # Meta.astro, SchemaProfessionalService.astro,
│  │  │                           #   SchemaFaq.astro, SchemaArticle.astro
│  │  └─ islands/                 # Calendly.astro, ScrollReveal.ts, MobileCta.svelte
│  ├─ layouts/
│  │  ├─ Base.astro               # html shell, Meta, Header, Footer
│  │  ├─ Page.astro
│  │  └─ Post.astro               # + author box + lead magnet + CTA (audit §7.4)
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ coaching.astro
│  │  ├─ for-organizations.astro
│  │  ├─ about.astro
│  │  ├─ contact.astro
│  │  ├─ testimonials.astro
│  │  ├─ resources.astro
│  │  ├─ privacy.astro
│  │  ├─ burnout-check.astro
│  │  ├─ blog/
│  │  │  ├─ index.astro
│  │  │  ├─ [...slug].astro
│  │  │  └─ category/[category].astro
│  │  └─ 404.astro
│  ├─ styles/
│  │  ├─ tokens.css               # audit §8.2 — the ONLY place colors exist
│  │  └─ global.css               # audit §8.3, translated off Wix classes
│  ├─ lib/
│  │  ├─ analytics.ts             # audit §11 event helpers
│  │  ├─ schema.ts                # JSON-LD builders, audit §7.5
│  │  └─ seo.ts                   # title/description defaults + per-page overrides
│  └─ assets/                     # source images, processed by Astro
├─ tests/
│  ├─ smoke.spec.ts               # Playwright: every route 200s, one H1, CTA present
│  └─ a11y.spec.ts                # axe on each route
└─ .github/workflows/
   ├─ ci.yml                      # astro check, build, lint, tests, link check
   └─ lighthouse.yml              # budget assertions, audit §10
```

---

## 3. How to use the audit doc

Three rules make it a spec instead of a blog post.

### Rule 1 — The audit is frozen and read-only

Drop it in as `docs/01-audit.md` and never edit it. It's a snapshot of the site on Sept 12, 2026 plus a set of recommendations. If you change your mind about something in it, you don't rewrite the audit — you write an ADR that supersedes it:

```md
<!-- docs/decisions/0003-pricing-presentation.md -->
# 0003 — Pricing presentation

Status: accepted
Date: 2026-09-20
Supersedes: audit §4.4 (Option A vs B)

## Decision
Option B. Keep $2,000 / $1,000 and reframe around inclusions.
John does not want to raise the single-session price this year.

## Consequences
- offers/three-month.md gains an `includes[]` array and a `comparison` block
- No change to single-session pricing
- Revisit Jan 2027 after 10 more clients
```

Now future-you (and any agent) can read the audit and the ADRs together and know exactly where the spec has moved.

### Rule 2 — Every section maps to a specific artifact

| Audit § | Becomes | Notes |
|---|---|---|
| §2 page audit | `docs/content-inventory.csv` | One row per old page → new URL, what carries over, what dies |
| §2.8 bug table | `docs/parity-checklist.md` + 15 GitHub issues | Each is a checkbox; don't launch with any open |
| §3.1 ICP | `src/content/pages/coaching.md` frontmatter (`forWho` / `notForWho`) | Rendered as the two-column block |
| §3.3 unused assets | Issues, one per asset | "Surface journals in proof strip", etc. |
| §3.4 voice | `docs/brand/voice.md` | Referenced by `CLAUDE.md`; the cut-list of words becomes a lint rule (see §8) |
| §4.3 CTA standard | `src/config/cta.ts` | **One export.** No CTA string is ever hardcoded in a component. |
| §4.4 pricing | `src/content/offers/*.md` | Prices are content, not markup |
| §4.5 FAQ | `src/content/faqs/*.md` | Same text feeds the accordion and the JSON-LD |
| §5.1 nav | `src/config/nav.ts` | Header, footer, and sitemap all read it |
| §5.2–5.6 blueprints | `src/pages/*.astro` section order | The blueprint tables *are* the page composition |
| §6 copy draft | `src/content/pages/home.md` | Starting text; John edits from there |
| §7.1 keywords | `docs/brand/keywords.md` | Post frontmatter has a `keywords` field checked against it |
| §7.2 titles/metas | Page frontmatter + `src/lib/seo.ts` defaults | Build fails if a page has no unique description |
| §7.5 JSON-LD | `src/lib/schema.ts` + `components/seo/*` | Built from content, so it can't drift from visible text |
| §8.2 tokens | `src/styles/tokens.css` | Hexes filled in from the real palette |
| §8.3 CSS | `src/styles/global.css` | **Translate, don't copy** — see Rule 3 |
| §9 Velo | `src/components/islands/*` | **Translate, don't copy** — see Rule 3 |
| §10 perf targets | `lighthouse-budget.json` in CI | Targets become failing builds |
| §11 measurement | `src/lib/analytics.ts` | Event names exactly as listed |
| §13 roadmap | 4 GitHub milestones | Phases map 1:1 |
| Appendix A | `public/_redirects` (Netlify) or `astro.config` redirects | 301s from old Wix URLs |
| Appendix C | `testimonials` schema fields | `firstName`, `role`, `industry`, `engagement`, `consent` |
| Appendix D | `src/pages/burnout-check.astro` + `public/downloads/` | |

### Rule 3 — Two sections are Wix-specific. Translate them.

**§8.3 `global.css`** is written against Wix's global classes (`.button__label`, `.text p`, `.section--alt`, `customClassList`). The *tokens, type scale, spacing rhythm, card treatment, focus states, and reduced-motion handling are all correct and portable.* The selectors are not. Rewrite as component classes or Tailwind `@layer components`.

**§9 Velo snippets** use `$w`, `onViewportEnter`, `wixData`. The four *behaviors* are right; the APIs are not:

| Audit §9 | Astro equivalent |
|---|---|
| 9.1 Sticky header via `onViewportLeave` | `position: sticky` + a tiny `IntersectionObserver` on a hero sentinel |
| 9.2 Calendly embed | `components/islands/Calendly.astro`, lazy-mounted on intersection, explicit height |
| 9.3 Testimonials from `wixData` | `getCollection('testimonials')` at build time — no client JS at all |
| 9.4 Scroll reveal | One `IntersectionObserver` in a `<script>`, CSS does the rest |
| 9.5 FAQ accordion | Native `<details>`/`<summary>`, styled. Zero JS. |
| 9.6 Lead magnet | ESP embed or a POST to the form endpoint |

Everything else in the audit — findings, copy, structure, SEO, pricing, benchmarks — is platform-agnostic and carries over verbatim.

---

## 4. Content model

This is the part worth getting right, because it's what John will be editing. Schemas in `src/content/config.ts`:

```ts
import { defineCollection, reference, z } from 'astro:content';

const offers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    segment: z.enum(['individual', 'organization']),
    tagline: z.string(),                    // one line, shows on the card
    forWho: z.string(),                     // the decision-row answer, audit §4.4
    priceDisplay: z.string(),               // "From $1,000" — display, not math
    priceValue: z.number().optional(),      // for JSON-LD Offer
    sessions: z.string().optional(),        // "12 sessions over 3 months"
    includes: z.array(z.string()).default([]),
    badge: z.string().optional(),           // "Most popular"
    cta: z.enum(['intro', 'consult']).default('intro'),
    order: z.number(),
    featured: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  type: 'content',                          // body = the quote
  schema: z.object({
    firstName: z.string().optional(),       // omit if client declined (Appendix C)
    role: z.string(),
    industry: z.string(),
    engagement: z.string(),                 // "3-month partnership"
    segment: z.enum(['individual', 'organization']),
    featured: z.boolean().default(false),
    consent: z.enum(['named', 'role-only']),// gate: named rendering requires 'named'
    order: z.number().default(99),
  }),
});

const faqs = defineCollection({
  type: 'content',                          // body = the answer, feeds FAQPage schema
  schema: z.object({
    question: z.string(),
    order: z.number(),
    page: z.enum(['coaching', 'organizations']).default('coaching'),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string().max(70),
    description: z.string().min(50).max(160),   // enforced meta description
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['burnout', 'resilience', 'career', 'leadership', 'practices']),
    heroImage: image().optional(),
    pillar: reference('posts').optional(),      // cluster → pillar, audit §7.4
    keywords: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(60),               // <title>, audit §7.2
    description: z.string().min(50).max(160),
    h1: z.string(),
    subhead: z.string().optional(),
    forWho: z.array(z.string()).default([]),
    notForWho: z.array(z.string()).default([]),
    noindex: z.boolean().default(false),
  }),
});

export const collections = { offers, testimonials, faqs, posts, pages, symptoms, steps, credentials };
```

Three things this buys you:

1. **The 15-category problem can't come back.** `category` is an enum of five.
2. **Metas can't be missing or duplicated.** `description` is required with length bounds; add a build-time check for uniqueness.
3. **Testimonial consent is enforced in types.** A component that renders `firstName` asserts `consent === 'named'`. You can't accidentally publish a name John didn't clear.

Example offer file:

```md
---
title: 3-Month Coaching Partnership
segment: individual
tagline: For changing how you work and live.
forWho: I'm burned out and want to change how I work and live.
priceDisplay: From $1,000
priceValue: 1000
sessions: Weekly (12 sessions) or biweekly (6 sessions)
includes:
  - Weekly or biweekly 60-minute sessions
  - Text and email support between sessions
  - A plan built around your patterns, not a template
badge: Most popular
cta: intro
order: 1
featured: true
---

Meaningful change happens when you have the space to notice what's working…
```

---

## 5. Single sources of truth

Three config files prevent the exact drift the audit found on the live site.

```ts
// src/config/cta.ts — audit §4.3
const CAL = 'https://calendly.com/johnchambers-coachingwithjc';

export const CTA = {
  intro: {
    label: 'Book a free intro call',
    href: `${CAL}/intro-call`,
    style: 'primary',
  },
  consult: {
    label: 'Book a consultation',
    href: `${CAL}/consultation`,
    style: 'primary',
  },
  leadMagnet: {
    label: 'Take the 2-minute burnout check',
    href: '/burnout-check',
    style: 'ghost',
  },
} as const;

// Every link gets attribution automatically (audit §11)
export function ctaHref(key: keyof typeof CTA, page: string, position: string) {
  const url = new URL(CTA[key].href);
  url.searchParams.set('utm_source', 'site');
  url.searchParams.set('utm_medium', 'cta');
  url.searchParams.set('utm_campaign', `${page}-${position}`);
  return url.toString();
}
```

Add a lint rule or a grep in CI: **no component may contain the strings "Schedule", "Book a", or "calendly.com".** They come from `cta.ts` or they don't exist.

```ts
// src/config/nav.ts — audit §5.1
export const primaryNav = [
  { label: 'Coaching', href: '/coaching' },
  { label: 'For Organizations', href: '/for-organizations' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];
export const footerNav = [
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
];
```

```ts
// src/config/site.ts
export const site = {
  name: 'JC Coaching & Consulting',
  url: 'https://www.coachingwithjc.com',
  person: 'John Chambers',
  email: 'johnchambers@coachingwithjc.com',
  locality: 'Austin', region: 'TX', country: 'US',
  credentials: ['ICF ACC', '12 years corporate HR', 'Cornell', 'Korn Ferry', 'UPenn', 'CaPP Institute'],
  social: {
    linkedin: 'https://www.linkedin.com/in/john-m-chambers-atx',
    instagram: 'https://instagram.com/coachingwithjc',
    tiktok: 'https://www.tiktok.com/@coachingwithjc',
    x: 'https://x.com/coachingwith_jc',
  },
} as const;
```

The `© 2024 JC Consulting & Consulting` bug becomes structurally impossible: the footer renders `© {new Date().getFullYear()} {site.name}`.

---

## 6. Tokens: extract before you build

Do this first, in one sitting, before any component work.

1. Open the live Wix site, DevTools → inspect the header, hero text, body text, button, and any alternate-background section.
2. Record the computed `color` / `background-color` hexes. Also grab the font families from the `font-family` stack.
3. Write them into `docs/brand/tokens.md` with a screenshot of each in context.
4. Fill `src/styles/tokens.css` using the audit §8.2 variable names exactly.
5. Check contrast (WebAIM) for body-on-bg and button-label-on-accent. If either fails 4.5:1, darken only that one value and note the deviation in `tokens.md`. Same hue, adjusted lightness — the vibe survives.
6. Wire Tailwind to the vars so there's no second copy:

```js
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)', surface: 'var(--c-surface)',
        ink: 'var(--c-text)', muted: 'var(--c-muted)',
        accent: 'var(--c-accent)', 'accent-ink': 'var(--c-accent-ink)',
        line: 'var(--c-line)',
      },
      maxWidth: { measure: 'var(--measure)' },
      borderRadius: { card: 'var(--radius)' },
    },
  },
};
```

**Rule:** a raw hex appearing anywhere outside `tokens.css` is a bug. Add that to CI too.

Fonts: whatever Wix is serving, self-host the same families as subset woff2 in `public/fonts/` with `font-display: swap` and a `<link rel="preload">` for the one used in the H1. Two families, max four weights (audit §10).

---

## 7. Migration

`docs/parity-checklist.md` — don't launch with anything unchecked.

**Content**
- [ ] Blog posts pulled from Wix. Try `https://www.coachingwithjc.com/blog-feed.xml` first; if the feed is complete, a small script converts RSS → MDX frontmatter. Otherwise copy/paste the three posts by hand (it's three posts).
- [ ] Post slugs preserved exactly. `/post/the-practice-that-saved-my-life` must resolve — redirect `/post/*` → `/blog/*`.
- [ ] Images downloaded at source resolution from `static.wixstatic.com` (strip the `/v1/fill/...` transform segment from the URL to get the original), into `src/assets/`.
- [ ] All 9 testimonials entered with `consent` set correctly.
- [ ] Journals (3) and books (6) and talks (5) into `resources`. Fix "Marta Beck" → Martha Beck and "Autl Gawande" → Atul Gawande.
- [ ] Clean Amazon short links only.

**Redirects** (`public/_redirects`)
```
/about-me            /about               301
/current-services    /coaching            301
/post/*              /blog/:splat         301
/blog/categories/*   /blog/category/:splat 301
```
Keep every old URL alive. The Wix blog has backlinks from LinkedIn.

**Cutover**
- [ ] Deploy to a preview URL; John reviews every page
- [ ] Lighthouse mobile ≥ 90 perf, 100 a11y/SEO on all routes
- [ ] Forms tested end to end (submission arrives in John's inbox)
- [ ] Calendly embed books a real test event
- [ ] Lead magnet automation delivers the PDF
- [ ] GA4 firing; `cta_click` visible in realtime
- [ ] Search Console: add the new property, submit `sitemap.xml`
- [ ] DNS switch (drop TTL to 300 the day before)
- [ ] Wix site kept on a subdomain or in the account for 30 days as a rollback
- [ ] 48h after launch: re-crawl for 404s, check GSC coverage

---

## 8. CI and guardrails

The point of a repo is that the audit's findings become mechanically impossible to regress.

```yaml
# .github/workflows/ci.yml (sketch)
- run: npx astro check          # types, content schema validation
- run: npm run build
- run: npm run test:smoke       # every route 200s, exactly one H1, CTA present
- run: npm run test:a11y        # axe, zero serious violations
- run: npm run lint:content     # custom script, see below
- run: npx linkinator ./dist --recurse
```

`scripts/lint-content.mjs` checks the things the audit caught by hand:

1. Exactly one H1 per rendered page
2. Every page has a unique, non-empty 50–160 char description (the Contact/Resources duplicate bug)
3. No hardcoded CTA strings or `calendly.com` outside `cta.ts`
4. No raw hex colors outside `tokens.css`
5. No banned words from `docs/brand/voice.md` in page copy (`journey`, `unlock`, `walk alongside`, `step into the life you deserve`) — warn, don't fail
6. Every image has non-empty alt text that isn't a filename
7. FAQ JSON-LD answer text matches the rendered answer text character-for-character
8. Every post has a `pillar` or is one

`lighthouse-budget.json` asserts the audit §10 targets: LCP < 2500ms, CLS < 0.1, total JS < 100KB, total page weight < 1MB mobile.

---

## 9. `CLAUDE.md` — how an agent should use the audit

If you're building this with Claude Code, this file does most of the work. Keep it short and pointed; long agent instructions get skimmed.

```md
# JC Coaching — agent instructions

## Spec
`docs/01-audit.md` is the spec. It is frozen and read-only.
`docs/decisions/` supersedes it where they conflict — read ADRs second, and they win.
Cite the section you're implementing in commit messages: `feat(hero): implement audit §5.2 §6`.

## Before starting any task
1. Read the relevant audit section(s) in full, not the summary.
2. Read `docs/brand/voice.md` if the task touches copy.
3. Check `src/config/` — nav, CTA labels, and site facts come from there. Never hardcode them.

## Hard rules
- Colors ONLY from `src/styles/tokens.css`. Never introduce a hex. Never change a hue —
  the audit's constraint is "no change to the color vibe."
- CTA labels and URLs ONLY from `src/config/cta.ts`. Exactly two primary CTAs exist site-wide.
- One `<h1>` per page.
- Ship zero client JS unless the feature genuinely needs it. The four that do are listed
  in audit §9 — implement them as Astro islands, NOT by copying the Velo snippets.
- Audit §8.3 and §9 contain Wix-specific code. Use the intent, not the API.
- Prices, quotes, FAQs, and page copy are content files. Do not put them in components.
- Testimonials render a first name only when `consent: named`.

## Voice
Warm, second person, plain. 6th–8th grade reading level.
Short sentences. No em-dash asides, no "not X but Y", no coach-speak
(see the cut-list in `docs/brand/voice.md`).

## Definition of done for a page
- [ ] Section order matches the audit blueprint
- [ ] Unique title + description in frontmatter, per audit §7.2
- [ ] Primary CTA in hero, mid-page, and footer — same label each time
- [ ] Lighthouse mobile: perf ≥ 90, a11y 100, SEO 100
- [ ] Renders correctly at 375px, 768px, 1440px
- [ ] `npm run lint:content` clean
```

Then work one milestone at a time, and give the agent the blueprint table rather than a prose description. "Implement audit §5.3 as `src/pages/coaching.astro`, sections in order, content from `src/content/offers` and `src/content/faqs`" is a much better prompt than "build the coaching page."

---

## 10. Build order

Mirrors audit §13, resequenced for a repo (infrastructure before content).

**Milestone 0 — Foundation (one evening)**
Repo, Astro + Tailwind, tokens extracted and filled, `Base.astro`, Header/Footer/Nav/Button/Section, `config/*`, deploy a blank page to a preview URL. Ship this before writing a single section.

**Milestone 1 — Homepage** (audit §5.2, §6)
Hero → ProofStrip → SymptomGrid → HowItWorks → OfferCards + DecisionRow → TestimonialBand → MeetJohn → OrgBand → LeadMagnet → FinalCta. Content collections for offers/symptoms/steps/testimonials/credentials get created here and reused everywhere after.

**Milestone 2 — Coaching + Organizations** (audit §5.3, §5.4)
Split of the old Services page. FAQ accordion + FAQPage schema. Org format table + capabilities PDF.

**Milestone 3 — About, Contact, Blog** (audit §5.5, §5.6, §7.4)
About reordered (TL;DR first). Contact with Calendly embed. Blog index, post layout with author box + lead magnet + CTA, five categories, pillar/cluster links.

**Milestone 4 — SEO, analytics, launch**
All metas, JSON-LD, redirects, sitemap, GA4 events, burnout-check landing page + PDF + automation, privacy page, parity checklist, cutover.

**Milestone 5 — Handoff**
Keystatic/Sveltia at `/admin`, John walked through editing a post and a testimonial, a one-page "how to update your site" doc in `docs/`, and a recurring calendar reminder for his two-posts-a-month cadence.

---

## 11. What to decide before you open the editor

Answer these in ADRs; each one changes the build.

1. **CMS for John — yes or no?** (§0. If no, be honest with him about it.)
2. **Pricing: Option A or B?** (audit §4.4) Changes the offer schema and the Coaching page.
3. **Testimonials: how many will John actually get named?** If fewer than three, the homepage band uses role+industry and you skip the `firstName` rendering path for now.
4. **Lead magnet: does the burnout-check PDF exist?** If it won't be written for a month, build the band with a plain newsletter signup and swap the offer later. Don't block launch on a PDF.
5. **Host: Netlify (forms included) or Cloudflare (Formspree)?**
6. **Does John want the org side at all right now?** If corporate work is 10% of revenue and he doesn't want more of it, `/for-organizations` becomes a single section on the homepage and you save a week.
7. **Who owns the domain and DNS?** Find out before cutover day, not during it.

---

## 12. One honest note

The audit's top three fixes — the hero, the unified CTA, and the pricing structure — are all achievable on the current Wix site in about two evenings. A repo rebuild is a bigger, better project, and it's the right call if you want the performance, the content model, and the CI guardrails. But the conversion gain comes almost entirely from the content and structure decisions, not the platform.

So if there's any chance the rebuild stalls at 70% done: do the hero, the CTA consolidation, and the pricing fix on Wix first. Then rebuild at your leisure with the site already converting better. Sunk-cost momentum is the main failure mode for a favor-for-a-friend project.

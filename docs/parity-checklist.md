# Parity checklist

Audit §2.8 bugs plus content migration. Don't launch with anything unchecked.

Items marked **Andrew** need a dashboard, a credential, or a file. Items marked
**John** need his words or his permission. Everything else is code.

## Blocking launch

### Needs John

- [ ] **Testimonial attribution.** All nine migrated quotes have no name, no role
      and no industry — only an engagement length. Audit §2.4 calls getting
      first name + role + industry the single highest-leverage social-proof
      change available. John emails nine clients. The rendering path already
      handles every case (ADR 0006), so this is a frontmatter edit per quote.
- [ ] **John's full About story.** `src/content/bands/about-story.md` is
      stitched together from the live page and is missing the middle. Audit §2.2
      calls this the strongest differentiator on the site; it should read as he
      wrote it, not as I reassembled it. The file carries a TODO.
- [ ] **Journal cover images.** The three journals now carry their real Amazon
      links on `/resources`; the cover images are still missing, and the About
      page's books band lists titles only.
- [ ] **Read the privacy page.** `src/content/pages/privacy.md` describes what
      the site actually does today — two forms, the Calendly embed, server logs —
      and deliberately says nothing about analytics because none are wired. It is
      not legal advice and no lawyer has seen it. It also needs updating the day
      GA4 goes in.
- [ ] **Photos.** Three slots are reserved and sized at 4:5 — hero, Meet John,
      and About — each rendering a dashed placeholder, so dropping the real
      images in shifts no layout. Audit §10 wants the hero photo ~1500px wide and
      never lazy-loaded, since it is the LCP element. Real alt text too, not a
      filename (audit §7.6).
- [ ] **Pricing decision, Option A or B** (audit §4.4, §11 question 2). The
      3-month package currently costs *more* per session than a single session
      (~$167 vs $145), so there is no economic reason to commit. The homepage
      renders John's current prices unchanged; deciding this changes
      `src/content/offers/*.md` only.
- [ ] **Burnout-check PDF** (audit appendix D). The form collects emails today
      but nothing is delivered. Audit §11 question 4 says don't block launch on
      the PDF — ship the band with a newsletter signup and swap the offer later.
- [ ] **Does the org side stay?** (§11 question 6.) If corporate work is 10% of
      revenue and John doesn't want more, `/for-organizations` collapses into the
      homepage band that already exists and Milestone 2 gets a week shorter.

### Needs Andrew

- [x] **Netlify connected** — famous-sorbet-282f6f.netlify.app. Deploy previews
      run per pull request, so John gets a review link on every change.
- [x] **Form detection enabled and verified.** Netlify injects a hidden
      `form-name` field into both `contact` and `burnout-check` at build time
      and strips our `data-netlify` attribute — checked on the live deploy.
- [ ] **Submit each form once for real** and confirm it arrives. The only part
      of the chain that cannot be verified from here.
- [x] **Self-host Bitter.** Latin-subset woff2 for 400 and 900 in
      `public/fonts/`, `font-display: swap`, the H1 weight preloaded. One
      family, two weights, inside the audit §10 cap of two and four. Until this
      landed every page rendered in Georgia — see `docs/brand/tokens.md`.
- [ ] **ESP for the lead magnet** (ConvertKit or Buttondown). Netlify Forms
      collects the address; something has to send the PDF.
- [ ] **Who owns the domain and DNS?** (§11 question 7.) Find out before cutover
      day, not during it.
- [ ] **GA4 + Search Console.** `src/lib/analytics.ts` already carries the audit
      §11 event names; this is creating the properties and pasting the tag.

### Code, not yet done

- [x] **Blog migrated.** All 65 posts, zero failures — `scripts/migrate-wix-posts.mjs`.
      Median 1,163 words, structure preserved (263 subheadings, lists, emphasis,
      links). Every old slug resolves: all 65 `/post/<slug>` map to `/blog/<slug>`
      via `public/_redirects`, verified against the live sitemap.
- [ ] **John: read all 65 and set the category.** Every post is `draft: true`
      and stays out of the listings and the sitemap until he flips it. Routes
      exist and are `noindex`, so he can read each one on a deploy preview. The
      script guessed the category from keywords — 21 of the 65 with low
      confidence — and that guess is not a judgment about his own writing.
- [ ] **43 migrated posts contain inline Calendly links** written into the
      original copy. They bypass `src/config/cta.ts`, carry no UTMs, and some
      point at the bare profile rather than one of the two event types (audit
      §4.3). They work, so nothing is broken; they are just invisible to the
      attribution in §11. Rewriting John's published words is his call, not mine.
- [ ] **Blog post images.** Hero images exist in each post's `BlogPosting`
      JSON-LD but are not migrated; the bodies carry no inline images. Pull them
      at source resolution from `static.wixstatic.com` with the `/v1/fill/...`
      segment stripped, then set `heroImage` in frontmatter.
- [ ] **Pillar and cluster links** (audit §7.4). The `pillar` reference field
      exists on the posts schema and is unset on all 65. Needs one pillar per
      category and internal links from its cluster.
- [ ] **John: confirm the five talk titles on `/resources`.** The live page
      shows descriptions with no titles (audit §2.6 asks for speaker + title as
      text). The speakers are from his copy; the titles are the well-known talks
      those descriptions match, and no embed URLs were recoverable. Worth thirty
      seconds of his eyes.
- [ ] Wire GA4 to `src/lib/analytics.ts`. The event names and parameters are
      written to audit §11 and the helpers no-op until a `gtag` exists, so this
      is adding the tag plus one delegated `cta_click` listener in `Base.astro` —
      not hunting event names through components.
- [ ] Run `lighthouse-budget.json` against the deployed site. Now unblocked —
      Netlify is live. Best done as a scheduled job or a manual pass rather
      than per-PR, since it needs a finished deploy. The build ships **0 KB of
      JS bundles** against a 100 KB budget.
- [x] **Sticky-header scroll state and the mobile bottom CTA** (audit §9.1).
      Header gains a shadow once the hero scrolls past; phones get a bottom
      CTA strip instead of a pinned 173px header, which hides again at the
      footer. One island, two observers, still zero JS bundles.
- [x] **Form border token.** `--c-line-strong` (#8b8b8b) — the lightest neutral
      grey clearing WCAG 1.4.11's 3:1 on both the page background (3.41:1) and
      the surface band (3.02:1). Inputs no longer borrow the body-text colour.
- [x] **Form success page.** All four form locations post with
      `action="/thanks/"`, so people land on a branded page that says what
      happens next rather than Netlify's generic one.
- [x] **Playwright suites** — `smoke.spec.ts` (every route 200s, one h1, a
      description, a CTA, one Calendly event per page, all 65 post routes, drafts
      noindex and out of the sitemap) and `a11y.spec.ts` (axe wcag2a/aa + 21a/aa,
      zero serious or critical). 32 tests, running in CI against the built site.

## Audit §2.8 bug table

The rebuild makes most of these structurally impossible rather than fixed.

| # | Issue | Status |
|---|---|---|
| 1 | Nav differs across pages | **Fixed by construction** — one `src/config/nav.ts`, read by header and footer. |
| 2 | `© 2024 by JC Consulting & Consulting` | **Fixed by construction** — footer renders `© {year} {site.name}`. (Also already corrected on the live site.) |
| 3 | Contact meta duplicates Resources | **Fixed by construction** — `description` is required, 50–160 chars, per page, and `lint:content` fails the build on a duplicate. |
| 4 | No H1 on homepage | **Fixed** — the hook is the H1 and the first thing on the page. Verified: exactly one H1. |
| 5 | Two H1s on Services | Open — Milestone 2 splits the page. |
| 6 | H5/H6 as headings on Testimonials | Open — Milestone 2. |
| 7 | Five Calendly events across six CTA labels | **Fixed** — `src/config/cta.ts` has three CTAs; the homepage emits two event types and one repeated primary label. |
| 8 | Social icons at top of page | **Fixed by construction** — footer only, and not rendered until the URLs in `site.ts` are confirmed. |
| 9 | "Marta Beck", "Autl Gawande" | **Fixed** — Martha Beck and Atul Gawande on `/resources`. |
| 10 | 400-character Amazon URL | **Fixed** — the 483-char Book of Joy URL is trimmed to its product path. Longest outbound URL on the page is now a Calendly CTA. |
| 11 | Zero-width-space spacer text boxes | **Gone** — spacing is margins in `Section.astro`. |
| 12 | Stock photos on Testimonials and Contact | **Gone** — neither page uses stock imagery. Contact has John's photo slot reserved. |
| 13 | Blog stale since May 26 | **Withdrawn — the finding was wrong.** The blog is active; most recent post 4 Sep 2026, eight days before the audit. See ADR 0007. |
| 14 | Certificate images inconsistently sized | **Fixed by construction** — the proof strip is text from `site.credentials`; logos can replace it. |
| 15 | No privacy policy | **Page exists** at `/privacy`, linked from the footer and both forms. Needs a human read — see Needs John above. |

## Cutover (audit §7)

- [ ] **Confirm the live site is indexable after DNS moves.** Pages are
      `noindex` unless the build's deploy URL matches the canonical domain in
      `src/config/site.ts`, which keeps the staging copy out of search results
      and competing with coachingwithjc.com. It clears itself at cutover — but
      verify, because the failure mode is a launched site nobody can find.
- [ ] Deploy preview; John reviews every page
- [ ] Lighthouse mobile ≥ 90 performance, 100 a11y/SEO on all routes
- [ ] Forms tested end to end — submission arrives in John's inbox
- [ ] Calendly embed books a real test event
- [ ] Lead magnet automation delivers the PDF
- [ ] GA4 firing; `cta_click` visible in realtime
- [ ] Search Console: add the property, submit `sitemap.xml`
- [ ] DNS switch, TTL dropped to 300 the day before
- [ ] Wix site kept 30 days as a rollback
- [ ] 48h after launch: re-crawl for 404s, check GSC coverage

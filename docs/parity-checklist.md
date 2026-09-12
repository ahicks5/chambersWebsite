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
- [ ] **Journal links.** The three titles are on the About page (Bhavana, Rest
      Regimen, Highlight of My Day) but the clean Amazon short links and cover
      images are not in the repo.
- [ ] **Photos.** Three slots now reserved and sized (hero 4:5, Meet John 4:5,
      About 4:5) and
      render a dashed placeholder. Audit §10 wants the hero photo ~1500px wide,
      never lazy-loaded — it is the LCP element. Also needed: real alt text, not
      a filename (audit §7.6).
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

- [ ] **Connect the repo to Netlify** (ADR 0005). `netlify.toml` is committed and
      runs check, build and `lint:content`. Needs a dashboard login.
- [ ] **Enable form detection in Netlify.** Site configuration → Forms → Enable.
      It is **off by default on new sites**, and with it off the lead-magnet form
      accepts a submission and silently discards it. Nothing in the repo can
      detect this; test a real submission after enabling.
- [ ] **Self-host Bitter.** Subset woff2 into `public/fonts/`, `font-display:
      swap`, preload the H1 weight. Bitter is on Google Fonts; the tokens fall
      back to Georgia until then. Audit §10 caps this at two families, four
      weights — Bitter is one family, two weights.
- [ ] **ESP for the lead magnet** (ConvertKit or Buttondown). Netlify Forms
      collects the address; something has to send the PDF.
- [ ] **Who owns the domain and DNS?** (§11 question 7.) Find out before cutover
      day, not during it.
- [ ] **GA4 + Search Console.** Audit §11 event names go in `src/lib/analytics.ts`,
      which does not exist yet.

### Code, not yet done

- [ ] Pages that exist only as links: `/blog`, `/resources`, `/privacy`. The
      header, footer and homepage link to them and they 404 today. `/blog` is
      its own milestone (ADR 0007); `/resources` and `/privacy` are Milestone 4.
- [ ] **Blog: 65 posts, not three.** See ADR 0007 — the audit undercounted and
      the blog is active (most recent post 4 Sep 2026). Migration is scripted,
      not hand-copied: `scripts/migrate-wix-posts.mjs`. Slugs must be preserved —
      `/post/the-practice-that-saved-my-life` has LinkedIn backlinks, and
      `public/_redirects` already maps `/post/*` → `/blog/*`.
- [ ] **John: category and accuracy review on migrated posts.** The script
      guesses `category` from title keywords across five options and cannot
      judge John's own content. Every migrated post needs a human read before
      launch.
- [ ] Images pulled at source resolution from `static.wixstatic.com` — strip the
      `/v1/fill/...` transform segment from the URL to get the original.
- [ ] Journals (3), books (6) and talks (5) into `resources`. Fix
      "Marta Beck" → Martha Beck and "Autl Gawande" → Atul Gawande (audit §2.6).
      Replace the 400-character Amazon search URL with a clean short link.
- [ ] FAQ, 10 questions, plus `FAQPage` JSON-LD whose answer text matches the
      rendered answer character for character (audit §4.5, §7.5).
- [ ] `ProfessionalService` + `Person` JSON-LD on the homepage (audit §7.5).
- [ ] Sticky-header scroll state and the mobile bottom CTA strip (audit §9.1).
      The header is deliberately non-sticky below 640px until these exist.
- [ ] A form border token. `--c-line` is decorative and fails the 3:1 non-text
      contrast bar, so the lead-magnet and contact inputs both borrow
      `--c-text`. It works and it passes contrast, but a dedicated
      `--c-line-strong` would say what it means (`docs/brand/tokens.md`).
- [ ] Lead-magnet success page. The form has no `action`, so Netlify shows its
      generic success page.
- [ ] Playwright suites in `tests/` — `smoke.spec.ts` (every route 200s, one H1,
      CTA present) and `a11y.spec.ts` (axe, zero serious violations).
      `docs/02-project-structure.md` §8. `scripts/lint-content.mjs` is done and
      runs in CI and on Netlify.
- [ ] `lighthouse-budget.json` asserting audit §10: LCP < 2500ms, CLS < 0.1,
      total JS < 100KB, page weight < 1MB mobile.

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
| 9 | "Marta Beck", "Autl Gawande" | Open — with the Resources page. |
| 10 | 400-character Amazon URL | Open — with the Resources page. |
| 11 | Zero-width-space spacer text boxes | **Gone** — spacing is margins in `Section.astro`. |
| 12 | Stock photos on Testimonials and Contact | Open — those pages don't exist yet. |
| 13 | Blog stale since May 26 | **Withdrawn — the finding was wrong.** The blog is active; most recent post 4 Sep 2026, eight days before the audit. See ADR 0007. |
| 14 | Certificate images inconsistently sized | **Fixed by construction** — the proof strip is text from `site.credentials`; logos can replace it. |
| 15 | No privacy policy | Open — linked from the footer and the lead magnet, page is Milestone 4. |

## Cutover (audit §7)

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

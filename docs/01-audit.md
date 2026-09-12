# JC Coaching & Consulting — Website Revamp Deep Dive

**Site:** https://www.coachingwithjc.com
**Platform:** Wix (classic Editor, per `meta-generator`)
**Audit date:** September 12, 2026
**Scope:** All 7 public pages, site architecture, copy, conversion path, SEO, performance, and a CSS/JS design system that preserves the current color vibe.

> **Status: FROZEN.** This file is a snapshot of the site as of September 12, 2026 plus the
> recommendations made at that time. Do not edit it. Where a decision has moved on, record an
> ADR in `docs/decisions/` — ADRs supersede this document.

---

## 0. Executive summary

The positioning is the strongest thing about this site and it is almost entirely hidden. John is an ICF-credentialed coach with 12 years of corporate HR, three published journals, and a sharp niche (burnout and sustainable success for ambitious professionals). The site reads like a series of warm letters instead of a set of pages that move a stranger toward a booked call.

**Ten findings that matter most, ranked by impact:**

1. **No hero, no H1.** The homepage opens with "Welcome!" and four social icons. The real hook is the third thing on the page and there is no H1 anywhere on the homepage.
2. **Six different CTAs pointing at five different Calendly event types.** "Schedule your first session," "Book a Sample Session," "Start your Pivot," "Choose Your Session," "Schedule a Free Consultation," plus a form on Contact. Visitors do not know which door to walk through.
3. **The 3-month package costs more per session than a single session.** Weekly ($2,000 / ~12 sessions ≈ $167 each) and biweekly ($1,000 / ~6 sessions ≈ $167 each) both exceed the $145 single-session price. There is currently no economic reason to commit.
4. **Two audiences, one funnel.** Individuals and organizations share a page, a nav, and a testimonials page. They need separate paths, separate proof, and separate CTAs.
5. **Wrong reading order on every page.** Photo after text, TL;DR after the long story, credentials as a run-on sentence beneath certificate screenshots.
6. **Trust signals are buried.** "ICF-certified" appears mid-page in body copy. "12 years HR" is only on the Services page. "Author of three journals" is only on a Resources page that is missing from the main nav on six of seven pages.
7. **All nine testimonials are anonymous.** "Individual client | 5-month engagement" is honest but weak. First name + role + industry roughly doubles credibility.
8. **Nothing explains what coaching actually is.** No "how it works," no session description, no coaching-vs-therapy answer, no FAQ. For a first-time coaching buyer this is the biggest unanswered question.
9. **No lead capture on the homepage.** A newsletter ("Rooted Reflections") exists only on the blog page. The 90%+ of visitors who are not ready to spend $145 today leave with nothing.
10. **Housekeeping bugs** that quietly erode trust: inconsistent nav across pages, a hidden Resources page, `© 2024 by JC Consulting & Consulting` in the blog footer, Contact page's meta description copy-pasted from Resources, and two author-name typos on Resources.

**If you only do three things:** rebuild the homepage hero, unify every CTA to one free intro call, and fix the package pricing so committing is obviously the better deal.

---

## 1. Method and lenses

Each page was fetched and read in full. Findings were evaluated through six lenses:

| Lens | Question asked |
|---|---|
| First-time visitor | In five seconds, do I know who this is for, what he does, and what to do next? |
| Conversion | Is there one clear path from stranger → lead → booked call → client? |
| Coaching-niche buyer | Does the site answer the questions a burned-out professional actually has before booking? |
| B2B buyer (HR / people leader) | Can I evaluate this for my team without wading through individual-coaching copy? |
| SEO / discoverability | Will Google (and AI search) understand and surface this for the right queries? |
| Technical / design system | Can the structure, typography, and interactions be tightened without changing the palette? |

Research inputs: Wix developer docs on custom CSS and custom elements, Wix Help Center on structured data, 2026 conversion benchmarks for coaching and consulting sites (WordStream, Unbounce, First Page Sage, Growth Stack), Core Web Vitals guidance (web.dev-aligned checklists and Wix-specific speed tests), and SEO-for-coaches guidance across multiple 2025–2026 sources.

---

## 2. Site inventory and page-by-page audit

### 2.1 Homepage (`/`)

**What's there:** Logo, 6-item nav, "Welcome!" (H2), 4 social icons, ~12 short paragraphs of manifesto-style copy, one CTA, John's photo, one testimonial, a 4-slide carousel (slides not visible in a text crawl; verify it renders), footer.

**Findings**

- No `<h1>`. The only heading is an H2 reading "Welcome!" — the single least useful word on a coaching site.
- The hook ("You can be ambitious without abandoning yourself") is buried under the greeting and social icons. This is the H1.
- 12 paragraphs before the first CTA. On mobile that is 3–4 full screens of scrolling.
- The photo comes after all the copy. Faces build trust faster than words; it belongs beside the headline.
- Social icons at the top pull attention off-site before the pitch lands. Move to footer.
- One testimonial, anonymous, at the very bottom.
- Blank-line spacers (`​` zero-width characters in empty text elements) are used for vertical spacing. This is why it "feels wordy": every paragraph is a separate text box with an invisible spacer between. Delete them and use section/element margins.
- No email capture, no "how it works," no services preview, no credentials strip.

### 2.2 About (`/about-me`)

**What's there:** "My Story" (long personal narrative), a CTA, "TL;DR" (short version), a second CTA, photo, "My Credentials" (one run-on sentence), four certificate images.

**Findings**

- The order is inverted. TL;DR should lead, story should follow.
- The personal story is the strongest differentiator on the whole site. It is also intense, and it arrives with no on-ramp. Keep it, but give readers a subhead that lets them opt in ("The longer version, if you want it").
- Credentials are the most skimmable content on the site and they are formatted as prose. This should be a logo/badge strip: ICF ACC · Cornell · Korn Ferry · UPenn Positive Psychology · CaPP Institute · 12 yrs corporate HR.
- Certificate screenshots are low-resolution and inconsistently sized (298×203, 298×227, 273×203, 273×227). Replace with clean logos or a uniform badge treatment.
- The VIA strengths paragraph is charming for "positive psychology nerds" (his words) but is a detour for everyone else. Collapse it or move it below the fold.

### 2.3 Services (`/current-services`)

**What's there:** Two H1s ("Individual Coaching," "Organizational Opportunities"). Five offers: 3-Month Partnership, Purposeful Pivot, Single-Session, Coaching & Consulting Partnerships, Workshops & Facilitated Trainings. Each has 3–5 paragraphs and its own uniquely-worded CTA linking to a different Calendly event.

**Findings**

- Two H1s on one page. Split into two pages (see §5).
- The nav label "Current Services" implies impermanence. Use "Coaching" and "For Organizations."
- **Pricing architecture is upside down.** See §4.4. The package must be the obvious value.
- No "which one is right for me?" guidance. Five offers with no decision aid is where people stall.
- "Book a Sample Session" vs. "introductory session" (the Calendly slug) vs. "first session" (homepage). Three names for the same thing.
- The Purposeful Pivot is the best-productized offer on the site (defined scope, defined deliverables, single price). Use it as the template for how to present the others.
- Organizational copy is good but lacks the things a B2B buyer scans for: format (virtual / on-site / hybrid), group size range, duration, a sample agenda, past client types, and a downloadable one-pager.

### 2.4 Testimonials (`/testimonials`)

**What's there:** Stock header image, H5 heading, intro paragraph, 4 individual testimonials (anonymized by engagement length), CTA, 4 organizational testimonials (anonymized by training name), CTA, one more individual testimonial, a 6-slide carousel.

**Findings**

- Nine real testimonials is a solid base. Several are excellent and specific (the "collective burnout" one, the "opened my mind and heart" one, the "impact in one session" one).
- All anonymous. Ask each client for permission to use first name + role + industry (e.g., "Sarah, Senior PM, healthcare"). Named attribution near a CTA is the single highest-leverage social-proof change available.
- Headings are H5 and H6. Nothing on this page is semantically a top-level heading.
- The page is a dead end for most visitors. Testimonials convert when they sit next to the CTA on the page where the decision is made. Keep this page as an archive, but distribute the best three individual quotes to the Coaching page and the best three organizational quotes to the Organizations page.
- Stock photo header adds nothing. Use John's photo or drop the header image.

### 2.5 Blog (`/blog`)

**What's there:** "Rooted Reflections" H2, social icons again, intro paragraph, CTA, 15 category filters, search, three visible posts (May 2, May 9, May 26, 2026), a subscribe block, footer.

**Findings**

- The three visible post titles are excellent and directly on-niche ("The Definition of Burnout Is Broken – And It Is Failing a Generation," "Burnout Is a Liar," "The Practice That Saved My Life"). This is the voice the homepage should borrow.
- Last post: May 26, 2026 — three and a half months ago. A visible "last updated" gap reads as a dormant business.
- 15 categories for a handful of posts. Collapse to 4–5 (Burnout · Resilience · Career · Leadership · Practices).
- **The nav on this page is different from every other page** (includes "Resources," different order). Wix blog pages can have their own header; this one drifted. Unify.
- **Footer reads `© 2024 by JC Consulting & Consulting`.** Two errors in one line.
- The subscribe block for "Rooted Reflections" is the only email capture on the site and it lives on the least-visited page.

### 2.6 Resources (`/resources`)

**What's there:** H1, intro, CTA, "Journals Created by Me" (3 journals on Amazon), "Inspirational Books" (6), "Motivational Talks" (5 embeds).

**Findings**

- **This page is not in the main nav** on Home, About, Services, Testimonials, or Contact. It is reachable only from the Blog page's header. It is effectively hidden.
- **Three self-published journals** (Bhavana, Rest Regimen, Highlight of My Day) are a major authority signal that appears nowhere else. "Author of three positive-psychology journals" belongs in the hero credibility strip and on the About page.
- Typos: "Marta Beck" → Martha Beck; "Autl Gawande" → Atul Gawande.
- The Book of Joy link is a 400+-character Amazon search URL with tracking parameters. Replace with a clean `a.co` short link like the others.
- The talks section has descriptions but (in the crawl) no visible video titles/links; verify the embeds render and add the speaker + talk title as text for SEO and accessibility.
- Recommendation: fold the journals into a "Books & Journals" band on About and Home; keep Resources as a secondary page linked from the footer, not the nav.

### 2.7 Contact (`/contact`)

**What's there:** Stock image (filename literally "A close-up shot of a person writing in a journal in a sunlit setting..png"), "Let's Connect" H1, social icons, a 4-field form, footer.

**Findings**

- **Meta description is copy-pasted from the Resources page.** Google will show a description about journals and self-help books for the Contact page.
- No context for the form: no "what happens after you submit," no response-time expectation, no alternative (email, Calendly).
- No Calendly embed. The primary action on the entire site is "book a call," and the Contact page doesn't offer it inline.
- No location, no timezone, no "virtual / in-person" statement. A coaching buyer needs to know if they can work with him from Denver.
- No privacy policy link. Wix forms collect PII; a one-line privacy notice and a linked policy page are baseline.
- Stock image should be John. This is the page where someone is deciding whether to reach out to a human.

### 2.8 Cross-site bugs and inconsistencies (fix in one sitting)

| # | Issue | Where | Fix |
|---|---|---|---|
| 1 | Nav differs across pages (order + Resources item) | Blog vs. all others | Unify header; decide once whether Resources is in nav |
| 2 | Footer typo and stale year | Blog | `© 2026 JC Coaching & Consulting` |
| 3 | Contact meta description duplicates Resources | Contact | Write a unique one |
| 4 | No H1 on homepage; "Welcome!" as only heading | Home | H1 = hook line |
| 5 | Two H1s on Services | Services | Split page |
| 6 | H5/H6 as page headings | Testimonials | H1 + H2s |
| 7 | Five Calendly event types across six CTA labels | Site-wide | Two events: Intro Call (individuals), Consultation (orgs) |
| 8 | Social icons at top of Home and Blog | Home, Blog | Footer only |
| 9 | "Marta Beck," "Autl Gawande" | Resources | Martha Beck, Atul Gawande |
| 10 | 400-char Amazon URL | Resources | Short link |
| 11 | Zero-width-space spacer text boxes | Home, About, Services | Delete; use margins |
| 12 | Stock photos on Testimonials and Contact | Testimonials, Contact | John's photo or none |
| 13 | Blog stale since May 26 | Blog | Publish or set cadence (see §7.4) |
| 14 | Certificate images inconsistent sizes | About | Uniform badge strip |
| 15 | No privacy policy | Site-wide | Add page + footer link |

---

## 3. Positioning and messaging

### 3.1 The ideal client, stated plainly

Right now the reader has to infer the ICP from a manifesto. State it:

> **For:** ambitious professionals and leaders (roughly late-20s to mid-40s, mid-career, high-achieving) who are burned out, questioning the path, or realizing the success they built isn't the one they wanted.
> **Not for:** people in acute crisis (refer out), people looking for accountability-only coaching, people who want a quick-fix mindset hack.

A "who this is for / who this isn't for" block does three things: it raises intro-call quality, it signals confidence, and it lets the wrong-fit visitor leave quickly instead of booking and no-showing.

### 3.2 The message hierarchy

The site has every ingredient but serves them in the wrong order. Proposed hierarchy, top to bottom:

1. **Hook (H1):** "You can be ambitious without abandoning yourself."
2. **Positioning line (subhead):** "ICF-certified coaching for high-achievers recovering from burnout and building success they don't have to recover from."
3. **Proof strip:** ICF ACC · 12 yrs corporate HR · Author of 3 journals · Cornell / UPenn / Korn Ferry
4. **Recognition ("Sound familiar?"):** the four symptoms already written on the homepage, as cards.
5. **Mechanism ("How it works"):** 3 steps.
6. **Offer:** three individual packages, priced, with a decision aid.
7. **Proof (again):** 3 named testimonials.
8. **Human:** 3-sentence About + photo + link.
9. **Objections:** FAQ.
10. **CTA (again).**

### 3.3 Assets that exist but aren't being used

| Asset | Currently | Should be |
|---|---|---|
| ICF ACC credential | Mid-body-copy on Home, prose on About | Badge in hero proof strip, every page footer |
| 12 years corporate HR | One line on Services (org section only) | Proof strip; central to the B2B pitch |
| Three published journals | Hidden Resources page | Proof strip; "Books" band on About; lead-magnet source |
| Blog voice (sharp, specific, contrarian titles) | Blog only | Homepage copy should sound like the blog titles |
| Nine testimonials | Separate page, anonymous | Named, distributed to decision pages |
| Between-session text/email support | Buried in package paragraph 3 | The headline benefit of the 3-month package |
| Cornell, Korn Ferry, UPenn, CaPP | Run-on sentence | Logo strip |

### 3.4 Voice guidance

Keep: warm, second-person, plain language, the willingness to say "burned out" and "shame" without euphemism.
Cut: "journey," "walk alongside," "transformation," "unlock," "step into the life you deserve." These appear in the meta descriptions and CTAs and they are the generic-coach vocabulary the blog titles successfully avoid.
Target reading level: 6th–8th grade. Pages written at this level have been measured converting at roughly double the rate of college-level copy in landing-page studies.

---

## 4. Conversion architecture

### 4.1 Benchmarks to calibrate against

- Professional-services sites average ~4.6% conversion (WordStream 2026 benchmarks); most coaching sites land at 1–3%.
- Free-consultation funnels for coaches convert at roughly 6–12%; high-ticket application pages at 3–5%.
- Referral traffic converts at 10–15% vs. 2–5% for cold traffic — this matters because most of John's traffic today is almost certainly referral/LinkedIn, so his current rate is inflated relative to what SEO traffic will do.
- Single-CTA pages convert at ~13.5% vs. ~10.5% for pages with three or more competing CTAs (Unbounce, 18,639 pages). Repeating *one* CTA is fine; offering *different* ones is not.
- CTA placement swings conversion ~15× (0.9% bottom-of-page banner to 13.6% for full-page content-download popups). Placement first, then copy, then color.

### 4.2 The funnel, defined

| Stage | Visitor state | Offer | Where it lives |
|---|---|---|---|
| Cold | Found a blog post via search or LinkedIn | Burnout self-check (lead magnet) → email | End of every blog post; homepage band; exit-intent on blog |
| Warm | Read the homepage, thinks "this is me" | **Free 30-min intro call** | Every page, sticky header, section-end CTAs |
| Hot | Knows they want help now | Single session ($145) as a low-commitment entry | Coaching page, FAQ |
| Committed | Finished intro call | 3-month partnership | Sold on the call; page just needs to confirm price/format |
| B2B | HR / team leader | **Free consultation** + downloadable one-pager | For Organizations page only |

### 4.3 CTA standard

**One primary CTA label for individuals, sitewide:** `Book a free intro call`
**One for organizations:** `Book a consultation`
**One secondary (soft):** `Take the 2-minute burnout check`

Rules:

- The primary CTA is a filled button in the accent color. Every other button is outline style. One obvious action per screen.
- Same label, same Calendly event, same UTM tagging everywhere (see §11).
- Consolidate Calendly to two public event types. Retire `/introductory-session`, `/packages/...`, `/consultation`, `/coaching-consultation` as public links (keep them for internal use if needed).
- Never "Submit." Never "Schedule your first session today" (a stranger hasn't decided to have a session yet; they've decided to have a conversation).

### 4.4 Pricing architecture

Current numbers:

| Offer | Price | Sessions | Effective per-session |
|---|---|---|---|
| 60-min single | $145 | 1 | $145 |
| 90-min deep dive | $200 | 1 | $200 |
| 3-mo biweekly | $1,000 | ~6 | ~$167 |
| 3-mo weekly | $2,000 | ~12 | ~$167 |
| Purposeful Pivot | $750 | 4 + 2 resume reviews | ~$125 + reviews |

The package costs *more* per session than a single. Between-session support is the justification, but it's buried in paragraph three. Two ways to fix, either works:

**Option A — reprice singles up.** Single 60-min → $175–195. The package immediately reads as a discount and the single becomes the "try it" tier rather than the value tier.

**Option B — reframe the package around what's included.** Present it as: 12 sessions + unlimited text/email support between sessions + a personalized plan. Show a per-session figure and a "vs. booking singly" comparison. Keep $2,000 but make the value visible.

Either way, add a **"Which is right for me?"** row:

- "I have one specific decision or conversation" → Single session
- "I'm changing jobs or careers" → Purposeful Pivot
- "I'm burned out and want to change how I work and live" → 3-month partnership (most people start here)

Optional: a small "Most popular" tag on the 3-month partnership. It nudges without pressure.

### 4.5 Objection handling (the FAQ that doesn't exist yet)

These are the questions a first-time coaching buyer asks before booking. Answer each in 2–4 sentences on the Coaching page:

1. What actually happens in a session?
2. Coaching vs. therapy — how do I know which I need? (John's own therapy/EMDR history makes him unusually credible on this; answer it directly and note he refers out when therapy is the right call.)
3. Is this virtual? Where are you based? (Austin, TX; virtual by default; in-person available locally — confirm with John.)
4. What does the free intro call involve? Is it a sales pitch?
5. What if I'm not sure I'm "burned out enough"?
6. Can my company pay for this? (Yes — offer an invoice and a one-line description HR can use for L&D budget.)
7. What's the cancellation/reschedule policy?
8. How is this different from reading a book or listening to a podcast?
9. Do you offer payment plans?
10. What is ICF ACC and why does it matter?

Mark up the FAQ with `FAQPage` schema (§7.5) for rich results.

---

## 5. Recommended site architecture

### 5.1 Navigation

**Current:** Home · About Me · Current Services · Testimonials · Blog · Contact (+ Resources on one page only)

**Proposed:** Home · Coaching · For Organizations · About · Blog · **[Book a free intro call]** (button)

- Testimonials → distributed into Coaching and Organizations; the archive page stays live, linked from footer.
- Resources → linked from footer and from About ("Books & Journals").
- Contact → footer link and the header button; the Contact page becomes a Calendly embed + form.

### 5.2 Homepage blueprint

| # | Section | Content | Height target (mobile) |
|---|---|---|---|
| 1 | Hero | H1 hook · subhead · primary CTA · photo | 1 screen |
| 2 | Proof strip | 5 badges/logos in a row | ¼ screen |
| 3 | Sound familiar? | 4 symptom cards | 1 screen |
| 4 | How it works | 3 numbered steps | ¾ screen |
| 5 | Coaching options | 3 cards with price + one line + "Which is right for me?" | 1.5 screens |
| 6 | What clients say | 3 named testimonials + link to all | 1 screen |
| 7 | Meet John | Photo · 3 sentences · badges · link | ¾ screen |
| 8 | For organizations | 1 band: "I also work with teams" · 1 line · secondary CTA | ½ screen |
| 9 | Burnout check | Lead-magnet band with email field | ½ screen |
| 10 | Final CTA | Hook restated · primary CTA | ½ screen |

Total: ~8 mobile screens, down from roughly 6 screens of prose with one CTA at the end. Same length, ten times the structure.

### 5.3 Coaching page blueprint

1. H1: "Individual coaching" + one-line positioning
2. Who it's for / not for (two short columns)
3. Three offer cards (3-month · Pivot · Single) with price, what's included, one testimonial pull-quote each
4. "Which is right for me?" decision row
5. How it works (repeat from home, expanded: intro call → plan → sessions → between-session support → review)
6. Three named testimonials
7. FAQ (10 questions, accordion)
8. Primary CTA

### 5.4 For Organizations page blueprint

1. H1: "Resilience, leadership, and burnout work for teams"
2. Positioning: 12 years corporate HR + ICF + positive psychology + neuroscience. This is the page where the HR background is the headline.
3. Two offers: Workshops & Facilitated Trainings · Ongoing Coaching & Consulting Partnerships
4. Format facts table: virtual / on-site / hybrid · group sizes · durations · sample topics (the seven he lists) · pricing model
5. Three organizational testimonials (ideally with company type: "Series B fintech, 40-person team")
6. Downloadable one-page PDF (capabilities sheet) — gated or ungated
7. CTA: Book a consultation
8. Optional: "How to bring me in" (3 steps: call → proposal → delivery)

### 5.5 About page blueprint

1. Photo + H1 "Hi, I'm John." + the current TL;DR (it's good as written)
2. Badge strip (ICF ACC · 12 yrs HR · Cornell · Korn Ferry · UPenn · CaPP)
3. "The longer version, if you want it" — the full story, with a subhead
4. How I coach (values, strengths — the VIA paragraph, condensed)
5. Books & journals band (3 journal covers with short-link buttons)
6. Primary CTA

### 5.6 Contact page blueprint

1. Photo of John + "Let's talk."
2. Inline Calendly embed (primary)
3. "Prefer email?" + form + "I reply within one business day"
4. Location / virtual statement
5. Social links + privacy note

---

## 6. Copy rewrite — homepage draft

Target: roughly one-third of current word count. The bracketed items are John's to confirm.

**Hero**
> **You can be ambitious without abandoning yourself.**
> ICF-certified coaching for high-achievers who are burned out, questioning the path, or done building a version of success they have to recover from.
> [ Book a free intro call ]

**Proof strip**
> ICF ACC Credentialed · 12 years in corporate HR · Author of 3 positive-psychology journals · Cornell · Korn Ferry · UPenn

**Sound familiar?**
> **Burned out.** You care as much as ever. You just can't feel it.
> **Questioning the career.** You worked hard for this. You're not sure it's what you wanted.
> **Guilty about slowing down.** Rest feels like falling behind.
> **Never enough.** The goalpost moves every time you reach it.

**How it works**
> **1. A free 30-minute call.** We talk about what's going on. No pitch, no pressure. If I'm not the right fit, I'll say so.
> **2. A plan built around you.** We look underneath the immediate problem and get clear on what's actually driving it.
> **3. Sessions plus support.** Weekly or biweekly sessions, and I'm available by text or email in between for the decisions that don't wait.

**Coaching options** (cards)
> **3-Month Partnership** — For changing how you work and live. 12 or 6 sessions + between-session support. From $1,000.
> **The Purposeful Pivot** — For a job or career change. 4 sessions + 2 resume reviews + mock interview. $750.
> **Single Session** — For one specific decision or conversation. 60 or 90 minutes. From $145.
> *Not sure which? Most people start with the intro call.*

**What clients say** — three named pull-quotes, each ≤ 30 words.

**Meet John**
> Burnout survivor turned resilience nerd. Twelve years in corporate HR, an ICF credential, and a personal story that's the reason I do this. [Read more →]

**For organizations**
> I also design workshops and coaching partnerships for teams working through burnout, change, and resilient leadership. [See how I work with teams →]

**Burnout check**
> Not sure if it's burnout or just a hard season? Take the 2-minute check and get a short, honest read plus one practice to try this week.
> [ email field ] [ Send me the check ]

**Final CTA**
> Ambition doesn't have to cost you yourself. Let's talk about what a different way forward looks like.
> [ Book a free intro call ]

---

## 7. Discoverability: SEO and structured data

### 7.1 Keyword map

The blog already targets the right territory. Map commercial terms to pages and informational terms to posts:

| Page | Primary term | Secondary terms |
|---|---|---|
| Home | burnout coach | resilience coach, coach for burnout, sustainable success coaching |
| Coaching | burnout coaching for professionals | career transition coach, executive burnout coach, coaching packages pricing |
| For Organizations | burnout workshop for teams | resilience training for leaders, psychological safety workshop, corporate resilience training |
| About | John Chambers coach Austin | ICF certified coach Austin |
| Blog posts | how to recover from burnout, signs of burnout at work, burnout vs depression, how to rest without guilt, career change after burnout | |

Add "Austin, TX" to the homepage and About page body copy once (not stuffed) and set up a Google Business Profile as a service-area business. "Executive coach Austin" and "burnout coach Austin" are low-competition, high-intent local terms.

### 7.2 Title tags and meta descriptions (write these exactly)

| Page | Title (≤ 60 chars) | Meta description (≤ 155 chars) |
|---|---|---|
| Home | Burnout & Resilience Coach for High-Achievers \| John Chambers | ICF-certified coaching for ambitious professionals recovering from burnout. Free 30-minute intro call. Virtual, based in Austin, TX. |
| Coaching | Individual Coaching Packages & Pricing \| JC Coaching | 3-month partnerships, career-pivot packages, and single sessions for burnout, career change, and sustainable success. Transparent pricing. |
| For Organizations | Burnout & Resilience Workshops for Teams \| JC Coaching | Custom workshops and coaching partnerships from an ICF coach with 12 years of corporate HR. Resilient leadership, change, psychological safety. |
| About | About John Chambers, ICF ACC \| JC Coaching | Burnout survivor turned resilience coach. ICF credentialed, 12 years in HR, author of three positive-psychology journals. |
| Blog | Rooted Reflections — Burnout, Resilience & Career \| JC Coaching | Honest, research-backed writing on burnout, rest, resilience, and building a career you don't have to recover from. |
| Contact | Book a Free Intro Call \| JC Coaching | Book a free 30-minute call or send a note. Replies within one business day. Virtual coaching, based in Austin. |

### 7.3 Heading structure

Every page: exactly one H1, H2s for sections, H3s for cards. Currently: Home has no H1, Services has two, Testimonials uses H5/H6.

### 7.4 Blog strategy

- **Cadence:** two posts per month is enough. Consistency beats volume. Put a recurring reminder on John's calendar.
- **Structure:** one pillar page per cluster (e.g., "The complete guide to recovering from burnout without quitting your job") with 4–6 supporting posts each. Internal-link every post to its pillar and to the Coaching page.
- **Every post ends the same way:** 2-sentence author box with ICF badge + lead-magnet form + "Book a free intro call."
- **Categories:** collapse 15 → 5.
- **Repurpose:** each post → a LinkedIn post (his primary channel by the look of his handle) → a newsletter issue. One piece of writing, three outputs.
- **Enable Wix's AI-generated structured data for blog posts** (Dashboard → SEO → Blog posts → Structured data). It adds `Article` schema automatically.

### 7.5 Structured data (JSON-LD)

Wix supports up to five custom JSON-LD markups per page via SEO Settings → Advanced → Structured Data Markup. Wix auto-adds `LocalBusiness` to the homepage once a business name and address are set in Business Info — do that first, then add these. Fill the bracketed placeholders; validate with Google's Rich Results Test.

**Homepage — ProfessionalService + Person**

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "JC Coaching & Consulting",
  "url": "https://www.coachingwithjc.com",
  "image": "https://www.coachingwithjc.com/[john-photo].jpg",
  "description": "ICF-certified burnout and resilience coaching for ambitious professionals and teams.",
  "areaServed": ["United States"],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Austin",
    "addressRegion": "TX",
    "addressCountry": "US"
  },
  "founder": {
    "@type": "Person",
    "name": "John Chambers",
    "jobTitle": "Professional Coach, ICF ACC",
    "url": "https://www.coachingwithjc.com/about-me",
    "sameAs": [
      "https://www.linkedin.com/in/john-m-chambers-atx",
      "https://instagram.com/coachingwithjc",
      "https://www.tiktok.com/@coachingwithjc"
    ],
    "alumniOf": "Cornell University",
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "Associate Certified Coach (ACC)",
      "recognizedBy": { "@type": "Organization", "name": "International Coaching Federation" }
    }
  },
  "makesOffer": [
    { "@type": "Offer", "name": "3-Month Coaching Partnership", "price": "1000", "priceCurrency": "USD", "url": "https://www.coachingwithjc.com/coaching" },
    { "@type": "Offer", "name": "The Purposeful Pivot", "price": "750", "priceCurrency": "USD", "url": "https://www.coachingwithjc.com/coaching" },
    { "@type": "Offer", "name": "Single Coaching Session", "price": "145", "priceCurrency": "USD", "url": "https://www.coachingwithjc.com/coaching" }
  ]
}
```

**Coaching page — FAQPage** (one `Question` per FAQ item; keep answers identical to the visible text)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is coaching the same as therapy?",
      "acceptedAnswer": { "@type": "Answer", "text": "[Visible answer text]" }
    }
  ]
}
```

**Blog posts** — use Wix's auto `Article` markup; no custom work needed.

### 7.6 Technical SEO checklist

- [ ] Unique title + meta description on all pages (Contact currently duplicates Resources)
- [ ] One H1 per page
- [ ] Descriptive alt text on every image (currently "Black LinkedIn Icon," filenames as alt on Contact)
- [ ] Clean URLs: `/coaching`, `/for-organizations`, `/about`, `/contact`; set 301s from `/current-services` and `/about-me`
- [ ] Google Search Console verified (the `google-site-verification` meta is already present; confirm GSC is actually connected and someone looks at it)
- [ ] Sitemap submitted (Wix auto-generates at `/sitemap.xml`)
- [ ] Google Business Profile created as a service-area business, Austin
- [ ] Privacy policy page, linked in footer
- [ ] Favicon present and branded (verify)
- [ ] Open Graph image set per page (currently inherits site default; set John's photo for About/Home)

---

## 8. Design system: CSS without changing the palette

### 8.1 First, confirm the platform tier

Wix's `global.css` custom-CSS feature is documented as available in Wix Studio (and the code panel in newer Editor setups). The site's generator tag says classic "Wix.com Website Builder." Before writing CSS, check: **Editor → Dev Mode → Code panel → CSS section.** If it's there, everything below applies directly. If not, the options are:

1. Migrate the site to Wix Studio (Wix offers a transfer path; this is the cleanest route and unlocks CSS, custom elements, and better responsive controls).
2. Stay on classic Editor and achieve 80% of the below through the native design panel (site-wide text themes, button styles, section spacing) — no code, more clicks.
3. Use Custom Elements (web components) for specific pieces like the sticky CTA. Requires a Premium plan with a connected domain.

Recommendation: move to Studio. Andrew can do it; the site is small.

### 8.2 Tokens (extract from the existing palette)

Open **Site Design → Colors** and copy the current hex values into tokens. Nothing below changes a color; it names them so they're used consistently.

```css
:root {
  /* Fill from the current Wix palette — do not invent new colors */
  --c-bg:        #______;  /* page background */
  --c-surface:   #______;  /* cards, alternate sections */
  --c-text:      #______;  /* body */
  --c-muted:     #______;  /* captions, meta */
  --c-accent:    #______;  /* the ONE CTA color */
  --c-accent-ink:#______;  /* text on accent */
  --c-line:      #______;  /* borders, dividers */

  /* Type scale — fluid, mobile-first */
  --fs-h1: clamp(2rem, 1.2rem + 3.2vw, 3.25rem);
  --fs-h2: clamp(1.5rem, 1.1rem + 1.8vw, 2.25rem);
  --fs-h3: clamp(1.15rem, 1rem + 0.6vw, 1.4rem);
  --fs-body: 1.125rem;          /* 18px */
  --lh-body: 1.6;
  --measure: 68ch;              /* max line length */

  /* Spacing (8pt) */
  --s-1: 0.5rem; --s-2: 1rem; --s-3: 1.5rem; --s-4: 2rem;
  --s-6: 3rem;   --s-8: 4rem;  --s-12: 6rem;

  --radius: 14px;
  --shadow: 0 6px 24px rgba(0,0,0,.06);
}
```

### 8.3 global.css (Wix global + custom classes)

Wix exposes global classes (`.button`, `.text`, `.section`, `.header`, `.footer`, `.repeater`, `.accordion`, etc.) and semantic sub-classes (`.button__label`). You can also add custom classes to any element from the code panel.

```css
/* ---------- Typography ---------- */
.text { line-height: var(--lh-body); }
.text p { max-width: var(--measure); }
h1, .h1 { font-size: var(--fs-h1); line-height: 1.1; letter-spacing: -0.01em; margin: 0 0 var(--s-3); }
h2, .h2 { font-size: var(--fs-h2); line-height: 1.2; margin: 0 0 var(--s-2); }
h3, .h3 { font-size: var(--fs-h3); line-height: 1.3; margin: 0 0 var(--s-1); }

/* ---------- Sections ---------- */
.section { padding-block: var(--s-8); }
@media (min-width: 900px) { .section { padding-block: var(--s-12); } }
.section--alt { background: var(--c-surface); }

/* ---------- Buttons: one primary, everything else outline ---------- */
.button {
  border-radius: 999px;
  padding: 0.9rem 1.6rem;
  font-weight: 600;
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
.button--primary { background: var(--c-accent); color: var(--c-accent-ink); border: 2px solid var(--c-accent); }
.button--primary:hover { transform: translateY(-1px); box-shadow: var(--shadow); }
.button--ghost { background: transparent; color: var(--c-accent); border: 2px solid var(--c-accent); }
.button__label { letter-spacing: 0.01em; }
.button:focus-visible { outline: 3px solid var(--c-accent); outline-offset: 3px; }

/* ---------- Cards (symptoms, offers, steps, testimonials) ---------- */
.card {
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
  padding: var(--s-4);
  box-shadow: var(--shadow);
}
.card--offer .price { font-size: 1.5rem; font-weight: 700; margin-top: var(--s-2); }
.card--offer .badge { display: inline-block; font-size: .75rem; padding: .2rem .6rem; border-radius: 999px; background: var(--c-accent); color: var(--c-accent-ink); }

/* ---------- Proof strip ---------- */
.proof { display: flex; flex-wrap: wrap; gap: var(--s-3); justify-content: center; align-items: center; opacity: .85; }
.proof img { height: 36px; width: auto; filter: grayscale(1); }
.proof img:hover { filter: none; }

/* ---------- Testimonial ---------- */
.quote { font-size: 1.15rem; line-height: 1.5; }
.quote::before { content: "“"; font-size: 3rem; line-height: 0; color: var(--c-accent); vertical-align: -0.4em; margin-right: .15em; }
.quote__attrib { margin-top: var(--s-2); color: var(--c-muted); font-size: .95rem; }

/* ---------- Sticky header ---------- */
.header { backdrop-filter: saturate(1.2) blur(8px); transition: box-shadow .2s ease; }
.header.is-scrolled { box-shadow: 0 2px 12px rgba(0,0,0,.08); }

/* ---------- Motion (respect user preference) ---------- */
.reveal { opacity: 0; transform: translateY(10px); transition: opacity .5s ease, transform .5s ease; }
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }

/* ---------- Kill the spacer habit ---------- */
/* Delete empty spacer text boxes in the editor; spacing lives in margins now. */
```

### 8.4 Layout rules

- **Line length:** 60–75 characters. The current single-column paragraphs on wide screens run much longer.
- **Rhythm:** alternate section backgrounds (`--c-bg` / `--c-surface`) so the eye knows where one idea ends.
- **Hero:** two-column at ≥ 900px (text left, photo right), stacked below. Photo `object-fit: cover`, fixed aspect ratio (4:5) to prevent layout shift.
- **Cards:** 1 column mobile, 2 at ≥ 640px, 3–4 at ≥ 1024px. Never five.
- **Buttons:** full-width on mobile, auto-width on desktop. Primary always visible in the sticky header.
- **Images:** every image gets explicit width/height (Wix does this for native image elements; check embeds).
- **Contrast:** verify body text on background ≥ 4.5:1 and accent button label ≥ 4.5:1. If the current accent fails, darken it 5–10% for text-on-accent only; the hue stays the same.

---

## 9. JavaScript / Velo interactions

Keep these to the four that earn their place. Everything else is noise.

### 9.1 Sticky header with scroll state + always-visible CTA

Native approach: pin the header (Editor → header → Pin to screen / "Freeze position"). Add scroll-state class via Velo:

```js
import wixWindow from 'wix-window';

$w.onReady(() => {
  const header = $w('#header');            // your header element id
  // Wix classic Editor has no window.scroll; use a sentinel section instead:
  $w('#heroSection').onViewportLeave(() => header.customClassList.add('is-scrolled'));
  $w('#heroSection').onViewportEnter(() => header.customClassList.remove('is-scrolled'));
});
```

On mobile, show a compact bottom-anchored primary CTA once the hero leaves the viewport (pin a small strip, hide by default, `show()` on `onViewportLeave`).

### 9.2 Calendly inline embed

Use an HTML embed element (or a Custom Element on Studio) with Calendly's inline widget. Pass UTMs so bookings are attributable.

```html
<div class="calendly-inline-widget"
     data-url="https://calendly.com/johnchambers-coachingwithjc/intro-call?hide_gdpr_banner=1&utm_source=site&utm_medium=embed&utm_campaign=contact"
     style="min-width:320px;height:700px;"></div>
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

Set the embed height explicitly to avoid CLS.

### 9.3 Testimonials from a CMS collection

Create a Wix CMS collection `Testimonials` with fields: `quote`, `firstName`, `role`, `industry`, `segment` (individual / org), `featured` (boolean). Connect a Repeater on Coaching and Organizations pages filtered by `segment` and `featured`. On the homepage, show three random featured individual quotes:

```js
import wixData from 'wix-data';

$w.onReady(async () => {
  const { items } = await wixData.query('Testimonials')
    .eq('segment', 'individual').eq('featured', true).find();
  $w('#quoteRepeater').data = items.sort(() => Math.random() - 0.5).slice(0, 3);
  $w('#quoteRepeater').onItemReady(($item, d) => {
    $item('#quoteText').text = d.quote;
    $item('#quoteAttrib').text = `${d.firstName}, ${d.role} · ${d.industry}`;
  });
});
```

One place to edit, three pages update. John can add testimonials without touching layout.

### 9.4 Scroll reveal (subtle)

Add the custom class `reveal` to sections in the editor, then:

```js
$w.onReady(() => {
  $w('.reveal').forEach(el => el.onViewportEnter(() => el.customClassList.add('is-in')));
});
```

Do not animate the hero. Do not animate the CTA. Respect `prefers-reduced-motion` (handled in CSS above).

### 9.5 FAQ accordion

Use Wix's native Accordion element (Studio) or Collapsible Text (Editor). No custom JS needed. Make sure the visible answers match the `FAQPage` schema text exactly.

### 9.6 Lead magnet capture

Wix Forms → connect to a "Leads" collection → Wix Automations: on submit, email the burnout-check PDF and add to the Rooted Reflections list. If John prefers Mailchimp/ConvertKit, use the native integration rather than a custom script.

---

## 10. Performance and accessibility

Core Web Vitals targets: LCP < 2.5 s, INP < 200 ms, CLS < 0.1. Well-optimized Wix sites pass; unoptimized ones typically fail LCP on mobile.

**LCP**
- The hero photo is the LCP element. Upload at ~2× displayed size (≈1,500 px wide), let Wix serve AVIF/WebP variants (it already does — the current URLs show `enc_avif`).
- Do **not** lazy-load the hero. Lazy-load everything below the fold.
- Remove unused Wix apps (each adds scripts). Audit the app list; anything unused in 60 days goes.
- Limit fonts to two families, and no more than four weights total.

**CLS**
- Explicit dimensions on the Calendly iframe and any video embeds.
- Fixed aspect-ratio container for the hero photo.

**INP**
- Fewer apps, fewer third-party scripts. Calendly's widget is the only one that needs to be there.

**Accessibility**
- Real alt text ("John Chambers, ICF-certified coach, in Austin" not "0478_John Chambers_edited.jpg").
- Visible focus states on all interactive elements (in the CSS above).
- Color contrast ≥ 4.5:1 for body text.
- Form labels tied to inputs; error messages announced.
- Wix's built-in Accessibility Wizard: run it once after the rebuild.

**Verify with:** PageSpeed Insights (mobile), Search Console → Core Web Vitals report (field data lags ~28 days).

---

## 11. Measurement

If it isn't measured, the revamp is a redesign, not a conversion project.

- **GA4** connected via Wix → Marketing Integrations. Turn on Wix's own analytics too; the "Behavior → Clicks" report is useful.
- **Events to track:** `cta_click` (with `location` param: hero / header / section / footer / sticky), `lead_magnet_submit`, `calendly_booked` (Calendly fires a `calendly.event_scheduled` postMessage; listen in the embed).
- **UTMs on every Calendly link:** `utm_source=site&utm_medium=cta&utm_campaign={page}-{position}`. Calendly passes these through to the event, so John sees which button booked the call.
- **Search Console:** watch impressions/clicks for "burnout coach," "burnout coaching," "resilience coach," and the post titles.
- **Targets after 90 days (warm + referral traffic mix):**
  - Intro-call booking rate: 4–8% of homepage sessions
  - Lead-magnet capture: 2–4% of blog sessions
  - Mobile LCP: < 2.5 s
  - Organic sessions: +50% (from a small base; the blog cadence drives this)

---

## 12. Platform decision: stay on Wix?

**Stay on Wix, upgrade to Studio.** Reasons:

- The blog, forms, CMS collections, automations, and structured-data tools are all native and working.
- Studio unlocks custom CSS, custom elements, and much better responsive control. Everything in §8–9 assumes it.
- Migration (Webflow / Framer / a static site) would cost 2–4 weekends of Andrew's time and hand John a platform he can't edit himself. The site's biggest problems are content and structure, not platform.

**Revisit migration if:** John wants a gated members area, a course, or a client portal. Those are heavier on Wix than on purpose-built tools.

---

## 13. Implementation roadmap

Effort: S = an evening, M = a weekend day, L = a full weekend.

| Phase | Item | Effort | Impact |
|---|---|---|---|
| **Week 1 — Fix and unify** | Fix all 15 housekeeping bugs (§2.8) | S | Medium |
| | Consolidate Calendly to 2 event types; one CTA label sitewide; UTMs | S | High |
| | Decide pricing fix (Option A or B) | S | High |
| | Get permission for named testimonials (John emails 9 clients) | S | High |
| | Confirm Studio availability; migrate if needed | M | Enabler |
| **Week 2 — Homepage** | Rebuild hero, proof strip, symptom cards, how-it-works | M | Very high |
| | Offer cards + decision row | S | High |
| | Named testimonials band; Meet John band; final CTA | S | High |
| | Sticky header + mobile CTA | S | Medium |
| **Week 3 — Coaching + Organizations** | Split Services into two pages; 301s | M | High |
| | FAQ (10 Qs) + FAQPage schema | S | Medium |
| | Org page format table + one-pager PDF | M | Medium (B2B) |
| | Testimonials CMS collection + repeaters | S | Medium |
| **Week 4 — About, Contact, SEO** | Reorder About; badge strip; books band | S | Medium |
| | Contact: Calendly embed + form + copy | S | Medium |
| | Title tags, metas, alt text, H1 audit | S | Medium |
| | ProfessionalService/Person JSON-LD; GBP setup | S | Medium |
| | Lead magnet: 2-minute burnout check PDF + form + automation | M | High (long-term) |
| **Ongoing** | Two blog posts / month, each → LinkedIn + newsletter | recurring | Compounding |
| | Monthly: GA4 + Search Console review; one A/B test (hero subhead or CTA position) | S / month | Compounding |

---

## 14. Appendix

### A. Current → proposed URL map

| Current | Proposed | Action |
|---|---|---|
| `/` | `/` | Rebuild |
| `/about-me` | `/about` | Rename + 301 |
| `/current-services` | `/coaching` and `/for-organizations` | Split + 301 to `/coaching` |
| `/testimonials` | `/testimonials` | Keep as archive; remove from nav |
| `/blog` | `/blog` | Keep; fix header/footer |
| `/resources` | `/resources` | Keep; footer link only |
| `/contact` | `/contact` | Rebuild with embed |
| — | `/privacy` | New |
| — | `/burnout-check` (optional landing page for the lead magnet) | New |

### B. CTA label bank (pick one per row, use consistently)

- Primary (individuals): **Book a free intro call** · Book a free 30-minute call
- Primary (orgs): **Book a consultation** · Talk about your team
- Secondary: **Take the 2-minute burnout check** · Get the burnout check
- Blog end: **Book a free intro call** (same as primary; never introduce a new label here)

### C. Testimonial attribution format

`“Quote.” — First name, Role · Industry (Engagement)`
Example: `— Priya, Engineering Manager · SaaS (3-month partnership)`
If a client declines naming: `— Engineering Manager, SaaS (3-month partnership)` — role and industry still beat "Individual client."

### D. Lead-magnet outline: "The 2-Minute Burnout Check"

1. Ten yes/no statements drawn from the symptoms on the homepage and the blog ("I can't remember the last time I felt rested," "I feel guilty when I slow down," etc.)
2. Three result bands with a short, honest read for each (John's voice, no diagnosis language)
3. One practice to try this week per band (the Highlight of My Day exercise fits the low band perfectly — and it's a soft introduction to his journal)
4. Last page: what coaching is, what the intro call is, the CTA

One PDF, one form, one automation. Reusable at the end of every blog post forever.

### E. Sources consulted

- Wix Velo docs — About CSS Styling; Styling Elements with CSS (global/semantic/custom classes); Custom Element introduction
- Wix Help Center — Adding Structured Data Markup to Your Site's Pages; Customizing Your SEO Settings
- Lovepixel Agency — Conversion Rate Optimization for Coaches (2026)
- Foundry CRO — CTA Button Conversion Rate Benchmarks 2026 (Unbounce single- vs multi-CTA data; First Page Sage placement data)
- Growth Stack — Landing Page Conversion Rate: 2026 Industry Benchmarks (coaching funnel ranges; reading-level data)
- Schmidt Consulting Group — Consulting Website Conversion (2026; referral vs cold traffic)
- Zentus — Wix Website Speed: 2026 Test Results & Core Web Vitals
- Studiorra — Wix Studio Page Speed: How to Pass Core Web Vitals in 2026
- SitePoint — Image Optimization for Core Web Vitals in 2026
- Web Tonic, Funnel Pandit, SEO Juice, SEOTakeoff — SEO for coaches (2025–2026)

# 0007 — The blog is active, and there are 65 posts

Status: accepted — migration complete, see Outcome
Date: 2026-09-12
Corrects: audit §2.5, §2.8 bug 13, and the blog-strategy premise in §7.4

## Context

Milestone 3 began with the audit's account of the blog: three posts, the most
recent 26 May 2026, and a recommendation to establish a two-posts-a-month cadence
because "a visible last-updated gap reads as a dormant business" (§2.5, §7.4).

Two primary sources say otherwise.

`/blog-feed.xml` returns 20 items, the most recent dated **4 September 2026** —
eight days before the audit. Posts also appear on 14 August and 10 August 2026,
all well after 26 May.

`/blog-posts-sitemap.xml` lists **65 post URLs**.

The audit almost certainly saw a paginated or partially hydrated blog listing and
read the three visible cards as the whole archive. Everything else in the audit
held up under checking; this did not.

## What this changes

1. **Finding 13 ("blog stale since May 26") is withdrawn.** The blog is active
   and was published to eight days before the audit date. There is no dormancy
   problem to fix and no cadence to establish — John is already writing.
2. **§7.4's cadence recommendation is already met.** Twenty posts in the feed
   span roughly eleven months, and the recent run is faster than two a month.
   The useful part of §7.4 is the *structure* advice — pillar and cluster pages,
   internal linking, an author box and CTA at the end of every post — not the
   frequency advice.
3. **§2.5's "15 categories for a handful of posts" loses its arithmetic.** Sixty
   five posts is not a handful. Collapsing 15 categories to 5 is still the right
   call, but the reason is navigation and topical focus, not disproportion.
4. **Migration is a scripted job, not hand-copying.** The previous plan in
   `docs/parity-checklist.md` said "there are only three posts, so hand-copying
   is fine". That is withdrawn.

## Decision

Treat the blog as its own milestone rather than a third of Milestone 3.

Post bodies are server-rendered in the HTML and extract cleanly, so migration is
mechanical — but it must preserve structure. Flattening 65 posts to plain
paragraphs would strip subheadings, lists, emphasis and links from the single
biggest SEO asset on the site. `scripts/migrate-wix-posts.mjs` walks the rendered
DOM and maps elements to Markdown.

Frontmatter comes from the feed, which carries the title, publication date, slug
and a description of the right length for a meta description.

Every slug is preserved. `public/_redirects` already maps `/post/*` → `/blog/*`.

## Consequences

- The five-category enum in `src/content.config.ts` now has to absorb 65 posts.
  Assigning each to one of five categories is a judgment call on John's content,
  and the script cannot make it — it writes `category` as a best guess from
  title keywords and flags every post for review.
- Sixty five migrated posts must be read by a human before launch. That is a
  real review task, and it belongs to John.
- The feed returns only the 20 most recent items, so the remaining 45 slugs come
  from the sitemap and their dates from each post page.

## Outcome

All 65 migrated, zero failures. `scripts/migrate-wix-posts.mjs` reads the
sitemap for slugs, each post's `BlogPosting` JSON-LD for title, dates and
description, and `section[data-hook="post-description"]` for the body.

Structure survived, which was the point: 263 subheadings, lists in 50 posts,
emphasis in all 65, links in 50. Median post is 1,163 words and the shortest is
501, so nothing was truncated.

Three things the migration surfaced that the plan did not anticipate:

1. **Wix posts use `<h4>` for their only subheading.** Rendered under our `h1`
   that leaves the page jumping h1 → h4. The script now normalises the
   shallowest heading in each post to `h2` and keeps the relative nesting.
2. **John uses a line of asterisks as a visual divider** before his closing
   note, in 42 of the 65 posts. Carried across literally it is broken Markdown
   and renders as a stray `**`. It becomes a real thematic break.
3. **43 posts carry inline Calendly links** in the original copy, bypassing
   `src/config/cta.ts` and carrying no UTMs. Left intact — they are his
   published words — and recorded on the checklist.

Per-post categories turned out not to be machine-readable anywhere: they are not
in the feed, not in the JSON-LD, and the `/categories/*` links on a post page
are the site nav rather than that post's own. The nav does confirm the audit's
count exactly — fifteen categories. So the script guesses from keywords, flags
its confidence, and writes every post as `draft: true`.

Drafts have routes but are `noindex` and excluded from the sitemap, so John can
read each post on a deploy preview before anything is publishable.

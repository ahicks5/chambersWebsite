/**
 * Content collections — the content model from docs/02-project-structure.md §4.
 *
 * This is where the audit's findings become impossible to regress:
 *   - `category` is an enum of five, so the 15-category sprawl (audit §2.5)
 *     cannot come back.
 *   - `description` is required with length bounds, so a page cannot ship with a
 *     missing or borrowed meta description (audit §2.8 bug 3).
 *   - `consent` is a required enum, so a testimonial cannot be published with a
 *     name the client did not clear (audit appendix C).
 *
 * Schemas are deliberately flat — strings, enums, string arrays, booleans,
 * numbers. Nothing computed, nothing cross-file. That keeps every field editable
 * in a web form if `docs/decisions/0002-cms.md` lands on a git-based CMS.
 *
 * NOTE ON LOCATION: this file lives at `src/content.config.ts`, not
 * `src/content/config.ts`. Astro 6 removed legacy collections and made the old
 * path a build error. See docs/decisions/0004-astro-7.md.
 */
import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Coaching and organizational offers. Audit §4.4 — prices are content. */
const offers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/offers' }),
  schema: z.object({
    title: z.string(),
    segment: z.enum(['individual', 'organization']),
    /** One line, shown on the card. */
    tagline: z.string(),
    /** The decision-row answer, audit §4.4: "I'm burned out and want to…" */
    forWho: z.string(),
    /** Display string, e.g. "From $1,000". Never used for arithmetic. */
    priceDisplay: z.string(),
    /** Numeric price for JSON-LD Offer, audit §7.5. */
    priceValue: z.number().optional(),
    sessions: z.string().optional(),
    includes: z.array(z.string()).default([]),
    /** e.g. "Most popular" — audit §4.4 allows exactly one nudge. */
    badge: z.string().optional(),
    cta: z.enum(['intro', 'consult']).default('intro'),
    order: z.number(),
    featured: z.boolean().default(false),
  }),
});

/**
 * Testimonials. Body is the quote.
 *
 * `consent` gates attribution: a component renders `firstName` only when
 * `consent === 'named'`. Audit §2.4 and appendix C.
 */
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    /** Omit entirely if the client declined naming. */
    firstName: z.string().optional(),
    role: z.string(),
    industry: z.string(),
    /** e.g. "3-month partnership" */
    engagement: z.string(),
    segment: z.enum(['individual', 'organization']),
    featured: z.boolean().default(false),
    consent: z.enum(['named', 'role-only']),
    order: z.number().default(99),
  }),
});

/** FAQs. Body is the answer, and also feeds FAQPage schema — audit §4.5, §7.5. */
const faqs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    order: z.number(),
    page: z.enum(['coaching', 'organizations']).default('coaching'),
  }),
});

/** Blog posts — audit §7.4. */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(70),
      /** Enforced meta description. Audit §7.2. */
      description: z.string().min(50).max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** Five categories, down from fifteen. Audit §2.5. */
      category: z.enum(['burnout', 'resilience', 'career', 'leadership', 'practices']),
      heroImage: image().optional(),
      /**
       * Cluster → pillar link, audit §7.4. Optional because a pillar post is
       * its own cluster head and has nothing to point at.
       */
      pillar: reference('posts').optional(),
      keywords: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

/** Page-level copy and meta. Audit §7.2, §3.1. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    /** <title>, capped at 60 characters per audit §7.2. */
    title: z.string().max(60),
    description: z.string().min(50).max(160),
    /** The visible h1, which often differs from <title>. */
    h1: z.string(),
    subhead: z.string().optional(),
    /** Audit §3.1 — rendered as the two-column who-it's-for block. */
    forWho: z.array(z.string()).default([]),
    notForWho: z.array(z.string()).default([]),
    noindex: z.boolean().default(false),
  }),
});

export const collections = { offers, testimonials, faqs, posts, pages };

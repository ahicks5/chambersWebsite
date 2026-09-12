/**
 * CTAs — audit §4.3.
 *
 * The live site has six CTA labels pointing at five Calendly event types. This
 * file is the fix: three CTAs exist, and nothing else does. Two primaries
 * (`intro` for individuals, `consult` for organizations) and one soft secondary
 * (`lead`).
 *
 * No component may contain the strings "Book a", "Schedule" or "calendly.com".
 * Labels and URLs come from here or they do not exist.
 */
import { site } from './site';

const CALENDLY = 'https://calendly.com/johnchambers-coachingwithjc';

/**
 * Calendly's embed widget script (audit §9.2). Here rather than in the island
 * so that this file is the only one in the repo naming the vendor's host —
 * which is the whole point of the rule `lint:content` enforces.
 */
export const CALENDLY_WIDGET_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';

export interface Cta {
  readonly label: string;
  readonly href: string;
  /** `primary` renders filled in the accent colour; `ghost` renders outline. */
  readonly style: 'primary' | 'ghost';
}

export const CTA = {
  intro: {
    label: 'Book a free intro call',
    href: `${CALENDLY}/intro-call`,
    style: 'primary',
  },
  consult: {
    label: 'Book a consultation',
    href: `${CALENDLY}/consultation`,
    style: 'primary',
  },
  lead: {
    label: 'Take the 2-minute burnout check',
    href: '/burnout-check',
    style: 'ghost',
  },
} as const satisfies Record<string, Cta>;

export type CtaKey = keyof typeof CTA;

/**
 * Every CTA link carries attribution (audit §11). Calendly passes UTMs through to
 * the booked event, so John can see which button on which page produced the call.
 *
 * @param key      which CTA
 * @param page     the page the button sits on, e.g. `home`, `coaching`
 * @param position where on that page, e.g. `hero`, `mid`, `footer`, `sticky`
 */
export function ctaHref(key: CtaKey, page: string, position: string): string {
  const { href } = CTA[key];
  const url = new URL(href, site.url);

  url.searchParams.set('utm_source', 'site');
  url.searchParams.set('utm_medium', 'cta');
  url.searchParams.set('utm_campaign', `${page}-${position}`);

  // Internal targets stay relative; only external links need the origin.
  return href.startsWith('/') ? `${url.pathname}${url.search}` : url.toString();
}

/**
 * URL for an inline scheduling embed (audit §9.2). Same event as the button,
 * tagged `embed` rather than `cta` so John can tell a page embed apart from a
 * click-through in Calendly's UTM report.
 *
 * Lives here for the same reason every other URL does: the host name appears in
 * exactly one file.
 */
export function ctaEmbedUrl(key: CtaKey, page: string): string {
  const url = new URL(CTA[key].href, site.url);

  url.searchParams.set('hide_gdpr_banner', '1');
  url.searchParams.set('utm_source', 'site');
  url.searchParams.set('utm_medium', 'embed');
  url.searchParams.set('utm_campaign', `${page}-embed`);

  return url.toString();
}

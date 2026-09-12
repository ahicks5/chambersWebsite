/**
 * Analytics events — audit §11.
 *
 * The event names and parameters here are exactly the ones the audit specifies,
 * because the targets in §11 are written against them: intro-call booking rate,
 * lead-magnet capture rate, and which CTA position produced a booking.
 *
 * NOT WIRED YET. GA4 is not connected (docs/parity-checklist.md), so these
 * helpers are the contract, not a live integration. They no-op safely until a
 * `gtag` exists, which means wiring GA4 later is adding the tag and calling
 * these — not hunting for event names across components.
 *
 * Note on §11 and client JS: `cta_click` needs a listener, and the site
 * currently ships zero JS outside the Calendly island. Add one delegated
 * listener in Base.astro when GA4 lands, not a handler per button.
 */

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: GtagParams) => void;
  }
}

function track(name: string, params?: GtagParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

/** Where on the page a CTA sits. Audit §11 lists these values exactly. */
export type CtaLocation = 'hero' | 'header' | 'section' | 'footer' | 'sticky';

/** A visitor clicked a primary or secondary CTA. */
export function ctaClick(location: CtaLocation, page: string): void {
  track('cta_click', { location, page });
}

/** A visitor submitted the burnout-check form. */
export function leadMagnetSubmit(page: string): void {
  track('lead_magnet_submit', { page });
}

/**
 * A visitor completed a booking in the Calendly embed.
 *
 * Calendly posts a `calendly.event_scheduled` message to the parent window; the
 * listener belongs in the Calendly island, and calls this.
 */
export function calendlyBooked(page: string): void {
  track('calendly_booked', { page });
}

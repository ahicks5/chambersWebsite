/**
 * Navigation — audit §5.1. Header, footer and sitemap all read from here, so the
 * nav cannot drift between pages the way it did on the live site (audit §2.8
 * bug 1: the blog page carried a different nav from every other page).
 */
export interface NavItem {
  readonly label: string;
  readonly href: string;
}

/** Primary nav. Testimonials and Resources are deliberately not here — §5.1. */
export const primaryNav: readonly NavItem[] = [
  { label: 'Coaching', href: '/coaching' },
  { label: 'For Organizations', href: '/for-organizations' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
] as const;

export const footerNav: readonly NavItem[] = [
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
] as const;

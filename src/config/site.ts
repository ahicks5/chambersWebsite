/**
 * Site facts — the single source of truth for anything that identifies the
 * business. Audit §2.8 bug 2: the live site's footer reads
 * "© 2024 by JC Consulting & Consulting". Rendering the name and year from here
 * makes that class of bug structurally impossible.
 */
export const site = {
  name: 'JC Coaching & Consulting',
  url: 'https://www.coachingwithjc.com',
  person: 'John Chambers',
  email: 'johnchambers@coachingwithjc.com',

  locality: 'Austin',
  region: 'TX',
  country: 'US',

  /**
   * Audit §3.3 — these belong in the hero proof strip, not buried in prose.
   * Two lists because they are two kinds of claim: things John holds or did,
   * and places he trained. The proof strip sets each credential as a figure
   * with a label under it, the way a stat reads; the footer and the blog
   * author box use the one-line `short` form.
   */
  credentials: [
    { figure: 'ICF ACC', label: 'credentialed coach', short: 'ICF ACC' },
    { figure: '12', label: 'years in corporate HR', short: '12 years corporate HR' },
    { figure: '3', label: 'journals authored', short: 'Author of 3 journals' },
  ],
  trainedAt: ['Cornell', 'Korn Ferry', 'UPenn', 'CaPP Institute'],

  /** Short name for a home-screen icon, where the full name would truncate. */
  shortName: 'JC Coaching',

  /**
   * The four profiles linked from the live site's footer, as of 2026-09-13.
   * The footer renders only entries that are real URLs, so a profile can be
   * dropped by emptying its string.
   */
  social: {
    linkedin: 'https://www.linkedin.com/in/john-m-chambers-atx',
    instagram: 'https://instagram.com/coachingwithjc',
    tiktok: 'https://www.tiktok.com/@coachingwithjc',
    x: 'https://x.com/coachingwith_jc',
  },
} as const;

export type Site = typeof site;

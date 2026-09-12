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

  /** Audit §3.3 — these belong in the hero proof strip, not buried in prose. */
  credentials: [
    'ICF ACC',
    '12 years corporate HR',
    'Author of 3 journals',
    'Cornell',
    'Korn Ferry',
    'UPenn',
    'CaPP Institute',
  ],

  social: {
    linkedin: 'TODO: confirm LinkedIn profile URL',
    instagram: 'TODO: confirm Instagram profile URL',
    tiktok: 'TODO: confirm TikTok profile URL',
    x: 'TODO: confirm X profile URL',
  },
} as const;

export type Site = typeof site;

// @ts-check
import { readdirSync, readFileSync } from 'node:fs';

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = 'https://www.coachingwithjc.com';

/** URLs of posts still marked `draft: true`, read at config time. */
const DRAFT_POST_URLS = new Set(
  readdirSync('src/content/posts')
    .filter((name) => name.endsWith('.md'))
    .filter((name) => /^draft:\s*true\s*$/m.test(readFileSync(`src/content/posts/${name}`, 'utf8')))
    .map((name) => `${SITE_URL}/blog/${name.replace(/\.md$/, '')}/`)
);

// https://astro.build/config
export default defineConfig({
  site: 'https://www.coachingwithjc.com',

  // Audit §7.6 wants a sitemap submitted to Search Console. public/robots.txt
  // already points at /sitemap-index.xml, which this generates.
  integrations: [
    sitemap({
      // Draft posts have routes so John can review them on a deploy preview,
      // but they are noindex and must stay out of the sitemap. Slugs come from
      // the filenames, so a draft's URL is /blog/<slug>.
      filter: (url) => !DRAFT_POST_URLS.has(url),
    }),
  ],

  // Tailwind 4 ships its own Vite plugin — there is no @astrojs/tailwind and no
  // tailwind.config.mjs. See docs/decisions/0003-tailwind-v4.md.
  vite: {
    plugins: [tailwindcss()],
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.coachingwithjc.com',

  // Audit §7.6 wants a sitemap submitted to Search Console. public/robots.txt
  // already points at /sitemap-index.xml, which this generates.
  integrations: [sitemap()],

  // Tailwind 4 ships its own Vite plugin — there is no @astrojs/tailwind and no
  // tailwind.config.mjs. See docs/decisions/0003-tailwind-v4.md.
  vite: {
    plugins: [tailwindcss()],
  },
});

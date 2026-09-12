import { defineConfig } from '@playwright/test';

/**
 * Runs against the built site, not the dev server — the thing we ship is the
 * thing we test. `astro preview` serves dist/ exactly as a static host would.
 *
 * PLAYWRIGHT_BROWSERS_PATH is set in this environment; CI installs Chromium.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'line' : 'list',

  use: {
    baseURL: 'http://127.0.0.1:4321',
  },

  /**
   * No `webServer` block on purpose. Astro 7's preview server daemonises and
   * returns, so Playwright sees the command "exit early" and gives up. The
   * server is started and stopped around the run instead — see the `test`
   * script in package.json and the CI workflow.
   */
});

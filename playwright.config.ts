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
   * A foreground server Playwright owns, rather than `astro preview`. Astro 7's
   * preview daemonises, which Playwright reads as the command exiting early —
   * and on GitHub Actions the surviving process inherits the step's stdout and
   * hangs the job after the tests pass. See scripts/serve-dist.mjs.
   */
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});

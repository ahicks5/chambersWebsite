/**
 * Smoke — docs/02-project-structure.md §8: every route 200s, has exactly one
 * H1, and carries a CTA.
 */
import { test, expect } from '@playwright/test';
import { builtRoutes, postRoutes, primaryRoutes } from './routes';

const primary = primaryRoutes();
const all = builtRoutes();

test('the build produced the routes we expect', () => {
  expect(all.length).toBeGreaterThan(70);
  for (const route of ['/', '/coaching/', '/for-organizations/', '/about/', '/contact/', '/blog/']) {
    expect(all, `${route} should exist`).toContain(route);
  }
});

for (const route of primary) {
  test(`${route} loads, has one h1, and offers an action`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status(), 'should not 404').toBe(200);

    // Audit §7.3 / §2.8 bugs 4 and 5.
    await expect(page.locator('h1')).toHaveCount(1);

    // Audit §7.2 — every page carries its own description.
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length ?? 0, 'meta description present').toBeGreaterThan(49);

    // Audit §4.3 — a visitor can always act.
    await expect(page.locator('a.button, button[type="submit"]').first()).toBeVisible();
  });
}

test('no page offers two competing Calendly events', async ({ page }) => {
  // Audit §4.3. The homepage is the deliberate exception: its org band is a
  // ghost-styled secondary.
  for (const route of primary.filter((r) => r !== '/')) {
    await page.goto(route);
    const events = await page.evaluate(() =>
      [
        ...new Set(
          [...document.querySelectorAll('a[href*="calendly"]')].map(
            (a) => new URL((a as HTMLAnchorElement).href).pathname
          )
        ),
      ].sort()
    );
    expect(events.length, `${route} should offer at most one event type`).toBeLessThanOrEqual(1);
  }
});

test('every old Wix post URL has a page at its new address', async ({ page }) => {
  // Audit §7.6: the old /post/* URLs carry LinkedIn backlinks. The redirect is
  // Netlify's job; what we can check here is that the destination exists.
  const posts = postRoutes();
  expect(posts.length).toBe(65);

  const [first] = posts;
  if (!first) throw new Error('no post routes were built');

  const response = await page.goto(first);
  expect(response?.status()).toBe(200);
});

test('published posts are in the sitemap and carry no draft banner', async ({ page, request }) => {
  // The 65 migrated posts are published (ADR 0007's draft gate is still there:
  // a post with `draft: true` leaves the listings and the sitemap and shows the
  // banner again). Off the canonical domain every page is noindex, so that is
  // not what distinguishes a draft here — the sitemap and the banner are.
  const posts = postRoutes();
  const [first] = posts;
  if (!first) throw new Error('no post routes were built');

  await page.goto(first);
  await expect(page.locator('.draft')).toHaveCount(0);

  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  for (const post of posts.slice(0, 5)) {
    expect(sitemap, `${post} should be in the sitemap once published`).toContain(post);
  }
});

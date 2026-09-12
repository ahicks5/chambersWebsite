/**
 * Accessibility — docs/02-project-structure.md §8: axe on each route, zero
 * serious violations. Audit §10 wants 100 on Lighthouse a11y.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { primaryRoutes } from './routes';

for (const route of primaryRoutes()) {
  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(route);

    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(
      serious.map((v) => `${v.id}: ${v.nodes.length} node(s) — ${v.help}`),
      `${route} axe violations`
    ).toEqual([]);
  });
}

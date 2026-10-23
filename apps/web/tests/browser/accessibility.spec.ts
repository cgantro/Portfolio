import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

const routes = [
  '', 'projects/', 'documents/', 'projects/robotpal/', 'projects/mausoleum/',
  'projects/autowingcar/', 'projects/dronesim/', 'resume/general/',
];

for (const route of routes) {
  test(`axe WCAG 2.1 AA: /${route}`, async ({ page }) => {
    await page.goto(`/Portfolio/${route}`);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations.map(({ id, impact, description, nodes }) => ({
      id, impact, description, targets: nodes.map(node => node.target),
    })), null, 2)).toEqual([]);
  });
}

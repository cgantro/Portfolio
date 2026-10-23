import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const screenshotRoot = resolve(process.cwd(), '../../artifacts/design-review/screenshots');
mkdirSync(screenshotRoot, { recursive: true });

const routes = [
  ['', 'home'], ['projects/', 'projects'], ['projects/dronesim/', 'dronesim'],
  ['projects/robotpal/', 'robotpal'], ['projects/mausoleum/', 'mausoleum'],
  ['projects/autowingcar/', 'autowingcar'], ['documents/', 'documents'],
  ['resume/general/', 'resume-general'],
] as const;

for (const [device, width, height] of [['desktop', 1440, 1000], ['tablet', 768, 1024], ['mobile', 375, 812]] as const) {
  for (const [route, name] of routes) {
    test(`${device} ${name} fits its viewport and captures a review image`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.goto(`/Portfolio/${route}`);
      await page.locator('img').evaluateAll(images => Promise.all(images.map(element => { const image = element as HTMLImageElement; image.loading = 'eager'; return image.decode().catch(() => undefined); })));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await expect(page.locator('main h1')).toBeVisible();
      const file = resolve(screenshotRoot, `${device}-${name}.png`);
      await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
      await testInfo.attach(`${device}-${name}`, { path: file, contentType: 'image/png' });
    });
  }
}

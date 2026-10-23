import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';

test('live DroneSim web demo renders after the explicit new-tab launch', async ({ page }) => {
  test.setTimeout(120_000);
  const pageErrors: string[] = [];
  const externalFailures: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/Portfolio/projects/dronesim/');
  await page.locator('#demo').scrollIntoViewIfNeeded();
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '새 탭에서 데모 열기' }).click();
  const simulator = await popupPromise;
  simulator.on('requestfailed', request => {
    if (request.url().includes('cgantro.github.io/DroneSim')) externalFailures.push(`${request.url()}: ${request.failure()?.errorText}`);
  });
  simulator.on('pageerror', error => pageErrors.push(error.message));
  await expect(simulator).toHaveURL('https://cgantro.github.io/DroneSim/');
  const canvas = simulator.locator('canvas').first();
  try {
    await expect(canvas).toBeVisible({ timeout: 90_000 });
  } catch (error) {
    console.error({ frames: page.frames().map(frame => frame.url()), externalFailures, pageErrors });
    throw error;
  }
  await expect.poll(() => canvas.evaluate(element => (element as HTMLCanvasElement).width), { timeout: 30_000 }).toBeGreaterThan(300);
  await expect.poll(() => canvas.evaluate(element => (element as HTMLCanvasElement).height), { timeout: 30_000 }).toBeGreaterThan(150);
  const isolated = await simulator.evaluate(() => window.crossOriginIsolated);
  const canvasSize = await canvas.evaluate(element => ({ width: (element as HTMLCanvasElement).width, height: (element as HTMLCanvasElement).height }));
  expect(pageErrors).toEqual([]);

  const output = resolve(process.cwd(), '../../artifacts/design-review');
  mkdirSync(output, { recursive: true });
  await simulator.screenshot({ path: resolve(output, 'live-dronesim.png'), fullPage: true });
  writeFileSync(resolve(output, 'live-dronesim.json'), JSON.stringify({
    url: 'https://cgantro.github.io/DroneSim/',
    canvas: canvasSize,
    crossOriginIsolated: isolated,
    pageErrors,
    externalFailures,
    note: isolated ? null : 'The standalone web demo rendered. crossOriginIsolated was false; SharedArrayBuffer thread isolation was not verified.',
  }, null, 2) + '\n');
  if (!isolated) console.warn('Live simulator rendered standalone, but crossOriginIsolated is false; SharedArrayBuffer thread isolation remains unverified.');
  await simulator.close();
});

import { test, expect } from '@playwright/test';

test('DroneSim is not published as a portfolio detail page', async ({ page }) => {
  const response = await page.goto('/Portfolio/projects/dronesim/');
  expect(response?.status()).toBe(404);
});

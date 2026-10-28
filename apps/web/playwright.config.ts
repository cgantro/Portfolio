import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 4321', url: 'http://127.0.0.1:4321/Portfolio/', reuseExistingServer: !process.env.CI, timeout: 60_000 },
  projects: [
    { name: 'chromium', testMatch: '**/{routes,accessibility}.spec.ts', use: { ...devices['Desktop Chrome'] } },
    { name: 'visual', testMatch: '**/visual.spec.ts', use: { ...devices['Desktop Chrome'] } },
    { name: 'live-simulator', testMatch: '**/live-simulator.live.spec.ts', use: { ...devices['Desktop Chrome'] } },
  ],
});

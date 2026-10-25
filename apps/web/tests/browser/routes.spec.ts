import { test, expect } from '@playwright/test';

const base = '/Portfolio/';
test('all static routes render and internal navigation keeps deployment base', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const missingAssets: string[] = [];
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:4321/')) missingAssets.push(response.url()); });
  for (const route of ['', 'projects/', 'projects/robotpal/', 'projects/mausoleum/', 'projects/autowingcar/', 'projects/dronesim/']) {
    const response = await page.goto(`${base}${route}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    expect(await page.locator('img').evaluateAll(elements => elements.every(element => Boolean(element.getAttribute('alt'))))).toBe(true);
    const links = await page.locator('a[href^="/"]').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
    expect(links.every(link => link?.startsWith(base))).toBe(true);
    await page.locator('img').evaluateAll(images => Promise.all(images.map(element => { const image = element as HTMLImageElement; image.loading = 'eager'; return image.decode().catch(() => undefined); })));
  }
  expect(errors).toEqual([]);
  expect(missingAssets).toEqual([]);
});

test('DroneSim project assets preserve their deployed paths', async ({ request }) => {
  for (const asset of ['DroneSim-preview.jpg', 'dronesim-system-architecture.svg']) {
    const response = await request.get(`${base}${asset}`);
    expect(response.status()).toBe(200);
  }
});

test('portfolio pages have no downloadable files or document pages', async ({ page, request }) => {
  await page.goto(base);
  await expect(page.locator('a[download], a[href*="/downloads/"]')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '이력서' })).toHaveCount(0);
  for (const path of ['documents/', 'resume/general/', 'downloads/general/portfolio.pdf', 'downloads/general/portfolio.html', 'downloads/general/resume.rendercv.pdf']) {
    expect((await request.get(`${base}${path}`)).status(), `${path} is not published`).toBe(404);
  }
});

test('project content and links are readable without client JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4321${base}projects/`);
  await expect(page.locator('.archive-project')).toHaveCount(4);
  await page.goto(`http://127.0.0.1:4321${base}projects/dronesim/`);
  await expect(page.locator('.architecture-figure img')).toHaveAttribute('alt', /.+/);
  await expect(page.locator('.dronesim-narrative')).toContainText('4초 위치 RMSE는 약 1.041m');
  await expect(page.locator('.dronesim-narrative h2')).toHaveCount(5);
  await expect(page.locator('.dronesim-narrative h2').nth(0)).toHaveText('고정 Tick과 비행 계산');
  await expect(page.locator('.dronesim-narrative h2').nth(1)).toHaveText('통신 단절과 임무 재할당');
  await expect(page.locator('.dronesim-narrative h2').nth(2)).toHaveText('충돌 후보 정렬 재사용');
  await expect(page.locator('.dronesim-narrative h2').nth(3)).toHaveText('PX4 비행 기록 재생과 접촉 오차');
  await expect(page.locator('.dronesim-narrative h2').nth(4)).toHaveText('지상통제 명령');
  await expect(page.locator('.dronesim-narrative')).toContainText('188.0');
  await expect(page.locator('.dronesim-narrative')).toContainText('184.2µs');
  await expect(page.locator('[data-evidence-ids]')).toHaveCount(0);
  await expect(page.locator('.project-top-links a[target="_blank"]').filter({ hasText: '웹 데모 실행' })).toHaveAttribute('href', 'https://cgantro.github.io/DroneSim/');
  await context.close();
});

test('project index presents all four cases without client-side controls', async ({ page }) => {
  await page.goto(`${base}projects/`);
  await expect(page.locator('.archive-project')).toHaveCount(4);
  await expect(page.locator('astro-island')).toHaveCount(0);
  await expect(page.locator('.archive-project').nth(3)).toContainText('오토잉카');
});

test('keyboard skip link and navigation are reachable', async ({ page }) => {
  await page.goto(base);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '본문으로 바로가기' })).toBeFocused();
  await page.keyboard.press('Enter');
  expect(new URL(page.url()).hash).toBe('#main');
  await page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '프로젝트', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/Portfolio\/projects\/$/);
  await expect(page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '프로젝트', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('intro navigation returns visitors to the profile section', async ({ page }) => {
  await page.goto(`${base}projects/autowingcar/`);
  await page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '소개' }).click();
  await expect(page).toHaveURL(/\/Portfolio\/#about$/);
  await expect(page.getByRole('heading', { name: '소개', exact: true })).toBeVisible();
});

test('mobile menu opens by keyboard and supporting projects stay visible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(base);
  const menu = page.locator('.mobile-nav summary');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.mobile-nav')).toHaveAttribute('open', '');
  await expect(page.locator('.mobile-nav nav a', { hasText: '프로젝트' })).toBeVisible();
  await expect(page.locator('.supporting-project')).toHaveCount(2);
  await expect(page.locator('.supporting-project').nth(1)).toContainText('MQTT');
});

test('homepage introduces the developer before the featured project cases', async ({ page }) => {
  let demoRequests = 0;
  page.on('request', request => { if (request.url().startsWith('https://cgantro.github.io/DroneSim/')) demoRequests += 1; });
  await page.goto(base);
  await expect(page.getByRole('heading', { name: '시뮬레이션·실시간 통신 개발자 홍윤표입니다.' })).toBeVisible();
  await expect(page.locator('main h1')).not.toContainText('C++');
  await expect(page.getByRole('heading', { name: 'RobotPal', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'DroneSim', exact: true })).toBeVisible();
  const launch = page.getByRole('link', { name: '웹 데모 실행' });
  await expect(launch).toHaveAttribute('target', '_blank');
  await expect(page.locator('.featured-project')).toHaveCount(2);
  await expect(page.locator('.supporting-project')).toHaveCount(2);
  expect(demoRequests).toBe(0);
});

test('DroneSim stays absent until explicit launch and opens in a separate tab', async ({ page }) => {
  let demoRequests = 0;
  await page.context().route('https://cgantro.github.io/DroneSim/**', route => { demoRequests += 1; return route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>DroneSim simulator fixture</body></html>' }); });
  await page.goto(`${base}projects/dronesim/`);
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(demoRequests).toBe(0);
  const launch = page.locator('.project-top-links').getByRole('link', { name: '웹 데모 실행' });
  await expect(launch).toHaveAttribute('target', '_blank');
  await launch.scrollIntoViewIfNeeded();
  const popupPromise = page.waitForEvent('popup');
  await launch.click();
  const popup = await popupPromise;
  await expect(popup.getByText('DroneSim simulator fixture')).toBeVisible();
  expect(demoRequests).toBeGreaterThan(0);
  await popup.close();
});


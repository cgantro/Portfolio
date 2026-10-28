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
  for (const asset of ['DroneSim-native-scene.png', 'dronesim-system-architecture.svg']) {
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
  await expect(page.locator('.project-narrative h2')).toHaveText(['프로젝트 개요', '담당 역할', '주요 기능', '트러블슈팅', '결과']);
  await expect(page.locator('.project-narrative')).toContainText('완료율 100%');
  await expect(page.locator('.project-narrative')).toContainText('188.0');
  await expect(page.locator('.project-narrative')).toContainText('184.2µs');
  await expect(page.locator('.dronesim-p95-chart .p95-chart-row')).toHaveCount(5);
  await expect(page.locator('.dronesim-p95-chart')).toContainText('변경 전');
  await expect(page.locator('.dronesim-p95-chart')).toContainText('변경 후');
  await expect(page.locator('.project-narrative')).toContainText('H.264 영상으로 실시간 전송');
  await expect(page.locator('.project-narrative')).toContainText('90m DEM의 높이값을 수치지도 표고점·등고선 자료로 보정해 5m 간격 지형 격자');
  await expect(page.locator('.project-narrative .code-disclosure')).toHaveCount(1);
  await expect(page.locator('.project-narrative .code-disclosure[open]')).toHaveCount(0);
  await expect(page.locator('.project-heading')).not.toContainText('2.6×10⁻⁶');
  await expect(page.locator('.project-narrative')).toContainText('같은 기록을 12회 재생');
  await expect(page.locator('.dronesim-p95-chart')).toContainText('물리 단계 처리 시간');
  await expect(page.locator('[data-evidence-ids]')).toHaveCount(0);
  await expect(page.locator('.project-top-links a[target="_blank"]').filter({ hasText: '웹 데모 실행' })).toHaveAttribute('href', 'https://cgantro.github.io/DroneSim/');
  await context.close();
});

test('RobotPal follows the project introduction, role, features, troubleshooting, and results structure', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4321${base}projects/robotpal/`);
  await expect(page.locator('.project-narrative h2')).toHaveText(['프로젝트 개요', '담당 역할', '주요 기능', '트러블슈팅', '결과']);
  await expect(page.locator('.project-meta-brief')).toContainText('4인');
  await expect(page.locator('.project-role-list')).toContainText('실물 JETANK의 주행값');
  await expect(page.locator('.project-narrative')).toContainText('66.70 FPS');
  await expect(page.locator('.project-narrative')).toContainText('96.01 FPS');
  await expect(page.locator('.project-narrative')).toContainText('TCP 송신 2프레임');
  await expect(page.locator('.project-narrative .code-disclosure')).toHaveCount(1);
  await expect(page.locator('.project-narrative .code-disclosure[open]')).toHaveCount(0);
  await context.close();
});

test('all projects share the five narrative sections and show the cover beside the role section', async ({ page }) => {
  for (const id of ['robotpal', 'dronesim', 'mausoleum', 'autowingcar']) {
    await page.goto(`${base}projects/${id}/`);
    await expect(page.locator('.project-narrative h2')).toHaveText(['프로젝트 개요', '담당 역할', '주요 기능', '트러블슈팅', '결과']);
    await expect(page.locator('.project-features .project-feature-list > li').first().locator('h3')).toBeVisible();
    await expect(page.locator('.project-story-section').nth(3).locator('h3').first()).toBeVisible();
    await expect(page.locator('.project-story-section .code-disclosure[open]')).toHaveCount(0);
    await expect(page.locator('.project-roles + .project-cover-wide img')).toHaveAttribute('alt', /.+/);
    await expect(page.locator('.project-narrative a[href*="/blob/"]')).toHaveCount(0);
    await expect(page.locator('.project-narrative figure a')).toHaveCount(0);
    await expect(page.locator('.project-cover-wide img')).toHaveAttribute('alt', /.+/);
    await expect(page.locator('.architecture-figure img')).toHaveAttribute('alt', /.+/);
  }
});

test('project code stays collapsed and does not expose a source-code link', async ({ page }) => {
  await page.goto(`${base}projects/robotpal/`);
  const codeDisclosure = page.locator('.code-disclosure');
  await expect(codeDisclosure).toHaveCount(1);
  await expect(codeDisclosure).not.toHaveAttribute('open', '');
  await expect(codeDisclosure.locator('summary')).toContainText('JPEG 인코딩 대기열에 프레임 추가');
  await codeDisclosure.locator('summary').click();
  await expect(codeDisclosure.locator('pre')).toBeVisible();
  await expect(page.locator('.project-narrative a[href*="/blob/"]')).toHaveCount(0);
  await expect(page.locator('.project-narrative figure a')).toHaveCount(0);
});

test('mobile project tables fit and architecture diagrams have a keyboard-scrollable viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const id of ['robotpal', 'dronesim']) {
    await page.goto(`${base}projects/${id}/`);
    const table = page.locator('.project-comparison').first();
    await expect(table).toBeVisible();
    expect(await table.evaluate(element => element.scrollWidth)).toBeLessThanOrEqual(375);
    await expect(table).toContainText(id === 'robotpal' ? '40.05 FPS' : '13.5%');
    const diagram = page.getByRole('region', { name: /구성 흐름도/ });
    await diagram.focus();
    await expect(diagram).toBeFocused();
  }
});

test('project index presents all four cases without client-side controls', async ({ page }) => {
  await page.goto(`${base}projects/`);
  await expect(page.locator('.archive-project')).toHaveCount(4);
  await expect(page.locator('.archive-project').first()).toContainText('DroneSim');
  await expect(page.locator('.archive-project').first()).toContainText('진행 중 · 개인 프로젝트');
  await expect(page.locator('.archive-project').first()).toContainText('담당');
  await expect(page.locator('.archive-project').first().locator('ul')).toHaveCount(0);
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
  await expect(page.getByRole('heading', { name: '시뮬레이션과 실시간 통신 소프트웨어를 개발합니다.' })).toBeVisible();
  await expect(page.locator('main h1')).not.toContainText('C++');
  await expect(page.getByRole('heading', { name: 'RobotPal', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'DroneSim', exact: true })).toBeVisible();
  await expect(page.locator('.featured-project').first()).toContainText('DroneSim');
  await expect(page.locator('.featured-project').first()).toContainText('담당');
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


import { test, expect } from '@playwright/test';

const base = '/Portfolio/';
test('all static routes render and internal navigation keeps deployment base', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const missingAssets: string[] = [];
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:4321/')) missingAssets.push(response.url()); });
  for (const route of ['', 'projects/', 'documents/', 'projects/robotpal/', 'projects/mausoleum/', 'projects/autowingcar/', 'projects/dronesim/', 'resume/general/']) {
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

test('every available document download is served from the repository base', async ({ page, request }) => {
  for (const edition of ['general']) {
    await page.goto(`${base}resume/${edition}/`);
    const downloads = await page.locator('a[href*="/downloads/"]').evaluateAll(elements => elements.map(element => element.getAttribute('href')!));
    expect(downloads).toContain(`${base}downloads/${edition}/resume.rendercv.pdf`);
    for (const href of downloads) {
      expect(href.startsWith(`${base}downloads/${edition}/`)).toBe(true);
      const response = await request.get(href);
      expect(response.status()).toBe(200);
      const body = await response.body();
      expect(body.length).toBeGreaterThan(0);
      if (href.endsWith('/portfolio.html')) {
        const html = body.toString('utf8');
        const imageSources = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
        expect(imageSources.length).toBeGreaterThan(0);
        for (const source of imageSources) {
          const assetUrl = new URL(source, `http://127.0.0.1:4321${href}`).pathname;
          const assetResponse = await request.get(assetUrl);
          expect(assetResponse.status(), `${source} should be available beside downloaded HTML`).toBe(200);
        }
      }
    }
  }
  for (const internalArtifact of ['resume.json', 'resume.loss-report.json', 'portfolio.data.json']) {
    const response = await request.get(`${base}downloads/general/${internalArtifact}`);
    expect(response.status(), `${internalArtifact} stays local to the build`).toBe(404);
  }
});

test('project content and links are readable without client JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4321${base}projects/`);
  await expect(page.locator('.project-card')).toHaveCount(4);
  await page.goto(`http://127.0.0.1:4321${base}projects/dronesim/`);
  await expect(page.locator('#overview')).toBeVisible();
  await expect(page.locator('#architecture img')).toHaveAttribute('alt', /.+/);
  await expect(page.locator('#implementation')).toContainText('충돌 상자');
  await expect(page.locator('#verification, #limitations, [data-evidence-ids]')).toHaveCount(0);
  await expect(page.locator('#demo a[target="_blank"]')).toHaveAttribute('href', 'https://cgantro.github.io/DroneSim/');
  await context.close();
});

test('project search and category filters work with a useful empty state', async ({ page }) => {
  await page.goto(`${base}projects/`);
  await expect(page.locator('astro-island[component-url*="ProjectExplorer"]')).not.toHaveAttribute('ssr', '');
  await expect(page.locator('.project-card')).toHaveCount(4);
  const search = page.getByRole('searchbox', { name: '프로젝트 또는 기술 검색' });
  await search.fill('DroneSim');
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'DroneSim' })).toBeVisible();
  await search.fill('there-is-no-project');
  await expect(page.getByRole('heading', { name: '검색 결과가 없습니다.' })).toBeVisible();
  await page.getByRole('button', { name: '필터 초기화' }).click();
  await expect(page.locator('.project-card')).toHaveCount(4);
  const categories = page.locator('.filter-categories button');
  await categories.nth(1).click();
  await expect(categories.nth(1)).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('.project-card').count()).toBeGreaterThan(0);
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

test('mobile navigation keeps contact visible and documents explain all resume formats', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(base);
  const contact = page.getByRole('navigation', { name: '주 메뉴' }).getByRole('link', { name: '연락하기' });
  await expect(contact).toBeVisible();
  await expect(contact).toHaveAttribute('href', /^mailto:/);

  await page.goto(`${base}documents/`);
  await expect(page.locator('.document-card').first()).toContainText('PDF · HTML');
  for (const [edition, headline] of [['general', '소프트웨어 개발자']]) {
    await page.goto(`${base}resume/${edition}/`);
    await expect(page.locator('.page-heading')).toContainText(headline);
    await expect(page.locator('.download-panel')).toContainText('PDF 포트폴리오');
    await expect(page.locator('.download-panel')).not.toContainText('변환 보고서');
  }
});

test('DroneSim stays absent until explicit launch and opens in a separate tab', async ({ page }) => {
  let demoRequests = 0;
  await page.context().route('https://cgantro.github.io/DroneSim/**', route => { demoRequests += 1; return route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>DroneSim simulator fixture</body></html>' }); });
  await page.goto(`${base}projects/dronesim/`);
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(demoRequests).toBe(0);
  const launch = page.getByRole('link', { name: '새 탭에서 실행하기' });
  await expect(launch).toHaveAttribute('target', '_blank');
  await launch.scrollIntoViewIfNeeded();
  const popupPromise = page.waitForEvent('popup');
  await launch.click();
  const popup = await popupPromise;
  await expect(popup.getByText('DroneSim simulator fixture')).toBeVisible();
  expect(demoRequests).toBeGreaterThan(0);
  await popup.close();
});

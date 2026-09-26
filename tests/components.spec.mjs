import { test, expect } from '@playwright/test';
import { createRenderingFixture } from '../scripts/check-rendering.mjs';
let fixture;
test.beforeAll(async () => { fixture = await createRenderingFixture(); });
test.afterAll(async () => { await fixture?.cleanup(); });
test.beforeEach(async ({ page }) => {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== '127.0.0.1') return route.abort();
    if (url.pathname.startsWith('/__fixtures/')) {
      return route.fulfill({ contentType: 'text/html', body: await fixture.read(`${url.pathname.slice(1)}index.html`) });
    }
    return route.continue();
  });
});

test('ordinary Markdown currencies do not load math or chart libraries', async ({ page }) => {
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/__fixtures/currency/');
  await expect(page.locator('.prose')).toContainText('Price: $20 and $30.');
  await expect(page.locator('.prose strong')).toHaveText('bold text');
  await expect(page.locator('.katex')).toHaveCount(0);
  expect(requests.some(url => url.includes('/vendor/'))).toBeFalsy();
});

test('resource JSON renders with math inside a notice; only ECharts is downloaded', async ({ page }) => {
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/__fixtures/resource/');
  await expect(page.locator('[data-ready=true]')).toHaveCount(1);
  await expect(page.locator('.notice .katex')).toHaveCount(2);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  expect(requests.some(url => url.includes('/echarts-'))).toBeTruthy();
  expect(requests.some(url => url.includes('/mermaid.'))).toBeFalsy();
  await expect(page.locator('#utter-container')).toHaveCount(0);
});

test('invalid JSON retains visible configuration and an error message', async ({ page }) => {
  await page.goto('/__fixtures/invalid/');
  await expect(page.locator('.chart-status')).toContainText('图表加载失败');
  await expect(page.locator('.chart-source')).toHaveAttribute('open', '');
  await expect(page.locator('.chart-source code')).toContainText('broken JSON');
});

test('Mermaid cannot lower strict mode or create executable links', async ({ page }) => {
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/__fixtures/mermaid/');
  await expect(page.locator('[data-ready=true]')).toHaveCount(1);
  await expect(page.locator('.chart-canvas a[href^="javascript:"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.fixtureExecuted)).toBeUndefined();
  expect(requests.some(url => url.includes('/echarts-'))).toBeFalsy();
});

import { test, expect } from '@playwright/test';

// Third-party images/comments are content dependencies, not required for these deterministic checks.
test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

test('search is lazy, matches Chinese body/title/tags, handles keyboard and empty results', async ({ page }) => {
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  expect(requests.some(url => url.endsWith('search.json'))).toBeFalsy();
  expect(requests.some(url => url.includes('/vendor/'))).toBeFalsy();
  await page.keyboard.press('/');
  await expect(page.locator('#search-input')).toBeFocused();
  await page.locator('#search-input').fill('智能家');
  await expect(page.locator('#search-results a').first()).toHaveAttribute('href', /ha-config-as-code/);
  await expect(page.locator('#search-results mark').first()).toHaveText('智能家');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#search-results a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#search-dialog')).not.toBeVisible();
  await page.locator('.search-open').click();
  await page.locator('#search-input').fill('xyz-nothing-9373');
  await expect(page.locator('#search-status')).toContainText('没有找到');
  await page.locator('#search-input').fill('优化器');
  await expect(page.locator('#search-results a').first()).toBeVisible();
  await page.locator('#search-input').fill('Python');
  await expect(page.locator('#search-results a').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.search-open')).toBeFocused();
  await page.goto('/en/');
  await page.locator('.search-open').click();
  await page.locator('#search-input').fill('assistant');
  await expect(page.locator('#search-results a')).toHaveCount(1);
  await expect(page.locator('#search-results a')).toHaveAttribute('href', /\/en\//);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/en\/2026\/03\/ha-config-as-code\//);
});

test('code copy omits line numbers; wrap, heading links, and image focus work', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/style-guide/');
  const block = page.locator('.code-block').first();
  await block.locator('[data-copy]').click();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toBe(await block.getAttribute('data-source'));
  expect(text).toMatch(/^def greet/);
  await expect(block.locator('td:last-child .hl')).toHaveCount(1);
  await block.locator('[data-wrap]').click();
  await expect(block).toHaveClass(/wrap/);
  await expect(block.locator('[data-wrap]')).toHaveAttribute('aria-pressed', 'true');
  const anchor = page.locator('.heading-anchor').first();
  await anchor.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await anchor.evaluate(a => a.href));
  const zoom = page.locator('.image-zoom').first();
  await zoom.click();
  await expect(page.locator('#image-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(zoom).toBeFocused();
  await page.getByRole('tab').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
});

test('theme supports keyboard selection, persistence, system changes and cross-tab sync', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.getByRole('radio', { name: '深色', exact: true }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.getByRole('radio', { name: '深色', exact: true })).toBeChecked();
  await page.getByRole('radio', { name: '深色', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: '跟随系统', exact: true })).toBeChecked();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const other = await page.context().newPage();
  await other.goto('/about/');
  await other.getByRole('radio', { name: '浅色', exact: true }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('radio', { name: '浅色', exact: true })).toBeChecked();
  await other.close();
});

test('the Loop navigation keeps real page links and the language switch preserves translations', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: '主导航' });
  await expect(navigation.getByRole('link')).toHaveText(['主页', '关于我', '标签', '归档']);
  await navigation.getByRole('link', { name: '归档', exact: true }).click();
  await expect(page).toHaveURL(/\/archives\/$/);
  await expect(navigation.getByRole('link', { name: '归档', exact: true })).toHaveAttribute('aria-current', 'page');
  await navigation.getByRole('link', { name: '关于我', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await page.goto('/2026/03/ha-config-as-code/');
  await page.getByRole('navigation', { name: '语言', exact: true }).getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/2026\/03\/ha-config-as-code\/$/);
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveText(['Home', 'About', 'Tags', 'Archive']);
});

test('pixel navigation, Chinese, Latin and highlighted code use the locally served fonts', async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  async function renderedFonts(selector) {
    await page.evaluate(() => document.fonts.ready);
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
    return (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts;
  }
  await page.goto('/');
  const pixel = await renderedFonts('.loop-navigation a');
  expect(pixel.length).toBeGreaterThan(0);
  expect(pixel.every(font => font.isCustomFont && /Ark Pixel/.test(font.familyName))).toBe(true);
  await page.goto('/style-guide/');
  const chinese = await renderedFonts('h1');
  expect(chinese.every(font => font.isCustomFont && /Noto Sans SC/.test(font.familyName))).toBe(true);
  expect(chinese.length).toBeGreaterThan(0);
  const code = await renderedFonts('.code-block .cl');
  expect(code.length).toBeGreaterThan(0);
  expect(code.every(font => font.isCustomFont && font.familyName === 'JetBrains Mono')).toBe(true);
  await page.goto('/en/style-guide/');
  expect((await renderedFonts('h1')).some(font => font.isCustomFont && font.familyName === 'Geist')).toBe(true);
  expect((await renderedFonts('.loop-navigation a')).every(font => font.isCustomFont && /Ark Pixel/.test(font.familyName))).toBe(true);
});

test('multiple charts render once, resize, and retain legend/zoom state on theme changes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/style-guide/');
  await expect(page.locator('[data-ready=true]')).toHaveCount(5);
  const chartState = await page.evaluate(async () => {
    // Access the exact bundled ECharts module through the entry chunk's import URL.
    const entry = await (await fetch('/vendor/charts/charts.js')).text();
    const modulePath = entry.match(/import\("(\.\/echarts[^"\n]+)"\)/)[1];
    const echarts = await import(new URL(modulePath, `${location.origin}/vendor/charts/charts.js`));
    const instance = echarts.getInstanceByDom(document.querySelector('[data-chart=echarts] .chart-canvas'));
    instance.dispatchAction({ type: 'legendUnSelect', name: 'Writing' });
    instance.dispatchAction({ type: 'dataZoom', start: 20, end: 80 });
    window.readChartState = () => ({ selected: instance.getOption().legend[0].selected, zoom: instance.getOption().dataZoom[0].start, width: instance.getWidth() });
    return window.readChartState();
  });
  const diagram = page.locator('[data-chart=mermaid]').first();
  const oldId = await diagram.locator('svg').getAttribute('id');
  await diagram.locator('summary').click();
  await page.getByRole('radio', { name: '深色', exact: true }).check();
  await expect(diagram.locator('svg')).not.toHaveAttribute('id', oldId);
  await expect(diagram.locator('.chart-source')).toHaveAttribute('open', '');
  await expect(page.locator('[data-chart=mermaid] svg')).toHaveCount(2);
  await expect.poll(() => page.evaluate(() => window.readChartState().selected.Writing)).toBe(false);
  expect(await page.evaluate(() => window.readChartState().zoom)).toBe(chartState.zoom);
  await page.setViewportSize({ width: 375, height: 812 });
  await expect.poll(() => page.evaluate(() => window.readChartState().width)).toBeLessThan(335);
  expect(errors).toEqual([]);
});

test('real legacy math and ordinary currency are handled separately', async ({ page }) => {
  await page.goto('/2021/03/频繁模式挖掘/');
  await expect(page.locator('.prose')).toHaveAttribute('data-math-rendered', 'true');
  expect(await page.locator('.katex').count()).toBeGreaterThan(30);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await page.goto('/2024/11/llm-超参搜索指南/');
  await expect(page.locator('.prose')).toHaveAttribute('data-math-rendered', 'true');
  expect(await page.locator('.katex').count()).toBeGreaterThan(50);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/about/');
  await page.locator('.prose').evaluate(node => node.append(document.createTextNode('Price: $20 and $30.')));
  await expect(page.locator('.prose')).toContainText('Price: $20 and $30.');
  expect(requests.some(url => url.includes('/vendor/'))).toBeFalsy();
});

for (const width of [375, 768, 1440]) {
  test(`layout stays within ${width}px and supports reading aids`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const path of ['/', '/style-guide/', '/2026/01/opencode-安装与配置/', '/2024/11/llm-超参搜索指南/', '/en/style-guide/', '/archives/', '/tags/', '/404.html']) {
      await page.goto(path);
      if (path.includes('style-guide')) await expect(page.locator('[data-ready=true]')).toHaveCount(5);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
      if (path === '/style-guide/') {
        if (width >= 1200) await expect(page.locator('.desktop-toc')).toBeVisible();
        else await expect(page.locator('.mobile-toc')).toBeVisible();
        await page.locator('.prose h3').nth(4).scrollIntoViewIfNeeded();
        await expect(page.locator('.desktop-toc [aria-current]')).toHaveCount(1);
        await expect.poll(() => page.locator('.reading-progress').evaluate(node => getComputedStyle(node).transform)).not.toBe('matrix(0, 0, 0, 1, 0, 0)');
      }
    }
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    expect(await page.locator('.skip-link').evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe('none');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  });
}

test('search and charts expose recoverable failures', async ({ page }) => {
  await page.route('**/search.json', route => route.abort());
  await page.goto('/');
  await page.locator('.search-open').click();
  await expect(page.locator('#search-status')).toContainText('搜索加载失败');
  await page.route('**/vendor/charts/**', route => route.abort());
  await page.goto('/style-guide/');
  await expect(page.locator('.chart-status').first()).toContainText('图表加载失败');
  await expect(page.locator('.chart-source').first()).toHaveAttribute('open', '');
});

test('without JavaScript, content, figures, tables, code, and sources remain readable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/style-guide/');
  await expect(page.locator('.prose')).toBeVisible();
  await expect(page.locator('.tab-panel')).toHaveCount(2);
  await expect(page.locator('.tab-panel').nth(1)).toBeVisible();
  await expect(page.locator('.chart-source').first()).toHaveAttribute('open', '');
  await expect(page.locator('.search-open')).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '归档', exact: true }).click();
  await expect(page).toHaveURL(/\/archives\/$/);
  await context.close();
});

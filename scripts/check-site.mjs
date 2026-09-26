import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const baseline = JSON.parse(await readFile('tests/fixtures/ink-baseline.json', 'utf8'));
function csv(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (char === '\n' && !quoted) { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (char !== '\r') cell += char;
  }
  const keys = rows.shift();
  return rows.map(values => Object.fromEntries(keys.map((key, index) => [key, values[index]])));
}
const content = csv(execFileSync('hugo', ['list', 'all'], { encoding: 'utf8' }));
for (const original of baseline.content) {
  const current = content.find(page => page.path === original.path);
  assert(current, `Missing content: ${original.path}`);
  for (const field of ['permalink', 'date', 'slug']) assert.equal(current[field], original[field], `${original.path}: ${field}`);
  if (current.draft === 'false') await access(`public${decodeURI(new URL(current.permalink).pathname)}index.html`);
}
for (const lang of ['', 'en/']) {
  const index = JSON.parse(await readFile(`public/${lang}search.json`, 'utf8'));
  assert(index.length > 0);
  assert(index.every(page => !page.content.includes("换行复制")), "Search indexed code controls");
  assert(index.every(page => lang ? page.url.startsWith('/en/') : !page.url.startsWith('/en/')));
  const drafts = content.filter(page => page.draft === 'true').map(page => new URL(page.permalink).pathname);
  assert(index.every(page => !/style-guide|archives/.test(page.url) && !drafts.includes(page.url)));
  const feed = await readFile(`public/${lang}index.xml`, 'utf8');
  assert(!/style-guide|<link>[^<]*\/archives\//.test(feed));
  assert(drafts.every(path => !feed.includes(path)), 'Draft found in RSS');
  const about = await readFile(`public/${lang}about/index.html`, 'utf8');
  assert(!about.includes('vendor/katex/'));
  assert(!about.includes('data-chart='));
  const post = await readFile(`public/${lang}2026/03/ha-config-as-code/index.html`, 'utf8');
  assert(post.includes(`${lang ? '' : '/en'}/2026/03/ha-config-as-code/`), 'Translation link missing');
  const guide = await readFile(`public/${lang}style-guide/index.html`, 'utf8');
  assert(!guide.includes('id=utter-container') && !guide.includes('id="utter-container"'));
}
if (process.argv.includes('--baseline')) {
  // Only the migration comparison: future posts should naturally change feeds/pagination.
  for (const [path, expected] of Object.entries(baseline.feeds)) {
    const xml = await readFile(`public/${path}`, 'utf8');
    const actual = [...xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map(match => match[1]);
    assert.deepEqual(actual, expected, `RSS changed: ${path}`);
  }
  for (const [path, expected] of Object.entries(baseline.pagination)) {
    const html = await readFile(`public/${path}`, 'utf8');
    const actual = [...html.matchAll(/<article class=(?:"post-card"|post-card)>[\s\S]*?<h2><a href=(?:"([^"]+)"|([^ >]+))/g)].map(match => match[1] || match[2]);
    assert.deepEqual(actual, expected, `Pagination changed: ${path}`);
  }
}
console.log(`Verified ${baseline.content.length} existing content paths/dates/slugs, translations, local indexes, RSS exclusions and utility pages${process.argv.includes('--baseline') ? '; Ink feed and homepage pagination match' : ''}.`);

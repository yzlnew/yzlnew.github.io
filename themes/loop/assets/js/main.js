const root = document.documentElement;
const vendor = document.body.dataset.vendorUrl;
const english = root.lang === 'en';
const announce = message => { document.querySelector('#announcement').textContent = message; };

// Theme preference is separate from the resolved light/dark scheme.
const themeOptions = [...document.querySelectorAll('input[name="theme"]')];
const media = matchMedia('(prefers-color-scheme: dark)');
function syncThemeControls(mode) {
  themeOptions.forEach(option => { option.checked = option.value === mode; });
}
syncThemeControls(root.dataset.mode || 'system');
function applyTheme(mode) {
  root.dataset.mode = mode;
  root.dataset.theme = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
  syncThemeControls(mode);
  document.dispatchEvent(new CustomEvent('loop:theme', { detail: root.dataset.theme }));
}
themeOptions.forEach(option => option.addEventListener('change', () => {
  if (!option.checked) return;
  try { localStorage.setItem('loop-theme', option.value); } catch {}
  applyTheme(option.value);
}));
media.addEventListener('change', () => { if (root.dataset.mode === 'system') applyTheme('system'); });
window.addEventListener('storage', event => {
  if (event.key === 'loop-theme') applyTheme(['light', 'dark'].includes(event.newValue) ? event.newValue : 'system');
});

// Native dialogs provide focus containment; restore the exact trigger on close.
function configureDialog(dialog) {
  let trigger;
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  // Search inputs consume Escape in some browsers; close explicitly and restore focus.
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
  });
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
  return source => { trigger = source || document.activeElement; dialog.showModal(); };
}
const searchDialog = document.querySelector('#search-dialog');
const showSearch = configureDialog(searchDialog);
const searchInput = document.querySelector('#search-input');
const searchStatus = document.querySelector('#search-status');
const results = document.querySelector('#search-results');
const normalize = value => value.normalize('NFKC').toLocaleLowerCase();
let indexPromise;
let searchRun = 0;
function getIndex() {
  if (!indexPromise) {
    indexPromise = fetch(document.body.dataset.searchUrl)
      .then(response => { if (!response.ok) throw Error(response.status); return response.json(); })
      .then(items => items.map(item => ({ ...item, haystack: normalize(`${item.title} ${item.tags.join(' ')} ${item.content}`) })))
      .catch(error => { indexPromise = undefined; throw error; });
  }
  return indexPromise;
}
function highlight(element, value, terms) {
  // Work with text nodes, never HTML from the search index or the query.
  const escaped = terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(escaped.join('|'), 'giu');
  let end = 0;
  for (const match of value.matchAll(regex)) {
    element.append(document.createTextNode(value.slice(end, match.index)));
    const mark = document.createElement('mark');
    mark.textContent = match[0];
    element.append(mark);
    end = match.index + match[0].length;
  }
  element.append(document.createTextNode(value.slice(end)));
}
async function search() {
  const run = ++searchRun;
  const terms = normalize(searchInput.value.trim()).split(/\s+/).filter(Boolean);
  results.replaceChildren();
  searchStatus.textContent = searchStatus.dataset.loading;
  try {
    const items = await getIndex();
    if (run !== searchRun) return;
    if (!terms.length) { searchStatus.textContent = searchStatus.dataset.initial; return; }
    const matches = items.filter(item => terms.every(term => item.haystack.includes(term)))
      .map(item => ({ item, score: terms.reduce((score, term) => score + (normalize(item.title).includes(term) ? 10 : 0) + (normalize(item.tags.join(' ')).includes(term) ? 5 : 0), 0) }))
      .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date));
    searchStatus.textContent = matches.length ? `${matches.length} ${searchStatus.dataset.count}` : searchStatus.dataset.empty;
    for (const { item } of matches) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.url;
      const title = document.createElement('strong');
      highlight(title, item.title, terms);
      const meta = document.createElement('small');
      meta.textContent = `${item.date} · ${item.tags.join(' / ')}`;
      const snippet = document.createElement('p');
      const content = item.content.replace(/\s+/g, ' ');
      const positions = terms.map(term => normalize(content).indexOf(term)).filter(position => position >= 0);
      const start = Math.max(0, (positions.length ? Math.min(...positions) : 0) - 40);
      highlight(snippet, `${start ? '…' : ''}${content.slice(start, start + 160)}${content.length > start + 160 ? '…' : ''}`, terms);
      a.append(title, meta, snippet); li.append(a); results.append(li);
    }
  } catch { if (run === searchRun) searchStatus.textContent = searchStatus.dataset.error; }
}
function openSearch(trigger) { showSearch(trigger); searchInput.focus(); search(); }
document.querySelector('.search-open').addEventListener('click', event => openSearch(event.currentTarget));
searchInput.addEventListener('input', search);
document.addEventListener('keydown', event => {
  const editing = event.target.closest('input, textarea, select, [contenteditable]');
  if (((event.key === '/' && !editing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) && !document.querySelector('dialog[open]')) {
    event.preventDefault(); openSearch();
  }
});
searchDialog.addEventListener('keydown', event => {
  const links = [...results.querySelectorAll('a')];
  if (!links.length) return;
  const current = links.indexOf(document.activeElement);
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const next = event.key === 'ArrowDown' ? (current + 1) % links.length : (current < 0 ? links.length - 1 : (current - 1 + links.length) % links.length);
    links[next].focus();
  } else if (event.key === 'Enter' && document.activeElement === searchInput) {
    event.preventDefault(); links[0].click();
  }
});

async function copy(text) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(text); return; } catch {}
  }
  const previous = document.activeElement;
  const field = document.createElement('textarea');
  field.value = text; field.className = 'sr-only'; document.body.append(field); field.select();
  const success = document.execCommand('copy');
  field.remove(); previous?.focus({ preventScroll: true });
  if (!success) throw Error('Clipboard unavailable');
}
// Hugo's code render hook covers fenced blocks; old indented Markdown and raw
// <pre><code> blocks need the same controls without reparsing their contents.
const plainCodeToolbar = document.querySelector('#plain-code-toolbar');
if (plainCodeToolbar) document.querySelectorAll('.prose pre').forEach(pre => {
  if (pre.closest('.code-block, .chart-block, .gist-embed')) return;
  const block = document.createElement('div');
  block.className = 'code-block';
  block.dataset.source = pre.textContent;
  const highlight = document.createElement('div');
  highlight.className = 'highlight';
  pre.before(block);
  block.append(plainCodeToolbar.content.cloneNode(true), highlight);
  highlight.append(pre);
});
document.querySelectorAll('.code-block').forEach(block => {
  const button = block.querySelector('[data-copy]');
  button.addEventListener('click', async () => {
    try {
      await copy(block.dataset.source);
      const original = button.textContent;
      button.textContent = button.dataset.copied; announce(button.dataset.copied);
      setTimeout(() => { button.textContent = original; }, 1600);
    } catch { announce(button.dataset.error); }
  });
  block.querySelector('[data-wrap]').addEventListener('click', event => {
    event.currentTarget.setAttribute('aria-pressed', block.classList.toggle('wrap'));
  });
  const scrollArea = block.querySelector('.highlight');
  if (scrollArea) { scrollArea.tabIndex = 0; scrollArea.setAttribute('aria-label', english ? 'Code; scroll horizontally' : '代码，可横向滚动'); }
});
document.querySelectorAll('.heading-anchor').forEach(anchor => anchor.addEventListener('click', async event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  try { await copy(anchor.href); announce(anchor.dataset.copied); history.replaceState(null, '', anchor.hash); }
  catch { location.hash = anchor.hash; }
}));

// Readable panels become tabs only after enhancement succeeds.
document.querySelectorAll('[data-tabs]').forEach((container, group) => {
  const panels = [...container.querySelectorAll(':scope > .tab-panel')];
  const list = document.createElement('div');
  list.className = 'tab-list'; list.setAttribute('role', 'tablist'); list.setAttribute('aria-label', container.dataset.label);
  const buttons = panels.map((panel, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = panel.dataset.title;
    button.id = `tab-${group}-${index}`; panel.id = `panel-${group}-${index}`;
    button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', button.id); panel.tabIndex = 0;
    panel.querySelector('.tab-fallback-title').hidden = true;
    button.addEventListener('click', () => activate(index));
    list.append(button); return button;
  });
  function activate(index) {
    panels.forEach((panel, n) => {
      panel.hidden = index !== n; buttons[n].setAttribute('aria-selected', index === n); buttons[n].tabIndex = index === n ? 0 : -1;
    });
    document.dispatchEvent(new Event('loop:resize'));
  }
  list.addEventListener('keydown', event => {
    const index = buttons.indexOf(document.activeElement);
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (next !== undefined) { event.preventDefault(); activate(next); buttons[next].focus(); }
  });
  container.prepend(list); activate(0);
});

const imageDialog = document.querySelector('#image-dialog');
const showImage = configureDialog(imageDialog);
document.querySelectorAll('.prose img').forEach(img => {
  img.loading = 'lazy'; img.decoding = 'async';
  if (img.closest('a, button')) return;
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'image-zoom';
  button.setAttribute('aria-label', `${english ? 'Enlarge image' : '放大图片'}${img.alt ? `: ${img.alt}` : ''}`);
  button.setAttribute('aria-haspopup', 'dialog');
  img.replaceWith(button); button.append(img);
  button.addEventListener('click', () => {
    const target = imageDialog.querySelector('img');
    target.src = img.currentSrc || img.src; target.alt = img.alt;
    imageDialog.querySelector('figcaption').textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || img.title || img.alt;
    showImage(button);
  });
});

const article = document.querySelector('.prose');
if (article) {
  const headings = [...article.querySelectorAll('h2[id], h3[id], h4[id]')];
  const links = [...document.querySelectorAll('.desktop-toc a, .mobile-toc a')];
  const bar = document.querySelector('.reading-progress');
  let scheduled = false;
  function updateReading() {
    const rect = article.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
    bar.style.transform = `scaleX(${progress})`;
    const current = headings.filter(heading => heading.getBoundingClientRect().top < 140).at(-1) || headings[0];
    for (const link of links) {
      if (current && decodeURIComponent(link.hash.slice(1)) === current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  }
  function scheduleReading() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateReading); } }
  window.addEventListener('scroll', scheduleReading, { passive: true });
  window.addEventListener('resize', scheduleReading);
  new ResizeObserver(scheduleReading).observe(article);
  updateReading();
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = src;
    script.onload = resolve; script.onerror = reject; document.head.append(script);
  });
}
if (article?.dataset.math === 'true') {
  // A single render pass, scoped to the article; code and source configurations are ignored.
  (async () => {
    try {
      await loadScript(`${vendor}katex/katex.min.js`);
      await loadScript(`${vendor}katex/contrib/auto-render.min.js`);
      window.renderMathInElement(article, {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }, { left: '$', right: '$', display: false }],
        throwOnError: false, trust: false, ignoredClasses: ['code-block', 'chart-block'],
      });
      article.dataset.mathRendered = 'true';
    } catch { announce(english ? 'Math could not load. The original notation remains readable.' : '公式加载失败，已保留原始写法。'); }
  })();
}
if (document.querySelector('[data-chart]')) {
  import(`${vendor}charts/charts.js`).then(module => module.initCharts()).catch(() => {
    document.querySelectorAll('[data-chart]').forEach(block => { block.querySelector('.chart-status').textContent = block.dataset.error; });
  });
}

const comments = document.querySelector('#utter-container');
if (comments?.dataset.repo) {
  const theme = () => root.dataset.theme === 'dark' ? comments.dataset.themeDark : comments.dataset.themeLight;
  const sync = () => comments.querySelector('iframe')?.contentWindow?.postMessage({ type: 'set-theme', theme: theme() }, 'https://utteranc.es');
  document.addEventListener('loop:theme', sync);
  const observer = new MutationObserver(() => {
    const frame = comments.querySelector('iframe');
    if (frame) { frame.addEventListener('load', sync); sync(); observer.disconnect(); }
  });
  observer.observe(comments, { childList: true, subtree: true });
  const lazy = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    lazy.disconnect();
    const script = document.createElement('script'); script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', comments.dataset.repo); script.setAttribute('issue-term', comments.dataset.issueTerm);
    script.setAttribute('theme', theme()); script.crossOrigin = 'anonymous'; script.async = true; comments.append(script);
  }, { rootMargin: '300px' });
  lazy.observe(comments);
}

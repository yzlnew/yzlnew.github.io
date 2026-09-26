// Run before CSS to avoid a flash. Retain the previous Ink preference on migration.
(() => {
  let mode = 'system';
  try { mode = localStorage.getItem('loop-theme') || localStorage.getItem('scheme') || 'system'; } catch {}
  if (!['system', 'light', 'dark'].includes(mode)) mode = 'system';
  const root = document.documentElement;
  root.dataset.mode = mode;
  root.dataset.theme = mode === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode;
  root.classList.add('js');
})();

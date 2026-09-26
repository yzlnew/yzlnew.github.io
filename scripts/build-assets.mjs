import { cp, mkdir, rm, copyFile, readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
const out = 'themes/loop/static/vendor';
// Keep unicode-range subsets: a page downloads only the glyph groups it uses.
// Versioned paths let the font files be cached without going stale after updates.
const fontOut = 'themes/loop/static/fonts/generated';
await rm(fontOut, { recursive: true, force: true });
await mkdir(fontOut, { recursive: true });
let fontCSS = '';
for (const family of ['geist', 'noto-sans-sc']) {
  const source = `node_modules/@fontsource-variable/${family}`;
  const { version } = JSON.parse(await readFile(`${source}/package.json`, 'utf8'));
  const directory = `${family}-${version}`;
  const css = await readFile(`${source}/index.css`, 'utf8');
  await mkdir(`${fontOut}/${directory}`, { recursive: true });
  const files = new Set([...css.matchAll(/url\(\.\/files\/([^)]*)\)/g)].map(match => match[1]));
  for (const file of files) await copyFile(`${source}/files/${file}`, `${fontOut}/${directory}/${file}`);
  await copyFile(`${source}/LICENSE`, `${fontOut}/${directory}/LICENSE`);
  fontCSS += css.replaceAll('./files/', `/fonts/generated/${directory}/`) + '\n';
}
await mkdir('themes/loop/assets/css/generated', { recursive: true });
await writeFile('themes/loop/assets/css/generated/fonts.css', fontCSS);
await rm(out, { recursive: true, force: true });
await mkdir(`${out}/katex`, { recursive: true });
await cp('node_modules/katex/dist', `${out}/katex`, { recursive: true });
await build({
  entryPoints: ['themes/loop/assets/js/charts.js'],
  outdir: `${out}/charts`, bundle: true, splitting: true, format: 'esm',
  minify: true, target: ['es2022'], legalComments: 'linked', chunkNames: '[name]-[hash]',
});
for (const pkg of ['echarts', 'katex', 'mermaid']) {
  await copyFile(`node_modules/${pkg}/LICENSE`, `${out}/${pkg}-LICENSE`);
}
console.log('Local chart bundles, KaTeX, fonts, and licenses prepared.');

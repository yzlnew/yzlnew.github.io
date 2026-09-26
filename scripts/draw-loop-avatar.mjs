// Original vector mark using the same torus projection as the homepage study.
// Run with `node scripts/draw-loop-avatar.mjs` after changing the geometry.
import { mkdir, writeFile } from 'node:fs/promises';

const tau = Math.PI * 2;
const tilt = 50 * Math.PI / 180;
const turn = -24 * Math.PI / 180;
function point(u, v) {
  const radius = 37 + 11 * Math.cos(v);
  const x = radius * Math.cos(u);
  const y = radius * Math.sin(u) * Math.cos(tilt) - 11 * Math.sin(v) * Math.sin(tilt);
  return `${(64 + x * Math.cos(turn) - y * Math.sin(turn)).toFixed(2)},${(64 + x * Math.sin(turn) + y * Math.cos(turn)).toFixed(2)}`;
}
function curve(fn, steps = 64) {
  return `M${Array.from({ length: steps }, (_, i) => fn(i * tau / steps)).join('L')}Z`;
}
// Surface-normal tangencies define clean outer/inner silhouettes. Draw only
// the visible half of each rib so the mark remains legible at favicon sizes.
const edge = u => Math.atan2(-Math.sin(u) * Math.sin(tilt), Math.cos(tilt));
const outline = curve(u => point(u, edge(u)), 96);
const opening = curve(u => point(u, edge(u) + Math.PI), 96);
const ribs = (count, offset = 0) => Array.from({ length: count }, (_, i) => {
  const u = (i + offset) * tau / count;
  const points = Array.from({ length: 25 }, (_, j) => point(u, edge(u) + j * Math.PI / 24));
  return `<path d="M${points.join('L')}"/>`;
}).join('\n');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="loop-symbol" viewBox="0 0 128 128" width="256" height="256" role="img" aria-label="Loop">
<style>
.loop-symbol { --symbol-ink: var(--diagram-line, #52525a); --symbol-orbit: var(--orbit, #ca8618); --symbol-face: var(--bg, #fff); --symbol-bg: var(--soft, #f5f5f5); --symbol-disc: var(--diagram-fill, #ffdda0); }
.loop-symbol .symbol-grid { fill: none; stroke: var(--symbol-ink); stroke-width: .85; stroke-linejoin: round; opacity: .65; }
.loop-symbol .symbol-fine { opacity: .35; stroke-width: .7; }
.loop-symbol .symbol-contour { fill: none; stroke: var(--symbol-ink); stroke-width: 1.3; }
.loop-symbol .symbol-orbit { fill: none; stroke: var(--symbol-orbit); stroke-width: 2.1; stroke-linecap: round; }
@media (prefers-color-scheme: dark) {
  .loop-symbol { --symbol-ink: var(--diagram-line, #a3a3aa); --symbol-orbit: var(--orbit, #f6ba45); --symbol-face: var(--bg, #101011); --symbol-bg: var(--soft, #202023); --symbol-disc: var(--diagram-fill, #674a23); }
}
@media (max-width: 48px) {
  .loop-symbol .symbol-fine { display: none; }
  .loop-symbol .symbol-grid { stroke-width: 1.9; opacity: .8; }
  .loop-symbol .symbol-contour { stroke-width: 2.1; }
  .loop-symbol .symbol-orbit { stroke-width: 3; }
}
</style>
<circle cx="64" cy="64" r="62" fill="var(--symbol-bg)"/>
<circle cx="81" cy="47" r="21" fill="var(--symbol-disc)"/>
<path d="${outline}${opening}" fill="var(--symbol-face)" fill-rule="evenodd"/>
<g class="symbol-grid symbol-fine">
${ribs(12, .5)}
</g>
<g class="symbol-grid">
${ribs(12)}
</g>
<path class="symbol-contour" d="${outline}${opening}"/>
<path class="symbol-orbit" d="${curve(u => point(u, Math.PI / 2), 96)}"/>
</svg>
`;
await mkdir('themes/loop/assets/images', { recursive: true });
await writeFile('themes/loop/assets/images/loop-avatar.svg', svg);

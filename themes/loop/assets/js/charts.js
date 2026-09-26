// This entry point is imported only on pages with charts. Each renderer is a separate local chunk.
const dark = () => document.documentElement.dataset.theme === 'dark';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function fail(block) {
  block.querySelector('.chart-status').textContent = block.dataset.error;
  block.querySelector('.chart-status').hidden = false;
  block.querySelector('.chart-source').open = true;
}
function ready(block) {
  if (!block.dataset.ready) block.querySelector('.chart-source').open = false;
  block.dataset.ready = 'true';
  block.querySelector('.chart-status').hidden = true;
}
function colors() {
  const style = getComputedStyle(document.documentElement);
  const token = name => style.getPropertyValue(`--${name}`).trim();
  return { text: token('text'), muted: token('muted'), line: token('line'), background: token('surface'),
    accent: token('accent'), soft: token('accent-soft'), link: token('link'), font: token('font-sans') };
}
// OpenAI dotcom fill/stroke pairs, with warm orange as the site's first hue.
const palette = [
  { fill: '#cc6f47', stroke: '#804126' },
  { fill: '#ffedde', stroke: '#cc6f47' },
  { fill: '#5477c4', stroke: '#2e4780' },
  { fill: '#eaf1fe', stroke: '#5477c4' },
  { fill: '#71b436', stroke: '#386411' },
  { fill: '#f0f1f2', stroke: '#767881' },
];
const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
function chartDefaults(config, echarts) {
  const c = colors();
  const series = list(config.series);
  const bars = series.some(s => s.type === 'bar' && (!s.coordinateSystem || s.coordinateSystem === 'cartesian2d'));
  const axis = value => {
    const category = value.type === 'category' || (!value.type && value.data);
    return { ...value,
      axisLine: { show: !category, ...value.axisLine, lineStyle: { width: 1.5, ...value.axisLine?.lineStyle } },
      axisTick: { show: !category, inside: false, length: 6, ...value.axisTick },
      splitLine: { show: false, ...value.splitLine },
      axisLabel: { rotate: category ? 45 : 0, fontSize: 12, ...value.axisLabel },
    };
  };
  return {
    ...config,
    color: config.color || palette.map(p => p.fill),
    ...(bars ? {
      grid: list(config.grid || {}).map(grid => ({ left: 60, right: 24, top: 52, bottom: config.dataZoom ? 112 : 76, ...grid })),
      xAxis: list(config.xAxis || {}).map(axis),
      yAxis: list(config.yAxis || {}).map(axis),
      legend: list(config.legend || (series.some(s => s.name) ? {} : [])).map(legend => ({
        left: 60, top: 0, padding: 0, icon: 'circle', itemWidth: 12, itemHeight: 12, ...legend,
        itemStyle: { borderWidth: 1.5, ...legend.itemStyle },
      })),
    } : {}),
    series: series.map((s, index) => {
      if (s.type !== 'bar') return s;
      const pair = palette[index % palette.length];
      const customPalette = list(s.color || config.color);
      const custom = s.itemStyle?.color || (customPalette.length ? customPalette[index % customPalette.length] : null);
      const stroke = typeof custom === 'string' ? echarts.color.lift(custom, -.25) : pair.stroke;
      return { barCategoryGap: '34%', barGap: '15%', barMaxWidth: 40, ...s,
        itemStyle: { borderRadius: 4, borderWidth: 1.5, borderColor: stroke, ...s.itemStyle },
        label: { show: true, position: 'outside', distance: 8, fontSize: 12, color: c.text, ...s.label },
        labelLayout: { hideOverlap: true, ...s.labelLayout },
      };
    }),
  };
}
async function initECharts(blocks) {
  if (!blocks.length) return;
  let echarts;
  try { echarts = await import('echarts'); } catch { blocks.forEach(fail); return; }
  for (const block of blocks) {
    try {
      const config = JSON.parse(block.querySelector('.chart-source code').textContent);
      if (!config || Array.isArray(config) || typeof config !== 'object') throw Error('Expected a JSON object');
      const canvas = block.querySelector('.chart-canvas');
      // Hide the no-JS placeholder before measuring, then give the empty container layout.
      canvas.style.display = 'block';
      const chart = echarts.init(canvas, dark() ? 'dark' : undefined, { renderer: 'canvas' });
      // ECharts richText tooltips avoid interpreting author strings as HTML. No eval/Function.
      const tooltips = Array.isArray(config.tooltip) ? config.tooltip : [config.tooltip || {}];
      config.tooltip = tooltips.map(tooltip => ({ ...tooltip, renderMode: 'richText', confine: true }));
      chart.setOption({ ...chartDefaults(config, echarts),
        animation: !reducedMotion.matches && config.animation !== false, aria: { enabled: true, ...config.aria } });
      function restyle() {
        const c = colors();
        const option = chart.getOption();
        const axes = key => (option[key] || []).map(() => ({ axisLabel: { color: c.text }, nameTextStyle: { color: c.text }, axisLine: { lineStyle: { color: c.text } }, axisTick: { lineStyle: { color: c.text } }, splitLine: { lineStyle: { color: c.line } } }));
        // Merge only presentation properties; legend selections, dataZoom and brush state survive.
        chart.setOption({ darkMode: dark(), backgroundColor: c.background, textStyle: { color: c.text, fontFamily: c.font },
          title: (option.title || []).map(() => ({ textStyle: { color: c.text }, subtextStyle: { color: c.muted } })),
          legend: (option.legend || []).map(() => ({ textStyle: { color: c.text }, pageTextStyle: { color: c.text } })),
          xAxis: axes('xAxis'), yAxis: axes('yAxis'),
          tooltip: { backgroundColor: c.background, borderColor: c.line, textStyle: { color: c.text } },
          dataZoom: (option.dataZoom || []).map(() => ({
            textStyle: { color: c.muted }, borderColor: c.line, backgroundColor: c.background, fillerColor: c.soft,
            handleStyle: { color: c.background, borderColor: c.link }, moveHandleStyle: { color: c.line },
            dataBackground: { lineStyle: { color: c.muted }, areaStyle: { color: c.line } },
            selectedDataBackground: { lineStyle: { color: c.link }, areaStyle: { color: c.accent } },
          })),
          series: list(config.series).map(s => s.type === 'bar' ? { label: { color: s.label?.color || c.text } } : {}),
        });
      }
      restyle(); ready(block);
      const observer = new ResizeObserver(() => { if (canvas.clientWidth) chart.resize(); });
      observer.observe(canvas);
      document.addEventListener('loop:resize', () => chart.resize());
      document.addEventListener('loop:theme', restyle);
      reducedMotion.addEventListener('change', () => chart.setOption({ animation: !reducedMotion.matches && config.animation !== false }));
    } catch { fail(block); }
  }
}
async function initMermaid(blocks) {
  if (!blocks.length) return;
  let mermaid;
  try { ({ default: mermaid } = await import('mermaid')); } catch { blocks.forEach(fail); return; }
  let rendering = false;
  let requested = false;
  let generation = 0;
  async function render() {
    requested = true;
    if (rendering) return;
    rendering = true;
    while (requested) {
      requested = false;
      const c = colors();
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'base', suppressErrorRendering: true,
        secure: ['securityLevel', 'startOnLoad', 'suppressErrorRendering', 'maxTextSize', 'secure'],
        flowchart: { htmlLabels: false, curve: 'basis' }, themeVariables: {
          darkMode: dark(), fontFamily: c.font, fontSize: '14px', background: c.background,
          primaryColor: c.soft, primaryTextColor: c.text, primaryBorderColor: c.link,
          secondaryColor: c.background, tertiaryColor: c.soft, lineColor: c.muted,
          textColor: c.text, mainBkg: c.soft, nodeBorder: c.link, edgeLabelBackground: c.background,
          actorBkg: c.soft, actorBorder: c.link, actorTextColor: c.text,
          signalColor: c.text, signalTextColor: c.text, labelBoxBkgColor: c.background,
          labelBoxBorderColor: c.line, labelTextColor: c.text, loopTextColor: c.text,
          noteBkgColor: c.soft, noteTextColor: c.text, noteBorderColor: c.link,
          activationBkgColor: c.soft, activationBorderColor: c.link,
        } });
      for (const [index, block] of blocks.entries()) {
        try {
          const { svg } = await mermaid.render(`loop-mermaid-${++generation}-${index}`, block.querySelector('.chart-source code').textContent);
          block.querySelector('.chart-canvas').innerHTML = svg;
          ready(block);
        } catch { fail(block); }
      }
    }
    rendering = false;
  }
  document.addEventListener('loop:theme', render);
  await render();
}
export async function initCharts() {
  // Canvas and SVG text metrics need the same webfonts as the surrounding prose.
  await document.fonts.ready;
  await Promise.all([
    initECharts([...document.querySelectorAll('[data-chart="echarts"]')]),
    initMermaid([...document.querySelectorAll('[data-chart="mermaid"]')]),
  ].filter(Boolean));
}

import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

export async function createRenderingFixture() {
  const temp = await mkdtemp(join(tmpdir(), 'loop-rendering-'));
  const content = join(temp, 'content');
  const destination = join(temp, 'public');
  await mkdir(join(content, 'blog', 'resource'), { recursive: true });
  async function page(name, frontmatter, body) {
    await writeFile(join(content, 'blog', name), `---\ntitle: "${name}"\ndate: "2020-01-01"\n${frontmatter}\n---\n${body}\n`);
  }
  await page('currency.md', 'url: /__fixtures/currency/\ncomments: false', '### Prices\n\nPrice: $20 and $30. This **bold text** remains Markdown.');
  await page('hidden.md', 'hidden: true\ntags: [private-test]\nurl: /__fixtures/hidden/', 'HiddenSearchSentinel');
  await page('draft.md', 'draft: true\nurl: /__fixtures/draft/', 'DraftSearchSentinel');
  await page('resource/index.md', 'url: /__fixtures/resource/\nkatex: true', String.raw`### Resource chart
{{< chart src="sample.json" title="Resource fixture" description="A single observation." height="240" >}}

{{< notice tip >}}
$x_{a_b} + y_{c_d}$ and \(\mathbb{E}_{a_b}[X]\).
{{< /notice >}}

{{< details title="Details" >}}Some **details**.{{< /details >}}

{{< mygist id="22ec96067f020c6ae976bf385ac3fa04" file="example.txt" >}}
`);
  await writeFile(join(content, 'blog/resource/sample.json'), '{"xAxis":{},"yAxis":{},"series":[{"type":"scatter","data":[[1,2]]}]}');
  await page('invalid.md', 'url: /__fixtures/invalid/', '### Invalid configuration\n\n```echarts\n{ broken JSON }\n```');
  await page('bars.md', 'url: /__fixtures/bars/', `### Authored bar styles
\`\`\`echarts
{"color":["#123456","#789abc"],"xAxis":{"type":"category","data":["A","B"]},"yAxis":{},"series":[{"type":"bar","itemStyle":{"borderRadius":0,"borderWidth":3,"borderColor":"#102030"},"label":{"show":false},"data":[2,3]},{"type":"bar","data":[4,5]}]}
\`\`\`
`);
  await page('mermaid.md', 'url: /__fixtures/mermaid/', '### Strict diagram\n\n```mermaid\n%%{init: {"securityLevel":"loose"}}%%\nflowchart LR\n A[Start] --> B[End]\n click A "javascript:window.fixtureExecuted=true"\n```');
  const config = join(temp, 'disable-comments.toml');
  await writeFile(config, '[params.utter]\nenable = false\n');
  execFileSync('hugo', ['--contentDir', content, '--destination', destination, '--config', `config.toml,${config}`, '--buildDrafts', '--quiet']);
  const read = path => readFile(join(destination, path), 'utf8');
  const index = await read('search.json');
  const feed = await read('index.xml');
  for (const source of [index, feed, await read('index.html'), await read('tags/private-test/index.html')]) {
    assert(!source.includes('HiddenSearchSentinel') && !source.includes('DraftSearchSentinel'));
    assert(!source.includes('/__fixtures/hidden/') && !source.includes('/__fixtures/draft/'));
  }
  const currency = await read('__fixtures/currency/index.html');
  assert(currency.includes('Price: $20 and $30.'));
  assert(currency.includes('<strong>bold text</strong>'));
  assert(!currency.includes('katex.min.css'));
  const resource = await read('__fixtures/resource/index.html');
  assert(resource.includes('x_{a_b} + y_{c_d}'));
  assert(resource.includes('Resource fixture'));
  assert(resource.includes('data-chart="echarts"'));
  assert(resource.includes('?file=example.txt'));
  assert(!resource.includes('id="utter-container"'), 'Global comments=false was ignored');
  return { temp, destination, read, cleanup: () => rm(temp, { recursive: true, force: true }) };
}
if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const fixture = await createRenderingFixture();
  await fixture.cleanup();
  console.log('Verified isolated Hugo rendering: currency, math passthrough, hidden/draft exclusion, page-resource charts, named Gist and disabled comments.');
}

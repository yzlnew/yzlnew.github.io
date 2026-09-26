# Loop 升级验收记录

2026-09-17 完成首次本地实现与验证；后续视觉调整与复验记录见下文。

### 内容与构建

- 使用 Hugo extended **0.161.1**、Node.js **22.22.0**、Playwright **1.58.2** 与其 Chromium **145.0.7632.6**。
- `npm ci` / `npm run build`：完整双语构建，本地生成 KaTeX、ECharts、Mermaid 及许可证，Hugo 无错误或弃用警告。
- `npm run check:site -- --baseline`：45 份原始内容记录的 URL、日期、slug 保持一致（包含 2 份草稿与中英文关于页）；40 篇中文已发布文章和 1 篇英文文章的搜索索引独立。
- 中文首页的 5 页文章列表、英文首页、两种语言首页 RSS 的条目与顺序均与 Ink 基线一致。原有关于页 RSS 条目继续保留；新增归档和展示页不进入 RSS。分页新增到博客列表和较长的标签列表。
- `ha-config-as-code` 中英文翻译互链保留；原 Ink 子模块未修改。
- `epaper-dashboard.md` 保留开始任务时的未提交内容。前后 SHA-256 均为 `995d8cfb2136f49c9443e71189dc164229243d94d645c0968510743b20b742f8`。
- `npm audit`：0 个已知漏洞。Mermaid 固定为 11.17.2，锁文件包含已修复的间接依赖。

### 浏览器与内容渲染

`npm test` 的 14 项 Chromium 测试覆盖：

- 搜索首次打开才请求索引；中文标题、标签及正文子串匹配、摘要高亮、无结果提示、加载失败、方向键与 Enter、Escape 关闭及焦点恢复。
- 代码复制不含行号、代码高亮行、长行换行、标题链接复制、图片放大与 Escape 焦点恢复、标签页键盘操作。
- 浅色／深色／系统模式持久化，以及系统配色改变时更新。
- 展示页同时加载 3 个 ECharts 图表与 2 个 Mermaid 图表；调整尺寸后重绘；主题切换后保留图例选择、缩放范围和用户展开的源配置。
- 真实文章《频繁模式挖掘》《LLM 超参搜索指南》的旧式公式渲染，无 KaTeX 错误。普通文章不请求公式或图表库。
- 375px、768px、1440px 下检查首页、双语展示页、长代码文章、公式文章、归档、标签和 404，均无整页横向溢出。检查桌面侧栏／移动折叠目录、目录当前位置、阅读进度、跳到正文链接及减少动画偏好。
- 关闭 JavaScript 后，正文、代码、表格、图注、折叠内容、所有标签页面板与图表源配置仍可阅读。
- 隔离的 Hugo 内容夹具验证：普通货币文字、notice 内复杂公式、文章资源 JSON、单独 ECharts／Mermaid 分包、无效 JSON 的失败提示，以及 Mermaid 不能通过文章指令降低严格模式。

`npm run check:rendering` 另验证构建时的草稿／隐藏内容排除（包括 `--buildDrafts`）、全站禁用评论、命名 Gist 参数和文章资源解析。夹具写入临时目录并清理，不进入 `public/`。

Utterances 保留现有仓库、issue-term 与主题配置，按需进入视口后加载，支持全站和单页关闭；没有提交真实评论。浏览器自动测试隔离外部 Gist、评论及图片请求，因此未将外部服务可用性作为测试通过的条件。

### 视觉检查

检查了以下截图，以及真实公式文章和中英文完整展示页：

| 视口 | 首页 | 正文 |
| --- | --- | --- |
| 375px | [首页](screenshots/home-375.png) | [阅读页](screenshots/reading-375.png) |
| 768px | [首页](screenshots/home-768.png) | [阅读页](screenshots/reading-768.png) |
| 1440px | [首页](screenshots/home-1440.png) | [阅读页](screenshots/reading-1440.png) |

补充：[深色图表](screenshots/charts-dark.png)、[深色代码与公式](screenshots/code-math-dark.png)。

当前浏览器覆盖为 Chromium，未单独验证 Safari、Firefox 或真实屏幕阅读器。

### 外部图片记录

抽查《LLM 超参搜索指南》、Opencode、Home Assistant、钱迹 Tasker 文章以及头像涉及的 20 个外部图片地址：17 个返回 HTTP 200（包含原头像）。`cdn.sspai.com` 的以下 3 个地址在当前运行环境发生 DNS 解析错误，无法据此判定图片已失效。它们均来自 `content/blog/tasker-with-qianji.md`，原文件和地址未改动：

- `https://cdn.sspai.com/2020/07/07/318c33c44af79e0b45e6149ecfbb2f94.png`
- `https://cdn.sspai.com/2020/07/07/5eeacad6e96ee751dfea79eaf811a94c.jpg`
- `https://cdn.sspai.com/2020/07/07/7d5cf12f2fdbe6be901a1e0c68975726.jpeg`

没有发现已确认的 HTTP 404 图片；未对全站所有历史外部资源作永久可用性承诺。

### 2026-09-25：Loop 视觉深化

参考本地 `infra-skills/openai-dotcom-viz` 的设计规格，统一近黑与白、淡粉色强调、细边框和等宽标注。首页增加原创 SVG 回环线框与阅读入口；移动端压缩页头和装饰图形。正文保持原有阅读宽度、目录与局部滚动。双语样式指南增加回环图形和字体示例。

- 字体：Geist Variable 与 Noto Sans SC Variable（Fontsource 包均锁定 5.3.0），保留 JetBrains Mono。字体与 OFL 许可证由构建脚本复制到本站，WOFF2 保留 unicode-range 分片及版本路径，不请求第三方字体 CDN。修复 `<pre><code>` 的浏览器默认字体覆盖问题。
- 使用 Chromium CDP 确认实际字体：中文标题为 Noto Sans SC 可变字体、西文为 Geist、高亮代码为 JetBrains Mono，均为 `isCustomFont: true`。Noto 的内部 family 名含 `Thin`，页面通过可变字体轴实际使用 400–550 等字重。
- 本地中文首页冷缓存测得 19 个字体请求，约 950 KiB；后续页面可复用已下载分片。相较系统字体方案增加了首访下载量，尚未测量线上网络表现。
- 图表读取 CSS 配色和字体变量；演示图表使用粉色深浅配对、带边框的圆角柱和圆形图例。文章指定的系列颜色、图例筛选与缩放状态继续保留；Mermaid 仍使用严格模式。
- `npm ci --prefer-offline`、`npm run build`、`npm run check:site`、`npm run check:rendering` 全部通过；`npm test` 15 项通过，包含新增的实际字体回归检查。安装审计为 0 个已知漏洞。
- 检查 375px、768px、1440px 与中英文页面，截图期间无页面脚本错误或本站资源 HTTP 错误。预览使用独立临时输出目录，避免影响生产构建。

截图：[浅色首页](screenshots/refined/home-light-1440.png)、[深色首页](screenshots/refined/home-dark-1440.png)、[手机首页](screenshots/refined/home-light-375.png)、[平板首页](screenshots/refined/home-light-768.png)、[英文首页](screenshots/refined/home-en.png)、[阅读页](screenshots/refined/reading-light.png)、[深色代码与公式](screenshots/refined/code-dark.png)、[深色图表](screenshots/refined/charts-dark.png)。

### 2026-09-25：回环标识

按头像重设计要求，将原黄色头像与页头循环箭头统一为倾斜环面。头像、页头及 favicon 共用矢量源文件；使用可见半面的网格、清晰的内外轮廓和粉色轨道，小尺寸隐藏辅助网格。页内随主题切换配色，独立 SVG 随系统配色切换；保留自定义头像 URL 的支持。双语样式指南补充标识示例。

已查看 16、28、36、48 像素与大尺寸的深浅色效果，确认 `/loop-avatar.svg` 返回 200。构建、站点与渲染检查通过，最终完整浏览器测试 15 项通过。首轮既有图片关闭后标签页键盘焦点用例失败一次，完整重跑通过，未修改交互实现。

[标识尺寸与配色](screenshots/avatar/avatar-study.png)、[首页](screenshots/avatar/home-light.png)、[手机深色页](screenshots/avatar/home-mobile-dark.png)、[1024px PNG](screenshots/avatar/loop-avatar-1024.png)。

### 2026-09-25：暖黄配色与顶部导航

强调色统一为偏橙的暖黄 `#f6ba45`，同时调整头像、环面轨道、链接、目录、高亮和演示图表。THE LOOP 成为最上方的导航区，四个主导航链接置于环面中央；移除原独立导航栏及“观察／实验／记录”标签。正文页使用较紧凑的导航区。

语言切换改为分段链接；配色改为太阳、月亮、屏幕三个原生单选按钮，保留键盘方向键操作、系统偏好、持久化和跨标签页同步。搜索入口合并到右上角。首页介绍区相应调整为下方的双栏布局，手机上顺序排布。

`npm run build`、`npm run check:site`、`npm run check:rendering`、`npm test` 全部通过，浏览器测试共 16 项。新增导航与翻译互链检查，扩充配色键盘操作和跨标签页同步检查；无 JavaScript 时导航仍可访问。检查 375px、768px、1440px 与中英文页面，无整页横向溢出，截图期间无脚本错误或本站资源错误。

截图：[浅色首页](screenshots/amber/home-light-1440.png)、[深色首页](screenshots/amber/home-dark-1440.png)、[手机浅色](screenshots/amber/home-light-375.png)、[手机深色](screenshots/amber/home-dark-375.png)、[英文首页](screenshots/amber/home-en.png)、[正文页](screenshots/amber/article-light.png)、[深色图表](screenshots/amber/charts-dark.png)。

### 2026-09-26：精简首页与像素导航

删除首页介绍区，包括站点大标题、简介、签名及“开始阅读／浏览归档”入口，页头之后直接显示文章列表。主导航排在回环图形下方的中央留白中，使用普通文档流保持图形完整；移除胶囊、背景和阴影，当前页面仅用暖黄色文字和下划线标记。首页列表标题承担 H1，保持阅读层级。

导航使用官方 Ark Pixel Font `2026.09.25` 的 12px Proportional 简体中文版，在 24px 尺寸显示。完整 WOFF2、来源记录、校验值及 OFL 1.1 许可证随站点保存；浏览器实际字体检查确认中英文导航均使用本地 Ark Pixel，中文正文、英文正文和代码仍分别使用 Noto Sans SC、Geist 和 JetBrains Mono。语言、主题模式及搜索入口统一为原生 SVG 方格像素图标，保留语义标签、键盘操作和无脚本导航。

`npm run build`、`npm run check:site`、`npm run check:rendering` 通过；`npm test` 16 项全部通过。检查 375px、768px、1440px、中英文及深浅色预览，无整页横向溢出、页面脚本错误或本站资源 HTTP 错误。另检查 320px 窄屏，在英文导航收紧间距后确认全部文字都在图形区域内。

截图：[浅色首页](screenshots/pixel/home-light-1440.png)、[深色首页](screenshots/pixel/home-dark-1440.png)、[手机浅色](screenshots/pixel/home-light-375.png)、[手机深色](screenshots/pixel/home-dark-375.png)、[英文手机页](screenshots/pixel/home-en-375.png)、[正文页](screenshots/pixel/article-light.png)。

后续字号微调：四项导航从 24px 缩小为 18px，下划线调整为 1px、偏移 6px，保持 40px 的点击区域。小字号下 320px 英文导航无需特殊压缩间距。构建、站点检查、渲染检查及 16 项浏览器测试通过；已查看桌面及手机预览。

[18px 桌面预览](screenshots/pixel-small/home-light-1440.png)、[手机预览](screenshots/pixel-small/home-light-375.png)、[320px 英文预览](screenshots/pixel-small/home-en-320.png)。

### 2026-09-26：提示、柱状图与旧文章控件覆盖

提示块改为上下 1px 分隔线与留白，移除加粗侧边和彩色底；折叠内容采用相同分隔线和加减号，保留原生键盘交互。首页题图移除“每一次回环，都是新的起点。”及英文对应文案。

柱状图按 `infra-skills/openai-dotcom-viz/references/design-spec.md` 调整为四角 4px 圆角、1.5px 同色系深描边、暖橙深浅配对（`#cc6f47 / #ffedde`）、圆形图例、柱顶数值、斜向分类标签和无网格坐标轴。默认配置在图表入口统一应用，行内 JSON 与文件图表均生效；保留作者显式配色、圆角和标签设置，以及筛选、缩放和主题切换状态。继续使用本站字体和现有 ECharts 交互渲染。

逐篇检查 41 篇已发布博客：16 个提示块、43 段围栏代码、5 篇公式文章（146 处公式）、65 张图片、7 张表格及 1 个 Gist。补齐《频繁模式挖掘》中 1 段旧式缩进代码的复制与换行控件，原文保持不变；没有文章使用折叠、标签页或可交互图表语法。完整清单见 [published-components.md](published-components.md)。

构建、站点与渲染检查通过，浏览器测试 17 项通过；新增实际柱形四角、描边、配色及显式配置优先级检查，扩展真实旧文章代码复制检查。41 篇文章在 1440px 与 375px 下均返回 200，无脚本错误、公式错误或整页横向溢出。

截图：[提示与折叠](screenshots/components/notices-light.png)、[浅色柱状图](screenshots/components/bars-light.png)、[深色柱状图](screenshots/components/bars-dark.png)、[手机柱状图](screenshots/components/bars-mobile.png)、[首页](screenshots/components/home-mobile.png)。

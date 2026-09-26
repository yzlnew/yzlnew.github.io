# 已发布文章控件覆盖检查

2026-09-26 检查 Hugo `list published` 中的全部 41 篇博客（40 篇中文、1 篇英文），并逐篇打开实际渲染页面，检查 1440px 与 375px 布局。草稿与隐藏的样式指南不计入已发布文章。

### 结果

- 16 个 `notice` 提示块已统一为上下细分隔线样式。
- 43 段围栏代码已有复制与换行按钮；另发现《频繁模式挖掘》的 1 段缩进代码缺少控件，已通过渐进增强补齐，保留原始内容。总计覆盖 44 段代码。
- 5 篇启用 KaTeX 的文章共渲染 146 处公式，未出现公式解析错误。
- 65 张正文图片均有放大入口；7 张表格保留局部滚动；1 个旧式 Gist shortcode 保留嵌入与直达链接。
- 已发布文章没有 `details`、`tabs`、`chart` 或 Mermaid/ECharts 围栏，因此无需改写其内容。相应控件在双语样式指南演示和验证。
- 全部文章返回 200，无页面脚本错误、遗留未增强的代码块或整页横向溢出。此轮浏览器检查隔离第三方请求，检查控件生成与布局，不重新判定外链图片、Gist 和评论服务的可用性。

### 逐篇清单

“代码”包含围栏与旧式缩进代码，“公式”按实际渲染数量计。0 表示文章本身未使用该控件。

| 文章 | 提示 | 代码 | 公式 | 图片放大 | 表格 | Gist |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [LLM「我是谁」之谜](../content/blog/identity-context-probe.md) | 0 | 2 | 0 | 5 | 1 | 0 |
| [Building My Smart Home: Home Assistant Made Easy with Claude Code](../content/blog/ha-config-as-code.en.md) | 0 | 0 | 0 | 7 | 0 | 0 |
| [打造我的「智能家」——使用 Claude Code 轻松使用 Home Assistant](../content/blog/ha-config-as-code.md) | 0 | 0 | 0 | 7 | 0 | 0 |
| [Opencode 安装与配置](../content/blog/opencode.md) | 0 | 4 | 0 | 0 | 1 | 0 |
| [LLM 超参搜索指南](../content/blog/llm-hp-search-using-mup.md) | 2 | 5 | 75 | 9 | 2 | 0 |
| [迁移到 Mac Mini](../content/blog/move-to-mac-mini.md) | 0 | 0 | 0 | 2 | 0 | 0 |
| [小猫咪的一年](../content/blog/cat-one-year.md) | 0 | 0 | 0 | 3 | 0 | 0 |
| [N5095 All in One 折腾记](../content/blog/n5095-aio.md) | 0 | 0 | 0 | 2 | 0 | 0 |
| [FLoC](../content/blog/FLoC.md) | 0 | 0 | 6 | 4 | 0 | 0 |
| [频繁模式挖掘](../content/blog/frequent-itemset-mining.md) | 5 | 1 | 52 | 1 | 1 | 0 |
| [从 heapq 到 TopK](../content/blog/heapq-topk.md) | 0 | 4 | 8 | 0 | 0 | 0 |
| [在 Vim 中输入递增的数字](../content/blog/vim-increasing-numbers.md) | 0 | 7 | 0 | 0 | 0 | 0 |
| [发现、解决、习惯，思维方式改造生活](../content/blog/thinking-2020.md) | 1 | 0 | 0 | 5 | 0 | 0 |
| [是不是应该重新开始写作了？](../content/blog/back-to-writing.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [从通知实现钱迹 Tasker 自动化记账](../content/blog/tasker-with-qianji.md) | 2 | 1 | 0 | 3 | 0 | 0 |
| [牙的冒险](../content/blog/adventure-of-teeth.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [隐秘的渴望](../content/blog/the-bad-kids.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [用 Tasker 把自己的微信变成 🤖](../content/blog/tasker-bot.md) | 0 | 1 | 0 | 5 | 0 | 0 |
| [Java 和 Python 中的时间](../content/blog/python-java-time.md) | 1 | 4 | 0 | 0 | 0 | 0 |
| [涤尘迎新](../content/blog/new-theme.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [键盘之路](../content/blog/mk-road.md) | 0 | 0 | 0 | 7 | 0 | 0 |
| [被偷走的 2020](../content/blog/ncov-2019.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [Cheer 20](../content/blog/cheer20.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [不死鸟之死](../content/blog/immortal-bird.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [Hey Jude](../content/blog/hey-jude.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [开始工作的新开始](../content/blog/new-start.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [当我 27](../content/blog/when-i-am-27.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [终章，新生](../content/blog/end-and-beginning.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [我的昨天](../content/blog/my-stories-1.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [我的 Vim 配置](../content/blog/vimrc-2019.md) | 1 | 0 | 0 | 0 | 0 | 0 |
| [实现在 Vim 的正常和插入模式下中英文输入法的自动切换](../content/blog/vim-imselect.md) | 2 | 4 | 0 | 0 | 1 | 0 |
| [记一次 rm -rf 之后](../content/blog/after-rm.md) | 0 | 1 | 0 | 0 | 0 | 0 |
| [迁移到 Hugo 上！](../content/blog/transport-to-hugo.md) | 0 | 0 | 0 | 0 | 0 | 0 |
| [Python 垃圾回收及 gc 模块](../content/blog/python-gc.md) | 0 | 1 | 0 | 1 | 0 | 0 |
| [分类器评价指标简析 - Accuracy, Precision, Recall, F1, ROC&AUC](../content/blog/ml-evaluation.md) | 1 | 0 | 5 | 1 | 1 | 0 |
| [美年健康 AI 大赛初赛小结](../content/blog/meinian.md) | 0 | 0 | 0 | 1 | 0 | 0 |
| [在 VPS 部署 TeamSpeak 语音服务器一键脚本](../content/blog/teamspeak.md) | 0 | 1 | 0 | 1 | 0 | 0 |
| [用 pandoc 让 Markdown 从 LaTeX 输出 pdf 文档](../content/blog/pandoc-chinese.md) | 0 | 1 | 0 | 0 | 0 | 0 |
| [用 duti 管理 macOS 下的默认打开程序](../content/blog/duti.md) | 1 | 4 | 0 | 0 | 0 | 0 |
| [鼠须管 Rime 主题](../content/blog/rime-theme.md) | 0 | 1 | 0 | 1 | 0 | 1 |
| [利用 TikZ 宏包在 LaTeX 中绘制流程图](../content/blog/flowchart-with-tikz.md) | 0 | 2 | 0 | 0 | 0 | 0 |

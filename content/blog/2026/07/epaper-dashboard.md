---
date: 2026-07-30
title: "给 Home Assistant 做两块电子墨水屏"
slug: epaper-dashboard
tags:
  - Home Assistant
  - ESPHome
  - E-Ink
  - Agent
draft: true
toc: true
description: 从一块黑白屏折腾到六色屏：用服务端 HTML 渲染、组件系统和 Home Assistant 做一张会自己更新的纸
---

在上一篇 [Home Assistant 的文章](/2026/03/ha-config-as-code/)里，我把电子墨水屏放在「其他亮点」里一笔带过。那时候它还是一块黑白屏，Dashboard 也只有一个固定布局。后来我又买了一块六色屏，并且顺手把渲染脚本改成了一个完整的设计系统：同一份数据，可以排成黑白或六色，可以独占整屏，也可以拼成横半屏、竖半屏和四象限。

事情到这里已经明显不再是「接块屏幕显示温湿度」了，值得单独写一篇。

![最早的黑白电子墨水屏实拍](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/device-real.jpg)

<!--more-->

### 我到底想要什么

这块屏幕放在家里之后，最常见的使用场景不是站在它面前操作，而是路过时扫一眼。所以它和墙上的 Home Assistant 平板不是一类东西：

1. **不需要交互**，时间、天气、环境和异常状态三秒内能读完就够了；
2. **不应该一直发光**，关灯以后它最好像相框或一张纸一样安静；
3. **信息不必实时**，十分钟刷新一次对于温湿度、日历和家庭状态完全够用；
4. **断网和 AI 失败也要有内容**，屏幕不能因为某个接口超时就留下一张白纸。

一开始我也走了最直觉的路：ESPHome 在设备端画线、写字、放图标。很快就会遇到中文字体、复杂排版、内存和图片处理的问题。更麻烦的是，每改一点布局都要重新编译和刷固件，调 CSS 突然变成了一件很奢侈的事情。

最后我把边界划得非常简单：**屏幕不是一台小电脑，它只是一张会自己下载 PNG 的纸。**

### 整体架构：把复杂度留在 VM

![电子墨水屏、渲染 VM 与 Home Assistant 的整体架构](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/architecture.png)

渲染服务运行在 Proxmox 里的一台常开 Linux VM 上。它通过 Home Assistant API 读取实体状态，也可以读取新闻、天气、照片和 AI 生成的文字，然后用 Jinja + HTML/CSS 在 Chromium 里生成固定的 `800×480` 截图。

截图之后还不是设备最终看到的图片。黑白屏要变成 1-bit，六色屏要量化到黑、白、红、绿、蓝、黄六种物理墨水；照片还要提前做误差扩散抖动。通过校验以后，两张 PNG 用 SSH 上传到 Home Assistant 的 `/config/www/eink/`，ESP32 再通过 `online_image` 拉取并整屏刷新。

Home Assistant 在这里同时扮演三种角色：

1. 提供温湿度、空气质量、设备状态等数据；
2. 保存 Dashboard 选择器和手动刷新按钮；
3. 作为一个很朴素的静态图片服务器。

这样做的最大好处不是「技术栈看起来更高级」，而是固件从此几乎不再变化。字体、组件、照片算法和版式都在服务端迭代，屏端只保留网络、下载和刷新逻辑。

### 两块屏，一套内容

| | 黑白屏 | 六色屏 |
|---|---|---|
| 面板 | Waveshare 7.5" v2，800×480 | Good Display GDEP073E01，800×480 |
| 主控 | ESP32-S3 DevKitC | Seeed XIAO ESP32-S3 |
| 输出 | 1-bit 黑白 | Spectra 6 六色 |
| 刷新 | 10 分钟整屏刷新 | 10 分钟整屏刷新，单次约 18 秒 |

下面不是 Figma mockup，而是固定 fixture 数据真正走过 Chromium 截图、面板量化之后的结果。左边使用黑白屏渲染源图，右边使用六色面板的真实暗淡观感预览。

![同一个 Daily Dashboard 在黑白与六色屏上的效果](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/panel-comparison.png)

代码里没有维护两套主题。组件只使用 `black / white / red / green / blue / yellow` 六个语义色：六色屏映射到物理墨水，黑白屏则把所有彩色墨水折叠成黑色。警告状态除了红色，还会同时保留文字、图标或纹理，所以颜色消失以后含义仍然成立。

### Dashboard 不是一个页面

做到第二版的时候，我发现单纯不断往首页里塞卡片会很快失控。于是把 Dashboard 分成了几种不同的信息节奏：

- **Editorial** 像一张家庭晨报，适合新闻和连续阅读；
- **Workbench** 更像技术仪表台，状态和遥测信息最密；
- **Catalogue** 用大时钟和开放式数据格展示全屋概览；
- **Timeframe** 比较安静，只留下时间、天气和需要处理的事情；
- **Modular** 是可组合的 2×2 组件系统；
- **Nothing / Gallery / Poster / Math Art** 则把整张画布交给一个主题。

![九种 Dashboard 风格的六色面板真实预览](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/dashboard-families.png)

这些页面没有统一成一种「万能卡片网格」。它们共享颜色、字体、组件和失败降级规则，但是可以有完全不同的宏观构图。我很喜欢这种感觉：同一块屏幕有时候是一张报纸，有时候是仪表台，有时候只是一幅每天变化的图片。

### 设计：像素味，不是全像素

![电子墨水屏 Dashboard 设计系统示意](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/design-system.png)

这个设计系统有几个比较强硬的规则：

1. 画布永远是 `800×480`，浏览器 `deviceScaleFactor=1`，所有关键几何落在整数像素；
2. Doto 负责时间和温度这类大数字，像素字体只负责短标题，中文正文仍然使用加粗的 Noto Sans SC；
3. 不画真正的灰色，次级区域使用点阵、排线、斜线和交叉纹理；
4. 颜色必须有语义，红色是待处理，绿色是正常，蓝色是信息，黄色用于太阳和提醒；
5. 照片先按目标区域抖动，再原像素贴进 HTML，绝不让浏览器二次缩放。

我一开始把像素字体用在了所有正文上，成品有一种「为了复古而复古」的感觉，而且中文阅读很累。后来只在标题和短标签里保留像素味，正文换回平滑字体，整体反而更像一件真实的印刷品。

### 组件如何适应四种尺寸

Modular Dashboard 使用固定的 2×2 网格。组件有四种 canonical layout：

| Layout | 占用网格 | 外框尺寸 |
|---|---:|---:|
| `full` | 2×2 | 784×464 |
| `half_horizontal` | 2×1 | 784×228 |
| `half_vertical` | 1×2 | 388×464 |
| `quadrant` | 1×1 | 388×228 |

关键不是给 `full` 加一个 `transform: scale()`，而是每种尺寸都重新决定信息层级。比如贡献图在竖半屏里会拆成两段连续周带；歌词组件在满屏显示三句精选歌词，在小尺寸保留两句；状态组件会减少行数，但始终保留异常项目。

下面的对照图覆盖目前所有标准组件。每一张图从上到下是四种 layout，左右分别是黑白和六色面板。

#### 家庭状态

![Weather 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/weather.png)

![Status 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/status.png)

![Air Quality 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/air_quality.png)

![Metric Grid 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/metric_grid.png)

#### 时间与自然

![Activity Graph 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/activity_graph.png)

![Month Calendar 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/month_calendar.png)

![Year Progress 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/year_progress.png)

![Sun Daylight 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/sun_daylight.png)

![Lunar Phase 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/lunar_phase.png)

#### 内容与个人数据

![Brief 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/brief.png)

![Todo List 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/todo_list.png)

![Market Quote 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/market_quote.png)

![Music Lyric 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/music_lyric.png)

![Codex Usage 组件四种布局与双面板对比](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/components/codex_usage.png)

组件最终可以像下面这样组合。同一套 registry 可以装成一个满屏组件、两个横半屏、两个竖半屏或四象限，也可以形成 Daily、Daylight + Music 这样的固定内容组合。

![六种 Modular Dashboard 组合示例](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/dashboard-compositions.png)

### 几个比较有意思的组件

歌词组件的数据链路可能是这里最「过度设计」的一部分。歌曲元数据和封面来自 MusicBrainz / Cover Art Archive，歌词从 LRCLIB 临时读取，然后让 Codex CLI 的 `gpt-5.6-luna` 只返回三个候选行号。程序再把行号映射回原文并做严格校验，缓存里只留下最终三句。模型不可用时会按候选顺序确定性降级，不会影响整张屏幕刷新。

Codex Usage 则只读取 app-server 的 rate limit 和 token activity summary，显示当前窗口、最近 14 天用量和连续使用天数。缓存里不保存账号标识和对话正文。这类信息其实很适合墨水屏：不用实时盯着，但是偶尔扫一眼很有用。

### 最费时间的不是把字画出来

电子墨水屏没有浏览器里习以为常的灰阶。中文细字经过抗锯齿以后，本来依赖灰色像素维持的笔画会在阈值或六色量化时直接断掉。这也是为什么这里的中文正文要求至少 `15px`、字重 `600+`，而像素字体只使用原生 `12px` 的整数倍。

另一个坑是照片。浏览器如果把一张已经抖动好的图片缩放哪怕一个像素，规则的墨点就会重新插值成灰色，随后再次量化，最后得到一团脏纹理。现在照片会先按组件的精确尺寸处理，再以原像素贴入页面，并用自动校验阻止任何亚像素坐标。

六色屏还有一个现实问题：设备文件里的纯红、纯蓝只是驱动需要接收的颜色，不等于肉眼看到的颜色。预览图因此使用另一套接近物理面板的暗淡 RGB，只给人检查构图；真正发给设备的 PNG 仍然严格限制在六个纯色桶里。

### 和 Home Assistant 接在一起

HA 首页里为两块屏分别放了一个 Dashboard selector 和一个刷新按钮，也可以选择自动轮播。后台任务每分钟检查按钮是否被按下，每十分钟读取一次选择器：渲染成功后先把 PNG 上传到 HA，再调用 ESPHome 暴露的 `Refresh Dashboard` button，让屏幕立即拉取新图。

整个过程仍然遵守一个底线：网络、新闻、照片或 AI 任意一层失败，都只能损失对应内容，不能损失这一帧。最坏情况下会回到一个只包含本地时间和基础状态的安全页面。

项目代码放在 [yzlnew/epaper-dashboard](https://github.com/yzlnew/epaper-dashboard)。渲染、组件 fixture、两块屏的 ESPHome 固件和 HA 控制脚本都在里面。

### 还准备补充

<!--
成稿前待补：
1. 六色屏和两块屏摆在一起的实拍；
2. 两套硬件 BOM、购买价格、接线与外壳来源；
3. 实际刷新速度、稳定性和一个月使用体验；
4. HA 首页电子墨水屏控制区截图；
5. 是否加入从 Pillow 旧版布局迁移到 HTML 设计系统的前后对比。
-->

这类设备的信息密度肯定比不过平板，刷新速度也不会让人产生任何「智能终端」的错觉。但它放在桌上以后很像家里自然长出来的一小块界面：不用唤醒，不会发光，也不要求你操作。对我来说，这反而是它最有意思的地方。

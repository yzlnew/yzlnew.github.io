---
date: 2026-07-30
title: "用 AI 从零制作电子墨水屏 Dashboard"
slug: epaper-dashboard
tags:
  - Home Assistant
  - ESPHome
  - E-Ink
  - Agent
draft: false
toc: true
description: 用 Codex 手搓一个复古墨水屏相框。
---

在上一篇关于我家 [Home Assistant 的文章](/2026/03/ha-config-as-code/)里，不少人似乎对这个墨水屏 Dashboard 很感兴趣。相对于一般的显示设备而言，墨水屏没有光污染、能耗低，能够比较和谐地融入家居环境中。

一开始有这个想法是在 Hacker News 上看到[一篇博客](https://hawksley.org/2026/02/17/timeframe.html)，博主介绍了给自己的家迭代智能 Dashboard 的历程。他最后是用了文石的显示屏，虽然说显示效果很好，但是也几乎是天价了。后来看到了 [TRMNL](https://trmnl.com/) 这个项目，可以说也是非常优雅的一套开源解决方案，基于 ESP32 配合廉价的低 DPI 电子墨水屏也成为了我的首选方案。

<!--more-->

### 成品和成本核算

在之前的文章中，我是用的 Seeed Studio 的 TRMNL 7.5" (OG) DIY Kit，一共花费 312.93 元，800×480 黑白显示，包括驱动主板和电池，外壳可以自行打印。不过这次我想带点「颜色」。当然随着 Coding Agent 的崛起，我们终于可以用比较低的代价实现完全个性化的软硬件。跟 Agent 一番沟通以及一些试错之后，我的硬件列表如下：

| | 黑白屏 | 六色屏 |
|---|---|---|
| 面板 | Waveshare 7.5" v2，800×480 | Good Display GDEP073E01，800×480 |
| 主控 | ESP32-S3 DevKitC | Seeed XIAO ESP32-S3 |
| 驱动板 | 自带 | GYS DEPG0730-Tboard-V01（DESPI-C73 等效） |
| 输出 | 黑白 | Spectra 6 六色 |
| 电池 | 2000 mAh | 1S 3.7V 航模电池 2000mAh |
| 价格 | 312.93 元 | 213.24(屏幕)+36(主控)+28.6(转接板)+电池(36)+相框(64.54)=378.38 元 |

同样参数的六色成品淘宝要卖 ~900 元，并且是比较依赖商家提供的软件。从一幅画的角度来看，300+ 的价格不算很离谱。最终成品如下：

![装入柚木相框的六色电子墨水屏成品](/images/blog/2026/epaper-dashboard/framed-display.jpg)

这里用的是一个柚木相框，然后用卡纸留白，看上去更「逼真」一点。相关的固件和介绍都放在 https://github.com/yzlnew/epaper-dashboard 。可以通过 Agent 直接在代码库询问和适配：

> 我准备制作一个电子墨水屏，我的硬件是：xxx，请问我应该怎么接线/帮我直接刷写固件/我需要什么其他硬件

### 如何制作

我觉得在 Agent 时代，一步步写教程告诉读者是怎么一模一样复刻变得非常没有必要。每个人都可以以比较低的代价实现完全个性化的作品。因此本文我只会提及一些想法（prompt）和目标（goal）。

首先我之前使用过 ESPHome 这个项目，也知道 ESP32。以此为基础，先从成品出发（其实也是买的套件），先通过 Coding Agent 做了一个黑白的样例。之后初步定了做彩色屏的想法，然后开始借助 AI 调研电子墨水屏的屏幕面板，了解到主要有四色和六色两种，但是前者少了蓝绿两色。后面自行去淘宝购买了面板、转接板、主板，之后让 Coding Agent 帮我写固件、教我接线和调试。读者想要自制一个类似的东西的话，可以直接和上面的代码仓库对话，聊需求、定方案，会更直接一点。

在制作过程中，一些额外需要注意的点：

1. 需要自行焊接连线，也可以直接用杜邦线，但是可能会因为太高没办法贴墙挂置。
2. 主板电池可以直接用无痕胶粘在背面，卡纸上也可以使用无痕胶帮助面板固定。
3. 卡纸的大小为显示屏的**视域**面积，比如文中这块是 160\*96，**记得不要让老板自行缩小**。

### 整体思路

搞定了终端设备，我们还需要搭建一个链路来显示和控制屏上内容。在端上做一些复杂的操作和渲染有点没必要，所以这些都放在了一个 PVE 的虚拟机中，具体如下：

![电子墨水屏 Dashboard 的整体架构](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/architecture.png)

1. VM 中执行了 Codex CLI 指令来获取摘要和个性化文本、HTML 渲染代码来出图
2. 图片会传输到 HA 的实例中
3. 电子墨水屏会定时下载目标位置的图片然后进行渲染

根据装载电池的大小或者是否接电可以调整刷新时间。同时在 HA 端，可以通过 Dashboard 和自动化触发（比如音箱在播放歌曲的时候，会自动跳转到「音乐歌词」这个 Dashboard）。

![Home Assistant 电子墨水屏控制界面](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/HA_controller.png)

### 设计美学

AI 让前端对普通人来说变得很简单，但是稍不注意就会产出一眼 AI slop 的内容。在构建这一部分风格的时候，我主要给 Agent 的输入有：

1. [Hallmark](https://github.com/Nutlope/hallmark)，一个 Anti AI Slop 设计的 Skill
2. Nothing OS 的小组件截图，让它分析里面的元素
3. TRMNL 的设计风格，让它分析和仿造设计理念和样例

总之很像一个「融梗」操作 😅。这里可以延伸讨论非常多关于 AI 训练数据、原创性、署名等等话题，不过话说回来，对于类似于「私人定制」的个人非商业项目，这是一个不错的思路：领域专家写的 skill 加上引用标杆项目先进行一番研究，指定项目规范（AGENTS.md）。


### 效果展示

同一套内容可以分别输出到黑白屏和六色屏：

![同一个 Daily Dashboard 在黑白与六色屏上的效果](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/panel-comparison.png)

目前实现的几种 Dashboard 风格：

![九种 Dashboard 风格的六色面板真实预览](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/dashboard-families.png)

设计系统和组件布局总览：

![电子墨水屏 Dashboard 设计系统示意](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/design-system.png)

![四种组件尺寸与九个组件的组合总览](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/component-layout-atlas.png)

![专用组件与混合尺寸装箱总览](https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2026/epaper-dashboard/component-mixed-atlas.png)

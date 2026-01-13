---
date: 2024-11-10
tags:
  - 家庭网络
title: 迁移到 Mac Mini

share: true
series: 
keywords: 
description: 一些迁移必备的同步工具和软件。
lastmod: 
dir: blog
toc: false
---

首发入了丐版 m4 Mac mini，一方面是手里的古早 ITX 主机基本用来打游戏，在 Windows 平台下总是没办法集中精力打字，公司配的 MacBook 业余用起来偷感很重，另一方面这个价格确实太香，I just need more compute power!

![看上去还挺像那么一回事](https://cdn.jsdelivr.net/gh/yzlnew/ImageBed/gh-pic/2024-11-12T01:25:04.jpg)

不过从工作电脑同步配置和软件还是有点麻烦的，因此也就精简了以下，只安装必要的软件。

- Obdisian：通过 Remotely Save 和 WebDAV 同步，包括可以开启实验性的 config 同步，这样可以把插件配置一并同步过来。但是毕竟是第三方插件，最好还是定期能整个 vault 做 snapshot 进行备份。
- Zotero：附件通过 WebDAV，插件通过 Tara 备份和恢复，点个赞！
- iTerm2：软件自带的导出和导入。
- zprezto：zsh 基本按照 zprezto 提供的插件，因此迁移比较方便，主题为 p10k。
- Neovim：不多说，但是好久没折腾了，平时还是 VSCode 为主了。

![](https://cdn.jsdelivr.net/gh/yzlnew/ImageBed/gh-pic/2024-11-12T01:27:57.png)

其他一些必备软件如上，荣誉提名：

- Shottr：买过 Longshot，长期用过 Snapshot。不过新装还是用这个，主要是好看，而且个人电脑对贴图需求不是很大。
- Dropover：最好用的「暂挂」软件。
- Clop：用来压缩博客图片很实用。

太好了，是 Mac mini with Apple Silicon m4 inside，我又有救了！

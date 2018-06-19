---
title: Vim 学习之路
date: 2017-12-14 15:50:11
tags: [Vim]
categories: Tools
---

学习使用 vim 可真的是一件痛苦又快乐的事。

<img src="http://o95hwznwb.bkt.clouddn.com/vim.png" width=100% />

<!-- more -->

### Why Vim?

作为一个严格意义上的~~低效率~~工具癖，尝试了很多个文字编辑器。心路历程大概是这样的。

1. 听说过 Vim 和 Emacs，但是大佬都说编辑器不是关键，所以心安理得地选择 Sublime Text。
1. Sublime Text 不是免费软件也不开源，功能上总有不符合期望的部分。转成发展不错的 VSCode。
1. 用了 VSCode，踏上了一条配置的不归路，然而问题更多了。~~可是 Vim 也不让我省心啊我靠。~~
1. 重新认识 Vim，重新使用 Vim。**真好用**。

<div class="note info"><p>不过话说回来，适合自己的还是最好的。</p></div>

跟之前所用过的文本编辑器相比，我自己体会 Vim 的优势主要是两点:

1. 速度。VSCode 相比之下有点慢，总在我的电脑上要空白 2 秒。另一方面，快捷键的使用让我的编辑效率大大提升了。
1. 定制化。Vim 虽然没有内置的插件管理工具，但是插件能够做到的事情要比其他编辑器插件多。

<div class="note danger"><p>Vim 的学习曲线极其陡峭，比 LaTeX 还陡，在攀登高峰的过程中可能因为一个个小小配置问题而发疯、抓狂，所以请谨慎前进。</p></div>

### Which Vim?

对于很多像我一样的初学者，都会对 Vim 各种版本感到困惑：终端中的 Vim、GUI Vim、各种各样的发行版（比如我用的[spf13-vim](http://vim.spf13.com/)）。他们的差别可以简单描述成：

#### Terminal Vim

1. 预装或者需要自己编译，预装的可能缺少某种语言的支持。
1. 不同 Terminal 对色彩的支持不同，可能因为不支持 24bit true color 而导致 color scheme 显示异常。

#### GUI Vim

1. 已经编译好的安装包，支持一般比较完整。
1. 已经支持 24bit true color 。
1. 非常类似于一个记事本一样的文本编辑器（没有配置前）

#### 各种发行版

1. 说白了就是各种配置文件，里面包含了一些基本设置、插件，上手就是一个很完备的文本编辑器了。
1. 里面的插件库一般比较庞大。但是 Key mappings 也不是自己熟悉的，即开即用的弊端就是对于配置文件的实现并不是很熟悉。

综上，我**推荐**并且**正在使用**的方案是：

1. macOS: iTerm2 + Vim + Solarized 主题 + FiraCode 字体。
1. Windows: gVim + Solarized 主题 + Mononoki 字体。

<div class="note danger"><p>不要在 macOS 自带的 Terminal 使用，因为不支持 true color，无论怎么样 Fallback 颜色都会有问题！</p></div>

<div class="note info"><p>关于字体，如果想要使用 Vim 的一些状态栏插件、或者使用类似 Font Awesome 之类的 Unicode 图形字符，需要选择类似上面两种一样 Patched 的字体。</p></div>

### 其他注意事项

如果在 Mac 上使用，不要用自带的 Vim，而是用 `homebrew` 自己编译安装一份。

```bash
# 安装 lua 和 python 支持的 Vim
brew install vim --with-lua --with-python --with-python3
```

之后就是要正式开始入门 Vim 了，网上有特别多的材料，导致的麻烦就是不知道看什么好。下一篇总结一下我所用到的一些材料。

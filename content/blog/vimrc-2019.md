---
date: "2019-01-28T16:59:47+08:00"
title: "我的 Vim 配置"
tags:
  - vim
draft: false
---

使用 VSCode 需要记住另一套快捷键。尝试过在 VSCode 里面使用 Vim 模式但是还是不太好用。
尤其是其自带的 EasyMotion 显示效果实在捉 🐔。

<!--more-->

之前一直使用 spf13 的 Vim 配置。现在回过头来看有这几个问题不适合我：

- 整个配置极其庞大，有很多我不需要的东西；
- 因为庞大，所以我对里面的内容和 Vim 的理解有限。

因此我打算从头根据 spf13 来配置一份自己的 `.vimrc` 。

{{< notice warning >}}
注意不要加入任何一行自己不清楚功能的代码。
{{< /notice >}}

### 最终成果

年久失修，图全挂了。

~~先上成果图，在 macOS 下显示良好。~~


~~在 gVim 下显示正常。~~


~~同样在WSL下正常（终端是 Terminus）。~~


### 安装说明

这是一份主要在 macOS 以 iTerm2 作为终端（或者 MacVim）的 Vim 配置。

在 [这里](https://github.com/yzlnew/dotfiles) 下载。

- 主题是 [Solarizd](https://ethanschoonover.com/solarized/) ，有不同实现，为了支持 True Color 选择了 [NeoSolarizd](https://github.com/icymind/NeoSolarized) 。（注意：终端、Vim、Airline 的主题最好要统一）
- 字体选择任意的 [Nerd Fonts](https://nerdfonts.com) 即可。因为用到了很多
  Unicode 字符。
- 使用 [vim-plug](https://github.com/junegunn/vim-plug) 进行插件管理。

复制 `.vimrc` 至根目录即可。~~如果有使用 MacVim 的，需要添加 `.gvimrc` 以获得正确的显示效果（并且需要从命令行启动 `mvim`，使用 `zsh` 产生的 [问题](https://github.com/b4winckler/macvim/wiki/Troubleshooting)）~~。

会自动安装 `vim-plug` 并且生成备份目录（在 `.vim/files` 下）。

### [UPDATE] 支持 Windows 的 gVim

- `$VIMRUNTIME` 设置为 `.vim` 便于管理
- 解决了乱码的问题
- 需要把`Python37.dll`的路径加入环境变量，否则类似`YCM`不能用
- 编译了`YCM`

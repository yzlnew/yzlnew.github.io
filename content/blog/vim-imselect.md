---
date: "2019-01-21T21:53:58+08:00"
title: "实现在 Vim 的正常和插入模式下中英文输入法的自动切换"
lastmod: 2021-03-10
tags:
  - vim
draft: false
---

在使用 Vim 的过程中有一点一直很头疼，就是总是要在正常和插入模式下切换输入法，因
为大多时候是不会注意自己现在是中文还是英文的输入法。

<!--more-->

需求可以描述为，在**正常模式**下，切换到英文；在**插入模式**下，切换到上一次的输入法。

直接上到目前为止（2021-03）的最佳实践，不写调研的过程了。

### 结论

| 环境           | 方案                                                                      |
|----------------|---------------------------------------------------------------------------|
| gVim/MacVim    | 自带，完美                                                                |
| Windows + nvim | [`yzlnew/smartim`](https://github.com/yzlnew/smartim)                     |
| macOS          | [`xcodebuild/fcitx-vim-osx`](https://github.com/xcodebuild/fcitx-vim-osx) |
| Linux          | [`daipeihust/im-select`](https://github.com/daipeihust/im-select)         |
| 全平台         | [`brglng/vim-im-select`](https://github.com/brglng/vim-im-select)         |

### Windows

如果是使用 gVim 就不用操心这个事。Windows 上面应该主要也是用这个。

如果使用 Neovim 的话，可以装我这个 [`yzlnew/smartim`](https://github.com/yzlnew/smartim) fork。
目前不能用于 Windows 下的 TUI 的 Vim。其实稍微改改也能兼容 macOS。

### macOS

第一个选择设置起来略复杂，后续考虑整合一下 `smartim` 使其支持 macOS。

1. 安装
   [fcitx-remote-for-osx](https://github.com/CodeFalling/fcitx-remote-for-osx)
   。提供一个 `fcitx-remote` 可以通过命令行切换输入法的指令。
2. 安装 [fcitx-vim-osx](https://github.com/CodeFalling/fcitx-vim-osx) 这个 Vim 插件。

{{< notice warning >}}
注意由于插件中用到 `InsertLeave` 动作，不支持 `CTRL-C` 退出插入模式。
另外会导致 `vimwiki` 每换行都切换输入法，几乎不可用。
{{< /notice >}}

`brglng/vim-im-select` 这个我还没测试过。

也可以使用
[`coc-imselect`](https://github.com/neoclide/coc-imselect)。

### Bonus: VScodeVim

VScode 的 Vim 模式虽然实际效果一般，但是给了比较好的输入法切换的解决方法。

1. 同样安装 [`im-select`](https://github.com/daipeihust/im-select) 这个命令行工具。
2. 再在配置文件中加上如下设定：

```json
{
  "vim.autoSwitchInputMethod.obtainIMCmd": "/usr/local/bin/im-select",
  "vim.autoSwitchInputMethod.switchIMCmd": "/usr/local/bin/im-select {im}",
  "vim.autoSwitchInputMethod.defaultIM": "com.apple.keylayout.US",
  "vim.autoSwitchInputMethod.enable": true,
}
```

### 更新


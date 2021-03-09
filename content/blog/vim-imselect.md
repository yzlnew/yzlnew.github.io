---
date: "2019-01-21T21:53:58+08:00"
title: "实现在 Vim 的正常和插入模式下中英文输入法的自动切换"
tags:
  - vim
draft: false
---

在使用 Vim 的过程中有一点一直很头疼，就是总是要在正常和插入模式下切换输入法，因
为大多时候是不会注意自己现在是中文还是英文的输入法。

<!--more-->

{{< notice info >}}
需求：在正常模式下，切换到英文；在插入模式下，切换到上一次的输入法。
{{< /notice >}}

直接上到目前为止（2019-01）的最佳实践，不写调研的过程了。( **更新** ：现在不是了）

### Terminal Vim on Mac

1. 安装
   [fcitx-remote-for-osx](https://github.com/CodeFalling/fcitx-remote-for-osx)
   。提供一个 `fcitx-remote` 可以通过命令行切换输入法的指令。
2. 安装 [fcitx-vim-osx](https://github.com/CodeFalling/fcitx-vim-osx) 这个 Vim 插件。

{{< notice info >}}
注意由于插件中用到 `InsertLeave` 动作，不支持 `CTRL-C` 退出插入模式。
{{< /notice >}}

### VScode with Vim mode

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

在 `MacOS` 用以上方法会导致 `vimwiki` 每换行都切换输入法，几乎不可用。

如果仅仅在 `MacOS` 使用，建议使用
[`coc-imselect`](https://github.com/neoclide/coc-imselect)。

---
title: 用 duti 管理 macOS 下的默认打开程序
date: 2017-09-25 18:52:54
tags:
    - mac
    - utils
---

`macOS`下管理文件的默认打开程序不是很方便，不过有了`duti`就可以通过配置文件来更改默认打开程序了。

<!--more-->

### 安装`duti`

通过`homebrew`安装

```bash
brew update
brew install duti
```

### 生成配置文件

`duti`支持通过`.duti`或`plist`或命令的方式设置，用`.duti`配置文件比较直接，也便于保存。具体用法可以参照`man duti`。

```bash
touch .duti
```

### 填写配置文件

在`.duti`中输入以下内容。分别表示设置`IINA`打开所有影片，使用`Sublime Text 3`打开所有纯文本文件（如`.txt`结尾的文件），使用`Sublime Text 3`打开所有扩展名为`yml`的文件。

值得注意的是，`duti`支持扩展名也支持所谓的`UTI`（Uniform Type Identifiers），是开发者用来分类数据的。`macOS`支持的`UTL`类型可以参照[这儿](https://developer.apple.com/library/content/documentation/Miscellaneous/Reference/UTIRef/Articles/System-DeclaredUniformTypeIdentifiers.html)。

```
com.colliderli.iina    public.movie       all
com.sublimetext.3      public.plain-text  all
com.sublimetext.3      yml                all
```

{{< notice info >}}
如果不清楚某个文件的类型，可以通过 <code>mdls</code> 命令查看。 如果不清楚某个应用的包名，可以通过 <code>osascript -e 'id of app "AppName"</code> 查看。
{{< /notice >}}

### 载入配置文件

```bash
duti .duti
```

All set！试试看效果吧～

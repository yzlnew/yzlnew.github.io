---
title: 用 pandoc 让 Markdown 从 LaTeX 输出 pdf 文档
date: 2017-10-12 17:42:44
---

听着名字就很绕，主要需求来源是用 Markdown 写一些简单的作业、提交的文档比较快，可是一些编辑器输出 pdf 比较难看（主要是字体无法自定义）或者是收费的，但是 pandoc 可以通过调用 XeLaTeX 解决这个问题。

<!--more-->

### 所需环境

pandoc 和 LaTeX 是必须的，本文是在 macOS 下，其他系统同理。

以及一些必要的字体。

### 命令行

```bash
pandoc test.md -o test.pdf --latex-engine=xelatex -V CJKmainfont:SourceHanSerifCN-Regular -V CJKoptions:BoldFont=SourceHanSansCN-Medium,ItalicFont=STKaiti
```

* `--latex-engine=xelatex`：选定`xelatex`作为引擎。
* `-V CJKmainfont:SourceHanSerifCN-Regular`：设置正文字体，在字体册里可以查看字体名，这里是思源宋体。
* `-V CJKoptions:BoldFont=SourceHanSansCN-Medium,ItalicFont=STKaiti`：设置粗体和斜体，一般建议中文粗体用黑体，斜体用楷体。

### 其他要说的

* pandoc 实际上是用了一个默认的 LaTeX 模版，这个模版可以通过`pandoc -D latex`看到。
* `-V`或者`-M`参数都可以改变这个模版的参数值，具体可以通过 [pandoc](https://pandoc.org/MANUAL.html) 文档查到。
* 可以向[这个答案](https://tex.stackexchange.com/questions/341809/pandoc-does-not-recognize-chinese-characters})一样写成模版，如果不常改变字体设置的话。
* [这个链接](http://www.bagualu.net/wordpress/archives/5396)很有用。
* 成果还是不怎么好看，所以我开始质问自己为什么不直接用LaTeX，🙄️。

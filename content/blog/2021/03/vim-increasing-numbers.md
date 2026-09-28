---
date: 2021-03-16
lastmod:
title: 在 Vim 中输入递增的数字
tags:
  - vim
draft: false
toc: true
description:
---

整理几种在 vim 中生成一连串递增数字的方法，在写一写测试样例的时候比较有用。

### 使用 put

在第 `[line]` 行放置 `[x]` 寄存器中的内容：

```vimscript
:[line]put [x]
```

稍作修改，`[x]` 可以替换为表达式 `=range(1,3)`，因为动作都是 `linewise` 的，所以可以得到

```
1
2
3
```

同样可以写成循环或者 `map` 来生成更灵活的文本。

```
:put =map(range(1,3), 'printf(''%03d'', v:val)')
:for i in range(1,3) | put ='000'.i | endfor
```

这两者都会生成

```
0001
0002
0003
```

### 使用 `g<C-a>`

这个 Vim 8 新加入的可视模式的快捷键，可以 `:help new-items-8` 来查看说明。

简单来说，可以把选中的文本的每行第一个数字都加 1。

比如用 `V` 行选择下面三行代码，并按下 `g<C-a>`：

```cpp {hl_lines=["1-3"]}
TreeNode *n0 = new TreeNode(0)
TreeNode *n0 = new TreeNode(0)
TreeNode *n0 = new TreeNode(0)
```

可以得到：

```cpp
TreeNode *n1 = new TreeNode(0)
TreeNode *n2 = new TreeNode(0)
TreeNode *n3 = new TreeNode(0)
```

当然如果想改变后面的数字的值，使用 `<C-v>` 进行块选择即可。

### 使用替换[^1]

使用寄存器保存数字，并且每次替换之后 +1。下面的命令可以把所有的 `abc` 按照出现的顺序替换为 `xyz_N`。

```vimscript
:let @a=1 | %s/abc/\='xyz_'.(@a+setreg('a',@a+1))/g
```

[^1]: 参考 https://vim.fandom.com/wiki/Making_a_list_of_numbers

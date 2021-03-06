---
title: Python 垃圾回收及 gc 模块
date: 2018-06-19 15:35:17
tags:
    - python
---

本文简单描述了 Python 3.6 的垃圾回收机制。

<!--more-->

翻译整理自原文[Garbage collection in Python: things you need to know](https://rushter.com/blog/python-garbage-collector/)

### Python 垃圾回收机制

标准的 CPython 垃圾回收机制有两个组成部分：引用计数和 gc 模块。

- 引用计数回收直接、高效，但是不能处理循环引用；Python 用 gc 模块来处理循环引用
- 引用计数不能被禁用，gc 可选

### 引用计数

引用计数的思想很简单，当一个对象没有引用的时候就会被释放。

我们知道所有的 Python 变量都是指向对象的一个引用。记录下每一个对象的引用数量，随着引用的创建或删除增减。

比如，下列情况下引用数会增加：

- 赋值运算
- 传参
- 列表中加入对象

当引用计数为0的时候，CPython 就会自动调用对象的析构函数。当这个对象里有其他对象的引用，他们的引用计数也会减少。

### gc 模块

gc 模块用来处理循环引用。

`del` 删除了对于对象的引用（指针，箭头），但是它们互相的引用还存在，所以不会被引用计数机制回收。

![gc](https://ws2.sinaimg.cn/large/006tNc79ly1fsgiegex7jj30ad05j0st.jpg)

虽然有了垃圾回收机制，还是可能导致内存泄漏。可以用 gc 和 objgraph 来定位内存泄漏。

### 常用的 gc 函数

```python
    gc.disable()        # 禁用自动垃圾回收.
    gc.collect()        # 执行一次完整的垃圾回收
    gc.set_threshold()  # 设置垃圾回收的阈值
    gc.set_debug()      # 设置垃圾回收的调试标记
```

### 延伸阅读

- [http://www.wklken.me/posts/2015/09/29/python-source-gc.html](http://www.wklken.me/posts/2015/09/29/python-source-gc.html)
- [https://www.jianshu.com/p/1e375fb40506](https://www.jianshu.com/p/1e375fb40506)

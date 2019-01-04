---
title: 利用 TikZ 宏包在 LaTeX 中绘制流程图
date: 2016-06-22 09:37:35
tags:
---

本来打算把在毕设过程中零零碎碎学到或者用到的东西记录下来，没想到还是太懒，到最后就忘记要写什么了。由于在毕设论文中用到了流程图，就在网上找了找用 LaTeX 画流程图的方法，这里简单分享下。

<!--more-->

### 来源

[TeXample](http://www.texample.net/) 上给出了两种流程图的画法：

- [Easy-maintenance flowchart](http://www.texample.net/tikz/examples/flexible-flow-chart/)
- [Simple flow chart](http://www.texample.net/tikz/examples/simple-flow-chart/)

第一种比较好看，也比较容易维护，当然是用它了。

### 所需宏包

在导言区加入以下代码：

```tex
\usepackage{tikz}
\usetikzlibrary{shapes,arrows,chains}
\usepackage{xcolor}
```

### 最终效果和代码

![flowchart](https://ws4.sinaimg.cn/large/006tNc79ly1fytoxi0567j30ha0kt0u0.jpg)

```tex
% 设置颜色代号
\colorlet{lcfree}{green}
\colorlet{lcnorm}{blue}
\colorlet{lccong}{red}
% -------------------------------------------------
% 设置调试标志层
\pgfdeclarelayer{marx}
\pgfsetlayers{main,marx}
% 标记坐标点的宏定义。交换下面两个定义关闭。
\providecommand{\cmark}[2][]{%
  \begin{pgfonlayer}{marx}
    \node [nmark] at (c#2#1) {#2};
  \end{pgfonlayer}{marx}
  } 
\providecommand{\cmark}[2][]{\relax} 
% -------------------------------------------------
% 开始绘图
\begin{figure}[H]
	\centering
	\scalebox{.8}{				%设置缩放	
\begin{tikzpicture}[
    >=triangle 60,              % 箭头的形状
    start chain=going below,    % 从上往下的流程
    node distance=6mm and 60mm, % 全局间距设置
    every join/.style={norm},   % 连接线的默认设置
    ]
% ------------------------------------------------- 
% 节点的样式定义 
% <on chain> 和 <on grid> 可以减少手动调整节点位置的麻烦
\tikzset{
  base/.style={draw, on chain, on grid, align=center, minimum height=4ex},
  proc/.style={base, rectangle, text width=8em},
  test/.style={base, diamond, aspect=2, text width=5em},
  term/.style={proc, rounded corners},
  % coord 用来表示连接线的转折点
  coord/.style={coordinate, on chain, on grid, node distance=6mm and 25mm},
  % nmark 用来表示调试标志
  nmark/.style={draw, cyan, circle, font={\sffamily\bfseries}},
  % -------------------------------------------------
  % 不同的连接线样式
  norm/.style={->, draw, lcnorm},
  free/.style={->, draw, lcfree},
  cong/.style={->, draw, lccong},
  it/.style={font={\small\itshape}}
}
% -------------------------------------------------
% 先放节点
\node [term, densely dotted,fill=lccong!25, it] (p0) {输入};
% 用 join 表示和上一个节点相连 
\node [proc, join]	{使用非线性最小二乘法得到 $X_0$};
\node [proc, join]	{记录 $X=X_0, f=f(X_0)$};
\node [test, join] (t1)	{$T>T_E$?};
\node [proc] (p1)		{$step=0$};
\node [test, join] (t2)	{$step<count$?};
\node [proc] (p2)		{得到新状态$P_N=P+scale\times rand$,计算目标函数差$\Delta f$};
\node [test, join] (t3)	{$F_{Accept}<rand$?};
\node [proc] (p3)		{记录新状态 $X=X_N,f=f(X_N)$};

\node [proc, left=of t1] (p4)	{$T=T\times a,scale=scale\times b$};
\node [term, densely dotted, right=of t1,fill=lcfree!25](p5)	{输出};
\node [proc, right=of t3](p6)	{$step++$};

\node [coord, left=of t2] (c1)  {}; 
\node [coord, right=of t2] (c2)  {}; 
\node [coord, right=of p3] (c3)  {}; 
%先画南北方向的连接线，先画线再画两端的标志和箭头
\path (t1.south) to node [near start, xshift=1em] {$y$} (p1);
  \draw [*->,lcnorm] (t1.south) -- (p1);
\path (t2.south) to node [near start, xshift=1em] {$y$} (p2);
  \draw [*->,lcnorm] (t2.south) -- (p2);
\path (t3.south) to node [near start, xshift=1em] {$y$} (p3);
  \draw [*->,lcnorm] (t3.south) -- (p3);
%接着画东西方向的连接线，方法同上
\path (t1.east) to node [near start, yshift=1em]  {$n$}(p5);
  \draw [o->,lcnorm] (t1.east) -- (p5);
  \draw [->,lcnorm] (p4.east) -- (t1);
\path (t3.east) to node [near start, yshift=1em]  {$n$}(p6);
  \draw [o->,lcnorm] (t3.east) -- (p6);
\path (t2.west) to node [near start, yshift=1em]  {$n$}(c1);
  \draw [o->,lcnorm] (t2.west) -- (c1) -| (p4);
  \draw [->,lcnorm] (p3.east) -- (c3) -| (p6.south);
  \draw [<-,lcnorm] (t2.east) -- (c2) -| (p6.north);
  \end{tikzpicture}
}
\label{fig:algorithm}
\end{figure}
```
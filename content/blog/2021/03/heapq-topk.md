---
date: 2021-03-16
lastmod:
title: "从 heapq 到 TopK"
tags:
  - 算法
  - python
draft: false
toc: true
description:
katex: true
---

最近在看 Python3 Cookbook，还挺有趣的。

### `Heapq` 寻找最小/最大元素

其中 1.4 节提到了一个问题「查找最大或最小的 N 个元素」，用到了内置的 `heapq` 模块的两个函数 `nlargest()` 和 `nsmallest()` 。本质上是利用了最小/最大堆，从堆顶得到堆里面最小/最大的元素。

查看 `CPython` 源码，`nsmallest()` 一段典型的实现是这样的：

```python
if key is None:
    it = iter(iterable)
    # put the range(n) first so that zip() doesn't
    # consume one too many elements from the iterator
    result = [(elem, i) for i, elem in zip(range(n), it)]
    if not result:
        return result
    _heapify_max(result)
    top = result[0][0]
    order = n
    _heapreplace = _heapreplace_max
    for elem in it:
        if elem < top:
            _heapreplace(result, (elem, order))
            top, _order = result[0]
            order += 1
    result.sort()
    return [elem for (elem, order) in result]
```

这里考虑没有 `key` 参数的时候的普遍情况。

1. `_heapify_max` 通过一个 `in-place` 的方法把包含前 k 个元素和序号的元组列表 `result` 最大堆化。
2. `_heapreplace` 是最大堆上 `heappop + heappush` 。对所有的元素循环，如果元素比堆顶小，那么堆顶不配在结果里面，把堆顶弹出，然后新元素的元组加进去。
3. 最后对 k 个元素排序，就可以输出。

另外在代码的注释里面，还给出了各个步骤进行比较的次数。

```python
# Step   Comparisons                  Action
# ----   --------------------------   ---------------------------
#  1     1.66 * k                     heapify the first k-inputs
#  2     n - k                        compare remaining elements to top of heap
#  3     k * (1 + lg2(k)) * ln(n/k)   replace the topmost value on the heap
#  4     k * lg2(k) - (k/2)           final sort of the k most extreme values
```

#### 建堆

首先第一步建堆，一个 `bottom up` 的建堆过程可以描述为：

```python
# heapify(x)
def heapify(x):
    for i = reversed(range(len(x)//2)):
        _siftup(x,i)
```

其中 `_siftup` 即为《算法导论》中提到的 `MIN-HEAPIFY` 操作，目的是保持堆的性质，使得以 `i` 为根的堆满足最小堆的性质。因为大于循环范围的结点都是叶子节点，已经满足堆性质。

这里如果仔细读了 `_siftup` 源码及注释可以发现，实际实现和书上的方法不太一样：

1. `MIN-HEAPIFY` 在大多书上会在当前节点满足小于两个子节点就继续循环
2. `_siftup` 会把当前子树的值最小的节点上浮

为什么这么做，主要原因是 `heappop` 也用到了这个内部函数，而当 `pop` 再调整的时候，最末的节点会移动到堆顶，这个值一般都要比两个子节点大，因此并不能提前终止循环。而对于这个过程中，因为节点的值可能是元组，比较操作的代价比较昂贵，用后面的方法可以有效减少 `heappop` 比较的次数。

#### 复杂度

堆调整的复杂度可以通过以下方法分析得到：

$$T(k) \le T(2k/3) + \Theta(1)$$

其中 $2n/3$ 是最坏情况，及底层恰好半满的时候，递归调用该子树时最大的节点数量。最后可以得到调整的复杂度为 $O(\lg n) = O(h)$。

另外，建堆的复杂度，按照 `MIN-HEAPIFY` 的方法，在高度 `h` 上（高度定义为从本节点到叶子节点的最长简单下降路径的边的数量），最多有 $\lceil \frac{k}{2^{h+1}} \rceil$ 个节点，那么可以计算总复杂度为

$$\sum_{h=0}^{\lfloor\lg k\rfloor}\left[\frac{k}{2^{h+1}}\right\rceil O(h)=O\left(k \sum_{h=0}^{\lfloor\lg k\rfloor} \frac{h}{2^{h}}\right) = O(k)$$

同时看到源码注释里面给出的是 `1.66*k` 的比较次数。

整体的复杂度就是 $O(n\lg k)$。

### 快速选择算法

有没有更快的算法呢？有的。类似于快速排序的快速选择算法。

主要采用了快排的切分的操作，但是只迭代符合要求的一侧元素，以下是一个比较简答的 Python 实现。

```python
class Solution:
    def getLeastNumbers(self, data: list, k: int) -> list:
        if (k==0 or len(data)==0): return []
        return self.quick_select(data, 0, len(data)-1, k-1)

    def quick_select(self, nums: list, lo: int, hi: int, pos: int) -> list:
        j = self.partition(nums, lo, hi)
        if (j==pos): return list(nums[:j+1])
        if (j<pos): return self.quick_select(nums, j+1, hi, pos)
        if (j>pos): return self.quick_select(nums, lo, j-1, pos)

    def partition(self, nums, lo: int, hi: int) -> int:
        pivot = nums[lo]
        i, j = lo, hi+1
        while(True):
            while(True):
                i += 1
                if (i > hi or nums[i] >= pivot):
                    break
            while(True):
                j -= 1
                if (j < lo or nums[j] <= pivot):
                    break
            if(i >= j): break
            nums[i], nums[j] = nums[j], nums[i]
        nums[lo], nums[j] = nums[j], nums[lo]
        return j

    def partition1(self, nums, lo: int, hi: int) -> int:
        pivot = nums[lo]
        i, j = lo+1, hi
        while(True):
            while(i <= j and nums[i] <= pivot):
                i += 1
            while(i <= j and nums[j] >= pivot):
                j -= 1
            if(i >= j): break
            nums[i], nums[j] = nums[j], nums[i]
        nums[lo], nums[j] = nums[j], nums[lo]
        return j

    def partition2(self, nums, lo: int, hi: int) -> int:
        pivot = nums[hi]
        store_idx = lo
        for i in range(lo,hi):
            if nums[i] <= pivot:
                nums[store_idx], nums[i] = nums[i], nums[store_idx]
                store_idx += 1
        nums[hi], nums[store_idx] = nums[store_idx], nums[hi]
        return store_idx
```

因为每次平均只需要遍历之前数组长度的一半，因此平均复杂度为 $O(n)$，当然最坏的复杂度还是 $O(n^2)$，关键还是看基准值的选择。因此针对此算法的优化变体基本上围绕基准值的选择，比如随机、 [BFPRT](https://en.wikipedia.org/wiki/Median_of_medians) 。

另外还有一些并行的方法，比如[这篇论文](https://www.doc.ic.ac.uk/~hlgr/pdfs/MassivelyParallelTopK.pdf) 。

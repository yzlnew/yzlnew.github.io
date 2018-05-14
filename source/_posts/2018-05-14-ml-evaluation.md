---
title: 分类器评价指标简析 - Accuracy, Precision, Recall, F1, ROC&AUC
tags: []
date: 2018-05-14 17:18:11
categories:
    - 机器学习
---

在机器学习的模型评估中，选择合适的评价指标很重要。对于回归问题，常常使用一些损失函数，这在各个线上比赛、sklearn 的文档里都能看到。而对于分类或者标注问题，几种常见的指标比较容易混淆，这里简单总结一下。

<!-- more -->

### 二分类的预测情况

 || 预测为正类 | 预测为负类
-----------| ------------ | -------------
实际为正类 | True Positive | False Negative
实际为负类 | False Positive | True Negative

记忆很简单，前面表示预测是正确（True）的还是错误（False）的，后面表示预测的是正类（Positive）还是负类（Negative），跟英文两组词的原意一致。

### 准确率、精确率、召回率和 F1

- 准确率 Accuracy 即预测正确的样本数占总样本数之比，也就是 0-1 损失函数在测试集上的准确率
- 精确率 Precision 和召回 Recall，对应上表来说，分子都是 TP
  - Precision 是检索出相关文档数与检索出的文档总数的比率，衡量的是检索系统的**查准率**。对于二分类公式如下，即**第一列**中 TP 的占比，预测为正的样本中预测正确的占比。

  $$P = \frac{TP}{TP+FP}$$

  - Recall 是指检索出的相关文档数和文档库中所有的相关文档数的比率，衡量的是检索系统的**查全率**。对于二分类公式如下，即**第一行**中 TP 的占比，实际正类中预测正确的占比。

  $$R = \frac{TP}{TP+FN}$$

  - F-Measure 是两者的加权调和平均，F1 即 alpha = 1

  $$F = \frac{(\alpha^2+1)P\cdot R}{\alpha^2(P+R)}$$

  很显然一个好的分类器要最大化 P 和 R，但是两者有不可调和的矛盾时，F1 可以作为一个整体的指标。

  然而这几个指标的局限也在于，并不关心分类器在负类上的表现（TN 没有出现过）。所以引出了 ROC 曲线和 AUC。

  ### ROC 曲线和 AUC

  #### TPR 和 FPR

  - 真阳性率 True Positive Rate，在二分类下和 Recall 含义一致，表示**第一行**中的 TP 占比，表示所有正类中预测正确的比例

  $$TPR = \frac{TP}{TP+FN}$$

  - 假阳性率 False Positive Rate，弥补了前面指标对于 TN 关注不周的局限，即**第二行**的 FP 占比，表示所有负类中预测错误的比例

  $$FPR = \frac{FP}{FP+TN}$$

  #### ROC 曲线

  由上面的两个指标，就能衡量分类器在正类和负类上的表现。而且 TPR 越大越好，FPR 越小越好。ROC（Receiver Operating Characteristic） 曲线就是用来表示两者在阈值变化的情况下的取值变化。

  ![](http://o9gmysn8m.bkt.clouddn.com/20180514152630028191819.png)

  理解 ROC 曲线其实关键在于曲线是通过遍历所有的阈值得到的。而曲线越靠近左上角，分类器的整体性能越好。但是毕竟是不同的曲线，需要人为判定，为了方便机器判断，引入 AUC。

  #### AUC

  AUC 即 Area Under Curve，即 ROC 曲线和 x 轴围成的面积，AUC 越大分类器效果越好。

  - AUC = 1，是完美分类器，采用这个预测模型时，不管设定什么阈值都能得出完美预测。绝大多数预测的场合，不存在完美分类器。
  - 0.5 < AUC < 1，优于随机猜测。这个分类器（模型）妥善设定阈值的话，能有预测价值。
  - AUC = 0.5，跟随机猜测一样（例：丢铜板），模型没有预测价值。
  - AUC < 0.5，比随机猜测还差；但只要总是反预测而行，就优于随机猜测。

<div class="note info"><p>AUC 的物理意义：假设分类器的输出是样本属于正类的 socre（置信度），则 AUC 的物理意义为，任取一对（正、负）样本，正样本的 score 大于负样本的 score 的概率。</p></div> 

  参考资料：

  1. 《统计学习方法》，李航
  2. [http://www.cnblogs.com/maybe2030/p/5375175.html](http://www.cnblogs.com/maybe2030/p/5375175.html)
  3. [https://zh.wikipedia.org/zh/ROC曲线](https://zh.wikipedia.org/zh/ROC%E6%9B%B2%E7%BA%BF)
  4. [https://blog.argcv.com/articles/1036.c](https://blog.argcv.com/articles/1036.c)
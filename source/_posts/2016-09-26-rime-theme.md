---
title: Material Design 配色的鼠须管 RIME 主题
date: 2016-09-26 18:35:59
tags:
---
因为搜狗输入法在更新了 macOS 之后切换有点卡，再加上之前的皮肤不知道怎么的就被搜狗更新覆盖了。所以就找出鼠须管用吧。偶然发现皮肤还是挺好配的。

<!-- more -->

### 最终效果

![Rime](http://o9gmysn8m.bkt.clouddn.com/2016-09-26-Rime.jpg)

### 说明

* 配置文件里还有两个我觉得比较好看的主题。一个是`Liang Hai`的[`Apathy`](https://zhuanlan.zhihu.com/p/19599206)，另一个是`hotoo`的[`Pithy`](https://github.com/hotoo/rime)。不难发现我就是照着后者改的，😄。
* 想要自定义颜色，直接上[MD官网](https://material.google.com/style/color.html)上找吧。值得注意的是，这里的颜色都是BGR排列的（不知道为什么）。

### 更改`suqirrel.custom.yaml`如下

```yaml
patch:
  show_notifications_when: never
  
  style:
    color_scheme: material

  preset_color_schemes:

    apathy:
   
      name: "冷漠 / Apathy"
      author: "LIANG Hai"

      horizontal: true  # 水平排列
      inline_preedit: true #单行显示，false双行显示
      candidate_format: "%c\u2005%@\u2005"  # 用 1/6 em 空格 U+2005 来控制编号 %c 和候选词 %@ 前后的空间。

      corner_radius: 2  #候选条圆角
      border_height: 0 
      border_width: 0
      back_color: 0xFFFFFF  #候选条背景色
      font_face: "PingFang SC,H-SiuNiu"  #候选词字体
      font_point: 16  #候选字词大小
      text_color: 0x424242  #高亮选中词颜色
      label_font_face: "PingFang SC Light"   #候选词编号字体
      label_font_point: 12   #候选编号大小
      hilited_candidate_text_color: 0xEE6E00  #候选文字颜色
      hilited_candidate_back_color: 0xFFFFFF  #候选文字背景色
      hilited_candidate_back_color: 0xFFF0E4  #候选文字背景色
      comment_text_color: 0x999999  #拼音等提示文字颜色

    pithy:
      name: "简洁 / Pithy"
      author: "@hotoo"

      horizontal: false                                 # 水平排列
      inline_preedit: true                              # true: 单行显示，false: 双行显示
      candidate_format: "\u2005%c\u2005%@\u2005"        # 用 1/6 em 空格 U+2005 来控制编号 %c 和候选词 %@ 前后的空间。

      corner_radius: 0                                  # 候选条圆角
      border_height: 2                                  # 窗口边界高度，大于圆角半径才生效
      border_width: 2                                   # 窗口边界宽度，大于圆角半径才生效
      back_color: 0xFFFFFF                              # 候选条背景色
      border_color: 0xE0B693                            # 边框色
      font_face: "PingFangSC-Regular, H-SiuNiu"         # 候选词字体
      font_point: 19                                    # 候选字词大小
      text_color: 0x424242                              # 高亮选中词颜色
      label_font_face: "SimHei"                         # 候选词编号字体
      label_font_point: 18                              # 候选编号大小
      label_color: 0x9e9e9e                             # 预选栏编号颜色
      candidate_text_color: 0x000000                    # 预选项文字颜色
      text_color: 0x9e9e9e                              # 拼音行文字颜色，24位色值，16进制，BGR顺序
      comment_text_color: 0x999999                      # 拼音等提示文字颜色
      hilited_text_color: 0x9e9e9e                      # 高亮拼音 (需要开启内嵌编码)
      hilited_candidate_text_color: 0x000000            # 第一候选项文字颜色
      hilited_candidate_back_color: 0xfff0e4            # 第一候选项背景背景色
      hilited_candidate_label_color: 0x9e9e9e           # 第一候选项编号颜色
      hilited_comment_text_color: 0x9e9e9e              # 注解文字高亮

    material:
      name: "材料 / Material"
      author: "@yzlnew"

      horizontal: true                                  # 水平排列
      inline_preedit: true                              # true: 单行显示，false: 双行显示
      candidate_format: "\u2005%c\u2005%@\u2005"        # 用 1/6 em 空格 U+2005 来控制编号 %c 和候选词 %@ 前后的空间。
      corner_radius: 2                                  # 候选条圆角
      border_height: 3                                  # 窗口边界高度，大于圆角半径才生效
      border_width: 3                                  # 窗口边界宽度，大于圆角半径才生效
      back_color: 0xFFFFFF                              # 候选条背景色
      border_color: 0x212121                            # 边框色
      font_face: "PingFangSC-Regular, H-SiuNiu"         # 候选词字体
      font_point: 16                                    # 候选字词大小
      text_color: 0x3643F4                              # 高亮选中词颜色
      label_font_face: "mononoki"                       # 候选词编号字体
      label_font_point: 16                              # 候选编号大小
      label_color: 0xDCD8CF                             # 预选栏编号颜色
      candidate_text_color: 0x9e9e9e                    # 预选项文字颜色
      text_color: 0x9e9e9e                              # 拼音行文字颜色，24位色值，16进制，BGR顺序
      comment_text_color: 0x9A9AEF                      # 拼音等提示文字颜色
      hilited_text_color: 0x9e9e9e                      # 高亮拼音 (需要开启内嵌编码)
      hilited_candidate_text_color: 0x212121            # 第一候选项文字颜色
      hilited_candidate_back_color: 0xDCD8CF            # 第一候选项背景背景色
      hilited_candidate_label_color: 0x212121          # 第一候选项编号颜色
      hilited_comment_text_color: 0x9A9AEF              # 注解文字高亮
```

### 更新

~一点都不好用~，还是自带好用。






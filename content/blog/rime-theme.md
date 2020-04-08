---
title: Material Design 配色的鼠须管 RIME 主题
date: 2016-09-26 18:35:59
---

因为搜狗输入法在更新了 macOS 之后切换有点卡，再加上之前的皮肤不知道怎么的就被搜狗更新覆盖了。所以就找出鼠须管用吧。偶然发现皮肤还是挺好配的。

<!--more-->

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
      horizontal: true
      inline_preedit: true
      candidate_format: "%c\u2005%@\u2005"
      corner_radius: 2
      border_height: 0
      border_width: 0
      back_color: 0xFFFFFF
      font_face: "PingFang SC,H-SiuNiu"
      font_point: 16
      text_color: 0x424242
      label_font_face: "PingFang SC Light"
      label_font_point: 12
      hilited_candidate_text_color: 0xEE6E00
      hilited_candidate_back_color: 0xFFFFFF
      hilited_candidate_back_color: 0xFFF0E4
      comment_text_color: 0x999999

    pithy:
      name: "简洁 / Pithy"
      author: "@hotoo"
      horizontal: false
      inline_preedit: true
      candidate_format: "\u2005%c\u2005%@\u2005"
      corner_radius: 0
      border_height: 2
      border_width: 2
      back_color: 0xFFFFFF
      border_color: 0xE0B693
      font_face: "PingFangSC-Regular, H-SiuNiu"
      font_point: 19
      text_color: 0x424242
      label_font_face: "SimHei"
      label_font_point: 18
      label_color: 0x9e9e9e
      candidate_text_color: 0x000000
      text_color: 0x9e9e9e
      comment_text_color: 0x999999
      hilited_text_color: 0x9e9e9e
      hilited_candidate_text_color: 0x000000
      hilited_candidate_back_color: 0xfff0e4
      hilited_candidate_label_color: 0x9e9e9e
      hilited_comment_text_color: 0x9e9e9e

    material:
      name: "材料 / Material"
      author: "@yzlnew"
      horizontal: true
      inline_preedit: true
      candidate_format: "\u2005%c\u2005%@\u2005"
      corner_radius: 2
      border_height: 3
      border_width: 3
      back_color: 0xFFFFFF
      border_color: 0x212121
      font_face: "PingFangSC-Regular, H-SiuNiu"
      font_point: 16
      text_color: 0x3643F4
      label_font_face: "mononoki"
      label_font_point: 16
      label_color: 0xDCD8CF
      candidate_text_color: 0x9e9e9e
      text_color: 0x9e9e9e
      comment_text_color: 0x9A9AEF
      hilited_text_color: 0x9e9e9e
      hilited_candidate_text_color: 0x212121
      hilited_candidate_back_color: 0xDCD8CF
      hilited_candidate_label_color: 0x212121
      hilited_comment_text_color: 0x9A9AEF
```

### 更新

~~一点都不好用~~，还是自带好用。






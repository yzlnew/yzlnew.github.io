---
date: "2020-06-12T17:10:46+08:00"
title: "用 Tasker 把自己的微信变成 🤖"
tags:
  - tasker
draft: false
description: 我是一个没有感情的机器人。
---

前排提醒，要实现本文所述的效果，需要使用到的工具是：

- 女娲石 - 使微信能够快捷回复
- tasker
- Notification Listener - tasker 的插件，提供了通知的触发和操作接口
- 图灵机器人 - 一个提供 Web Api 的对话机器人

另外额外需要一些条件：

- 对 Android 手机、tasker 有一定的了解
- 能通过 Google Play 购买并下载应用

实际我的手机环境是一个一加 8 Pro，系统是 Oxygen OS，已 Root。如果是其他系统的话，需要自己搞定所涉及的应用不被系统杀掉（一般是电池管理不优化并给应用加锁）以及管理通知权限。

### 前言

以前玩机的时候接触并在 Google Play 上购买了 tasker，但是每次都是难以上手、耗电、不知道需要自动化什么任务放弃使用了。这次突然想给自己的微信增加一个自动回复的功能， 像以前 QQ 的离线回复一样，稍微研究了一下怎么利用已有的工具实现，理论上来说也不算任何「外挂」程序，不会被微信官方封号。

整个自动回复的流程大概是这样的：

1. 微信通知事件被 tasker 捕获
2. tasker 解析出通知的文本并通过图灵机器人 Api 上传
3. 图灵机器人回传的文本通过 tasker 回复此通知事件

### 热身

在实现前面所述的效果之前，我们先来通过一个简单的自动回复的例子来熟悉一下 tasker 操作的流程。这里不需要用到图灵机器人，也不用接触 JavaScript 。

首先设置 tasker 的事件，这里直接采用 tasker 自带的通知事件进行触发。点击右下角的加号，选择事件-界面-通知，按照截图中的方式输入：

- 所有者程序：微信和 Pushbullet，后者完全是为了测试用，因为我可以在电脑浏览器给自己手机发消息从而触发事件，验证流程；
- 文字：这里匹配两个文本，「在吗」或「跟我说话」，中间的斜杠表示「或」的概念，当然你要在后面再过滤也是可以的，在这里添加可以避免所有的通知都要走后面的操作。

之后进入任务编辑的界面，这里就是实现两个 if 逻辑，分别匹配之前输入的文本。

{{< gallery >}}
{{< figure link="https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2020/06/auto_event.jpg" caption="触发事件" >}}
{{< figure link="https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2020/06/auto_task.jpg" caption="任务编辑" >}}
{{< figure link="https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2020/06/auto_nl.jpg" caption="通知回复" >}}
{{< /gallery >}}{{< load-photoswipe >}}

这里需要注意两个地方：

- if 操作中 `%evtprm` 是 `Event Context` 中的内容，即事件的上下文参数，是一个数组。`%evtprm3` 是数组的第三个元素，对于通知事件来说就是通知的文本内容（`%evtprm2`是标题）。Notification Listener 同样提供了`%nltext` 作为通知的文本变量，使用这个也是一样的。`~R` 表示正则匹配，即匹配到「在吗」就会走第一个逻辑。
- 具体执行的回复操作是通过 Notification Listener 实现的，`%nlkey` 是它提供的变量，直接填上并加上回复信息就行。

这里还有一个问题，微信本身是不支持快捷回复的，这里就需要女娲石来实现这样一个按钮，我的手机 Root，因此能够微信的身份发送通知，之前的所有者程序选择微信，是没有问题的。没有测试过普通模式下的效果，理论上也是可以的，只需要把之前的所有者程序加上女娲石即可。

{{< figure link="https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2020/06/ne.jpg" caption="通知回复" width=250px caption-position="bottom" caption-effect="appear" >}}

激活配置之后，现在收到微信消息，就会自动回复消息了。

### 进阶

显然我们不仅仅满足于此，以上是基本实现了 QQ 离线消息的效果，让人一下子穿越回十几年前盯着别人 QQ 上下线的年代。现在我希望自己完全变成一个没有感情的机器人，不再受世间的纷纷扰扰。

有了热身的基本原理，我想大家应该已经明白了，获取通知文本、回复微信消息的方法。现在只需要一个机器人的接口，我们把文本输进去，它把回复吐出来，然后接上之前的流程就可以了。

一番搜索之后确定了图灵机器人，因为它提供了 [Web API](https://www.kancloud.cn/turing/www-tuling123-com/718227)。个人用户一天的调用上限是 100 次，和朋友玩玩是完全够了。

{{< figure link="https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2020/06/turing.png" caption="JavaScriptlet" caption-position="bottom" caption-effect="appear" >}}

建立一个如图的操作，对，tasker 是支持 JavaScript 的，这样就可以很方便的进行 Web Api 的调用。这里遇到了这个任务里面最大的困难。首先对于 JavaScript 不是特别熟悉，其次 tasker 的 js 还有点不太一样的地方。

对于 tasker 的 JavaScriptlet 来说，如果勾选了「自动退出」，则会在执行到最后一行之后退出程序，那么对于异步的网络请求和更改变量就会不起效果；否则的话，需要自行调用 `exit()` 来告诉 tasker 何时退出。这里有一个坑是在异步的请求里，直接对 tasker 的 Local 变量赋值是不起作用的，需要调用 `setLocal` 来赋值。

```javascript
var xhr = new XMLHttpRequest();
var url = "http://openapi.tuling123.com/openapi/api/v2";
var response = "default";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var json = JSON.parse(xhr.responseText);
    response = json.results[0].values.text;
    flash(response);
    setLocal("response", response);
    exit();
  }
};
var text = nltext;
var str = {
  reqType: 0,
  perception: {
    inputText: {
      text: text,
    },
    selfInfo: {
      location: {
        city: "杭州",
        province: "浙江",
      },
    },
  },
  userInfo: {
    apiKey: "<Your ApiKey>",
    userId: "<Your UserId>",
  },
};
var data = JSON.stringify(str);
xhr.send(data);
```

{{< figure link="https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2020/06/bot_js_marked.png" caption="JavaScriptlet" width=250px caption-position="bottom" caption-effect="appear" >}}

当然可以完全忽略上一段，直接把这段代码中的 `apiKey` 和 `userId` 更改为你的机器人的 API 密钥以及用户名。如果你有兴趣，我们可以简单描述一下这段代码的细节：

- `var test = nltext` ，这里是把 Notification Listener 的 `%nltext` 变量赋值并后面拼接在 JSON 请求里面。虽然显得有点多余，但是你可以把 `nltext` 变成确定的字符串，来测试你的代码是否能正确从服务器拿回请求（按下编辑页面里面的播放键）。
- `flash()` 会生成一个 `Toast` 提示，也就是每次回复的消息会在下方提示内容。
- JSON 请求里面的 `location` 是机器人的默认地址，也就是说如果问它天气怎么样，会告诉我杭州的天气。

🆗，现在就可以找个小伙伴测试一下你的 🤖 啦，在工作时段打开静音模式，让 🤖 来回复那些消息吧。

{{< figure link="https://raw.githubusercontent.com/yzlnew/ImageBed/master/blog/2020/06/bot_talk_marked.png" caption="机器人对话" width=250px caption-position="bottom" caption-effect="appear" >}}

当然最后一个提醒，如果有群聊通知没有开免打扰、或者在群里被@，还是会回复的，以免再工作群里回复一些莫名其妙的话，可以考虑像热身这一节所讲的，做在通知标题 `%nltitle` 上做一些过滤，制定一个白名单。

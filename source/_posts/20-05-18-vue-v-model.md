---
title: vue2 vmodel 版本管理问题
date: 2020-05-18 11:20:14
tags: [js,vue2,v-model]
category: [frontend]
---

# 起因

新做了个输入框，在三次封装时用 `$attrs`，本地一切正常，内部测试环境出现bug:输入不了值。

# 解决

版本都查过，一样的代码，最后猜是不是vue的问题。

查了一下在线的vue版本是`2.6.11`而内部发布版本是`2.5.13`。

把调试的vue换成指定版本`2.5.13`重现了bug。

顺着官方`https://github.com/vuejs/vue/releases`看

看到`v2.6.1`修复了`v-model: add value to $attrs if not defined in props`

看`pull requests 9331`和`9330`似乎很多人也都遇到了

果然`XD`

内部测试发布的版本已经在生产使用，当然是锁版本不会改了，把开发用的vue调试版换回了`2.5.13`，然后对应组件增加`props`的`value`和 `value`的传递。// 还好是新组建

虽然听说并且实践了无数次`锁版本`，但亲身是第一次遇到版本问题！（之前几次其它第三方资源有bug 都是最新的官方资源也没修复的，例如swiper有个重复emit的bug放了很久也不知道现在修复没

# 结论

**锁版本!!!!!**

官方vue虽然说是开发环境是`https://cdn.jsdelivr.net/npm/vue/dist/vue.js`，但实际因为生产的vue 是锁了版本，所以为了保持和生产一致，如果要使用在线资源可以使用`https://cdn.jsdelivr.net/npm/vue@版本号/dist/vue.js`

# refs

[vue releases](https://github.com/vuejs/vue/releases?after=v2.6.2)

[vue pull requests 9331](https://github.com/vuejs/vue/pull/9331)

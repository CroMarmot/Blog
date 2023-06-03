---
title: Shit Vue
date: 2023-01-22
tags: [vue, shit]
category: [frontend,vue]
description: 越来越多vue网站能轻松的日常体验到极易复现的bug, 才有了本文
---

低情商: 国内越来越多网站体验比它自身原来还差, 一看都是用vue重写了原来jquery的

高情商: vue用得真广

# 难受的用户

vue 骗局: 特别喜欢去宣传什么代码很小, 容易上手和支持大项目, 但真正需要的时候, 怕是要额外编码很多

实际 用户体验到的vue开发网站 各种离谱

已经是极度频繁的遇到问题了, 但一下回想不起所有, 每再次遇到一个补充以后

## Bilibili 动态 增加图片

增加时间 2023-01-22

动态的 图片按钮 会打开 文件选择对话框

而它也有下拉框 的加号, 点击也会打开文件选择对话框

![2023-01-17_bilibili_0.png](/Blog/images/shit_vue/2023-01-17_bilibili_0.png)

![2023-01-17_bilibili_1.png](/Blog/images/shit_vue/2023-01-17_bilibili_1.png)

然后 每次缓存失效后的首次访问,即使是4.2s,264个请求,已传3.2mb的网络下,也非常容易点出两个文件选择对话框, 而且其中一个选择后还不生效???????

但2023年, 真的没什么东西值得service worker 存一下的吗?

## Bilibili 点赞 收藏

增加时间 2023-01-22

先不说和vue关系不大 的 点赞的"已点过赞" 但是不会高亮图标的 设计

一个很常见的操作 点开视频 直接点 投币, 非常容易出现 让我去登录的对话框????

![2023-01-22_bilibili.png](/Blog/images/shit_vue/2023-01-22_bilibili.png)

rxjs白送的 combinelatest pipe take,初学rxjs都会, vue的响应式原理怎么搞成这样, 不理解啊, 频繁的巨大的视觉与操作不匹配的停顿感

但 如果用rxjs, 其实也不需要vue了.

---

2023-02-16

咻咻满 看bilibili已经开始卡了

---

2023-03-08

bilibili 播放视频完后重播，前5秒会卡住

2023-05-02

bilibili 投票弹出层放缩下是炸的

## weibo

其实 直接微博里搜"微博 网页 旧版"或者搜"微博 网页 新版", 22年12月~23年1月之间(关闭了老版入口), 就知道新版体验有多差, 而且新版还经过了很长时间的 和老版共存

还有印象的 上下滚动网页, 图片会灰掉, 像在重新请求, 现在倒是修好了

以及 列表跳转完, 返回后滚动不到跳转前位置,也不是滚动到顶, 现在学聪明了直接开新网页, 两个网页就没这问题

## 腾讯视频

许多可点击的就是个div, Vimium 交互体验极差

## 知乎

2023-02-16

react

带有`#comment`的连接进去 看评论会重复弹窗

# 设计上

```
@click="fn"
@click="fn()"
```

```
v-for + ref = 数组?????????
```

```
单文件修改, 不知道为何卡顿半分钟以上的vetur
差劲滞后的IDE支持
```

```
private / public 没有划分， 难以从代码层面表述 一个有API的组件ref
```

```
vuex仿照redux
做得四不像，修改数据需要走 dispatch -> action -> mutation（在pinia上有改进)
```

```
get/set 侵入式
想放自定义结构体又不要放在 data里， data又变成了viewdata
同时this的指向问题也令人难受
```

不一致的设计

```
如果说input知道用 :value输入，和@input 输出
但是 v-for却用 in而不是of 和js语义不符
```

TS 只能说历史原因, 但是例如snabbdom之类的 先抄ts成js,再改js成ts就是两次工作量了

周边插件 vue-loader 在 webpack4/webpack3支持上的迟更新

# 网易云音乐API

2023-05-01

vue 页面 直接动效炸掉

https://neteasecloudmusicapi-docs.4everland.app/#/?id=neteasecloudmusicapi


# https://github.com/v2rayA/v2rayA

commit hash 696992270743b7ad395fc63879bd4a32f10301a3

```
cd gui
yarn
vue add typescript

Error: Cannot find module '@vue/cli-plugin-router/generator/template/src/views/Home.vue' from '/home/cromarmot/Documents/github/v2rayA/gui/node_modules/@vue/cli-plugin-typescript/generator/template/src/views'
```

然而这个项目不论是源码还是依赖 都比我的一个ng项目小，然而开发环境中,多次使用的 vue serve 依然20s 2mb,作为对比我的ng项目是16ms,10mb

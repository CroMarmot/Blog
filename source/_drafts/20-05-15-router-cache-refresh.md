---
title: vue router cache or refresh
date: 2020-05-15 11:20:14
tags: [vue2,vuex,router]
category: [frontend,vue2]
---

# 问题

## 基本问题

期望 页面前进期望是刷新，后退用缓存

也就是有 `A->B->C` 的情况

在跳转中都是刷新，但是从C返回B，直接展示B原来的状态即可

## 额外期望

1. 能和原生vue生命事件挂钩，例如刷新时走created，而恢复时是actived
2. 期望对于页面数据不要 额外使用 vuex来做数据缓存，能够直接类似keep-alive来实现缓存，也因为如果是vuex的话还涉及到页面销毁和数据初始化的问题
3. 滚动条





# 搜索一堆的结果

大多用了

```js
<keep-alive>
  <router-view v-if="$route.meta.keepAlive" class='router-view'></router-view> 
</keep-alive> 
<router-view v-if="!$route.meta.keepAlive" class='router-view'></router-view>
```

1. 有看到用`meta.`配个字段，但是也是特判前后 来处理，也就是还是需要额外代码(和直接push不关联的代码)维护 "相邻页面" 的状况
2. 页内调用`$destory()`，我这边尝试会有页面卡死无事件只有ui的情况
3. 手动把 数据丢到vuex，首先表单和vuex的绑定，本来官方给的computed+get+set就要写一堆代码，其次

# 总结



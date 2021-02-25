---
title: vue声明式交互能力 & vue3.0 进展
mathjax: true
date: 2019-06-13 01:01:01
categories: js
tags: [vue2]
---

# 参考

https://www.bilibili.com/video/av37345007?from=search&seid=12943305398860809438

https://www.bilibili.com/video/av55286346?from=search&seid=13529674123410117444

# 吹什么

vue的 声明式写法，最常见讲是computed

比如`0 js代码` ，直接组件实现 阶乘，斐波那契数列的计算

和 命令式相比，

历史发展向讲解

就 应用程序 实体举例

跨语言啊交互举例 [recycle-list](https://weex.apache.org/zh/docs/components/recycle-list.html)

简单说 原来的命令式 比较常用的是 事件->执行的代码

现在 实现 大概是 数据 = 构成来源

# vue3

chrome devTools 周活用户90万 / react的160万

what’s target?

<!-- more -->

 - 更小
 - 更快(重点)
 - 加强TS支持(重点)
 - 加强API设计一致性
 - 提高自身可维护性
 - 开放更多底层功能

## 更快

数据变动检测:

Object.defineProperty -> Proxy (es6)

---

用TS重写了Virtual DOM

编译时优化

Slot 默认便以为函数

单例vnode工厂，设计一致的函数参数


vdom 监测 设计改动

原来是整个遍历，大多数情况16ms完成整个更新(传统情况)

react，难在 代码中 提取 究竟哪个数据变化会影响 函数重算 ，方案CPU时间分片

参考svelte框架， 强限制+静态编译`->`不需要virtual DOM 的代码，性能强,但 底线只能用模板,编译后代码体积大，但速度快

vue3:兼容2，手写render function,其次 最大化利用模板信息

直接 分析模板 把 动静结合 分离分析动态和静态的块[放弃可能存在的 原生js改动 html的检测？]

做的benchmark 约6x快

## TypeScript

之前Class API ...然后被放弃了

Function-based API 对比 Class API

 - 更好的TypeScript 类型推导，这样js写法 基本是 ts写法(不需要多余类型声明)
 - tree-shaking !!!!!!!!!!!!!!!!!效果更好,
 - 写法 函数变量名更容易被压缩[编译优化]
 - 逻辑复用:

 2.0方案 Mixins(缺点 多mixins时，命名空间 模板 数据 来源不清晰,)

react: higher-order components 高阶组件(多个高阶组件 也有同样问题{命名空间冲突，数据来源不清晰，无额外的组件实例性能消耗})

作用域插槽:(没有命名空间冲突，数据来源清晰,额外的组件实例性能消耗) 如`v-slot`

最新的 函数式 复用,+函数返回 解构,{没有命名空间冲突,数据来源清晰，无额外的组件实例性能消耗}

和 react Hooks 对比:

 - vue 只在初始化时调用(值可追踪),没有闭包变量问题，没有 内存 gc压力问题




# 参考

[tree-shaking](https://segmentfault.com/a/1190000012794598?utm_source=tag-newest)

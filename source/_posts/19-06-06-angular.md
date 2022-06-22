---
title: 从 angular generate 看 分化想法
mathjax: true
date: 2019-06-06 01:01:01
tags: [Angular2+, js]
categories: [ frontend, Angular]
---

# 从 angular generate 看 分化想法

参考原文

英文:https://angular.io/cli/generate

中文:https://angular.cn/cli/generate

## 支持的 generate

 * appShell
 * application
 * class
 * component
 * directive
 * enum
 * guard
 * interface
 * library
 * module
 * pipe
 * service
 * serviceWorker
 * universal
 
<!-- more -->

## appShell

Generates an app shell for running a server-side version of an app.

服务端 shell app

## application

Generates a new basic app definition in the "projects" subfolder of the workspace.

在projects文件夹中 新的基础app

## class

新的通用class

## interface

ts 的知识点范畴了=.=，ts大法好啊

和class 的区别是 接口

```js
interface Animal {
    age: number;
}

class Person implements Animal {
    name: string;
}
```

等价于

```js
class Person {
    name: string;
    age: number;
}
```

## component

感觉上就是angular1 的directive，也就是 DOM+逻辑

https://angular.io/api/core/Component

从官方的文档上来看，它是继承 下面的directive的

从我的体验上来说，它是视觉上，最常用的，你的每一个重复的，不重复的，需要封装一下的，都会用到它

## directive

https://angular.io/api/core/Directive

分化很有趣，我的理解是，分离了 具体的实体组件，和组件行为，

假设我们有 两个不同组件，点击时都要背景变红，那么原来有写法，两个组件都引入相同的js

而有了directive后，我们可以实现一个背景变红的directive，在你需要这个效果的具体实例上加上，即可,可以看做它是一个寄生者，而只需要在需要的宿主上加上它

## enum

枚举量,主要是typescript那一套,尽量用枚举量取代 常量！

## guard

https://angular.io/api/router

route guard 路由保护,有什么用呢，目前看到的一个实用的用途 是 角色管理+页面控制，当用户的角色不能访问某些页面的时候阻止路由的一些访问

p.s. 想起以前写angular1的时候我的leader一个大佬，有自己通过实现角色管理来控制页面的可见性，orz

## library

和Application不同 library 不会生成 index.html, styles.css, polyfills.ts, main.ts. library 是一个可复用组件的集合 包含 components,services,directives 等.

## module

A module is simply a way of defining how these elements work both internally and externally.

大概层级是 application > library > module

NgModule

## pipe

https://angular.io/guide/pipes

主要用途页面文字渲染，举例如把时间戳转换为 `年-月-日` 进行展示，angular默认有一些pipes

## service

https://angular.io/docs/ts/latest/api/core/InjectableMetadata-class.html

个人体验，主要请求数据，单例服务等等会用到

## serviceWorker

https://angular.io/guide/service-worker-intro

简单的说，在浏览器上运行，拦截http请求，从而改善网络访问体验。 对于版本更新，它也能去做保持 不会仅有部分模块是新的，其它不是新的，而可能引发的相互不兼容。

和渐进式一起用

## universal

https://angular.io/guide/universal

SSR服务端渲染，在服务端生成静态的应用页面

相比于普通的来说，是在客户端渲染。

# 总结+闲谈

使用理由等见官方页面=.= 每次开始写 都感觉无拘无束真好，但每次到了项目大了，还是会觉得工程化真香，[最大的实例理由，看看spring


---
title: material学习
mathjax: true
date: 2019-06-11 01:01:01
tags: [Angular2+, material design]
categories: [code, frontend]
---

# 参考

https://material.io/collections/developer-tutorials/#web

很早就有人说过了material，不过在那时，1是不太能阅读英文文档，2是没有实际的需要，也没有要用的想法，没有阅读

下面是个人整理 (大概需要的前置知识 node基本+html+js+css

# 是什么

跨平台，好看的，google出的ui标准 

# demo

`git clone https://github.com/material-components/material-components-web-codelabs`

安装所有ui

`npm install material-components-web`

从文档和操作上来看 需要做3件事

1. 引入css 如`@import "@material/textfield/mdc-text-field";`
2. 在html的元素上 给对应的class
3. js里引入组件和 对相应元素进行处理,如下

```js
import {MDCTextField} from '@material/textfield';
const username = new MDCTextField(document.querySelector('.username'));
```

demo101 102里介绍了 输入框，按钮，图片，列表

然后103 介绍了一些，theme(例如主题颜色)，subtitle(typography),elevation(实际是阴影效果 用来让页面元素有高低感觉),`mdc-image-list--masonry`非等长图片排列

demo111 介绍了，如何对一个原来写过的原始工程，修改成Material Components的样式(基本就是 npm引入，js引入，css引入，换class，加js

demo112 介绍了一个react工程上 改为material components


最后 目前看下来 angular+material 最多star的是https://material.angular.io

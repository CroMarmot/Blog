---
title: karma jasmine
date: 2020-04-15 11:20:14
tags: [js,karma,jasmine]
category: [frontend]
---

# Run

```bash
yarn global add jasmine-core karma karma-chrome-launcher karma-jasmine karma-jasmine-html-reporter
karma init # 一路默认
vim karma.conf.js
```

一些改动

```diff
@@ -21,8 +21,12 @@ module.exports = function (config) {
 
     // list of files / patterns to load in the browser
     files: [
+      'src/**/*.js'
     ],
 
+    client: {
+      clearContext: false, // leave Jasmine Spec Runner output visible in browser
+    },
 
 
     // list of files / patterns to exclude
@@ -37,7 +41,7 @@ module.exports = function (config) {
     // test results reporter to use
     // possible values: 'dots', 'progress'
     // available reporters: https://npmjs.org/browse/keyword/karma-reporter
-    reporters: ['progress'],
+    reporters: ['progress', 'kjhtml'],


     // web server port
```

编写你的测试代码，语法见jasmine文档

启动

```bash
karma start
```

`karma-jasmine-html-reporter` 这个赞极少 却超高的周下载量 所以大多是连带下载的吧

# 坑

## 版本兼容各种问题

目前一组能用的

```json
{
    "jasmine-core": "^3.5.0",
    "karma": "^5.0.1",
    "karma-chrome-launcher": "^3.1.0",
    "karma-jasmine": "^3.1.1",
    "karma-jasmine-html-reporter": "^1.5.3"
}
```

## cnpm

不知道cnpm搞了什么私货，同样的命令 npm 能用 cnpm就是报错。目前采取全局yarn按加项目内karam.conf.js了 (感觉操作不科学啊

## import

报错 大概意思不在module内

搜到很多加plugins或者在预处理调用webpack的，暂时没有采用

可行的一种方案,目前把`files`的配置写成

```js
[{pattern:'src/**/*.js',type:'module'}]
```

## files

需要包括源代码 和 测试代码

# refs

http://karma-runner.github.io/4.0/config/files.html

http://karma-runner.github.io/4.0/intro/how-it-works.html

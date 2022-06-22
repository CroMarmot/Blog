---
title: fiddler android
date: 2021-03-16
tags: [fiddler,android]
category: [frontend, android]
mathjax: true
---

# fiddler

https://www.telerik.com/download/fiddler/fiddler-everywhere-linux

# android

fiddler 开个代理，手机wifi 自定义过去

http没啥说的

<!--more-->

https看了一下，就是导出个证书，把证书安装到android上，然后就能解密https。基本原理就是 你发东西给fiddler，fiddler解密后发给真实服务器。

然而试了一下，只有chrome里网页的https可以搞。搜了一下，android 7 以上，开发应用时可以设置不再信任 用户证书，而系统证书非root不能安，就没搞root。

总之放弃。



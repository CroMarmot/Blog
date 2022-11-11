---
title: android 11 wireless adb
date: 2020-11-13 21:58:14
tags: [linux,android 11,wireless adb,adb]
category: [frontend, android]
mathjax: true
---

发现android 11 开发者模式 多了个无线调试

# 准备

android 11，开发者模式

电脑：

android platform tools adb 30 版本

```
adb --version
Android Debug Bridge version 1.0.41
Version 30.0.5-6877874 # 这里 要30版本
Installed as /<your path>/Sdk/platform-tools/adb
```

# 使用

手机上：

<!--more-->

连接wifi，开发者选项->无线调试->使用配对码配对设备

电脑上

配对

`adb pair 弹框中你的ip:端口` 输入六位数字 配对成功

连接

`adb connect 无限调试界面的 ip:端口`

查看

`adb devices`

`adb shell`

# 参考

https://developer.android.com/studio/command-line/adb

之前看了一些国内发的文章，很多缺少`adb connect`这一步骤,可能是android studio会自动调用connect？

另外就是无线调试并不是android 11 才有的，看官方文档在10以及以下一直可以，只是授权过程和启动手机上调试端口更麻烦一些

可以先usb连接后 通过 adb tcpip 5555 再 adb connect ip:5555 这样进入无线调试




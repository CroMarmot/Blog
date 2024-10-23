---
title: fiddler 入门
date: 2024-04-16
tags:
  - code
  - 抓包
category:
  - code
description: fiddler 抓包入门
---


Download: https://www.telerik.com/download/fiddler/fiddler-everywhere-linux

system proxy生成crt文件

并 信任该文件

```bash
sudo mkdir /usr/share/ca-certificates/extra
sudo cp ~/Desktop/Fiddler_Root_Certificate_Authority.crt /usr/share/ca-certificates/extra

# Starts the tool and upgrades the certificates.
sudo dpkg-reconfigure ca-certificates
```

有些程序不会按照system proxy,需要走fiddler打开terminal打开这个程序

```
# TODO 让code 信任对应的crt
# 似乎 系统信任了 crt,但是code 并不是按照系统来的?(我看http设置里有从系统加载CA证书啊??)，对code来说还没有效果
# 暂时先不做证书校验, 有风险
code --ignore-certificate-errors
```

然后就可以看到 vscode的仓库的meta信息会查询marketplace.visualstudio.com

而 下载的包来自于 [用户名].gallerycdn.azure.cn

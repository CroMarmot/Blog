---
title: Kubuntu 22.04 install
date: 2023-06-02
tags:
  - cplusplus
category:
  - backend
  - cpp
description: kubuntu install
---
iso torrent and sha256sum: http://cdimage.ubuntu.com/kubuntu/releases/22.04.2/release/

教验sha256

```
curl http://cdimage.ubuntu.com/kubuntu/releases/22.04.2/release/SHA256SUMS
sha256sum kubuntu-22.04.2-desktop-amd64.iso
```


```
# 插入usb
# 查看分区
lsblk
# 制作usb启动盘, 替换后面的路径
sudo dd if=./kubuntu-15.04-desktop-amd64.iso of=/dev/xxxxxxxx
```

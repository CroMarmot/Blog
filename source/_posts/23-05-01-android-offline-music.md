---
title: Android offline music
date: 2023-05-01
tags: [android,music,offline]
category: [android,app]
description: A solution
---

众所周知 服务器只是别人的电脑， 在经历，小说/电影/音乐/文字 多次不同应用里不可靠时，最终回到原点还是本地离线方案

# 总览

工作流: 电脑负责下载, 使用电脑-手机同步，手机离线播放

- 安装`F-Droid`
- 安装`Linux/Windows/Android`同步软件, 例如Syncthing, 解决 电脑和手机之间的同步
- 通过`F-Droid`安装音乐播放器`Retro`(支持动态lrc) (有的手机系统自带的音乐播放器也能播放本地的)

# 细节

## 准备

例如开发者模式，linux adb等等

### Android wifi adb

- 手机打开对应开关 和 匹配code
- 配对 `adb pair <ip:pair port> <pair code>` 例如`192.168.101.7:40421 204623`
- 链接 `adb connet <ip:connect port>` 例如`192.168.101.7:41659`
- 查看 `adb devices`

### F-Droid

免费和开源软件 (FOSS) Android 应用程序的存储库

```
wget https://f-droid.org/F-Droid.apk
adb install F-Droid.apk
```

## 文件夹同步

### Syncthing

https://syncthing.net/

```
sudo curl -o /usr/share/keyrings/syncthing-archive-keyring.gpg https://syncthing.net/release-key.gpg
echo "deb [signed-by=/usr/share/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable" | sudo tee /etc/apt/sources.list.d/syncthing.list
sudo apt-get update
sudo apt-get install syncthing
```

再启动它 和 使用web-ui 即可

**防火墙注意放开 22000(默认端口), 关闭`NAT穿透`,`全局发现`,`启用中继`**

---

然后通过F-Droid在 Android上 安装Syncthing, 同样手机上设置 关闭`NAT穿透`,`全局发现`,`启用中继`, 这样就都走局域网

连接设备:

- 电脑上`操作->显示ID`
- 手机上`设备-> +号 -> 设备标识 扫电脑上的二维码`

同步文件夹:

- 电脑上, `文件夹-> 添加文件夹 -> 输入文件夹标签，修改文件夹路径, 复制文件夹ID, 共享tab里勾上手机，点击 保存`
- 手机上, `文件夹-> +号 -> 输入文件夹标签，修改文件夹ID和上面的复制的文件夹ID一样，选择手机中放置的目录，勾选电脑共享的id，确认即可`

在文件夹版本控制上用简单控制似乎够了

测试

- 新建文件看能否同步即可

### 注

也尝试过OwnCloud，本身设计上还是一个server多client的方式，而Syncthing是以文件夹唯一ID的形式

## 音乐下载

期望

- 维护meta列表
- 列表批量下载
- 单个下载

因为版权问题，各种开源的也在动态的出现和被封掉，而歌曲有的来自网易云，有的是QQ音乐, 有的是Youtube

所以 其实 这里没有一个什么“稳定”的解决方案，只有暂时可用的方案

例如`youtube-dl`

关于维护歌单，可靠的办法还是git + csv(歌手+歌名+(平台) ) 去做尽量精准匹配, 来源可以从现有的歌单抓取

然后只需要 一个精确匹配的下载工具即可

**这里有很坑的地方，不同平台可能大小写不同，歌名加了各种括号（Remix）,歌手是合作的顺序不同合作列表不全分割符号不同，中英文歌手名不同，括号里的东西不同**

---

目前工作流

- 脚本对playlist拉取到csv
- 脚本对csv中精确匹配下载

问题: 部分`vip`歌曲会下载成功，但只有十几秒

### 相关

eyeD3 可以命令行查看歌曲信息

https://eyed3.readthedocs.io/en/latest/

## 音乐播放

期望

- 基本功能 进度条，前一首，后一首，歌单
- 随机播放, 单曲循环，列表循环
- 歌词展示
- 可选: 播放次数统计，切歌统计，专辑封面

Retro music player:

https://github.com/RetroMusicPlayer/RetroMusicPlayer


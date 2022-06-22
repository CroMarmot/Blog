---
title: 迁移到win
date: 2021-07-05
tags: [win]
category: [code, win]
mathjax: true
---

# apt

怀念 Debian apt 的好, 在windows上腾讯软件管家成了我的“apt”

# 以下是一些问题记录

# vscode

set `git bash` as default terminal

# windows terminal 

windows terminal 双击点击鼠标选择 在单词和行选择切换,而非空格分割和行之间切换

https://stackoverflow.com/questions/60441221/double-click-to-select-text-in-windows-terminal-selects-only-one-word

# Git

**更应该 不要 win和wsl共用磁盘**

https://stackoverflow.com/questions/1580596/how-do-i-make-git-ignore-file-mode-chmod-changes

https://stackoverflow.com/questions/50096060/how-to-switch-branch-when-filename-case-changes

git bash ssh-keygen (same as linux)

wsl2 里 默认编辑器

https://stackoverflow.com/questions/2596805/how-do-i-make-git-use-the-editor-of-my-choice-for-commits

中文乱码：log commit信息, diff 文件内容, 文件名

https://stackoverflow.com/questions/22827239/how-to-make-git-properly-display-utf-8-encoded-pathnames-in-the-console-window

https://gist.github.com/xkyii/1079783/3e77453c05f6bcbce133fd0ba128686683f75bf8

win10有个Beta版本的区域utf-8设置，开了以后很多软件都是乱码，包括微信小程序开发工具,哎，

# Chrome

account sync

default browser( https://github.com/da2x/EdgeDeflector  )

# firefox

国内外登录地址一个有.cn 一个没有，所以不同地址相同邮箱账号不同, 选择firefox 官方 developer 版本+ win x64 版本+English版本

https://www.mozilla.org/zh-CN/firefox/all/#product-desktop-developer

# Python 被windows商店劫持

https://stackoverflow.com/questions/58754860/cmd-opens-window-store-when-i-type-python

<!-- more -->

# wsl2 (777看得我有点头疼，不过官方建议一般来说不要共用文件夹)

https://docs.microsoft.com/zh-cn/windows/wsl/install-win10#step-1---enable-the-windows-subsystem-for-linux

桌面方案xfce4+xrdp+windows远程桌面,xfce4相对轻量，也可以用gnome https://gist.github.com/Ta180m/e1471413f62e3ed94e72001d42e77e22

`sudo update-alternatives --config x-session-manager` 默认桌面设置

开发方案wsl2内部文件夹 + vscode wsl插件

网络问题

`New-NetFirewallRule -DisplayName "WSL" -Direction Inbound  -InterfaceAlias "vEthernet (WSL)"  -Action Allow`

https://github.com/microsoft/WSL/issues/5805#issuecomment-686807121

https://github.com/microsoft/WSL/issues/4585


oh-my-zsh 字体

https://blog.nillsf.com/index.php/2020/02/17/setting-up-wsl2-windows-terminal-and-oh-my-zsh/

vim (ctrl+shift+v粘贴)

https://stackoverflow.com/questions/61824177/visual-block-mode-not-working-in-vim-with-c-v-on-wslwindows-10

https://docs.microsoft.com/zh-cn/windows/wsl/compare-versions

当然需要一点网络基础知识，无脑的话，把server地址设为0.0.0.0

https://github.com/Microsoft/WSL/issues/1032

# proxy

https://github.com/Qv2ray/Qv2ray

https://github.com/v2ray/v2ray-core

访问主机见上面微软的文档

https://github.com/rofl0r/proxychains-ng

# ADB

idea + android + PATH 设置

# nvm(nodejs)

https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows

# symlink

https://docs.microsoft.com/zh-cn/windows/security/threat-protection/security-policy-settings/create-symbolic-links

https://stackoverflow.com/questions/18641864/git-bash-shell-fails-to-create-symbolic-links

https://github.community/t/git-bash-symbolic-links-on-windows/522/12

https://zhuanlan.zhihu.com/p/106225935

有的人的win上直接能用，是专业版，我这个是家庭版，为了不要因为用工具改配置，我做成了根据系统决定是拷贝还是symlink

https://nodejs.org/api/process.html#process_process_platform

# win10更新和指纹问题

https://answers.microsoft.com/zh-hans/windows/forum/all/%E6%9B%B4%E6%96%B0win10%E5%90%8E%E6%8C%87%E7%BA%B9/7fc55349-7234-4fd0-a3c1-04fcf20e2aaa

# 文件传输

据说有

scp

ftp(中文 字符集问题)

windows samba

usb、移动硬盘拷贝

网络

nextcloud之类

三方云

注意防火墙等设置

我东西蛮多,蛮大的比如wechat，然后samba等搭了半天没搞好，scp又慢，还是主要移动硬盘拷贝

filezilla 左连wsl文件夹，右连Ubuntu ssh，可以不受文件mode影响的拷贝文件

# 总结

目前看起来最理想的架起来大概

![migrate2win](/Blog/images/migrate2win.png)

1. 因为777等各种原因，开发丢在wsl2里面的文件夹里
2. `/etc/resolv.conf` 每次是变化的，虽然一行命令能获取，但是`/etc/proxychains.conf` 里的配置不能配`$`还有点问题
3. host能访问wsl2里暴露的端口，虽然好像端口冲突的报错有点不够理想，不过可以简单的靠改端口解决

综上所述，要轻量，不如 VMware player + Xubuntu ( 但 有一说一启动比vmware快还是很香的

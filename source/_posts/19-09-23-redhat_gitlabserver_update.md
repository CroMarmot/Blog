---
title: redhat7 + gitlab-ce版本更新 11.6->12.2
mathjax: true
date: 2019-09-23 15:09:01
tags: [gitlab, redhat, update]
categories: [code, git]
---

# Why

模拟生产环境 尝试 升级 gitlab-ce 从 11.6 到 12.2, 以及尝试模拟之前产生的错误

官方说 先要到`11.11.X`再到`12.X`

物料准备

vmware on Ubuntu 18.04 LTS

gitlab-ce-11.6.5-ce.0.el6.x86_64.rpm

gitlab-ce-11.11.0-ce.0.el6.x86_64.rpm

gitlab-ce-12.2.5-ce.0.el7.x86_64.rpm

rhel-server-7.7-x86_64-dvd.iso

# Install OS

https://access.redhat.com/downloads/content/69/ver=/rhel---7/7.7/x86_64/product-software

注册 下载 安装

需要注意的是 下4GB左右的 而不是boot.iso

> 为什么是7 不是8(当前最新)

因为想和某个生产环境保持一致 尝试 模拟某些操作

<!--more-->

# Install Software

https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/installing-software

401 还用不了 TODO

# authorized_keys

印象来说`~/.ssh/authorized_keys`中把pub丢进去 就好了

然而并没有

尝试了一些 方案

最后是`/etc/ssh/sshd_config` 中配置`StrictModes no`再重启sshd 好的

这主要是为了方便 我直接 ssh进去 可以更方便的copypaste

# 哇

默认

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

虽然 感觉要是按熟了 形成肌肉记忆 也阻止不了按y XD

# gitlab-ce 11.6 安装

也是模拟全靠离线包安装 没有配yum

之前一直用的是Debian系列的Linux，对rpm并不熟 搜一搜 常用命令 `rpm -i` 或者 `rpm -ivh` 即可

root权限下

`rpm -ivh gitlab-ce-11.6.5-ce.0.el6.x86_64.rpm`

`gitlab-ctl reconfigure`

然后 我主机访问 一下 内部ip ??? 访问不了

内部wget一下 是可以下载index.html

外部ping能通，nmap加了`-Pn`都只能nmap到 22

开了另一个虚拟机 发现 随便搭 个apache2 或者 nginx都是能从主机访问,以为是nginx配置或者虚拟机配置问题

然后突然想到是不是防火墙

用 `systemctl status firewalld.service` 看了看  哇 这个防火墙是默认打开的

这里 直接`systemctl stop firewalld.service` 就可以了访问了

TODO 这里有点疑惑 之前尝试过程中 我也有用过iptables 允许过80的难道哪里输错了?还是iptables不起作用?

不过 这次主要目的是 gitlab的升级,这里 就没有详细去研究防火墙了

至此 gitlab-ce 能用,随便设置root密码 建立个账户，改一些配置，建一些组，建一些仓库等等 模拟一下大概有内容


# 升级到11.11.0

`rpm -Uvh gitlab-ce-11.11.0-ce.0.el6.x86_64.rpm`

也没有输命令停止什么 然后 竟然无错运行了?

# 升级到12.2.5

`rpm -Uvh gitlab-ce-12.2.5-ce.0.el7.x86_64.rpm`

哎 也无错升级了 =.=

好吧 重现不了 GG

# 生产中尝试过的操作

虽然是 "生产" 但 实际只有50-人使用,所以 简单 弄下来，让大家停止使用

然后 生产 也不是我操作的，过程中不知道哪个步骤挂了

大概 现象是 升级到12了 但是 报500,查log 是 某个提示，搜对应提示找到issues都是建议`gitlab-rake db:migrate`搞一搞

然而`gitlab-rake`报错 数据库太老要先升级到11.11, emmmm 也就是 之前 从11.6到11.11应该就挂了但没人发现,我也是服气的=。=?

然后 搜了半天downgrade 也没有搜到明确指示，他们不敢downgrade=。= ? 感觉downgrade 也比 重装 影响小啊

解决过程 就把内容先 全搞下来 =。=，然后 完全删除 gitlab-ce 大概

```
gitlab-ctl stop
rpm -e gitlab-ce
ps aux | grep gitlab
kill -9 <上面一个runsvdir 带很长点的一个>
find / -name gitlab | xargs rm -rf
```

对应服务器是专门开的一个没有其它服务,所以最后一句 执行 还好=.=

然后 安 12.2

一个是需要runit，下载+安装

一个是运行时卡住`] action run`, 某个东西 lock? 可能是他们之前熟练的使用kill -9 造成的? 然后google一下,启动一哈对应服务

一个是报错 三个配置 找不到,ls去看 是三个conf 软链接 指向空的, 删掉它们

然后就能用=.=

所以 最后生产还是重装的 2333,然后把各个仓库导入进去=。= 我不知道是谁做的备份，只备份了仓库 也没有各个用户关系之类的=。=，估计他是clone的而没有用rake，所以也没尝试用 rake 去恢复

最后 客户端 内容太大,需要 清除就到了[这一篇](/Blog/19-09-20-gitbiguselessfile/)

# 使用到的工具等(可能有遗漏)

ssh wget vim rpm htop netstat ifconfig grep nmap systemctl iptables ping

https://docs.gitlab.com/omnibus/update/

https://docs.gitlab.com/ce/update/#upgrading-without-downtime

https://linuxconfig.org/how-to-stop-start-and-disable-enable-firewall-on-redhat-7-linux-system

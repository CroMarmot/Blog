---
title: .d 文件夹
date: 2021-03-08 21:58:14
tags: [config,server,etc]
category: [backend]
mathjax: true
---

# .d 文件夹

众所周知， debian系列的软件源列表, 从最早手动的改动`/etc/apt/sources.list`,到后面在`/etc/apt/sources.list.d/` 中手动增加，以及有软件可以直接更换不需要手动改

apache2 也从直接`conf`变成了`sites-enabled/` 和`sites-available/`

nginx 也从`nginx.conf` 变成去配置 `conf.d/` 里的

虽然老的方法也可以用, 但更多的都变成`.d` 文件夹之类的

然而一堆文章还在改 主配置文件文件

甚至 例如 fail2ban的配置文件 已经明确说了, 还是有人在改主conf

<!--more-->

```
# HOW TO ACTIVATE JAILS:
#
# YOU SHOULD NOT MODIFY THIS FILE.
#
# It will probably be overwritten or improved in a distribution update.
#
# Provide customizations in a jail.local file or a jail.d/customisation.local.
# For example to change the default bantime for all jails and to enable the
# ssh-iptables jail the following (uncommented) would appear in the .local file.
# See man 5 jail.conf for details.
```

不禁想知道`.d` 的意义和由来

然后搜到了

> When distribution packaging became more and more common, it became clear that we needed better ways of forming such configuration files out of multiple fragments, often provided by multiple independent packages. Each package that needs to configure some shared service should be able to manage only its configuration without having to edit a shared configuration file used by other packages.

> The most common convention adopted was to permit including a directory full of configuration files, where anything dropped into that directory would become active and part of that configuration. As that convention became more widespread, that directory was usually named after the configuration file that it was replacing or augmenting. But since one cannot have a directory and a file with the same name, some method was required to distinguish, so .d was appended to the end of the configuration file name. Hence, a configuration file /etc/Muttrc was augmented by fragments in /etc/Muttrc.d, /etc/bash_completion was augmented with /etc/bash_completion.d/*, and so forth. Sometimes slight variations on that convention are used, such as /etc/xinetd.d to supplement /etc/xinetd.conf, or /etc/apache2/conf.d to supplement /etc/apache2/apache2.conf. But it's the same basic idea.

> Generally when you see that *.d convention, it means "this is a directory holding a bunch of configuration fragments which will be merged together into configuration for some service."

# ref

https://unix.stackexchange.com/questions/4029/what-does-the-d-stand-for-in-directory-names/4047

https://lists.debian.org/debian-devel/2010/04/msg00352.html


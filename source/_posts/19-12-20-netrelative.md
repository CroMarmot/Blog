---
title: net/ping/virus scan
date: 2019-12-20 11:20:14
tags: [backend,virus]
category: [backend,system]
---

# disable ping

`echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all`

`/etc/sysctl.conf` 追加

`net.ipv4.icmp_echo_ignore_all = 1`

# list running program

`ps -ef  |  awk '$8~/^\// {for(i=8;i<=NF;i++)printf $i" "; print "" }' | sort | uniq`

# port and net

`lsof -i`

`ifconfig` the value of `TX bytes`

`hethogs`

# clamav

`clamscan -r -i /home/ -l  /var/log/clamscan.log`

`freshclam` before use

`clamtk` for ui

# relative

awk


anti virus



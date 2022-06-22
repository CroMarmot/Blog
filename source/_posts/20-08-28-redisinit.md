---
title: redis init 简单笔记
date: 2020-08-28 16:58:14
tags: [redis]
category: [code, backend, redis]
mathjax: true
---

# 安装配置

## 安装启动

Debian 系列

```
apt install redis-server
```

也可以考虑官网下源码自己编译，或者docker直接pull

修改`/etc/redis/redis.conf`中`supervised no`为`supervised systemd` (Ubuntu 用systemd初始化系统的这样设置

通用的重启

```
systemctl restart redis.service
# 查看状态
systemctl status redis
```

> 个人电脑取消它开机启动`systemctl disable redis`

## 基本使用

啊 这个cli的提示真的香

<!--more-->

```
$ redis-cli
127.0.0.1:6379> ping
127.0.0.1:6379> set test "It's working!"
127.0.0.1:6379> get test
127.0.0.1:6379> test
$ systemctl restart redis
127.0.0.1:6379> get test
```

## 允许访问的ip设置

注释掉`bind 127.0.0.1 ::1` 或者改成`bind 0.0.0.0` 允许localhost以外的任何地址访问,默认只允许本地访问（不建议？

```
netstat -lnp | grep redis
```

你应该看到的第4列

```
0.0.0.0:6379
::1:6379
```

## 密码设置

把下面配置启用并为

```
requirepass 你的密码
```

注释说因为很快用户可以150k/s的尝试，所以建议复杂密码。推荐的方案是`openssl rand 60 | openssl base64 -A`生成一个

重启服务用密码登录

```
$ systemctl restart redis.service
$ redis-cli
127.0.0.1:6379> auth 你的密码
127.0.0.1:6379> set key1 10
127.0.0.1:6379> get key1
127.0.0.1:6379> quit
```

## 风险指令禁用

一些可能有风险的指令 FLUSHDB, FLUSHALL, KEYS, PEXPIRE, DEL, CONFIG, SHUTDOWN, BGREWRITEAOF, BGSAVE, SAVE, SPOP, SREM, RENAME, and DEBUG

**The following steps showing how to disable and rename commands are examples. You should only choose to disable or rename the commands that make sense for you. You can review the full list of commands for yourself and determine how they might be misused at** 

**总之就是你应该了解指令的意义，才禁用相关的指令,以防误用** 相关指令描述 http://redis.io/commands

在配置中增加（两种方式）

```
rename-command 指令名字 ""
rename-command 指令名字 新的难输入的指令名字
```

## 类型

字符串，hash，list，集合，有序集合

超时时间设置

本身不支持嵌套对象，如果要把它变成json字符串

https://redis.io/topics/data-types-intro

Bit arrays (or simply bitmaps): it is possible, using special commands, to handle String values like an array of bits: you can set and clear individual bits, count all the bits set to 1, find the first set or unset bit, and so forth.

HyperLogLogs: this is a probabilistic data structure which is used in order to estimate the cardinality of a set. Don't be scared, it is simpler than it seems... See later in the HyperLogLog section of this tutorial.

Streams: append-only collections of map-like entries that provide an abstract log data type. They are covered in depth in the Introduction to Redis Streams.

## 发布/订阅

https://redis.io/topics/pubsub

```
SUBSCRIBE 频道名1 [频道名2 ...]
PUBLISH 频道名1 "消息"
```

## 事务

```
MULTI

命令队列

EXEC
```

https://redis.io/topics/transactions

每条命令是原子操作，如果exec调用了，那么执行过程中 如果有命令失败，则会跳过改命令继续往后。

? redis的事务 所以到底啥用,首先是和传统数据库的事务的意义不同

为啥不支持

Redis commands can fail only if called with a wrong syntax (and the problem is not detectable during the command queueing), or against keys holding the wrong data type: this means that in practical terms a failing command is the result of a programming errors, and a kind of error that is very likely to be detected during development, and not in production.

Redis is internally simplified and faster because it does not need the ability to roll back.

### watch

一个非原子的

```
val = GET mykey
val = val + 1
SET mykey $val
```

改为

```
WATCH mykey
val = GET mykey
val = val + 1
MULTI
SET mykey $val
EXEC
```

如果在WATCH和EXEC之间修改了mykey，这个transaction 会失败

然后反复尝试，因为从实际期望上，不同的用户冲突的可能性很小，所以用的是乐观锁, 多数情况并不需要重复尝试

管道Learn how to send multiple commands at once, saving on round trip time.: `$(echo -en "PING\r\n SET runoobkey redis\r\nGET runoobkey\r\nINCR visitor\r\nINCR visitor\r\nINCR visitor\r\n"; sleep 10) | nc localhost 6379`




## cheatsheet

远程连接: `redis-cli -h host -p port -a password` // 不建议直接这样操作? 会被记录在你的命令历史里?

查看信息`info`

```
config get 配置名
config set 配置名 配置值
```

benchmarks: https://redis.io/topics/benchmarks

`redis-benchmark -h 127.0.0.1 -p 6379 -t set,lpush -n 10000 -q` 咦 这玩意不需要权限？？？

文档很多是ruby写的例子 XD，没用过，人脑执行了一下大概的代码

# ref

https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04

https://redis.io/documentation


---
title: mkfifo sh nc
date: 2020-11-11 21:58:14
tags: [linux, mkfifo]
category: [software,linux]
mathjax: true
---

# mkpipe

众所周知

`ls | grep hey`中的竖线是pipe，

同样，我们可以用mkfifo创建命名的管道

创建

```
mkfifo /tmp/pipedemo
```

输入

```
ls > /tmp/pipedemo
```

读出

```
cat < /tmp/pipedemo
```

输入和读出不用保证执行顺序

<!--more-->

# sh -i

众所周知

0 是一个文件描述符，表示标准输入(stdin)
1 是一个文件描述符，表示标准输出(stdout)
2 是一个文件描述符，表示标准错误(stderr)

而`sh -i` 可以强制交互模式

# nc

最后就有了, nc文档上的实例,既可以做server又可以做client

服务端

```
# 清除并创建fifo 的管道(看权限是`rw-rw-r--`)
$ rm -f /tmp/f; mkfifo /tmp/f
$ cat /tmp/f | /bin/sh -i 2>&1 | nc -l 127.0.0.1 1234 > /tmp/f
```

客户端

```
nc 127.0.0.1 1234
```

/bin/sh 输出到服务端127.0.0.1:1234，作为输入

用户连接上127.0.0.1:1234，接受到上面的输入

用户敲入命令，发送给服务端127.0.0.1:1234

服务端输出重定向到/tmp/f中

/tmp/f 被cat出 定向给 /bin/sh

/bin/sh接受输入并反馈出输出给 服务端

服务端返回给客户端

# 搜还搜到了一个

https://www.dartmouth.edu/~rc/classes/ksh/welcome.html#top

# 参考

`man sh`

`man mkfifo`

`man nc`

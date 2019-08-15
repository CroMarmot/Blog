---
title: gitlab server 搭建
mathjax: true
date: 2019-07-08 01:01:01
categories: backend
tags: [gitlab,git]
---

# Why

可以在私有环境下使用。如果想用非私有，现成的，可以考虑github.com 或 gitlab云

# Steps

1. 方法1:用gitlab企业版/旗舰版 跟着官方文档走
2. 方法2:gitlab-ce+docker : https://docs.gitlab.com/omnibus/docker/

方法3: 手工安装配置 `docker-ce`

> 安装依赖

```bash
sudo apt update
sudo apt install ca-certificates curl openssh-server postfix
```

> 安装 gitlab-ce

```bash
cd /tmp
curl -LO https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh
sudo bash /tmp/script.deb.sh
sudo apt install gitlab-ce
```

> 修改 `sudo vim /etc/gitlab/gitlab.rb`中的`external_url` 为你的domain名称

`sudo gitlab-ctl reconfigure`

按理说这里就可以用了

然而 因为apache服务和原来开启的nginx服务，导致我找问题找了很久很久[我似乎也没看到报错

最后我停掉两个服务再重启 `gitlab`就好了

# nginx listen_port 配置

修改

`/etc/gitlab/gitlab.rb`

找到`nginx['listen_port']`修改为

```
nginx['listen_port'] = 8081
```

再执行`sudo gitlab-ctl reconfigure`

访问`你的domain:8081`即可

# TODO 权限管理, https

https://docs.gitlab.com/omnibus/settings/nginx.html

# 参考

https://about.gitlab.com/

https://hub.docker.com/r/gitlab/gitlab-ce/

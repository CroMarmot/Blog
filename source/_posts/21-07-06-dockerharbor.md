---
title: Docker Harbor on Ubuntu 20 on WSL2
date: 2021-07-06
tags: [docker]
category: [code, docker, harbor]
mathjax: true
---

# Docker Harbor

简单说，可以搭本地/局域网 docker仓库

# 前置条件

Ubuntu 或 其它linux 或 Ubuntu on WSL2

# 依赖

安装docker:

```
sudo apt install docker.io docker-compose
```

# 下载包

经过历史经验教训 用WSL2的不要把包放在win的目录下，要放在wsl2 **私有**的目录下

https://github.com/goharbor/harbor/releases

解压

```
tar xvzf harbor-offline-installer-*.tgz && cd harbor
```

# SSL等配置

这玩意一定要SSL, 这里用自签

ip查看

```
ifconfig | grep inet
```

<!-- more -->

**注意替换成你的ip**

```bash
YOURIP=192.168.1.203
openssl req -newkey rsa:4096 -nodes -sha256 -keyout ca.key -x509 -days 3650 -out ca.crt
openssl req -newkey rsa:4096 -nodes -sha256 -keyout $YOURIP -out $YOURIP
echo "subjectAltName = IP:$YOURIP" > extfile.cnf
openssl x509 -req -days 3650 -in $YOURIP -CA ca.crt -CAkey ca.key -CAcreateserial -extfile extfile.cnf -out $YOURIP
sudo mkdir -p /etc/docker/certs.d/$YOURIP
sudo cp *.crt *.key /etc/docker/certs.d/$YOURIP
sed -i "s/^hostname.*/hostname: $YOURIP/" harbor.yml
sed -i "s@^\(\s*certificate\).*@\1: /etc/docker/certs.d/$YOURIP/ca.crt@" harbor.yml
sed -i "s@^\(\s*private_key\).*@\1: /etc/docker/certs.d/$YOURIP/ca.key@" harbor.yml
```

如果有需要可以改动`harbor.yml`里面的端口配置

# 安装

```
sudo ./install.sh --with-clair
```

# 访问

localhost:你设置的端口

wsl2需要做以下映射

powershell:

```
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=443 connectaddress=172.28.52.88 
```

> 其中listenport是对外部暴露的端口
> connectport是你wsl2里的端口
> connectaddr是wsl2的地址

# 参考

https://goharbor.io/docs/latest/install-config

https://thenewstack.io/tutorial-install-the-docker-harbor-registry-server-on-ubuntu-18-04/

https://docs.microsoft.com/en-us/windows/wsl/compare-versions#accessing-a-wsl-2-distribution-from-your-local-area-network-lan

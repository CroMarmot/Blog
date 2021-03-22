---
title: gitlab server 搭建
mathjax: true
date: 2019-07-08 01:01:01
tags: [gitlab, git]
categories: [code, git]
---

# Why

可以在私有环境下使用。如果想用非私有，现成的，可以考虑https://github.com 或 https://gitlab.com

# 手工安装 `docker-ce`

> 安装依赖

```bash
sudo apt install ca-certificates curl openssh-server postfix
```

> 安装 gitlab-ce

```bash
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
sudo apt install gitlab-ce
```

注: 国内有不少镜像源 例如`https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/`，国内镜像会快很多，可以替换上面生成的`/etc/apt/sources.list.d/gitlab_gitlab-ce.list`中的路径

`sudo gitlab-ctl reconfigure`

按理说这里就可以用了

> 你需要设置root的密码，和新建一个用户以及(设置该用户的密码)

## 配置

然而 因为我本地apache服务和原来开启的nginx服务，有80冲突和原来nginx服务冲突(？)，导致我找问题找了很久很久[我似乎也没看到报错

> 修改 `sudo vim /etc/gitlab/gitlab.rb`

中的`external_url` 为你的domain名称+port,如`http://192.168.1.51:8081`

最后我停掉两个服务再重启 `gitlab`就好了

```c++
/* 未使用了 如果本身还有nginx据说可以配一下
# nginx listen_port 配置

修改

`/etc/gitlab/gitlab.rb`

找到`nginx['listen_port']`修改为

nginx['listen_port'] = 8081

再执行`sudo gitlab-ctl reconfigure`

访问`你的domain:8081`即可
*/
```

# gitlab on docker

```bash
sudo docker run --detach --name gitlab \
  --hostname gitlab.example.com \
  --publish 30080:30080 \
  --publish 30022:22 \
  --env GITLAB_OMNIBUS_CONFIG="external_url 'http://gitlab.example.com:30080'; gitlab_rails['gitlab_shell_ssh_port']=30022;" \
  gitlab/gitlab-ce:latest
```

好了 ssh 30022和http 30080都ok,docker真香了

https://developer.ibm.com/code/2017/07/13/step-step-guide-running-gitlab-ce-docker/

https://docs.gitlab.com/omnibus/docker/README.html

# 问题:仓库通过ssh的git clone报错

`http`的`clone`可用

而`ssh`的`clone`报错: `fatal: protocol error: bad line length character: Welc`

gihub上很多说`sed -i 's/session\s\+required\s\+pam_loginuid.so/# \0/' /etc/pam.d/sshd` 就是注释掉 也没用(也restart 过)

> 问题排查

网上有很多 pam的 校验关闭都没有用

然后 通过`ssh -vvv git@<ip>`得到`Exit status 254`,对应也是没有搜到可行方案,但感觉距离问题近了些

查看`/var/log/auth.log`发现

```log
Aug 20 14:24:03 RBEST systemd: pam_unix(systemd-user:session): session opened for user git by (uid=0)
Aug 20 14:24:03 RBEST systemd-logind[941]: New session 170 of user git.
Aug 20 14:24:03 RBEST sshd[16070]: error: PAM: pam_open_session(): Module is unknown
Aug 20 14:24:03 RBEST sshd[16148]: Received disconnect from 192.168.1.51 port 48618:11: disconnected by user
Aug 20 14:24:03 RBEST sshd[16148]: Disconnected from user git 192.168.1.51 port 48618
Aug 20 14:24:03 RBEST systemd-logind[941]: Removed session 170.
```

这个error也搜不到对应的

鸽了！ 用 docker来搞

docker的方法测试

`ssh -vvv git@gitlab.example.com -p 30022`的exit code 是0 所以感觉还是 本地的ssh相关的东西配置有问题

## 修复(重装试试)

上面我得到的信息是

1. ssh git@应该是成功登录了 但是没有和gitlab联系上
2. docker里看 只用简单配置 就应该能用
3. 我尝试新开了个空白虚拟机，装一遍gitlab是能用的

于是按照https://askubuntu.com/a/824723/653605把 gitlab完全删除 再重装就好了？喵喵喵，虽然现在能用了，可是之前究竟是什么问题。

# TODO email


https://docs.gitlab.com/omnibus/settings/nginx.html

# 权限管理

权限管理 https://docs.gitlab.com/ee/administration/#user-settings-and-permissions

用root权限用户登陆

> `<你的地址>/admin/application_settings`

可见和可访问性

的Restricted visibility levelsx限制为 内部和私有

关闭了为所有项目默认 runner和默认CI/CD

# HTTPS

`/etc/gitlab/gitlab.rb` 设置

`external_url 'https://gitlab.xxx.com'`

以及

```
letsencrypt['enable'] = true
letsencrypt['contact_emails'] = ['你的email']
```

再`gitlab-ctl reconfigure`就可以自动生成证书并且 启用https了
 
# 内存占用过大

```
unicorn['worker_timeout'] = 60
unicorn['worker_processes'] = 2
```

也有其它git server :`https://gogs.io/`

# 参考

https://about.gitlab.com/

https://hub.docker.com/r/gitlab/gitlab-ce/

https://gitlab.com/gitlab-org/gitlab-foss/-/issues/25840

https://docs.gitlab.com/omnibus/settings/unicorn.html

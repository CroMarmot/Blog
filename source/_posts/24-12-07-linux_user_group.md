---
title: Linux(user,group)
date: 2024-08-27
tags:
  - linux
  - user
  - group
category:
  - backend
description: linux用户和组
---

## cheetsheat

增加用户

```
useradd -c "注释" 用户名
useradd -c "evariste.sakura" esakura
或者如果你需要管理学校的服务器，有很多同学需要使用这一台，那么可以
useradd -c "年份.班级.姓名" 用户名
useradd --create-home --uid 用户id --groups 组a 组b 用户名
useradd -u 10600 -g 10600 -G sysadmin,helpdesk jdoe # 例如场景希望用户id和工号一致 但注意的是linux<=2.4 最大是65536, 后面的也只有 2^32 = 4294967296 , 毕竟还不是字符串
```

设置密码 (管理员可以通过 /etc/security/pwquality.conf 限制简单密码)

```
passwd 用户名
passwd esakura
# 删除密码
passwd -d 用户名
```

查看密码设置信息

```
sudo passwd -S sambauser  
sambauser P 2024-10-26 0 99999 7 -1
```

删除用户(移除前 请备份 用户 home 目录的内容)

```
userdel -r 用户名
```

添加到组

```
usermod --append --groups 组名 用户名
```

登录信息

```
w # 当前登录
last # 登录记录
```

文件的 用户和组，读写执行修改

```
chown 用户:组 文件
# 用户u组g其它o, 增加+减少-,读r写w执行x
chmod ug+r 文件 # 例子
```

切换用户

```
su - 用户名
su - 用户名 --command 命令 # 用指定用户执行一条命令
```

<!--more-->

## /etc/passwd （rw-r--r--）

包含，用户名，home 目录，默认shell, 用冒号分割

格式`username:password:UID:GID:comment:home:shell`

例子

```
root:x:0:0:root:/root:/bin/bash
esakura:x:1000:1000:esakura:/home/esakura:/bin/bash
```

这里可以看到 password 全都是x（看不到的

然后UID/GID是1000因为这是我创建的一个ubuntu用户

- 例如我重新安装了系统，但是/home是单独挂载的，那么，重装时不论用户名是怎样，它的权限对于/home的来说 会有原来的1000账户的目录的权限
- 小于1000的是预留给系统，服务和一些特殊账户的。普通用户的 >= 1000
- 例如 root的uid=0,gid=0,它厉害是因为它的uid/gid而不是因为它叫做root,也就是如果你把root改名，再另外建立一个root,那么有 额外权限的是 改名后的，而不是新的root

## /etc/shadow (rw-r-----)

注意到权限上，也就是只有root和root组 可以读

存储的 passwd 的 hash

`username:password:last password change:min:max:warning:inactive:expired`

```
root:!:20019:0:99999:7:::
esakura:$y$j9T$36h2ltp8Tdd3315KoGx0N0$vsVnHQ7ysdFyIVACx0Ooctl9StoteFoR1bkfDNhx4m6:20019:0:99999:7:::
```

后面几段，是和密码修改有关的信息， 延伸阅读：
- The effects of adding users to a Linux system
- Forcing Linux system password changes with the chage command

## 增删改

```
useradd
usermod
userdel
```

Linux sysadmin basics: User account management

延伸阅读， 可插拔 安全 模块

- How to enhance Linux user security with Pluggable Authentication Module settings 
	- https://www.redhat.com/en/blog/linux-security-pam 实现一些更复杂的安全验证机制
- An introduction to Pluggable Authentication Modules in Linux
	- https://www.redhat.com/en/blog/pluggable-authentication-modules-pam 
- 例如 ssh,cockpit 就是一种PAM
	- 有一些会有 ui配置界面，而不只是配置文件
- ![](https://www.redhat.com/rhdc/managed-files/styles/wysiwyg_full_width/private/sysadmin/2020-06/PAM_diagramm4.png.webp?itok=JW1jJKBz)


login 程序流程概览（过程中其他pam_ 模块也能参与）

- 使用 `libpam`验证 调用，询问“Is this user who they say they are?”
	- `pam_unix` 负责检查 本地账户authentication
- 使用 `libpam`验证调用，询问`is this user allowed to connect?`
	- `pam_unix` 完成相关检查（例如 密码是否过期）
- 使用`libpam` 调用 密码相关
	- `pam_unix` 写入 本地 shadow file
- 如果还成功了，那么会创建 session, 使用`libpam`发起 session 调用
	- `pam_unix` 写一个 登录 timestamp to the `wtmp`文件，其它modules 启用X11 authentication


**/usr/lib64/security**  

- 执行各种检查的 PAM 库集合。 这些模块中的大多数都有手册页面来解释使用情况和可用选项。

**/etc/pam.d**

- 用于调用 libpam 的应用程序的配置文件集。 这些文件定义了检查哪些模块、使用哪些选项、以何种顺序进行以及如何处理检查结果。 这些文件可能会在安装应用程序时添加到系统中，并经常被其他实用程序编辑。 
- 由于所有应用程序都要进行多项检查，因此这些文件还可能包含包含语句，以调用该目录中的其他配置文件。 大多数共享模块都存在于用于本地身份验证的 system-auth 文件和用于监听远程连接的应用程序的 password-auth 文件中。

**/etc/security**  

- 特定模块的附加配置文件集合。 某些模块（如 pam_access 和 pam_time）允许额外的检查粒度。 当应用程序配置文件调用这些模块时，将使用相应补充配置文件中的附加信息完成检查。 其他模块，如 pam_pwquality，通过将所有选项放在一个单独的文件中，而不是应用程序配置文件中的模块行，使其他实用程序更容易修改配置。

**/var/log/secure**  

- 大多数安全和身份验证错误都会报告到此日志文件中。 在此文件上配置了权限以限制访问。


## 组groups  /etc/group

格式:  `groupname:password:GID:group members`


```
root:x:0:
esakura:x:1000:
docker:x:987:esakura
```

增删改

```
groupadd
groupmod
groupdel
```

## user与group

`id` 查看用户的组信息

```
id esakura    
uid=1000(esakura) gid=1000(esakura) groups=4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),114(lpadmin),988(sambashare),987(docker),1000(esakura)  

id sambauser  
uid=1001(sambauser) gid=1001(sambauser) groups=1001(sambauser)
```

管理 usermod

## uid
- root 用户和组的 uid 和 gid 通常为 0，1-99 之间的 ID 也保留给其他系统账户使用。
- ID 99 之后的情况因操作系统而异。 
	- 例如，有些 *nix 系统会将 100-499 保留给动态系统配置（如安装的软件包需要 uid/gid），并从 500 开始分配标准用户账户的 uid 和 gid 号。 
	- 其他系统则为动态系统分配预留 100-999，并从 1000 及以上开始分配标准用户账户。(比如我现在的ubuntu)


如果一个 程序的 uid:gid = 1000:1000, 当前用户 是 1001:1001, 然后这个程序所有人都能运行， 那么程序在被运行时的uid:gid 是 发起运行的用户的uid:gid 而不是文件自身的uid:gid
- 所以文件
## 参考

https://www.redhat.com/en/blog/linux-user-group-management 这里面很多外置链接失效了

https://www.redhat.com/en/blog/linux-user-account-management

- passwd还可以锁定解锁密码，设置最小lifetime最大lifetime

```
passwd -e 用户名 # 下次登录时 过期密码
passwd -n <天数> 用户名 # 至少多少天才能修改密码
```

https://www.redhat.com/en/blog/user-account-gid-uid

```
文件 /etc/login.defs
PASS_MIN_DAYS 1
可以 让修改最小间隔为1天， 避免有的用户短时间从 密码A -> 密码B -> 密码A（原来的样子） 来绕过一些“更换密码要求”的安全策略
PASS_MAX_DAYS 60 
要求两个月要换一次密码
FAIL_DELAY 4
可以失败登录会有4秒惩罚，来避免爆破
UMASK 077
可以让新文件的创建mask都是600, 对应的如果022,那么创建的新文件mask都是644
```


## 问题

- 有办法建立层级系统吗?
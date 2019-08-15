---
title: nextCloud ! 真香
mathjax: true
date: 2019-10-22 15:09:01
categories: backend
tags: [dropbox,nextCloud,ownCloud]
---

# What

因为一些不可描述的原因，dropbox能用但是速度感人

现在需要一款能够 在 android+Linux+iPadOS三端做同步的

iPad上的Documents配上ssh可以完成Linux+iPadOS的同步, // android似乎并不行

google drive就和dropbox是同样的问题

baiduYunPan ??? 如果你不怕你的个人资料有一天变成 “根据相关法律法规” 的话 // 不过值得一提的是 这玩意支持linux了哦 虽然目测是个 浏览器壳 当然也就没有自动备份同步功能

然后搜了搜开源的 ownCloud 和 nextCloud ,看介绍基本是一家的

还有人说 用svn/git来搞，你确定喜欢在手机和ipad上输命令?

# 开干

client就不说了,各个平台下下来安装就行,说说 server

我目前的电脑环境`Ubuntu18.04 x86_64 Linux 4.15.0-65-generic , bash 4.4.20 , 15925MiB`

**警告第一条命令将会进入root,进入后你将有所有权限，请自重**

    sudo -s
    apt install apache2
    service apache2 start
    apt install mariadb-server
    mysql_secure_installation
    apt install php libapache2-mod-php php-mysql php-gd php-json php-mysql php-curl php-mbstring php-intl php-imagick php-xml php-zip
    apt install phpmyadmin
    ln -s /etc/phpmyadmin/apache.conf /etc/apache2/conf-available/phpmyadmin.conf
    a2enconf phpmyadmin
    a2enmod ssl
    a2ensite default-ssl
    service apache2 reload
    mariadb
    MariaDB [(none)]> CREATE DATABASE nextcloud;
    MariaDB [(none)]> CREATE USER nextcloud IDENTIFIED BY 'p@ssc0de';
    MariaDB [(none)]> grant usage on *.* TO nextcloud@localhost IDENTIFIED BY 'p@ssc0de';
    MariaDB [(none)]> GRANT ALL privileges ON nextcloud.* TO nextcloud@localhost;
    MariaDB [(none)]> FLUSH PRIVILEGES;

访问 https://localhost/phpmyadmin/

(用户名,密码)=(nextcloud,p@ssc0de)


去`https://download.nextcloud.com/server/releases/nextcloud-17.0.0.zip`下载最新的zip包 解压到 `/var/www/html/nextcloud`里

chown -R www-data:www-data nextcloud/

通过`https://localhost/nextcloud`即可访问 设置admin 密码，填写刚刚的配置即可

手机连接会无权限，跟着提示修改/var/www/html/nextcloud/config/config.php的配置即可

# 失败的尝试

下载`wget https://raw.githubusercontent.com/nextcloud/vm/master/nextcloud_install_production.sh`

然后`sudo bash nextcloud_install_production.sh`

`https://github.com/nextcloud/server` 下源码或者下releases

# nextCloud 额外的应用

把搜到的release包解压到`/var/www/html/nextcloud/apps`

在`index.php/settings/apps`中启用

例如

```
calendar.tar.gz
checksum.tar.gz
files_readmemd.tar.gz
richdocuments.tar.gz
spreed-7.0.2.tar.gz
```

# 参考

https://docs.nextcloud.com/server/17/admin_manual/installation/source_installation.html#example-installation-on-ubuntu-18-04-lts-server

https://github.com/nextcloud/server.git

https://nextcloud.com/install/#instructions-server

https://askubuntu.com/questions/387062/how-to-solve-the-phpmyadmin-not-found-issue-after-upgrading-php-and-apache

https://www.youtube.com/watch?v=QXfsi0pwgYw

# 总结

现在看来主要问题在于 直接snap的 会和当前本地开得一堆服务或多或少冲突？？ 我查运行状态 都是在运行，查端口 没看到监听

另外一个就是 文件夹权限要搞成 www-data:www-data

在一个就是mysql的db和账户创建,只玩过CURD，很久没摸也忘了

客户端口没啥难度

emmmmmmmm 似乎也不能在ipados上搞... 只能网页勉强

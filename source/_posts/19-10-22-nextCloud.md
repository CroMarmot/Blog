---
title: nextCloud ! 真香
mathjax: true
date: 2019-10-22 15:09:01
tags: [dropbox,nextCloud,ownCloud]
categories: [code, backend]
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

# Docker

1. 本地建立文件夹 `/data/nextcloudserver/` 给它存东西用
2. 一条docker命令`docker run -d -p 8080:80 -v /data/nextcloudserver/:/var/www/html --name=nextcloudserver nextcloud` ，注意docker的习惯冒号左边是宿主机器的东西，右边是容器内的东西，这里映射了端口和磁盘

这样就可以跑了，本地访问都是ui操作，没啥好说的

3. 配置`config/config.php`中的`trusted_domains` (无脑的话root进，或者docker起个busybox连接一下)，注意这里的写法是星号来匹配应该`192.168.*.*`，而不是`192.168.0.0/24`, 保存就行

## 或者官方的仓库下

https://github.com/nextcloud/docker/blob/master 文件夹`.examples/docker-compose/insecure/mariadb/apache`

执行`docker-compose up -d`

## 官方仓库自签https 证书

内网要用的话，可以考虑。毕竟没有CA中心，管内网的还是有办法搞你XD

`.examples/docker-compose/with-nginx-proxy-self-signed-ssl/mariadb/fpm`

sed玩得熟的可以sed替换哈

```diff
diff --git a/.examples/docker-compose/with-nginx-proxy-self-signed-ssl/mariadb/fpm/db.env b/.examples/docker-compose/with-nginx-proxy-self-signed-ssl/mariadb/fpm/db.env
index a436605..e9872a4 100644
--- a/.examples/docker-compose/with-nginx-proxy-self-signed-ssl/mariadb/fpm/db.env
+++ b/.examples/docker-compose/with-nginx-proxy-self-signed-ssl/mariadb/fpm/db.env
@@ -1,3 +1,3 @@
-MYSQL_PASSWORD=
+MYSQL_PASSWORD=123
 MYSQL_DATABASE=nextcloud
 MYSQL_USER=nextcloud
diff --git a/.examples/docker-compose/with-nginx-proxy-self-signed-ssl/mariadb/fpm/docker-compose.yml b/.examples/docker-compose/with-nginx-proxy-self-signed-ssl/mariadb/fpm/docker-compose.yml
index 3d60f7e..0d9fa81 100644
--- a/.examples/docker-compose/with-nginx-proxy-self-signed-ssl/mariadb/fpm/docker-compose.yml
+++ b/.examples/docker-compose/with-nginx-proxy-self-signed-ssl/mariadb/fpm/docker-compose.yml
@@ -8,7 +8,7 @@ services:
     volumes:
       - db:/var/lib/mysql
     environment:
-      - MYSQL_ROOT_PASSWORD=
+      - MYSQL_ROOT_PASSWORD=123
     env_file:
       - db.env
 
@@ -30,7 +30,7 @@ services:
     volumes:
       - nextcloud:/var/www/html:ro
     environment:
-      - VIRTUAL_HOST=
+      - VIRTUAL_HOST=nextcloud.cromarmot.com
     depends_on:
       - app
     networks:
@@ -59,11 +59,11 @@ services:
     volumes:
       - certs:/certs
     environment:
-      - SSL_SUBJECT=servhostname.local
-      - CA_SUBJECT=my@example.com
-      - SSL_KEY=/certs/servhostname.local.key
-      - SSL_CSR=/certs/servhostname.local.csr
-      - SSL_CERT=/certs/servhostname.local.crt
+      - SSL_SUBJECT=nextcloud.cromarmot.com
+      - CA_SUBJECT=cromarmot@example.com
+      - SSL_KEY=/certs/nextcloud.cromarmot.com.key
+      - SSL_CSR=/certs/nextcloud.cromarmot.com.csr
+      - SSL_CERT=/certs/nextcloud.cromarmot.com.crt
     networks:
       - proxy-tier
```

然后你需要在要连接的电脑上把hosts文件增加 ip到`nextcloud.cromarmot.com` 的映射

执行`docker-compose up -d`

# 移除

执行`docker-compose down`

注意，只会移除container和network，不会移除volume, 如果要移除，要手动移除

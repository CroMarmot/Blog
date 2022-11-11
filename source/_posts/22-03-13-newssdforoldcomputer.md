---
title: 给老电脑换个ssd, cheatsheet
date: 2022-03-13
tags: [ubuntu,ssd]
category: [backend,ubuntu]
mathjax: true
---

**带sudo的一定小心, 别选错盘了**

# 工具推荐

bcompare

gparted

# 常用命令

io测试

https://linuxreviews.org/HOWTO_Test_Disk_I/O_Performance#Testing_random_4K_reads

大块读`fio --name TEST --eta-newline=5s --filename=temp.file --rw=read --size=2g --io_size=10g --blocksize=1024k --ioengine=libaio --fsync=10000 --iodepth=32 --direct=1 --numjobs=1 --runtime=60 --group_reporting`

大块写`fio --name TEST --eta-newline=5s --filename=temp.file --rw=write --size=2g --io_size=10g --blocksize=1024k --ioengine=libaio --fsync=10000 --iodepth=32 --direct=1 --numjobs=1 --runtime=60 --group_reporting`

随机4K读`fio --name TEST --eta-newline=5s --filename=temp.file --rw=randread --size=2g --io_size=10g --blocksize=4k --ioengine=libaio --fsync=1 --iodepth=1 --direct=1 --numjobs=32 --runtime=60 --group_reporting`

<!-- more -->

带进度拷贝

```
rsync -aP <源> <目标>
```

磁盘情况查看

```
df -h
```

动态观察

```
watch
```

文件夹统计

```
du --max-depth=1 -h
```

停用swap

```
sudo swapoff -a
```

磁盘使用

```
iotop
```

进程状态

```
htop
```

停止挂载

```
umount /xxxxx(根据df看)
```

unmount时查看持有状态

```
sudo fuser -mv /media/xxxxxx
```

分区编辑

```
sudo fdisk
```

uuid

```
blkid
```

启动时mount `/etc/fstab`

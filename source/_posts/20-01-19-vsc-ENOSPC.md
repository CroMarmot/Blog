---
title: vscode use out my file watchers
date: 2020-01-19 11:20:14
tags: [vscode, ide]
category: [code, ide]
---

# ENOSPC

启动其它项目报错 `ENOSPC: System limit for number of file watchers reached`

也可能它自己报`Visual Studio Code is unable to watch for file changes in this large workspace" (error ENOSPC)`

多次尝试都是关掉vscode就好了，但之前一直没有更准确的定位问题,以及真的是它的锅吗

网上更多的说改改系统的最大限制吧。

先看看`cat /proc/sys/fs/inotify/max_user_watches`，大多都是8192，然后说改`/etc/sysctl.conf`改到`fs.inotify.max_user_watches=524288`

作为一个网易云音乐不用sudo启动不了就拒绝使用网易云音乐的人，又怎么会轻易该系统的东西//虽然linux是真的好改

我先是自己去看了 `ps -aux | grep code/code | awk '{print $2}' | xargs -I {} ls -1  /proc/{}/fd | wc` 占用不算多也不算少但是和8192还是差几个数量级(以2为基的数量级)

然后又搜了些资料，大概有`anon_inode`和`inotify`这两个关键字，但没具体说是怎么查看

最后是搜到了这个脚本

```
#!/bin/sh

# Get the procs sorted by the number of inotify watchers
#
# From `man find`: 
#    %h     Leading directories of file's name (all but the last element).  If the file name contains no slashes  (since  it
#           is in the current directory) the %h specifier expands to `.'.
#    %f     File's name with any leading directories removed (only the last element).
lines=$(
    find /proc/*/fd \
    -lname anon_inode:inotify \
    -printf '%hinfo/%f\n' 2>/dev/null \
    \
    | xargs grep -c '^inotify'  \
    | sort -n -t: -k2 -r \
    )

printf "\n%10s\n" "INOTIFY"
printf "%10s\n" "WATCHER"
printf "%10s  %5s     %s\n" " COUNT " "PID" "CMD"
printf -- "----------------------------------------\n"
for line in $lines; do
    watcher_count=$(echo $line | sed -e 's/.*://')
    pid=$(echo $line | sed -e 's/\/proc\/\([0-9]*\)\/.*/\1/')
    cmdline=$(ps --columns 120 -o command -h -p $pid) 
    printf "%8d  %7d  %s\n" "$watcher_count" "$pid" "$cmdline"
done
```

也就是 `/proc/具体pid/fdinfo/具体文件` 的以inotify开头的

这个也可以通过`/proc/具体pid/fd/具体fd -> anon_inode:inotify`查看有哪个`symbolic link`是指向`anon_inode:inotify`

可以看到其它的程序都用很少，就`idea-IU-193.5662.53/bin/fsnotifier64`和`/usr/share/code/code`使用是在4000数量级的

然后启动一个node 又是1000+

所以最后还是`改系统配置`+`改vsc的排除文件`

# inotify

TODO 记录的意义，和具体文件查看

`1024	inotify wd:175 ino:a7cc6 sdev:800002 mask:fc6 ignored_mask:0 fhandle-bytes:8 fhandle-type:1 f_handle:c67c0a00f48cb089`

TODO 我记得最开始跑脚本有看到vscode用8000+ 的难道我看错了？反正后来暂时没有重现

# vscode 的建议

一个也是改系统的

另一个是增加配置中`files.watcherExclude`的文件glob描述,增加以后 再启动似乎从8000+降低到1000+ (需要重启)

# 参考

https://howchoo.com/g/m2uzodviywm/node-increase-file-watcher-system-limit

https://unix.stackexchange.com/questions/15509/whos-consuming-my-inotify-resources/426001#426001

https://github.com/fatso83/dotfiles/blob/master/utils/scripts/inotify-consumers

https://code.visualstudio.com/docs/setup/linux#_visual-studio-code-is-unable-to-watch-for-file-changes-in-this-large-workspace-error-enospc

https://www.tldp.org/LDP/Linux-Filesystem-Hierarchy/html/proc.html

http://man7.org/linux/man-pages/man7/inotify.7.html

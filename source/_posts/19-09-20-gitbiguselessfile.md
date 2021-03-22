---
title: git 在历史版本中 完全移除文件
mathjax: true
date: 2019-09-20 15:09:01
tags: [git]
categories: [code, git]
---

# How

参考

https://www.cnblogs.com/amiezhang/p/11337095.html

上面链接都有讲

按照文件大小排序前100:

`git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -100 | awk '{print$1}')"`

`git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch 文件名' --prune-empty --tag-name-filter cat -- --all`

`git filter-branch --index-filter` 让每个提交的文件都复制到索引(`.git/index`)中

然后运行过滤器命令：`git rm --cached --ignore-unmatch` 文件名 ，让每个提交都删除掉“文件名”文件

然后`--prune-empty`把空的提交“修剪”掉

然后`--tag-name-filter cat`把每个tag保持原名字，指向修改后的对应提交

最后`-- --all`将所有ref（包括branch、tag）都执行上面的重写

`git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin`

`git reflog expire --expire=now --all`

`git gc --prune=now`

# 注意

1. 上面的文件名可以写通配符号

2. 众所周知只要我加到git中过的，即使把分支删了，也可以从reflog中找到，但这里 有 清除reflog所以 想要这样做的，要么 单独开文件夹搞，要么 确定 reflog都不会再用

3. 什么时候使用? 使用频率不应高，因为 这种操作无疑是会对 分支重写，也就完全不同的commit hash,所以最后push都会带上--force, 目前能想到场景,比如 不必要的大文件,如不小心提交的下下来的打包后文件,大zip.也有场景 比如 很多分支前 不小心提交了一个涉密的文件。 当然push force以后 所有用仓库的人要想继续用只有去新的分支里搞了，已经被别人下的还会在别人硬盘里


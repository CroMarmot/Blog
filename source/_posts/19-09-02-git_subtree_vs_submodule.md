---
title: git subtree vs submodule
date: 2019-09-02 11:20:14
tags: git
category: [code,git]
---

# 常用命令

## submodule

`git submodule add 仓库url`

`git diff --cached --submodule`

clone后

```shell
git submodule init
git submodule update
```

clone时自动 拉取`git clone --recurse-submodules`

`git log -p --submodule`

## subtree

`git subtree add --squash --prefix=文件夹名 仓库url 分支名`

分割

`git subtree split --prefix=文件夹名 -b 分支名`

配合remote使用

# 比较

|subtree|submodule|
|---|---|
|相当于拷贝文件甚至commit到当前仓库|相当于只记录了另一个仓库的某个提交的指针|
|因此 pull容易push难|push容易pull难|

# 参考

https://git-scm.com/book/en/v2/Git-Tools-Submodules

https://git-scm.com/book/en/v1/Git-Tools-Subtree-Merging

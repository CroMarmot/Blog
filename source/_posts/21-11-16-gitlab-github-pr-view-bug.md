---
title: 你所见的pr可能不是真正的变化(Gitlab/Github pr view diff bug
date: 2021-11-16
tags: [git]
category: [code, git]
mathjax: true
---

# 问题

因为工期，项目上有多个长分支，而最近在看pr的时候，发现有些已经合并过的，在页面上还是展示了变更，但是命令行里 直接diff两个分支不存在

# 复现

https://github.com/CroMarmot/gitlab-pr-view-bug/blob/master/reproduce.sh

```bash
# Init Repo
cd /tmp
mkdir gitlab-pr-view-diff-bug && cd gitlab-pr-view-diff-bug
git init
echo "Init" >> init
git add init
git commit -m "init"

# branchs
git checkout -b pre-release
git checkout -b common
git checkout -b feat

# some feature on feat0 branch
echo "feat0" >> feat0
git add feat0
git commit -m "file feat0"

git checkout pre-release
git merge --no-ff --no-edit feat
sleep 1

# some common update
git checkout common
echo "cmm" >> cmm
git add cmm
git commit -m "file cmm"
sleep 1

git checkout pre-release
git merge --no-ff --no-edit common
sleep 1

# feat use common and update some feature
git checkout feat
git merge common --no-edit
sleep 1
echo "feat1" >> feat1
git add feat1
git commit -m "file feat1"
sleep 1

# diff
git log --all --graph --oneline
echo "git diff pre-release feat"
git diff pre-release feat

echo "git diff pre-release..feat"
git diff pre-release..feat

echo "git diff pre-release...feat"
git diff pre-release...feat

echo 'git diff $(git merge-base pre-release feat) feat'
git diff $(git merge-base pre-release feat) feat

# clear
rm -rf /tmp/gitlab-pr-view-diff-bug/
```

输出

```
Initialized empty Git repository in /tmp/gitlab-pr-view-diff-bug/.git/
[master (root-commit) 7dbccd5] init
 1 file changed, 1 insertion(+)
 create mode 100644 init
Switched to a new branch 'pre-release'
Switched to a new branch 'common'
Switched to a new branch 'feat'
[feat 5e8b20f] file feat0
 1 file changed, 1 insertion(+)
 create mode 100644 feat0
Switched to branch 'pre-release'
Merge made by the 'recursive' strategy.
 feat0 | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 feat0
Switched to branch 'common'
[common 09a3969] file cmm
 1 file changed, 1 insertion(+)
 create mode 100644 cmm
Switched to branch 'pre-release'
Merge made by the 'recursive' strategy.
 cmm | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 cmm
Switched to branch 'feat'
Merge made by the 'recursive' strategy.
 cmm | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 cmm
[feat 9d8b809] file feat1
 1 file changed, 1 insertion(+)
 create mode 100644 feat1
* 9d8b809 (HEAD -> feat) file feat1
*   b9bfda6 Merge branch 'common' into feat
|\
| | *   376c6cc (pre-release) Merge branch 'common' into pre-release
| | |\
| | |/
| |/|
| * | 09a3969 (common) file cmm
| | * 5a08d58 Merge branch 'feat' into pre-release
| |/|
| |/
|/|
* | 5e8b20f file feat0
|/
* 7dbccd5 (master) init
git diff pre-release feat
diff --git a/feat1 b/feat1
new file mode 100644
index 0000000..d7c678b
--- /dev/null
+++ b/feat1
@@ -0,0 +1 @@
+feat1
git diff pre-release..feat
diff --git a/feat1 b/feat1
new file mode 100644
index 0000000..d7c678b
--- /dev/null
+++ b/feat1
@@ -0,0 +1 @@
+feat1
git diff pre-release...feat
diff --git a/feat0 b/feat0
new file mode 100644
index 0000000..05884ff
--- /dev/null
+++ b/feat0
@@ -0,0 +1 @@
+feat0
diff --git a/feat1 b/feat1
new file mode 100644
index 0000000..d7c678b
--- /dev/null
+++ b/feat1
@@ -0,0 +1 @@
+feat1
git diff $(git merge-base pre-release feat) feat
diff --git a/feat0 b/feat0
new file mode 100644
index 0000000..05884ff
--- /dev/null
+++ b/feat0
@@ -0,0 +1 @@
+feat0
diff --git a/feat1 b/feat1
new file mode 100644
index 0000000..d7c678b
--- /dev/null
+++ b/feat1
@@ -0,0 +1 @@
+feat1
```

注意到 上面 4种比较方式，前两种一致，后两种一致，而对于看一个pr导致的变化，更期望的是前两种(仅多了 feat1)而不是后两种(多了 feat0 和 feat1)

**但实际上 直接的 diff 也不是真正期望看到的，期望的还是如果merge以后和当前的差异 ** 

# 解释

搜到了一个`gitlab-ce`官方讨论的地方，大概意思是用的`git diff A...B`相当于`git diff $(git merge-base A B) B`

也就是 当`预发布分支 pre-release` 合并了公共的一个分支 `common` 后, 功能分支`feat` 页合并过公共分支后

那么`git merge-base A B` 去找的并不是`A`

而 你所看到的 pr 并不是真正的变化，就离谱

# 在线

看起来 github 还有这个问题

https://github.com/CroMarmot/gitlab-pr-view-bug/pull/1/files

但 gitlab官方似乎已经改了

https://gitlab.com/YeXiaoRain/gitlab-pr-view-bug/-/merge_requests/1/diffs

# 参考

https://gitlab.com/gitlab-org/gitlab-foss/-/issues/15140

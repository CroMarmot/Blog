---
title: vue 强制生产可调试
date: 2020-08-23 16:58:14
tags: [vue2]
category: [frontend]
mathjax: true
---

# 总

直接用devtools就不说了

现在说生产强制可调是，iqiyi为例

首先进入 vuejs.org 保证 控制版上有Vue标签

然后用同样的网页打开iqiyi保证 这个标签还存在

Sources->Page -> 右键 top -> search in all files

输入`file:* devtools` 搜索出文件

找到你觉得可能的文件（iqiyi是common.balabala...），格式化(chrome的花括号)，在`devtools:!1`执行后一句加断点。

刷新页面,在console中执行修改，例如`G.devtools = true;`，点调试的pause（暂停继续）按钮，切回Vue标签即可


---
title: linux 为什么比 windows 更安全
mathjax: true
date: 2017-02-15 01:01:01
tags: [article]
categories: [notes]
---

很久以前就有听说这个命题

但我始终也不能说出个所以然,最多的个人体验也就是root权限

知乎这种逐渐变为垃圾问答区的地方，显然是大量的0说服力的答案,慢慢变成百度知道了:-)

搜了一篇 ~当做英文休闲阅读了~

[original link](http://www.pcworld.com/article/202452/why_linux_is_more_secure_than_windows.html)

## 写在前面

 * windows的想法是好的,闭源比开源更难攻击
 * 事实上并没有得到预期的更好,由永无休止的补丁可证(?啊,Linux 没补丁的咯?) 

这里的意思并没有反驳闭源的安全性比开源更好 同样的linux(闭) > `linux(开)` > `windows(闭)` > 同样的windows(开)

安全性:同样`A`,`A(闭源) > A(开源)`，但开源带来的可以让`A`变成`A+` 那么安全性上,`A+(开)` 是可能 > `A(闭)`的

## 权限

windows
 * 日常运行 对于文件:高权限
 * 能够操作任何电脑上任何文件

Linux
 * 日常运行 对于文件:低权限
 * 只能操作当前用户有权限的文件

也就是说用户的文件等在Linux 还是有同样的风险? 

这里原文没有说细,[对于不同用户,windows是可以操作他人的文件,而linux可一通过权限控制在一个用户内+共享?]

小总结:Linux 也不是绝对可靠
 * 更难发生系统级别的破坏
 * 更难发生用户层面广泛的破坏

## 社社社...社会工程学

好吧 说得有那么一点道理 (这里也有`执行时需要权限`属于上一部分的东西)

病毒呢 传播时 通常诱导用户添加/点击/安装

说是windos呢 例子:给个带exe附件的邮件并诱导你下载点击，然后 就完事了 (简言之 点3下就可以入侵)

但是linux呢 你下下来给它执行权限`chmod`么才行(简言之 要执行过程复杂繁琐+运行有系统级别破坏时需要系统权限)

个人看法
 * 不认可
 * 如果把两边用户交换一下,linux 也能提供`点3下`就执行程序的,并且目前的易用操作系统的流程已经很简洁了
 * 感觉这一点 大自和`用户习惯`,`使用方式`,`社区安全`,`用的人少`相联系

## 单种效应

.......这个名词 瞎翻译的,说的是 windows就一个,但linux 有各种分支,不同的邮件客户端,不同的架构,然后病毒的兼容性很难实现.....

仔细想一想 还是有那么些道理的 但我只想到作为server端，比如架构

外网---我们的linux1---我们的linux2---我们的linux3---我们的linux4(服务)---我们的linux5(数据)

`那么要从外网进攻, 至少需要4个不同兼容性 而window就just do it again.... `
`讲道理的话....真有做这么多层这样防护的吗,目前只了解到 有 外网-server1-服务-数据这样的`

以及,本身作为非系统的server的话,在不同的linux之间的移植能力，也会比 攻击程序 的移植能力强。

感觉有那么一些道理,对我还不是太有说服力，感觉比第二点说服力强很多

## 用户多

个人看法
 * 不认可 
 * 这只能说可能是 `当下linux`比`当下window`安全的一个原因
 * 并不想讨论当下 我更喜欢数学上的 如果有相同的用户量呢 如果linux 比windows用户更多呢,如果真的是因为用户少而更安全,那我认为是无数学上的优势的
 * 其它看法linux desktop 少，但linux server多啊 虽然数据并不多到那里去[数据](https://en.wikipedia.org/wiki/Usage_share_of_operating_systems)

## 开源

就是上面我自己碎碎念的

大量的人能看到代码的bug,并及时去维护。

有利有弊吧

# 总结

啊,唯一让我满意一点的就是`权限`的说明了...

这篇文章也没有深入到系统里,感觉还是很表面的东西,不过windows也不开源,不知道能不能找到逆向工程出来的系统级别的,和linux的系统级别的深入比较的文章。。。恩 我不打算自己研究 还是看文章好了，期望能找到

之后在一个长篇的知乎回答上得到了一点对于`权限`的补充说明"其繁殖速度必须超过其死亡(被消灭)的速度"

所以,我现在能想到一个没有杀软的linux的进攻(相对于windows点3下)即是 下载并运行(社会工程学`:-)`)->写入用户的需要管理员权限的可执行文件/脚本文件?->用户执行了它->达到和windows点3下同样能达到的效果

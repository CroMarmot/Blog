---
title: Unikernels
mathjax: true
date: 2017-07-22 01:01:01
tags: [csp, system]
categories: [notes]
---

# Unikernels

相关连接

[1](http://blog.csdn.net/sunshine_dawn/article/details/54728751)

[2](http://blog.csdn.net/sunshine_dawn/article/details/74940296)

[3](http://tonybai.com/2016/05/16/understanding-unikernels/)

[4](https://www.zhihu.com/question/38158590)

虚拟化是不需要对用户程序更改提供的下层虚拟服务

这个实现在云端把它作为单目标程序的VM image

贡献：

1.提供单应用密封的程序 很适合云服务

2.评估了OCaml一种函数式语言 展示了类型安全 的好处 不会造成灾难性

3.lib和language扩展支持在OCaml上编码

基于hypervisor开发 而非硬件

§3 用Mirage的实现来描述一个unikernel的原型

牺牲向后兼容 显著 提高安全和性能

specialised, sealed, singlepurpose libOS VMs that run directly on the hypervisor

配置部署内置到编译过程中...???...

做了一些云端程序大小的优化

安全firstly by compile-time specialisation, then by pervasive type-safety in the running code + 基于hypervisor和ssl ssh等

在编译时尽可能的估计不需要的feature，从而减少image大小

多语言的支持 向后兼容 vs 效率 ,类型

单语言(类型 安全) 再用非OCaml的通过消息传递 来交流

single-address space 内存需要一次申请完 从而在隔离上基于hypervisor实现密封

运行时随机地址 保护

提供Xen VM 镜像 和linux 二进制可执行mirage

总之 我们用OCaml 我们觉得它吊

PVBoot  提供两个页申请slab & extent slab 用于支持c(用的不多 因为大多数代码是OCaml写的),extent是主要的 申请分配 虚拟地址 垃圾回收等，PVBoot还提供最基本的异步 事件驱动等

3.3 运行时语言 内存分为两个大堆(长期)和小堆(临时) ,通过对heap的分化 让垃圾回收管理所需要检测的部分变小，以及实现0拷贝I/O，基于PVBoot的domainpoll函数实现的并行，只有最外的线程main的loop需要C的外部事件其它都是OCaml的，用evaluator去唤醒轻量的线程，没有内部抢占和异步中断，试用本地key可以对一个thread进行定位从而操作。

3.4 设备驱动 基于hypervisor(Xen)的驱动 信号槽 事件通道 来支持USB PCI等，通过内联少量汇编和C结构 实现基本由纯OCaml实现。 I/O 零拷贝（grant table）自动垃圾回收(但仍然不能完全防止数据泄漏)  

3.5 Type-safe I/O  network(内部vchan+外部不同的lib对应不同的protocol 按照cstrcut分割) 网络DNS啊什么的更快(原理是给上层更多的底层控制?减少中间内耗？)

4 Evaluation

boot time(vs linux-pv 网络响应)Unikernels are compact enough to boot and respond to network traffic in real-time.

threading 因为少用户/内核切换唤醒时间 垃圾回收 感觉主要靠超页？ Garbage collected heap management is more efficient in a single address-space environment. Thread latency can be reduced by eliminating multiple levels of scheduling.

Networking and Storage (direct I/O 更高的throughput [relative](http://blog.csdn.net/guo_guo_guo/article/details/1647615)) 低内存拷贝 高cpu使用 和linux direct I/O比基本差不多 感觉那个表的意思是Mirage to Linux 的throughput更小??

实现了一些功能程序 =。= 然后比性能大小，还说For example, in the last 10 years the Internet Systems Consortium has reported 40 vulnerabilities in the Bind software.7 Of these, 25% were due to memory management errors, 15% to poor handling of exceptional data states, and 10% to faulty packet parsing code, all of which would be mitigated by Mirage’s type-safety.

活跃代码数=。= 感觉整个贡献也就很棒

总结也就和最开始的贡献总结一样

type-safe????

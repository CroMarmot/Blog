---
title: Singularity:Rethinking the Software Stack
mathjax: true
date: 2017-07-22 01:01:01
tags: [csp]
categories: [notes]
---

# Singularity: Rethinking the Software Stack

1. software-isolated processes for protection of programs and system services
2. contract-based channels for communication
3. manifest-based programs for verification of system properties

现有的系统在一些结构上还是采取老的方法,这个Singularity项目就是要复审现有的软件的常见问题 widespread security vulnerabilities; unexpected interactions among applications; failures caused by errant extensions, plug-ins, and drivers, and a perceived lack of robustness.

## 1 new os ,new program language(Sing#(extension of C#)) and new software verification tools，安全的编程语言能避免许多安全问题，verification tool也能提前检测出一些，增强的系统架构，作者也说这个Singularity在它们看来是个过程和意见 不是最终的一个完善的系统。

## 2 提供简易但能根据简易的实现更丰富的实现

### 2.1 Software-Isolated Processes

利用现代编程语言的类型和内存安全来说动态减少用于隔离的代码,两个程序间不能直接的内存操作，要么信号传递要么用特殊的交换heap，这样设计的sip是自动运行的，每一个sip有它自己的数据框架，运行时系统，垃圾回收，不能运行时加代码，新建sip和host的sip是隔离开的，易于去分析，最近也有paper对这种sealed processes的好处和trade-off进行分析.基于语言类型和内存安全用软件静态+运行时分析？？？这么吊？不需要硬件？通过这样多个程序甚至可以使用同一个大的虚拟地址，因为每个都不会超过它自己的SIP的范围，Aiken比较了硬件和软件用来孤立的trade-off，SIP减少page table切换 TLB，这个实验的关键就是建立一个用SIP的系统并论证它更加可靠..

### 2.2 Contract-Based Channels

通过合约channel (In the Sing# language, the endpoints are distinguished by types C.Imp and C.Exp , respectively,), 这里给的是状态来表示 以及状态转移所要进行的操作的伪代码 总之细节也记不很清，如果以后要做相关的可以来参考，这里这样是表达了所有的操作按照一个Contrat，这样是高效并且在SIP之间的交流是可以分析的，之后结合上线性类型Singularity也支持了SIP之间进行大数据的零拷贝的channel,作者说验证器开发了很久，因为它无法预测输入的数据不足的情况，并且这个bug也存在了很久，(最后的解决办法是在可能触发的几秒钟内再进行判断？？？) 总之通过channel 提供了分离 易于静态分析 减少一定的动态检测  并且动态也能去检测故障

### 2.3 Manifest-Based Programs

用户需要执行的时候不是给一个exe一样的而是给系统一个manifest，它包含source程序的位置以及要依赖的程序的信息(感觉就和Android中的权限需要 先在manifest的样子很像)，通过manifest的提供 可以静态动态的分析 依赖，以及检测是否可以支持,总之MBP很强 是MSIL的一个扩展=。= 有助于 各种检查

## 3. SINGULARITY KERNEL

提供最基本的 software-isolated processes, contract-based channels, and manifest-based programs的抽象,To each SIP, the kernel provides a pure execution environment with threads, memory, and access to other MBPs via channels. 主要90% 使用Sing# 类型安全的语言写的 有垃圾回收机制，最主要的unsafe的代码是是实现垃圾回收的=。= 并不懂它这种48%的计量方式是什么 以及这么具体干嘛=。=`_(:з」∠)_` 这也就不继续说语言组成的细节 具体看paper，总的说它是microkernel 所有的protocol 文件系统都是在核外,

## 3.1 ABI

Application Binary Interface (ABI) 确保最小 安全的 孤立的 每一个SIP的计算环境,ABI通过 终端的channel进行信息交流,ABI 将 accessing primitive和process-local operations 区分开，这种区分在进过通道时作为一个参数，静态分析可以利用这个信息进行分析，......比如静态分析可以知道没有使用网络channel的就没有能力发送DDOS攻击......

不是很懂这一段 怎么设计的功能有192个 又很多 又不包括一些类似win和linux的复杂的,ABI保证任何SIP不能通过ABI函数‘直接’改变另一个SIP的状态，保证了每一个SIP自己的控制权，这样让每个SIP依赖与软件层面的孤立而不是硬件的保护,然后它们的消耗比普通的函数调用消耗更大

3.1.1 Privileged Code 由于类型安全和内存安全，SIP提供了权限指令更加宽松的 执行范围，SIP并利用这种safe in-line技术 来优化channel 交流

3.1.2 Handle Table 通过强类型控制表保证SIP的跨ABI的操作例如 mutexes和threads不会被篡改，

### 3.2 Memory Management

又是说以往的内存的虚拟内存每个SIP一个管理,就算是分享 也是 指向自己的虚拟地址，不会指向其它SIP的虚拟地址，因此易于垃圾回收。

3.2.1 Exchange Heap 每一个SIP之间交换的数据需要放在交换heap中(Figure 3),交换heap中的指针只会指向交换heap中，在运行时同一个heap在一个时间最多被一个SIP拥有，静态分析能确保SIP不会访问一个dangling pointer.为了能静态分析....在执行时一个SIP最多有一个指向block的指针，Singularity保证一个SIP在发送一个block数据后不再拥有修改它的能力

### 3.3 Threads

所有tread是内核tread ，也就是内核可调度的,性能差不多 因为不需要内核权限和protected mode

3.3.1 Linked Stacks

3.3.2 Scheduler 用一个 unblocked list 和一个preempted list来,和普通发信息一样它也是发送信息，block等待返回，Singularity允许 一个SIP中的线程切换到另一个SIP上的线程，需要394个周期

3.4 Garbage Collection

大多safe language 中都有垃圾回收，Singularity的每个SIP有它自己的垃圾回收功能，又pointer不会跨SIP等前面的限定让系统能够很好的垃圾回收。现在运行时的垃圾回收有五种 generational semi-space, generational sliding compacting, an adaptive combination of the previous two collectors, mark-sweep, and concurrent mark-sweep.现在系统用的是concurrent mark-sweep collector

3.5 Channel Implementation

0allocated ,用Sing#实现，状态转换的每个周期至少一次发送和一次读取，这样保证了不会有终端无限发送而不等待，看上去这个规则过于严格，但实践没发现有放宽的需要,预申请终端的queues并把指针指向exchange heap 很自然的能够实现0拷贝的多SIP子系统

### 3.6 Principals and Access Control

# 4. DESIGN SPACE EXPLORATION

 Singularity’s principled architecture, amenability to sound static analysis, and relatively small code base make it an excellent vehicle for exploring new options. In the following subsections, we describe four explorations in Singularity:

* compile-time reflection for generative programming, 
* support for hardware protection domains to augment SIPs, 
* hardware-agnostic heterogeneous multiprocessing, 
* typed assembly language.

## 4.1 Compile-Time Reflection

The Java 有运行时的反射,We have developed a new compile-time reflection (CTR) facility . Compile-time reflection (CTR) is a partial substitute for the CLR’s (common language runtime) full reflection capability. The core feature of CTR is a high-level construct in Sing#, called a transform, which allows programmers to write inspection and generation code in a pattern matching and template style. The generated code and metadata can be statically verified to ensure it is well-formed, type-safe, and not violate system safety properties. At the same time, a programmer can avoid the complexities of reflection APIs.

## 4.2 Hardware Protection Domains

大多的os用cpu的mmu 硬件来孤立进程通过两种机制 ——1.进程只能访问具体的一些物理地址，2.使用privilege levels保护 执行权限指令的不可信代码.

主要讲的还是 权限的分配


## 4.3 Heterogeneous Multiprocessing

# 5. CONCLUSIONS

* how to make more dependable software systems
* software isolated processes (SIPs), 
* contract-based channels, and 
* manifest-based programs (MBPs).

# 总结

读后感 首先其的设计方法 还是让我有新的获取，

依然是对type-safe 的语言 一脸懵逼 问了问ssj，他说开学给我说` _(:з」∠)_ `向大佬低头

然后就是一点感悟，不知道其它学科 往研究方向是怎么走的，至少目前看到 系统相关的 很多东西都不是”站在巨人的肩上“ 更多的像是”听了巨人说的话“，毕竟它和实际的联系会有更紧密一些，向文中的很多驱动啊什么之类的都是巨大的工作量，当对底层有修改想法的时候，还需要去考虑对上层的支持，因此这样一个就算十分优秀的想法，想要实现，想要验证，甚至想要应用都需要大量的时间和物力去支持。

我不知道未来会怎样，不知道如果我去研究会做出多少贡献，又能有多少支持。如果梦想养不活你，就挣钱养活梦想吧。


---
title: Rowhammer.js
mathjax: true
date: 2015-07-24 01:01:01
tags: [rowhammer]
categories: [code, security]
---


[Rowhammer.js: A Remote Software-Induced Fault Attack in JavaScript](https://arxiv.org/pdf/1507.06955v5.pdf)阅读整理 

 - 非逐字逐句翻译
 - 序号不完全代表段落

# Abstract

 1. 概述Rowhammer.
 2. 别人要cache flush 指令以及高频率搞DRAM,但我们克服了这个限制,通过利用cache替换法来诱发Rowhammer,并且只用了常规内存访问,这让rowhammer在高严格甚至脚本环境里都能被触发.
 3. 我们将演示完全自动攻击,仅需要带JS的网页来引起远端硬件出错,由此我们可以自由的访问网络浏览者的系统,我们表明,攻击在现成的系统上工作。现有对策无法抵御这一新的Rowhammer攻击

# Introduction

 1. 利用硬件错误攻击通常需要物理访问改变设备的状态,然而软件诱导是可行的,85% 的 DDR3 块被Kim测试可以诱发位翻转,最近DDR4 也被发现可以被诱发,Seaborn证明了位翻转可以用来提升权限,但这些都用了底层代码并且使用了特殊指令——把cache刷入内存.
 2. 如果DRAM是有弱点的,我们可以不用任何特殊指令,仅仅利用常规访问和cache剔除法则在所有架构上实现。因此这是一个通用的,可以被部署在任何体系结构,编程语言,运行环境,只要它允许产生巨大的内存访问流,因此如移除clflush指令的抵抗手段并没有任何卵用。更吊的是,我们将向你展示用JS对远端有弱点的模块上进行攻击。
 3. 因为这个攻击通过网页同时并偷偷攻击数以亿计的设备,所以它是个严峻的安全威胁,rowhammer.js 不依赖任何CPU指令,他是第一个远端硬件错误攻击.为了证明我们实现了一个能在所有ff和chrome上运行的js代码.
 4. 我们用了4步, 1找两个不同的行的两个地址,2高频率剔除再重载这两个地址,3找寻可利用的位翻转,4利用它(控制页表 远端代码执行)
 5. 第3,4 步最近已经解决.........但第一二步保持开放的挑战[毕竟要做到任意性还要ff和chrome的解析器适应性和ff和chrome的更新吧orz]
 6. 第一步挑战是用js收集物理地址的信息,它是严格沙箱,没可能收集虚拟或物理地址。为了应对这个挑战,我们决定部分物理地址使用大数组,它们被操作系统分配到大页上,我们因此不利用任何的JavaScript或浏览器的弱点,只有利用系统级别的优化.
 7. 第二步是找到能替代clflush指令的cache替代策略,老版本CPU简单的访问n+1个地址就足够剔除n路cache。 过去4年 Intel CPU生产的CPU使用Sandy Bridge,替换法则变化了并且没文档.因此已知的剔除策略的乘剔除率降低或者需要相当多的执行时间。为了应对这个挑战，我们提出一个通用的方法来找cache替换策略以此来达到时间和剔除概率的最好性能.我们提出的是目前最好的剔除策略，在现在Intel架构上比以往的一切都做得要好

实验装置:

| Platform| CPU| Architecture |RAM|
|---|---|---|---|
|Lenovo T420 |i5-2540M |Sandy Bridge Corsair DDR3-1333 8 GB and Samsung DDR3-1600 4 GB (2×)|
|Lenovo x230 |i5-3320M |Ivy Bridge| Samsung DDR3-1600 4 GB (2×)|
|Asus H97-Pro |i7-4790 |Haswell| Kingston DDR3-1600 8 GB|
|ASRock Z170 ITX| i7-6700K |Skylake| G.Skill DDR4-3200 8 GB (2×) and Crucial DDR4-2133 8 GB (2×)erimental setups|

~~羡慕 别人的玩具比我日常使用的电脑还好~~

 1. 基于这些方法我们使用两阶段攻击未知配置的远端硬件
 2. 我们对比了上表列出的机器在固定配置rowhammer攻击下的状况，一些有和期望的样(挂了),另一些降低了刷新速率
 3. 至今软件对Rowhammer本机代码袭击的反抗也只是针对特定的利用,如我们所展示的，不足以保护JS的攻击，硬件防护难以部署,因为他们不影响传统的硬件,包括最近脆弱DDR4,BIOS更新可以用来解决这个问题在商品系统中,然而这仅仅是一个高端玩家的实际的解决方案
 4. 总之我们的贡献是:
 - 我们提供第一个完全获取Intel CPU的cache剔除规则的方法,这也有益于更广阔的领域。缓存攻击,缓存无关算法、缓存替换策略。
 - 我们用只访问内存的本地代码实现Rowhammer攻击。攻击在 Sandy Bridge, Ivy Bridge,Haswell and Skylake, 不同的 DDR3 and DDR4 都成功
 - 我们用纯js实现了rowhammer

# 背景知识

 - DRAM 介绍
 - rowhammer 介绍
 - CPU cache 介绍 以及别人没文档的也被反向工程了,o1表示双核cpu哪个cache来存 [o1,o2]表示4核CPU哪个cache来存,有几款CPU能自适应替换规则orz
 - Cache Attacks and Cache Eviction Practical attacks on cryptographic algorithms have been explored thoroughly [8,31]. There are two main types of cache attacks called Prime+Probe and Flush+Reload
 小总结: 他们的不同缺点:慢,兼容性差,手工循环列,用了反向工程,用了刷cache的指令,低剔除率

# 2阶段剔除策略

 这是一个完全自动找 Sandy Bridge的cache剔除策略的方法

 基于Prime+Probe并显著提升了cache攻击

 CPU 替换法不同影响了剔除集合的大小，访问模式需要建立一个高效的回收策略

 对于伪LRU,访问很多L3 cache相互冲突的目标地址,高可能的剔除,但对于适应性替换法,一个剔除策略可能在一个替换法下有效,在另一个替换法无效, 因此有必要搞一个理想的对两个都有效的并且不会有明显的时间开销

 1. 静态集合和静态访问:用极短的时间利用cache片函数和物理地址并生成一个预序列.见3.2 3.3
 2. 动态集合和静态访问: 自动计算驱逐模式,不用任何系统的知识,例如的核心。良好的访问模式去匹配到目标系统的替换法对于一个成功的攻击是必要的。见3.3
 3. 动态集合和动态访问: 自动计算驱逐模式,不用任何系统知识,但需要大量的测试,并可自动攻击未知系统。见3.3
 4. 静态集合和动态访问: 使用预定义的集合 但顺序是自动化计算的 在理论上可行[这很理论:-)] 但并没有任何优势. [羡慕严谨_(:з」∠)_非要把四个列出来]

 搞了离线[没有文档]和在线[未知系统]

# 剔除模型

 成功率来自很多一个mem是否被剔除了的测试

 1. 在同一个cache上的命中和不命中有可观的影响,我们通过一个剔除算法和添加不一致的随机内存访问来验证,剔除率=剔除函数的平均成功率,并且只要时间正常,剔除函数成功率并不会收到添加了随机访问影响,因此,驱逐集只包含一致地址和驱逐策略的有效性取决于驱逐集合大小。
 2. cache无法区别缓存,我们用a_i来表示访问序列,每一个a_i表示一个(一一对应),因此每次通过控制序列来决定访问哪个地址,a_1 a_2 a_3 序列等于任意一个 a_i a_j a_k 只要i,j,k 两两不等,如果在一个循环中运行,不同的内存地址的数量影响驱逐策略的有效性
 3. 重复访问同一个地址有必要把它留在cache 里,因为替换法会把旧的cache line 用新的cache line 替换掉 ,把a_1 ... a_17序列变成a_1 ... a_17 a_17 在Haswell上快了33%,如果重复执行它显著的提升乐剔除率,因为 cache 被我们的驱逐集填满了,但为我们发现一个随着访问同一个地址增多的边际效应递减,对所有地址我们发现到达一个阈值以后随访问增多剔除率在下降,因此 我们搞了S大小的集合剔除策略,但每轮只是该集合D大小的子集访问,再通过一个参数L来引起循环中能有重复的地址访问。
 4. 虽然在实际时间(第二类Stirling数 是很好的估计值)内测试所有可能序列甚至很短的序列不太可能,但探索能影响系统的参数是可能的,根据理论,更好的剔除策略不能被这种减少搜索空间方法找到。但用这种方法,我们可以找到有效的能引起rowhammer的驱逐策略.通过系统的比较驱逐策略,我们使用以下代码展示的方法, P:**C-D-L-S**, C决定每轮循环访问每一个内存的次数,D决定每轮访问不同的地址的个数,L是大循环的跳动步长,S是集合大小,比如LRU剔除序列是P:1-1-1-S,也就是a1 a2 a3...aS

```
for (s = 0; s <= S -D ; s += L)
  for (c = 0; c <= C; c += 1)
    for (d = 0; d <= D; d += 1)
      *a[ s+d ];
```

## 离线测试
  在离线阶段,攻击者试图学习他控制的一组机器每台最接近的驱逐策略相匹配的替代法。这不是严格意义上的替代法的逆向工程,通过找到最好的剔除策略,攻击者就弄清了系统。在这个阶段,攻击者没有时间限制 
  我们讨论对Haswell platform 单DIMM单channel 的具体评测,我们测试了6阶 不同的C D L 参数和23种不同的 剔除集合大小,为了找到快且足够有效引起rowhammer的剔除策略,包括相同的剔除策略,我们在我们的3个平台上测试了18293种策略,我们用20 双向 rowhammer 测试测试了每个剔除策略2百万轮(每个策略8千万次) 且 用不同的评估标准对它们进行评估,包括 剔除率 运行时间 cache命中/不命中率.总运行时间大于6天. hammering 是对一组固定的物理地址的一个特定的缓存设置的驱逐策略的公平比较.在进行到一半的时候(4千万) 我们测试了剔除率,命中/不命中,后一半我们测试剔除的平均时间,我们通过足够多的样本容量验证了可重复的测量
  位翻转的数量并不适合作为剔除策略有效性的评判标准,只有判断是否以及如何让cache命中不命中才是有用的,执行时间和剔除率影响一个位翻转的可能性,位翻转在内存位置是可重现的,但是需要的时间和需要访问的次数变化很大,为了测了一个剔除策略的平均访问次数,我们需要用很多小时测试每一个剔除策略,这很难...,它也不会产生可重复的结果,并已经观察到如果一个DRAM被hammer很长时间 它就会永久损坏.
  长执行时间引起位翻转太慢,短时间没有好的剔除效率也没什么作用。剔除策略的执行时间和两个victim address的访问次数直接相关,因此它直接影响一个bit的翻转概率,在我们默认配置的Ivy Bridge书上我们观察到每轮hammer导致的位翻转要用1.5ms的执行时间,也就是在总的刷新时间64ms内大约对每个地址21500次访问的数据结果。这与刷新间隔tREFI有关(把64ms分成8192份？),在我们的Haswell测试系统上两路rowhammer只需要60ns通过clfLUSH,也就是64ms进行了每个地址60万次的访问(解释图1a)
  解释图1b.99.75%剔除率可以导致81%的位翻转(你们考虑过 Haswell system的感受吗)就是说 剔除率越高越好
  解释图1c 1d 的cache hit和cache miss 对位翻转的影响相关性小，真正相关的还是剔除策略
  4个图得出的结论是剔除率是一个剔除算法的好的指标,然后再在中间找执行时间少的,并且这种方法需要js这类不需要任何系统接口的

Haswell test system 上的 和clfLUSH(第一行)比较

|C |D| L| S| Accesses |Hits| Misses| Time (ns)| Eviction|
|---|---|---|---|---|---|---|---|---|
|- |- |- |- |- |2| 2| 60| 99.9999%|
|5 |2 |2 |18| 90 |34 |4 |179 |99.9624%|
|2 |2 |1 |17| 68 |35 |5 |180 |99.9820%|
|2 |1 |1 |17| 34 |47 |5 |191 |99.8595%|
|6 |2 |2 |18| 108| 34| 5| 216| 99.9365%|
|1 |1 |1 |17| 17 |96 |13| 307| 74.4593%|
|4 |2 |2 |20| 80 |41 |23| 329| 99.7800%|
|1 |1 |1 |20| 20 |187| 78|934| 99.8200% |

  以上测试结果是在LRU上 5-2-2-18和2-2-1-17 只用180ns左右 比较优秀 而并不是1-1-1-20 无论是率还是时间

  并且在eviction 循环里增加内存访问 可以减少时间

  总之新找到的比原来的 时间 和 效率都要强

  然后 还进行了Ivy bridge上的测试 也能高达99%的剔除率 然后也列了相关测试性能好的表 

  Skylake DDR4 上测试不太一样 但它很容易被8核逆向工程函数突破 并且再次发现 LRU剔除方案工作得更糟(1-1-1-X ?)

## 在线测试

 目标是未知系统,特别的微体系结构和数量的CPU核都是未知的,攻击者只有离线测试所储备的知识,他在目标机器上没有特权也没有时间去运行广泛的搜索,在线攻击通过两种/步:以假设为基础的攻击 和一个备用攻击(如果第一个没有效果的话),这两种 都需要花一些时间 并且没有系统的特殊接口

23: Liu, F., Yarom, Y., Ge, Q., Heiser, G., Lee, R.B.: Last-Level Cache Side-Channel Attacks are Practical. In: S&P’15(2015)

27: Oren, Y., Kemerlis, V.P., Sethumadhavan, S., Keromytis, A.D.: The Spy in the Sandbox: Practical Cache Attacks in JavaScript and their Implications. In: CCS’15 (2015)

### Assumption-based Attack 

  首先通过时间表现 看看是不是离线测试过的机器中的一种或类似(因为并不能调系统函数来知道是啥) 只要匹配到了 就把之前离线得到的方案拿来试一试 这只需要很短的时间,并且 eviction 集合 可以静态或者动态计算处 我们在别人的基础上搞了一个动态生成集合算法 因此我们的静态算法产生的动态序列能最小化执行时间.

 一个假设是大**大数组占大页**,基于这个假设他们用下面这种 slice pattern 来判断 4核/2核 4KB 的slice 和 2MB的page 的映射法

0123 0123 0123 0123 1032 1032 1032 1032 2301 2301 2301 2301 3210 3210 3210 3210
1032 1032 1032 1032 0123 0123 0123 0123 3210 3210 3210 3210 2301 2301 2301 2301
2301 2301 2301 2301 3210 3210 3210 3210 0123 0123 0123 0123 1032 1032 1032 1032
3210 3210 3210 3210 2301 2301 2301 2301 1032 1032 1032 1032 0123 0123 0123 0123

 针对Sandy Bridge architecture

 Oren et al. [27] or Liu et al. [23] 的算法 只能找到 在同一个cache slice 和cache set 的地址

 我们用它可以找到 eviction set 在2mb 一致对齐的地址cache集合 同slice的

 子驱逐集 的计算 静态的取决于 复杂的地址函数 和 确定的2MB offset

### Fall-back Attack

 如果上一个攻击失效了 也就是说 目标机器并不属于离线测的机器中的一种类型 ，那么我们将用另一个方法来找能触发 位翻转rowhammer的剔除策略

 我们扩展了 Oren et al. [27] or Liu et al. [23]的 1-1-1-X算法 来计算剔除策略 通过利用 动态的集合 和 动态的序列

 1. 我们不断的给策略集合增加很多地址,让它足够访问同一个地址有驱逐策略,我们已经知道 当策略集合足够大时我们就能清晰的测试出 剔除的目标物理地址的大小
 2. 当剔除率大于设置的阈值 通过利用集合里的地址相互替代 并不会降低剔除率的话 这样 访问次数不下降但是 集合大小下降 因此降低了个数和执行时间,最后移除不会降低剔除率也不会增加时间的元素,再一次减少了不必要的 hit 也就减少了执行时间。

 这样找到的集合 既不会访问很少访问的地址 每一个重复访问都对驱逐率有贡献。因此它们接近于静态剔除策略 这样找到的访问集合的剔除率完全接近攻击者设置的剔除率阈值中低运行时间的,如果把阈值设定得足够高,那么在时间中就很可能引起位翻转,那么这种用fall-back找到的剔除策略就能用来攻击
 这种算法要用一个函数cached(p) :这是尝试驱逐一个目标地址p的函数 通过现在的驱逐策略,集合以及通过访问时间时间判断p是否被cache了,解决方案的优劣取决于这个函数在测试中的表现,如果驱逐率低于攻击者设定的阈值那么函数返回真,大量的测试增加了执行时间和二元决策性的正确性，解释图4 时间 和剔除率的关系,如果高剔除率是十分必要的,那么执行时间可以超过40min,因此我们的算法预计算剔除策略一次,之后的剔除集合用固定的剔除算法在几秒内完成。


## 实现以剔除为基础的rowhammer

 下面开始我们的表演:-) 

 首先我们证明 只要攻击者能用native code 攻击 我们就能攻击

 然后我们通过拥有物理地址的知识，证明用js引发远端机器位翻转的可能性

 最后我们证明仅用js(不用额外信息)可以完成完整的rowhammer攻击

### Rowhammer in Native Code

 我们用我们找到的最好剔除策略扩张了Dullien的 double_sided_rowhammer 程序,首先clflush 用p:2-2-1策略替代了,这个剔除集合是既有预先的静态计算物理地址映射关系，也有完全地址函数以及动态剔除策略计算算法。通过这样我们可以在前文说到的四种机器上可重复的产生位翻转

 但是Haswell 我们以及clflUSH都不太能搞定，因为我们调高了刷新频率的参数tREFI,是一个游戏爱好者和超频社区用来提高性能会改变的.当然这是一个很有趣的课题,我们甚至想分析刷新率对rowhammer攻击适应性的影响.Kim[见论文20]勘探出刷新率直接影像位翻转数.这个参数对js引起的rowhammer同样适用。

 降低刷新率并对于真实攻击并不现实,已有的工作已经研究了Rowhammer的可攻击流行度, 发现85%DDR3被测试是易受到rowhammer 位翻转进攻的.只有Haswell test system and the G.Skill DIMMs in the Skylake test system在默认设置下是不易收到进攻的。因此我们的结论并不否定之前的预测,并且我们必须假设还有百万数量级的系统依旧脆弱.
 
 rowhammer剔除策略被google native client 用在native code开发重现 这回允许在google chrome的权限提升,clfLUSH 指令已经被列入黑名单,然而这并没有卵用,我们用剔除法任然在GNC上引起了位翻转，从沙箱中脱离任然可能。

### Js Rowhammer

 用js引起rowhammer更难,因为js没有虚拟地址或者指针,没有对物理地址的映射,我们观察到在最近版本的ff和chrome的linux版本上js会把大数组分配到1MB对齐并使用匿名2MB大小 只要可以。这个原因在于由操作系统实现的内存分配机制，任何内存分配 在类似脚本语言和环境也会导致为大数组分配匿名的2MB页的。

 通过一个类似Gruss 的一个时间攻击表现,我们推断出了浏览器的2MB页框,在这种攻击中,我们遍历一个数组和测量的访问延迟,延迟的峰值,在内存初始化的时候发生,由缺页引起,它发生在每一个新的2MB页 (见图5),在最新版本的浏览器也是这样的 ,尽管被Oren提出了减少时间精度并被W3C加入了HTML5标准,因此,我们知道虚拟和物理地址的最低21位知道数组中的偏移量。

 证明第一个概念,我们用js在ff上重现了native code 能做的准确物理地址rowhammer,为了做这个我们造了一个工具来把物理地址转换为虚拟地址，为了计算驱逐集我们用假设基础的算法,我们观察到简单的内存访问例如我们的native code 实现的那样没有被即时编译器优化。
 最终以js为基础的攻击 不需要任何外界的计算 因此它运行完全不需要用户交互。它利用大数组被分配到2MB大页的西现实，因此我们知道每一个我们的数组在2MB 页里面被分成了16行偏移的每行128KB(取决于低位的index位).我们现在来展示double-sided hammering 在这些2MB区域来诱发位翻转,或者提升单向hammering 在每2 mb的页面的外两行来引导另一个2MB区域的位翻转,这是史前第一个用JS实现的网站远端硬件错误攻击。

### 攻击评值

 如Kim 论文[20]所描述的,DRAM里的地址能被位翻转的可能性不同,因此为了公平的比较不同的技术，我们测试了位翻转的数量对一个已知易感染的固定地址对。(图6)显示了在固定时间间隔内不同设置，不同的刷新频率如何影响位翻转。系统在测试时有轻微的使用(浏览,在编辑器里打字等等),如果刷新间隔设置得让clfLUSH指令可以引发位翻转,他们也就能被native code 剔除引发。为了用js引发位翻转略高的刷新间隔是必要的,再一次,如果特殊的DIMM刷新率设置得当,那么一次位翻转都不会发啊生。
 
 js的位翻转的概率略低于native code.并且native code 稍微快一些，然而,只要一个机器可以被native code 实现易受害的,那也有被js 实现的能力。我们通过测试在不同的几个机器上验证了这种情况。
 
 虽然DDR4被认为对rowhammering对策,对策不是最终DDR4标准的一部分。使用严格的DDR4 DIMM 我们也能诱发位翻转在默认情况下 在最新的BIOS版本中,(用了反向工程后)。在G.Skill DDR4 DIMMs我们只有增加刷新间隔才能引发位翻转。所以说在最近的系统 硬件 软件 都没有对rowhammer的有效对策。是否会受到rowhammer的攻击的关键在于DIMM的刷新时间间隔的值

# 讨论和相关工作

 现有的攻击假定页表被映射在攻击者占据的两行之间的行中，然而我们发现在实践中几乎不会发生。操作系统喜欢用大页来减少TLB的压力，为了让操作系统易于组织和易于做物理地址的映射,这操作系统还把小的页装进了相同的物理组织框。在near-out-of-memory的情况页表只被分配在两个用户页。因此利用几乎所有系统内存才能强行造出这样的情况。然而换页在主流操作系统中是默认可用的，因此系统由于换页会产生严重的迟钝。在我们的利用的概念证明中，我们演示了放大单向rowhammer.通过锤击两个相邻行，和单面锤击相比我们显著的增加了位翻转的可能性。这允许甚至具有高概率在的2MB物理地址相邻区域的跨越边界引起位翻转，当我们已经能够用js引发位翻转我们就将目光集中在怎么类似之前的利用方法来利用页表，攻击者可以重复任何攻击步骤只要有必要就能成功。

 第一步 4.2说了利用的可利用位翻转,在页表里有1/3的bit用于物理地址。在临近的2MB的范围里的一个页表中一个可以利用的bit翻转改变了一个物理地址。在我们的测试机器上我们已经发现了这样的位翻转。
 第二步 利用脚本释放除了两个被先hammer了的以外的其它页,因此包含位翻转的页也被释放了,申请数组要求浏览器储存虚拟地址空间区域，并按照第一次访问的映射到物理地址上，攻击者决定的最大数组大小也会触发页表分配在时间攻击,在我们所有测试系统中数组大小为1MB，我们只是访问，因此为每个1MB数组申请了4K页，因此每个页表有两个用户页面，The probability to place a group of page tables in the targeted 2MB region is ≈ 1/3
 
 第三步 再次利用脚本触发翻转，有可能发现它的内存映射改变, 有1/3的可能性地址映射到攻击者的页表中，如果成功，攻击者现在改变那个页表就会有完全的访问系统的物理地址。我们的想法在最新版linux系统和最新版ff被证实， It does not work in Google Chrome due to the immediate allocation of all physical memory for an allocated 1MB array after a single access.

## 限制

 在js中我们用2MB页来找到冲突地址和相邻的行，如果操作系统不提供2MB页我们就不能演示double-sided或提神 single-sided hammering.然而single-sided hammering 的一位翻转的可能性显著降低. 通过2MB页利用 double-sided hammering 也就不可能，因为我们只能引发在我们自己memory的位翻转. 因此攻击只可能放大single-sided hammering 来引发位翻转在相邻2MB页的相邻行，这是一个在这样行系统中的一个限制值.
 
 尽管搜寻一个可利用的位翻转可能要耗上好几个小时，尤其是js的位翻转比native code 的更低， 此外,如果我们不能猜出对这个系统最好的剔除策略,它将会耗上一个多小时来预计算来找寻一个好的剔除策略. 所以这对于现实的攻击也就不实际.

## 对策

The operating system allocates memory in large physical memory frames (often 2MB) for reasons of optimization. Page tables, kernel pages and user pages are not allocated in the same memory frame, unless the system is close to out-ofmemory (i.e., allocating the last few kilobytes of physical memory). Thus, the most efficient Rowhammer attack (double-sided hammering) would not possible if the operating system memory allocator was less aggressive in near-outof-memory situations. Preventing (amplified) single-sided hammering is more difficult, as hammering across the boundaries of a 2MB region is possible.

read-only shared code and data, shared libraries should not be shared over processes that run at different privilege levels or under different users. 

refresh rate. 

TRR

ECC

## 相关工作

The initial work by Kim et al. [20] and Seaborn’s [36] root exploit made the scientific community aware of the security implications of a Rowhammer attack.
However, to date, there have been very few other publications, focusing on different aspects than our work. Barbara Aichinger [1] analyzed Rowhammer faults in server systems where the problem exists in spite of ECC memory. She remarks that it will be difficult to fix the problem in the millions or even billions of DDR3
DRAMs in server systems. Rahmati et al. [34] have shown that bit flips can be used to identify a system based on the unique and repeatable error pattern that occurs at a significantly increased refresh interval. Our paper is the first to examine how to perform Rowhammer attacks based on cache eviction.1 Our cache eviction techniques facilitated cache side-channel attacks on ARM CPUs [22].
Concurrent and independent work by Aweke et al. [4] has also demonstrated bit flips without clflush on a Sandy Bridge laptop. They focus on countermeasures, whereas we focus on attacking a wider range of architectures and environments.

## 将来的工作

我们仅仅研究js在linux的ff和chrome上造成rowhammer攻击的可能性，攻击利用内置的硬件和操作系统的工作方式的基本概念运作.无论系统是否用 4KB 页, 页表是需要的，并在一个属于这个页表的页被访问时被创建的. 因此, 操作系统不能防止1/3 内存被用来分配页表.
相同的攻击方法可以应用到4 kb页分配给虚拟机的虚拟机监控程序, 他们甚至适用于Linux内核相似的分配机制.虽然看起来不合理和不现实的虚拟机监控程序分配4 kb页, 在实际上使得cross-VM页面重复数据删除技术变得更加容易. 根据 Barresi et al. [7], 页面重复数据删除实际上是仍然广泛应用于公共云. 我们的问题不是工作页面打开的可能性进一步调查是否重复数据删除实际上不仅是对虚拟机的安全和隐私, 而是程序本身的安全问题

# 总结

In this paper, we presented Rowhammer.js, an implementation of the Rowhammer attack using fast cache eviction to trigger the Rowhammer bug with only regular memory accesses. It is the first work to investigate eviction strategies to defeat complex cache replacement policies. This does not only enable to trigger Rowhammer in JavaScript, it also benefits research on cache attacks as it allows to perform attacks on recent and unknown CPUs fast and reliably. Our fully automated attack runs in JavaScript through a remote website and can gain unrestricted access to systems. The attack technique is independent of CPU microarchitecture, programming language and execution environment.
The majority of DDR3 modules are vulnerable and DDR4 modules can be vulnerable too. Thus, it is important to discover all Rowhammer attack vectors.
Automated attacks through websites pose an enormous threat as they can be performed on millions of victim machines simultaneously.

## 总结

证实只用访问内存就能引发 位翻转 不需要clflush指令 [并提供较为暴力的算法 和 实验数据比对]
证实js 可以引发 [匹配 和 用动态动态算(先增到平衡再替换减少 到最快)]并引发任何语言/环境/CPU/cache攻击的可能性疑问 [当下无法被立刻化解 硬件/软件 占有量]
证实利用ff的大页分配 2MB相邻 等 可实现引发+控制 
DDR3 DDR4 都没能应对 但是 有一些可用的应对方法

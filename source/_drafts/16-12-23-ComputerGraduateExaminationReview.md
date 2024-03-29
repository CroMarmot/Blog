---
title: 考研计算机复习个人整理
mathjax: true
date: 2016-12-23 01:01:01
categories: 数据结构/计算机网络/ICS/CSE/OS
tags: [计算机,考研]
---

<script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>

## 数据结构

B/B+ m阶 子树[m/2向上取整]~m

森林转化为二叉树的方法 等高横向连接

用哈希（散列）方法处理冲突时可能出现堆积现象，会受堆积选项直接影响的是D.平均查找长度

排序树最后插入可能不为叶子 A/B\C

折半查找法要构成二叉排序树

希尔排序按分量直接插排

快排 性质： 第i遍排序后有>=i个数在正确位置上，且这i个数 左右区间有良序关系

带最小权值的树就是求哈夫曼编码

## 计算机网络

传输时延(是过程耗时) 和 传输延迟(就是等)

发送窗口<=接受窗口

### OSI 模型

### 应用层

(POP3(110)/SMTP(25))TCP 有连接 可靠传输

### 表示层

### 会话层

### 传输层

UDP(8B首部) TCP(20B首部)

### 网络层

拥塞控制 路由算法 IPv4 (首部20B) IPv6(首部40B)

|协议|RIP(应用层)|OSPF|BGP|
|---|---|---|---|
|类型|内部|内部|内部|
|路由算法|距离-向量|链路状态|路径-向量|
|传递协议|UDP|IP|TCP|
|路径选择|跳数最少|代价最低|较好 非最佳|
|交换节点|相邻|所有路由器|相邻|
|内容交换|自己路由表|相邻状态|首次整个，以后传变化|

ARP(ip=>物理地址)

### 数据链路层

ARQ 自动重传机制：停止等待/go back n/选择重发

返回ack=seq+载荷(没有标注默认1) seq=ack

PPP面向字节 HDLC 面向比特

CSMA 不同坚持(如P坚持 )闲则以p概率发送，1-p等待下一个，忙则随机时间

CSMA/CA 有线(预约信道 ACK帧)

CSMA/CD 无线(边听边发 冲突停发 随机重发 先听后发  采用二进制指数退避算法)

|名称|隔离冲突|隔离广播|
|---|---|---|
|集线器|不|不|
|中继器|不|不|
|交换机|能|不|
|网桥|能|不|
|路由|能|能|

物理层(W带宽，理想传输率2Wlog2,V 信噪比=10log(10,S/N)S是平均功率 N噪声功率 ,极限速率W=log(2,1+S/N),中继器5-4-3规则)

一次总线事物中，主设备只需给出一个首地址，从设备就能从首地址开始的若干连续单元格读出或写入的个数，这种总伐事务方式称为 C.突发

## ICS&CSE&OS

### IEEE754

[数符S，阶码E，尾数值M]

1,8,23=32

$$V=(-1)^S*1.M*2^{E-127}$$

1,11,52=64

$$V=(-1)^S*1.M*2^{E-1023}$$

若E为全1 则 M全0 表示无穷大

若E为全0 则$$V=(-1)^S*0.M*2^{1-127}$$

**cache** PA[tag,index,offset]->[index]=>[valid,tag,data[0],..,data[]]=>data[offset]

**页表** VA[index,offset]->index[valid,data]=>PA[data,offset]

**TLB** VA[index,offset]->[valid,index,data]=>PA[data,offset]

**CRC校验**先补0再除

**报文首部** TCP20B,IP 20B

缺页≠地址越界(访问违规地址等)

汇编跳转指令移动的值是指令条数：（例按字节编址 一条指令占两字节 则实际地址跳转为指令条数(值)乘2）

机器只能执行机器语言

writeback有脏位1bit

页面不能固定分全局换

同步/异步传输中心好

同步:系统采用一个统一的时钟信号来协调发送和接受双方的传递定时关系

异步：三种加锁方式 没有同意时钟

I/O终端 数据交换 控制 DMA /非DMA

并发 共享 虚拟 异步

死锁四条 (互斥，不剥夺，请求和保持，循环等待)

预防 破条件（比如控请求，按序分配）

避免 控过程（控安全顺序）

检测 解决既有死锁（定期检查）


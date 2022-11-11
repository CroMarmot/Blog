---
title: Trinity RDF
mathjax: true
date: 2016-01-03
tags: [graph, rdf]
categories: [backend,rdf]
---

dgraph engine for web scale rdf data

# ABSTRACT

  现有的对于网络范围的RDF数据现有依然不是高效的,内部存储不用bitmap,other operations,

# INTRODUCTION

挑战:可扩展性(急切)和普遍性,需要分布式,现有依然三元组,join巨大中间结果,过大的开销 通常指数级 ,现有不支持更有意义的查询 仅仅对SPARQL优化

作者的成就:分布式,处理billion even trillion triples ,不用 relational tables and bitmap matrices,build on top of a memory cloud,首先说 随机访问的情况下 用硬盘储存三元组不够优良 ,就算有好的索引也会因为额外的join操作,作为主要的查询中 耗时,in-memory graph exploration instead of join operations for SPARQL processing ,作为对比 之前的系统 孤立使用自己划分的三元组 没有用已有的 造成了很大的中间额外开销,介绍如何降低join 数量 如何降低中间过程的大小,并且就算没有足够好的划分 也有优秀的性能,我们允许大范围的图分析

 1. 新的基于图表的管理RDF数据 ,有对于RDf 高效基于图查询 和 图分析 的可能性
 2. 新的查询规范(相对于SPARQL)有效的提高性能 减少总监结果 和提高系统可扩展性
 3. 新的价值模型 新的基数估计基数 分布式查询生成的优化算法 ,这些成果提供 在web 范围 RDF数据上 出色的性能

Section 2  join操作 和 图探索 的区别. Section 3 Trinity.RDF 系统的架构. Section 4 how we model RDF data as native graphs. Section 5 describes SPARQL query processing techniques. Section 6 shows experimental results. We conclude in Section 8.

# Join vs. Graph Exploration

RDF and SPARQL 的介绍 和 缺点(join 耗费高 中间无用结果大)

图探索 介绍方法 并说需要更高效的储存方式来适应这种方法 用native graph 会把原来的每次 读入O(log N)的时间复杂度降低为O(1) 需要搜索的顺序优化来 

# System Architecture

就是图储存,并且完全存在内存里 (因为是分布式的所以才可以储存这么多)

架构client,proxy,string server,trinity machine [看来陈榕老师就是按照这样的思路改的代码

# Data Modeling

(node-id, in-adjacency-list, out-adjacency-listi)

讲图分割问题 对于自然图 用大度的点 连接点来决定放置未知 以及使用 in out**间接id**  可以有效减少发送数据交流量

但是对于邻点少的来说用另一种方法更好 同一个点的in和out放在同一个机器上的方法

还用了
 * 本地 谓词索引 sort all (predicate, node-id )
 * 全局的 谓词索引 (predicate, hsubject-list i , object-list i i)

提供基本图操作
1. LoadNodes(predicate, direction): Return nodes that have an incoming or outgoing edge labeled as predicate. 使用全局谓词索引
2. LoadNeighborsOnMachine(node, direction, machine i): For a given node, return its incoming or outgoing neighbors that reside on machine i. 返回的是上面的间接id
3. SelectByPredicate(nid, predicate): From a given partial adjacency list specified by nid, return nodes that are labeled with the given predicate.
Figure 4.
LoadNodes(l2 , out) finds n2 on machine 1, and n3 on machine 2. LoadNeighborsOnMachine(n0 , in, 1) returns the partial adjacency list’s id in1 , and SelectByP redicate(in1 , l2 ) returns n2 .

# Query Processing

先把 查询Q拆分为 q1 q2 q3...qn，然后让它们并行寻找 再最后再和并

## 单个q的匹配方式

For a triple pattern q, our goal is to find all its matches R(q). Let P de[notes] the predicate in q, V denote the variables in q, and B(V ) denote the binding of V . If V is a free variable (not bound), we also use B(V ) to denote all possible values V can take.

从 S 去找 O ,写作q→

从 O 去找 S ,写作q←

分为两个阶段

src

用LoadNodes(本机)找到基于 所有可能predicate 的所有可能的src 

对于所有可能src  在所有机器LoadNeighborsOnMachine(有远端操作)找`nid_i` 把结果M再发给所有机器

tgt

对于收到的结果M 的每一个(src,nid)

找所有的可能的predicate

用 SelectByPredicate(本机) 交 所有可能的tgt 得到R

方案是 合并相邻 的操作来减少中间过程的损耗

然后讲优化 也就是顺序优化

注意到用了合并以后 前面j个操作 只要集合相同 那么结果与前面j个的内部顺序无关

我们使用 启发式算法

Heuristic 1. We expand a subgraph from its exploration point. We combine two subgraphs by connecting their exploration points.

Property 1. We expand a subgraph or combine two subgraphs through an edge. The two nodes on both ends of the edge are valid exploration points in the new graph.

Theorem 1. For a query graph G(V, E), the DP has time complexity O(n·|V |·|E|) where n is the number of connected subgraphs in G.

Theorem 2. Any acyclic query Q with query graph G is guaranteed to have an exploration plan.

Discussion. There are two cases we have not considered formally: i) G is cyclic, and ii) G contains a join on predicates.
























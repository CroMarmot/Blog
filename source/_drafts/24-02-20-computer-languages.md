---
title: 微观经济学
date: 2023-09-18
tags:
  - code
  - python3
  - cplusplus
  - typescript
category:
  - book
  - economics
description: 经济学原理-微观经济学
---


## 常用各种语言的“共性”整理


| - | c++ | py | typescript | 体验 |
| ---- | ---- | ---- | ---- | ---- |
| 数组 | array,vector,[] | [],不可更改() | [] | 差不多，不过ts可以假装生成很大的只访问很后面的，而c++增加了views |
| tuple | pair,tuple | typing的Tuple+实际的`[]` | https://www.typescriptlang.org/play#example/tuples | c++在没有解构前写得很痛苦，现在都差不多 |
| hash存储 | unordered_xxx | dict | {},hashmap | 差不多，c++可以自定义hash把地址作为key来用 |
| 排序类存储 | map/set/pbds | sortedcontainers | ??? | c++还是最顺手的 |
| 库相关工具 |  | pip,hatch,venv | npm/yarn | python3的使用库的体验吊打ts/js,然而发布库的体验上py3目前还很乱 |
| debug | gdb | pdb,icecream | chrome console的跳转+断点工具，手机devtools | 体验最好的ts,因为浏览器一致性，而c++,py的ide有好几个 没有浏览器调ts那种开箱即用的体验 |
| 编译运行 | clang++,gcc,g++ | python,pypy | node,tsc,浏览器 | 差不多，配好了基本很少调整 |
| 类型 |  | dataclass能做一层json转换 | json到 类型 非常轻松 | 编写体验最好的是ts,查错体验最好的是C++，然后都可以上protobuf解决跨端类型 |
| reactiveX | rxcpp | rxpy | rxjs | 主要体验rxjs很强比promise那一套舒服很多 |
| 精度 | __int128,可预测行为的无符号溢出 | 无限的int，还有fractions和decimal | 有限精度，且超过精度会自动转换？？？？ | ts/js真的狗屎一样，没有整除，超了会转换，c++很多日常是勾的，py是最舒服的 |
| sort | 比较函数返回bool(a<b) | sort 提供key,或者funtools.cmp_to_key, 但是需要正/负/零 | 正/负/零 | c++还额外提供了`stable_sort`,py3保证stable,ts Since version 10 (or ECMAScript 2019)，这里面体验最好的是C++, 因为有些时候比的就不是数字，或者比较逻辑里面需要做 `</=/>`转换`-1` |
| 函数/class默认参数 |  | 对象/数组 是引用(大坑) |  | 每个py新手必踩坑 |
| doc |  | mkdocs,rst |  |  |
| 并行 |  | 自带锁，有multiprocess方法 | 单线程+异步 | 这体验目前还是ts最舒服 |
| lambda | 不同capture指定 | nonlocal配合 | `()=>{}` | ts还是最好的， |
| ref/const | `const &` | 复杂类型ref | 复杂类型ref | `const + &`的概念的体验其实很好，而py,ts在引用上是隐式，导致传递int引用都不行，套个数组或者搞个变量或者改成返回值很别扭，再就是const&配合编译时检查 减少了不少心智负担，py/ts在传递引用时都有可能在里面做了修改 |
| == | stl | 默认 | `[1]!=[1]` | 这个默认体验ts是差了，不过有三方库相对还好，还能做带有循环的深比较 |
| for | `#define` | for | for loop,in,of | 超多情况都是for一个变量，c++,py都不差，c++可以上宏，ts的for range只能array强行搞，而对于vector一类的支持，虽然都有，但是py的相关处理是最多的 |
| print | printf,cout,fmt::format，std23::print | f-string | `${}` | 目前还是py的最舒服 |
|  |  |  |  |  |
| 其它 | c++的宏的优势是就算语法不满，自己改一改。而例如函数解释顺序可能不同编译器不同，可能遇到形如`f(g(),g())`的bug | 没有++，没有(a+=1)%=MOD | 曾经被this恶心，好在现在有`()=>`以及很多还是向函数式变化，不太会被this恶心了 | 对于变量作用域还是喜欢C++的，但是非常不喜欢 就近原则，而是希望 只要有祖先关系 就应该禁止重名，甚至包括（全局变量）， |

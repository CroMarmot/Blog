---
title: 前端通信
date: 2021-03-24
tags: [vue2,React,Angular2+]
category: [ frontend]
mathjax: true
---

# 交互

概念上, 这几类

1. 触发一个远端方法
2. 数据共享
3. 响应式触发

# 回顾经典

说道通信，那就回顾一下Linux的通信方式，IPC

- 共享文件
- 共享内存
- 管道(命名和匿名)
- 消息队列
- sockets
- signal

<!--more-->

众所周知 进程是资源最小单位，所以线程内对数据来说是默认共享的，而进程之间需要 memorymap之类的操作，

共享文件，当然加锁，慢，但数据量可以很大。

signal 比如中文博客常见的暴力杀人 `kill -9` //不是，`Ctrl+C`,`Ctrl+Z`。一般来说这个古老，小巧，系统

管道，常见的就是linux中 通过竖线连接的命令，这些命令呢是shell在 程序外建立的临时管道，因此对于程序本身来说和读stdin/stdout 的行为没区别。实现基本就是linux所有东西都是文件+同步+锁+一个读一个写+文件数据结构到物理页的映射. 也可以 mkfifo 创建文件来pipe通信, 本质上是字节流为单位

消息队列，单位是消息不是字节流，其它是消息单位以上的信息内容,比如优先级，获得第x条消息, 实现上每个消息一个结构体,链表链接

socket 就是套接字(domain,type,protocol)，除了网络套接字还有 unix domain socket,(domain,type,protocol,socketfd[2])

另外有一句话叫不要用共享内存来通信，而是通信来共享内存, 我们能见到的内存共享基本就是虚拟地址和物理地址映，其共享的是数据内容，而一般会通过其它方式来做控制通信,比如semaphore,

从设计上看，共享文件和共享内存以外的几个更注重信息发送，在信息发送的不同层级做了不同的包装，提供给用户使用的时候就是明确的事件

# Vue

|方法|特点|
|---|---|
|`props`/`$emit`|父子，props下去的是值，$emit 上来的是带有值的事件，可以通过`$attrs,$listener`穿透, 虽然看似watch能变成事件，但本身上是别扭的并且有基础类型不触发的问题|
|props + 回调式| 父子，类似react的习惯，本质是提供一个能访问上级的函数, 操作的是函数不是值|
|vuex| 本质上是共享响应式的数据, 非事件,虽然是事件的方式操作的vuex里的数据|
|手工一个共享对象/或`event = new Vue()`，可以支持`on/emit`方法，共享这个方法通信。|对象共享，可以非父子，都是事件|
|(vuex/公共js) + (on/emit)| 明确事件 + 跨级访问，只要都能触及的对象即可|
|provide/inject|祖先级别，单向，默认非响应式，当然通过共享对象，原理同上也是能做到多向通信|
|ref/ $parent| 获取实例直接操作值或函数，父子，一定程度破坏闭包性质，可以考虑文档协定那些是作为不会变暴露的，哪些是私有不应该操作的 |

# React

|方法|特点|
|---|---|
|props| 单向，但实际上已经够了，基于这个单向的，提供回调，就能完成上面的 props+回调式|
|context/redux|同vuex|
|EventEmitter|同上共享 通信对象，你可以自由实现是全局，还是父子还是|
|ref|虽然是单向，其实有props和自身也可以做大$parent的语义, 官方|

# Angular2

https://angular.cn/guide/component-interaction

|方法|特点|
|---|---|
|@Input/@Output| 向下值(可以通过setter截听等各种操作)，向上事件，上述回调等也是都可以去做，不过大可不必|
|本地变量 #timer| 不需要js，直接html建立关联，类似ref但并不是，ng这样默认ts的再用上本地变量也是一个公私分明的方案，至少封装性没有破坏，具体见ng的官方文档的讲解|
|ViewChild| 也就是另外语言里的ref了，这个就可以操作一些私有的内容甚至子级别的内容, 你也可以用这个做透传|
|service+rxjs|看起来像Vuex/Redux, 但本质是服务实现而不是响应式状态共享实现|

# 总结

## 从可行方法上

1. 直接通信 向下传递值，向上发送事件
2. 向下传递回调，但上级别不需要回调的时候的兼容处理(比较好的是如果有ts，可以直接`?.`)
3. 共享通信通道（传递通道（可以孤立和复用），共同引入通道（访问一定命名空间下的））
6. 其它不是`操作`而仅仅是数据共享/ localStorge/ vuex/redux/ng service/router params, 除了路由本身这些的通信属性是远远低于数据共享属性的
5. 获取实例直接操作（依赖注入/props/ref/$parent/$child) 总之不论是啥框架这都是非优先的考虑，在解决一些上述解决不了的时候才考虑，见react的英文文档
6. 当然基于本质是js的想法，你可以父传递回调函数给子组件，子组件回调给你一个有调用方法的实例，父对象在调用这个实例上的方法 XD等等花里胡哨的

## 从理论+实际使用上

1. 大多数时候，框架提供的向下共享数据，和向上传递事件（react回调也是）就足够了, 像
2. 那么有向下传递事件和跨越任何关系传递事件时，通过共享通信通道是更符合代码意义的操作，并且你可以按照需求管理所在作用域
3. 其它是react文档提到的几种实在要用ref操作的情况

而 实例，watch等不是明确事件的，虽然你可以各种手段去搞一个像是可以用作事件的，而这种东西如果能封装出可用的也不是不行，但没有封装到处这样写的话，那就是缺失语义的屎山代码的开端

当需要更多的应用时, js方法都可以用，毕竟本质都是js

React完全就是核心实现了props，其余非核心必要都交给用户

Vue2，$emit/ref/$child/$parent , 提供的杂乱的不一致 的可用方案，优点是相对常用，缺点是破坏封装性

Angular2+ 看起来还是最清晰详细的，有测试示例，有传递的各种处理工具，有0代码html上的组件交互，提供了公私分明(写起来比Vue还简洁)，也提供访问实例，还有Service+RxJs，而且这里文档实例也是“生产”的写法，并没有能跑就行，比如MissionService 的Subject使用（见我翻译的另一篇rxjs的文章）

react 提供核心，Vue2半成品即视感（当然react/vue2都给了你绩效机会比如你可以像有赞的代码一样封装一个好用的通信），Angular就是一个你能想到的完整实现了

## 更实际一点

暴论：考虑到有些代码，不在意代码质量，未来维护等等，以出产品为第一要义，你也可以，多获取实例调用，至少如果你的依赖组件几年不变的话，私有性等等其实是过度需求的，甚至写起来比上述的简单，也有一定的局部性保障。

这是根据看了不少线上源码得出来的结论,现实世界用户产品的优先级就是高于甚至远高于代码质量

# 想法

这里看到的是，如何在响应式框架中做通信，

React直接只提供传递，剩余的事情并不关心，你要做的就是用原生js去做就行了

Vue2看上去书写上看似比React多了点东西，但稍微有需求时，为了使用愿意破坏封装，要更有意义的实现，需要不少的额外手工操作代价，或者和React一样，Vue2的文档经常写一些自己的eslint过不了的示例代码。

Angular2看似你只需要读一边官方文档就好了。

再回顾最开始讲的linux通信，看起来都是创建一个通信通道，然后要通信的双方通过通道进行交流，而再看ipc/rpc，就是利用各种可能的通道，在上面做了一层看起来是直接调用方法的方案，而本质上只是同名和映射，使用体验上是直接调用，当然这个局限是建立在互相不能获操作对方实例的基础上的通信方案

# 参考

https://vuejs.org/v2/guide/components-props.html

https://reactjs.org/docs/refs-and-the-dom.html

https://angular.io/guide/component-interaction

[有赞relation](https://github.com/youzan/vant/blob/2.x/src/mixins/relation.js)

https://tldp.org/LDP/tlk/ipc/ipc.html

https://man7.org/linux/man-pages/man7/mq_overview.7.html

[unix pipe implementation and history](https://toroid.org/unix-pipe-implementation)


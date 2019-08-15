---
title: 闪耀暖暖 耗材计算器 rxjs + angular2+
mathjax: true
date: 2019-09-30 15:09:01
categories: frontend
tags: [nikki4,angular2]
---

# What

闪耀暖暖的设计师 材料耗材计算器

基于一个已经有的原生js 进行改造

原来生 http://www.spongem.com/ajglz/tools/evalLevelUpCost.html

# 重构内容

0. 首先把这个的源码 搞下来,比较无脑的操作
1. 然后开个module 配一下routing
2. 搞个component 然后把函数数据都搬进来
3. 把相关全局变量 改为 `this.`
4. 修改原来的一些`$`方法 改为原生js,或者改为`[(ngModel)]`双向绑定，至此基本可以运行。
5. 解构一下用户输入和计算输出分别叫做`Class: CardBasic/Card -> html:Card/CardOut` // 好吧 这里变量名有点乱 现在看来
6. 引入`https://material.angular.io`的组件,稍微调整画风
7. 尝试搞一个computed,移除计算按钮, 改为 `get XXX`的方法

这里遇到问题, 根据调试，页面上的调用会反复调用get方法, 大量重复不必要计算

8. 解决方案1: 引入Ramda，建立两个cache 分别是计算结果 和 用户输入，用 Ramda的深比较和深拷贝完成少的计算次数

写着还好，行数不多，就能实现，性能也好，但是问题是，相当于你依然要去关心的是，输出值输入值直接的具体关系才能写。

9. 解决方案2: 引入rxjs，用Observable搞

这里实践上有些问题

* 双向绑定如何和`BehaviorSubject`绑定,最后用`(ngModelChange)`来 单向到 具体字段
* 能否监听整个Class

```js
import { of } from 'rxjs';
let a = {x:1,y:2};
let a$ = of(a);
a$.subscribe(console.log);
a.x=3;
```

例如这样 并不会因为修改了a的子字段而自动发送next

搞了半天最后还是 感觉很 手工写依赖的输入

这一块的实现主要如下


```js
  // 相当于所有用户输入的部分 都会对应一个emitter
  private textEmitter: Map<string, BehaviorSubject<string>> = new Map();
  // 在初始化时 初始化它们并监听
    // initial textEmitter
    for (const key in this.card) {
      this.textEmitter.set(key, new BehaviorSubject(this.card[key]));
    }
    this.obAllKeys(this.textEmitter)
      .pipe(
        map(() => {
          // 细粒度触发 全体计算
          console.log('fire calc')
          return this.cardOut; // 就是最开始写的get方法 触发过程中只 告诉说 '哎!我变了!' 即可
        })
      ).subscribe(this.cardOut$); // 页面通过这个读取 是个 BehaviorSubject
  
  // 做的个功能 监听一个类 的所有字段 对应的 textEmitter的Observable
  // 做了一点防抖
  obAllKeys(emitter: Map<string, BehaviorSubject<string>>): Observable<string> {
    let mergeOb: Observable<string> = new BehaviorSubject('');
    emitter.forEach((emitValue, emitKey) => {
      mergeOb = merge(mergeOb, // 关于merge的使用考虑 最开始想过使用combineLatest 但是 问题是 我明明可以直接通过 页面双向绑定拿到 用户输入,所以其实只需要一个变更通知即可，再另一个 combineLatest感觉要配上flat 才能 自动 绑定所有key,不然是手写的所有key,而对应的下标再反向生成 对象,表示 是不是有更好的方法 没学到没搜到
        emitValue.pipe(
          debounceTime(this.debounceInterval),
          distinctUntilChanged(),
          map((v) => emitKey + v) // 这个是避免 在段时间内 上次状态a,  改b 改a 改回最初的a 这样就不会触发改变
        ));
    });
    return mergeOb.pipe(debounceTime(this.debounceInterval)); // 按理说一次只会改动一个  这个是初次进入时 会有多个 当然 combineLatest 不会有这个问题
  }

  // 主要是和页面上的 输入绑定 具体就是 ngModelChange ,这一块的问题就是 写了 [(ngModel)] 又写了一遍这个绑定 光是key就要写两遍 还是字符串没法保证正确 靠的是下面的 调试强行保证部分
  onChange(cardKey: string, value: string) {
    console.log(`onCardIdChange: ${cardKey} => ${value}`);
    if (this.textEmitter.has(cardKey)) {
      this.textEmitter.get(cardKey).next(value);
    } else { // 调试用
      console.warn('onChange', cardKey, value);
    }
  }
```

10. 最后增加了一点 try catch,因为 不同的卡可选范围并不同，或者用户输入不合法会 爆红=.=只在 两个LevelVal里加了

# 最后结果

https://cromarmot.github.io/Debuq/#/nikki4/lvlup

如果打开看到404，保持页面，等待一会儿再刷新即可。因为有worker service

# TODO

比如搞成动态拉取

计算函数再向纯函数靠拢啊

怎么json 转换 Class 甚至 Map // 搜了一会没搜到简洁的方案

更好的双向绑定+BehaviorSubject 绑定?

是否可能简化某部分代码

输入控制 比如 现在其实可以输入 小数 和 范围以外的数

比如因为还是有不少json 导致 typescript的 类型判断并不完整 虽然

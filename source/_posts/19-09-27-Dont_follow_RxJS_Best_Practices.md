---
title: 别遵循RxJS的最佳实践
mathjax: true
date: 2019-09-27 01:01:01
categories: frontend
tags: [rxjs,observable]
---

# 依赖

[英文原文](https://dev.to/nikpoltoratsky/don-t-follow-rxjs-best-practices-4893#pass-streams-to-children)

[rxjs入门](/Blog/19-06-27-rxjs/)

# 摘要

如今,越来越多开发者开始学 RxJs, 并跟随最佳实践正确使用它。但是完全不必要,那些所谓的最佳实践，需要学一些新的内容，并且在你的项目中增加额外的代码。

更多的是，使用最佳实践，是冒着创建好的代码库和让你的队友高兴的风险! 🌈

Stop being a gray mass! 打破常规，停止使用最佳实践

下面我将想你介绍，怎么改造那些所谓的最佳实践代码.

* 不要unsubscribe
* 嵌套使用Subscribe
* 不要使用 纯函数
* 手动subscribe，不要使用 async pipe
* 向你的服务暴露subjects
* 始终对子组件传递流
* 宝石图? 并不适合你

<!--more-->

# 不要unsubscribe

所有人都说，我们始终需要取消订阅observables来防止内存泄漏

但，我觉得不行。认真的吗，谁决定你需要 取消订阅 observables? 没必要，我们来玩个游戏，下面哪个取消订阅的实现最好。

有`takeUntil`操作符的吗?

```js
@Component({ ... })
  export class MyComponent implements OnInit, OnDestroy {

    private destroyed$ = new Subject();

    ngOnInit() {
      myInfiniteStream$
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => ...);
    }

    ngOnDestroy() {
      this.destroyed$.next();
      this.destroyed$.complete();
    }
  }
```

还是使用`takeWhile`操作符的?

```js
@Component({ ... })
  export class MyComponent implements OnInit, OnDestroy {
    private alive = true;
    ngOnInit() {
      myInfiniteStream$
        .pipe(takeWhile(() => this.alive))
        .subscribe(() => ...);
    }
    ngOnDestroy() {
      this.alive = false;
    }
  }
```

显然！都不是，`takeWhile`和`takeUntil`操作符有隐含意义，并且可能比较难以阅读 🤓 (sarcasm). 最好的解决方案，是用显示的方式用不同的变量分别保存每个subscription，在destroy中unsubscribe.

```js
@Component({ ... })
  export class MyComponent implements OnInit, OnDestroy {

    private subscription;

    ngOnInit() {
      this.subscription = myInfiniteStream$
        .subscribe(() => ...);
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  }
```

这个方案在有很多 subscriptions的时候工作得十分优秀

```js
Component({ ... })
  export class MyComponent implements OnInit, OnDestroy {

    private subscription1;
    private subscription2;
    private subscription3;
    private subscription4;
    private subscription5;

    ngOnInit() {
      this.subscription1 = myInfiniteStream1$
        .subscribe(() => ...);
      this.subscription2 = myInfiniteStream2$
        .subscribe(() => ...);
      this.subscription3 = myInfiniteStream3$
        .subscribe(() => ...);
      this.subscription4 = myInfiniteStream4$
        .subscribe(() => ...);
      this.subscription5 = myInfiniteStream5$
        .subscribe(() => ...);
    }

    ngOnDestroy() {
      this.subscription1.unsubscribe();
      this.subscription2.unsubscribe();
      this.subscription3.unsubscribe();
      this.subscription4.unsubscribe();
      this.subscription5.unsubscribe(); 
    }
  }
```

但方案还不完美。怎么样能做得更好呢? 你感觉呢? 怎么能让代码更加干净易读?

没错，我们给你的答案是，把那些丑陋的取消订阅删了呗

```js
@Component({ ... })
  export class MyComponent implements OnInit {

    ngOnInit() {
      myInfiniteStream$
        .subscribe(() => ...);
    }
  }
```

非常棒! 我们删除了冗余的代码，现在看起来清爽，并且节约了一些硬盘空间。 But what will happen with myInfiniteStream$ subscription?

别管他! 😅 让我们让垃圾回收器去做那些工作，不然它们有啥存在意义，对吧!

# 嵌套使用Subscribe

其它人说我们应该用 `*Map` 操作符来链接observables 而不是层级订阅它来防止回调地狱。

但，我又觉得不行. 认真吗，为啥? 为啥我们都要用`switchMap/mergeMap`操作符号? 你觉得下面代码易读吗？你真的喜欢你的队友吗？

```js
  getUser().pipe(
    switchMap(user => getDetails(user)),
    switchMap(details => getPosts(details)),
    switchMap(posts => getComments(posts)),
  )
```

你觉不觉得它过于整洁可爱，你有别的选择，看一看。

```js
  getUser().subscribe(user => {
    getDetails(user).subscribe(details => {
      getPosts(details).subscribe(posts => {
        getComments(posts).subscribe(comments => {  
          // handle all the data here
        });
      });
    });
  })
```

这样更好吧，如果你恨你的队友，而且不想学新的RxJS operators操作符号，就这么写代码吧.

做个聪明人! 让你的队友感受到一些回调地域的怀念之情。

# 不要使用 纯函数

其它人说，纯函数让代码可预测，且易测试

我双觉得不行。为啥要用纯函数？ 测试友好的？ 组合友好的？ 麻烦了，影响global让编码更加简单,看个例子。

```js
function calculateTax(tax: number, productPrice: number) {
  return (productPrice * (tax / 100)) + productPrice; 
}
```

对于实例，我们有一个计算tax的函数，一个纯函数，如果入参相同，返回始终相同，很容易测试和组合。但我们真的需要这些行为吗？我觉得大可不必，不带参数的函数更加易于使用:

```js
window.tax = 20;
window.productPrice = 200;

function calculateTax() {
  return (productPrice * (tax / 100)) + productPrice; 
}
```

事实上，我们又能弄错什么呢？ 😉

# 手动subscribe，不要使用 async pipe

其它人说我们需要在angular 模板中使用 async pipe 来帮助在components中管理subscriptions

但我觉得不行，我们上面已经讨论了`takeUntil`和`takeWhile`,并一致认可这些操作符来自邪恶。因此为什么我们不用另一种方式来处理async pipe.

```js
@Component({  
  template: `
    <span>{{ data$ | async }}</span>
  `,
})
export class MyComponent implements OnInit {

  data$: Observable<Data>;

  ngOnInit() {
    this.data$ = myInfiniteStream$;
  }
}
```

你看到了吗，干净，可读，容易维护的代码。但它不被允许，对于我来说，放到本地变量再在template里用不是更好吗。

```js
@Component({  
  template: `
    <span>{{ data }}</span>
  `,
})
export class MyComponent implements OnInit {
  data;

  ngOnInit() {
    myInfiniteStream$
      .subscribe(data => this.data = data);
  }
}
```

# 向你的服务暴露subjects

在 Angular中使用 Observable Data Services 是非常常见的事件。

```js
@Injectable({ providedIn: 'root' })
export class DataService {

  private data: BehaviorSubject = new BehaviorSubject('bar');

  readonly data$: Observable = this.data.asObservable();

  foo() {
    this.data$.next('foo');
  }

  bar() {
    this.data$.next('bar');
  }
}
```

这里我们以observable的形式暴露了一个数据流, 能保证只能通过 数据服务接口来修改它。但它令人困惑。

你想改变数据的时候，你必须真的改变数据。

为什么不增加一个方法能够就地改变数据呢？让我们重写这个服务让它更加易用。

```js
@Injectable({ providedIn: 'root' })
export class DataService {
  public data$: BehaviorSubject = new BehaviorSubject('bar');
}
```

Yeah!你看到了吗，我们的数据服务变得更加小且易读，现在我们可以任意的操作数据流了。完美！你也觉得是吧?🔥

# 始终对子组件传递流

你有没有听说过 Smart/Dump components pattern, 它能帮助, 解构组件之间? 同样的，这样的模式，能够阻止子组件触发父组件的行为。

```js
@Component({
  selector: 'app-parent',
  template: `
    <app-child [data]="data$ | async"></app-child>
  `,
})
class ParentComponent implements OnInit {

  data$: Observable<Data>;

  ngOnInit() {
    this.data$ = this.http.get(...);
  }
}

@Component({
  selector: 'app-child',
})
class ChildComponent {
  @Input() data: Data;
}
```

你喜欢这样写吗？你的队友也喜欢它。在这种情况下，你想报复他们，你需要这样重写你的代码。

```js
@Component({
  selector: 'app-parent',
  template: `
    <app-child [data$]="data$"></app-child>
  `,
})
class ParentComponent {

  data$ = this.http.get(...);
  ...
}

@Component({
  selector: 'app-child',
})
class ChildComponent implements OnInit {

  @Input() data$: Observable<Data>;

data: Data;
  ngOnInit(){
    // Trigger data fetch only here
    this.data$.subscribe(data => this.data = data);
  }
}
```

看到了吗，我们不再在父组件中处理subscriptions. 我们直接把它丢给子组件去处理.

如果你这样写，你的队友保证可以debug到 哭到流血，信我。

# 宝石图? 并不适合你

你知道宝石图吗？不，它不适合你。

让我们假设写了下面的函数，并且要测试。

```js
export function numTwoTimes(obs: Observable<number>) {
  return obs.pipe(map((x: number) => x * 2))
}
```

很多人，会使用宝石图来测试这个函数：

```js
it('multiplies each number by 2', () => { 
  createScheduler().run(({ cold, expectObservable }) => {
    const values = { a: 1, b: 2, c: 3, x: 2, y: 4, z: 6 }
    const numbers$ = cold('a-b-c-|', values) as Observable<number>;
    const resultDiagram = 'x-y-z-|';
    expectObservable(numTwoTimes(numbers$)).toBe(resultDiagram, values);
    });
  })
```

但是，谁又会想学新的宝石图的部分呢。谁想写clean and laconic 的代码呢? 让我们用更常规的方式写测试代码。

```js
it('multiplies each number by 2', done => {
  const numbers$ = interval(1000).pipe(
      take(3),
      map(n => n + 1)
  )
  // This emits: -1-2-3-|

  const numbersTwoTimes$ = numTwoTimes(numbers$)

  const results: number[] = []

  numbersTwoTimes$.subscribe(
      n => {
        results.push(n)
      },
      err => {
        done(err)
      },
      () => {
        expect(results).toEqual([ 2, 4, 6 ])
        done()
      }
    )
})
```

Yeah! 现在看起来100倍好了。

# 总结

You're a hero if you've read all the advice above. But. Well. If you recognized your train of thoughts, I have a piece of bad news for you. It was a joke.

![it was a prank](https://res.cloudinary.com/practicaldev/image/fetch/s--cuqyIqfO--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://i.ibb.co/7zwMdyn/image.png)

Please, never do what I said in that article. Never let your teammates cry and hate you. Always strive to be a decent and neat person. Save the world - use patterns and best practices!

I just decided to cheer you up and make your day a little bit better. Hopefully, you like it.

Stay tuned and let me know if you have any particular Angular topics you would like to hear about!

# 读后补充

看到第一个就满脸疑惑，然后看到pipe那里觉得很有问题，然后看到纯函数就觉得很不对,然后我把文章拉到了最后,XD 果然是prank

这个原作者是个大佬，每个内容反着看就是代码如何优化，举例的都是十分常见的场景。

下面说说每个对应的场景，和一些能想到的例子。

## 页面与页面内异步的生命周期

常见的就是，页面内有异步事件，如后台调用等。这种情况如果回调会触发一些全局的事情，但是并不会因为页面销毁而中止。通过`takeUntil`和生命周期挂钩，就能简单的解决这类问题。想对于自己去做逻辑显然更少的逻辑需要管理，更不容易出错。

其二是页面上的一些无限observable。这类主要是内存泄漏相关的问题。

## 回调地狱

在 promise里有  `promise.then(函数).then(函数).then(函数)` 的方式把地狱变为链式。

不过就我看来，有的人依然用了 promise.then, 依然在promise.then 里面去地狱函数。。。。。。。自闭


## 纯函数

其实和rxjs关系不大，毕竟不论任何一个提供全局的语言，总有滥用全局变量的。

有时觉得vue angular里面，很容易因为写页面写习惯了，毕竟本身页面之类的就是类/结构体，很多会用this点去取值。

然后去做纯函数时就会看到“全局变量”，也是难受，不过有框架，基本上在window上定义变量的人少了。

## Async Pipe

这个是angular 提供的，在上面例子只有一个可能还没多少感觉，当内容多了，每个尾部都会多出subscribe。这块，在说上第一部分讲的内存泄漏，也是可能因为没有取消订阅发生，而有了 async pipe，即少了代码，又不会泄漏？

## 封装与暴露

像vue之类的，关于这种数据，更多的是“同步写+开发时校验提醒”，但这一切，还是不够强制，毕竟仍然有不少的人，直接操作改变数据而不遵守流程。

我一直相信一句话，只要没有从工具上限制死，有多少内容，人始终会越界操作。

这里本质上，封装了具体的Subject，向外提供readonly的 observable。利用了typescript的修饰。

## 父向子组件传递不应使用 ob

对于一个组件的传递过程是 原始数据类型的更好？不是特别理解感受这一块。

## 测试 observables处理函数

利用已有的测试封装工具，把测试代码做到易读，易维护


---
title: Don't follow RxJS Best Practices
mathjax: true
date: 2019-09-27 01:01:01
categories: frontend
tags: [rxjs,observable]
---

# 依赖

[英文原文](https://dev.to/nikpoltoratsky/don-t-follow-rxjs-best-practices-4893#pass-streams-to-children)

[rxjs入门](/Blog/19-06-27-rxjs/)

# 摘要

Nowadays more and more developers learn RxJS and use it properly with best practices in mind. But we shouldn't. All those so-called best practices require to learn something new and to add additional code in your projects.
Moreover, using the best practices we're risking to create a good code base and make your teammates happy! 🌈
Stop being a gray mass! Break the rules! Stop using best practices!

Here are my suggestions to you on how to deal with those so-called RxJS best practices in Angular:

* 不要unsubscribe
* 嵌套使用Subscribe
* 不要使用 纯函数
* 手动subscribe，不要使用 async pipe
* 向你的服务暴露subjects
* 始终对子组件传递流
* 宝石图? 并不适合你

# 不要unsubscribe

Everybody says that we have to always unsubscribe from observables to prevent memory leaks.

But I can't agree with it. Seriously, who decided that you have to unsubscribe from observables? You don't have to do that. Let's play a game! Which unsubscribe implementation of those Angular components is the best?

That one with takeUntil operator?

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

Or that one with takeWhile operator?

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

Exactly! Neither! Both takeWhile and takeUntil operators are implicit and may be hard to read 🤓 (sarcasm). The best solution is to store each subscription in a separate variable and then unsubscribe on component destroy in an explicit way:

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

That works especially good in cases when you have multiple subscriptions:

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

But that solution is not perfect yet. What could be done better? How do you feel? How could we make that code more clean and readable?
Yeah, I have the answer for you! Let's remove all that ugly unsubscribe statements at all.

```js
@Component({ ... })
  export class MyComponent implements OnInit {

    ngOnInit() {
      myInfiniteStream$
        .subscribe(() => ...);
    }
  }
```

Excellent! We've removed all the redundant code and now it looks simpler and even saves us a bit of memory on our hard drives. But what will happen with myInfiniteStream$ subscription?

Forget about it! 😅 Let's leave that job for the garbage collector, otherwise, why does it exist, right?

# 嵌套使用Subscribe

Everybody says that we should use `*Map` operators to chain observables instead of subscribing inside subscribes to prevent callback hell.

But I can't agree with it. Seriously, why not? Why should we use all those switchMap/mergeMap operators? How do you feel about that code? Easy to read? Do you really like your teammates so much?

```js
  getUser().pipe(
    switchMap(user => getDetails(user)),
    switchMap(details => getPosts(details)),
    switchMap(posts => getComments(posts)),
  )
```

  Don't you think it too neat and cute? You shouldn't write code that way! You have another choice, take a look here:

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

Much better, huh?! Always write code this way if you hate your teammates and don't want to learn new RxJS operators.

Be bright! Let your team members feel a bit of nostalgia with callback hell.

# 不要使用 纯函数

Everybody says that we should use pure functions to make our code predictable and easier to test.

But I can't agree with it. Seriously, why should you use pure functions? Testability? Composability? It's hard, it would be much easier to affect the global world. Let's take a look at the example:

```js
function calculateTax(tax: number, productPrice: number) {
  return (productPrice * (tax / 100)) + productPrice; 
}
```

For instance, we have a function which calculates a tax - it's a pure function it will always return the same result for the same parameters. It's easy to test and compose with other functions. But, do we really need that behavior? I don't think so. It would be easier to use a function without parameters:

```js
window.tax = 20;
window.productPrice = 200;

function calculateTax() {
  return (productPrice * (tax / 100)) + productPrice; 
}
```

Indeed, what can go wrong? 😉

# 手动subscribe，不要使用 async pipe

Everybody says that we have to use async pipe in Angular templates to facilitate subscriptions management in components.

But I can't agree with it. We've already discussed subscriptions management with takeUntil and takeWhile and agreed that these operators are from an evil one. Though, why should we treat async pipe another way?

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

Do you see that? Clean, readable, easy to maintain code! Argh. It's not allowed. As for me, it would be much better to put the data in local variable and just use that variable in the template.

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

There is a pretty common practice to use Observable Data Services in Angular:

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

Here we're exposing data stream as observable. Just to make sure it can be changed only through a data service interface. But it confuses people.

You want to change the data - you have to change the data.

Why add additional methods if we can change the data on the place? Let's rewrite the service to make it easier to use;

```js
@Injectable({ providedIn: 'root' })
export class DataService {
  public data$: BehaviorSubject = new BehaviorSubject('bar');
}
```

Yeah! Do you see that? Our data service became smaller and easier to read! Also, now we can put almost anything in our data stream! Awesome, don't you think so?🔥

# 始终对子组件传递流

Have you ever heard about Smart/Dump components pattern, that can help us to decouple components from each other? Also, that pattern prevents child component from triggering actions in parent components:

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

Do you like it? Your teammates also like it. In case you want to revenge them, you need to rewrite your code in the following way:

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

Do you see that? We're not handling subscriptions in the parent component anymore. We're just passing subscription to the child component.
If you follow that practice your team members will cry tears of blood during debugging, believe me.

# 宝石图? 并不适合你

Do you know what are marble diagrams? No? It's good for you!

Let's assume we wrote the following function and going to test it:

```js
export function numTwoTimes(obs: Observable<number>) {
  return obs.pipe(map((x: number) => x * 2))
}
```

Many of us will use marble diagrams to test the function:

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

But, who the hell wants to learn a new concept of marble diagrams? Who wants to write clean and laconic code? Let's rewrite the test in a common manner.

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

Yeah! It looks one hundred times better now!

# 总结

You're a hero if you've read all the advice above. But. Well. If you recognized your train of thoughts, I have a piece of bad news for you. It was a joke.

![it was a prank](https://res.cloudinary.com/practicaldev/image/fetch/s--cuqyIqfO--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://i.ibb.co/7zwMdyn/image.png)

Please, never do what I said in that article. Never let your teammates cry and hate you. Always strive to be a decent and neat person. Save the world - use patterns and best practices!

I just decided to cheer you up and make your day a little bit better. Hopefully, you like it.

Stay tuned and let me know if you have any particular Angular topics you would like to hear about!

看到第一个就满脸疑惑，然后看到pipe那里觉得有问题，然后看到纯函数就觉得很不对,然后我把文章拉到了最后,XD 果然是prank


---
title: react 计时器与 useRef, useState
date: 2021-05-25
tags: [react]
category: [frontend, react]
mathjax: true
---

# 开始

一般来说tutorial, 是从有什么讲什么的开始

这里我们假设一个已经能写js的,但只是搜索react的用法,然后就开始用,可能遇到的问题(坑?)

<!-- more -->

# 问题1 useState 跟新导致局部变量无法获取新值

```ts
const [count,setCount] = useState(0);
let x = 0;
const StartTimer = () => {
  setTimeout(() => {
    x = x + 1
    console.log(x)
    StartTimer();
    setCount(x); // <----------------
  },1000);
};

const PrintX = () => {
  console.log('X:', x); // <------------
}

return (
  <View>
    <Text>{count}</Text>
    <Button
      onPress={() => StartTimer()}
      title="Start"
    />
    <Button
      onPress={() => PrintX()}
      title="Log"
    />
  </View>
)
```

我们, 把setCount注释和取消注释,会影响13行的输出

这以我历史的代码经验就很离谱,体验上就像 你写了100行代码,然后在100行以后增加了一行,影响了前100行

##  解决

https://github.com/facebook/react/issues/14010

大概意思就是 react的闭包(因为如果是js闭包直接支持的话,所见即所得,也不会有这个问题)处理后, 前面timeout里的x指向的是老的,而PrintX里的指向的是新的

解决方法就是上面issue提到的, 你需要使用react 提供的工具,让它在更新时,能更新到新的

# 问题2 设置值再取值

```ts
const [count,setCount] = useState(0);
setCount(233);
console.log(count)
```

输出是0

`useState`导出的set函数是非同步的

看了一堆 count上加`useRef`的方法

感觉从分层上`useState`看起来 更适合在需要显示层时再去用

```js
const count = useRef(0);
count.current = 233;
console.log(233);
```

# 计时器代码

```js
    const [count, setCount] = useState(0);
    let timer = useRef<NodeJS.Timeout>(null);
    let stRef = useRef(0);

    const StartTimer = () => {
        const cur = Number(new Date())
        setCount(cur - stRef.current)
        timer.current = setTimeout(() => {
            StartTimer();
        }, 100);
    };

    const StartTimerClick = () => {
        setCount(0)
        stRef.current = Number(new Date())
        if (timer.current) {
            clearTimeout(timer.current)
        }
        StartTimer()
    };
    const PrintX = () => {
        clearTimeout(timer.current)
    };
    return (
        <View style={styles.container}>
            <Text>{count}</Text>
            <Button
                onPress={() => StartTimerClick()}
                title="Start"
            />
            <Button
                onPress={() => PrintX()}
                title="End"
            />
        </View>
    );
```


# Vue2

```html
<template>
  <div>
    {{ count }}
    <button @click="StartTimerClick">start</button>
    <button @click="printX">printX</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      count: 0,
      timer: null,
      st: 0,
    };
  },
  methods: {
    StartTimer() {
      const cur = Number(new Date());
      this.count = cur - this.st;
      this.timer = setTimeout(() => {
        this.StartTimer();
      }, 100);
    },
    StartTimerClick() {
      this.count = 0;
      this.st = Number(new Date());
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.StartTimer();
    },
    printX() {
      console.log(this.count);
    },
  },
};
</script>
```

# Ng

```html
<p>{{ count }}</p>
<button (click)="StartTimerClick()">start</button>
<button (click)="printX()">printX</button>
```

```js
import {Component} from '@angular/core';

@Component({
  selector: 'app-timer-demo',
  templateUrl: './timer-demo.component.html',
  styleUrls: ['./timer-demo.component.scss']
})
export class TimerDemoComponent {
  count = 0;
  private timer = null;
  private st = 0;

  StartTimer(): void {
    const cur = Number(new Date());
    this.count = cur - this.st;
    this.timer = setTimeout(() => {
      this.StartTimer();
    }, 100);
  }

  StartTimerClick(): void {
    this.count = 0;
    this.st = Number(new Date());
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.StartTimer();
  }

  printX(): void{
    console.log(this.count);
  }
}
```

# 总结

以上,据说在 Class component 都不会出现,只有函数组件会,(当然Ng和vue都没这问题, 状态同步变更

其实这里就是,useState都去显示层需要的值,(所以其实不应该从显示层拿值做运算?),而非显示层又需要更新保持的,用useRef

当然因为不熟练,可能有更简单的写法, 比如用useEffect之类

或者应该直接rxjs的interval或者, 封装一个timer类,来持有实例和监听事件

# Ng(rxjs)

```js
import {Component} from '@angular/core';
import {timer} from 'rxjs';

@Component({
  selector: 'app-timer-demo',
  templateUrl: './timer-demo.component.html',
  styleUrls: ['./timer-demo.component.scss']
})
export class TimerDemoComponent {
  count = 0;
  private sub$ = null;

  StartTimerClick(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
    this.sub$ = timer(0, 100)
      .subscribe(val => this.count = val * 100);
  }

  printX(): void {
    console.log(this.count);
  }
}
```

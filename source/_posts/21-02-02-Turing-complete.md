---
title: 图灵完备？那做个二分vue/react/angular,递归组件Demo
date: 2021-02-02 21:58:14
tags: [vue2,angular,react,递归]
category: [frontend]
mathjax: true
---

# 总

之前看vue conf有人用vue组件算阶乘说图灵完备，于是突发奇想用组件做做二分？

<!--more-->

# Vue( 超栈了？Maximum call stack size exceeded

```js
<template>
  <demo
    v-if="this.l !== this.newl || this.r !== this.newr"
    :l="newl"
    :r="newr"
    :fn="fn"
  />
  <div v-else>[{{ l }},{{ r }}]</div>
</template>

<script>
export default {
  name: "Demo",
  props: {
    l: Number,
    r: Number,
    fn: Function,
  },
  computed: {
    mid() {
      return (this.l + this.r) / 2;
    },
    newl() {
      return this.fn(this.mid) ? this.l : this.mid;
    },
    newr() {
      return this.fn(this.mid) ? this.mid : this.r;
    },
  },
};
</script>
```

使用

```html
<demo :l="0" :r="1" :fn="(x) => x > 0" />
```

在线代码

<iframe src="https://codesandbox.io/embed/inspiring-sound-2f11o?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="inspiring-sound-2f11o"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

# React(能跑)


```js
import React, { Component } from "react";

class App extends Component {
  demo = (l, r, fn) => {
    const mid = (l + r) / 2;
    const newl = fn(mid) ? l : mid;
    const newr = fn(mid) ? mid : r;
    if (l !== newl || r !== newr) {
      return <>{this.demo(newl, newr, fn)}</>;
    }
    return (
      <div>
        [{l},{r}]
      </div>
    );
  };

  render() {
    return <div>{this.demo(this.props.l, this.props.r, this.props.fn)}</div>;
  }
}
export default App;
```

使用

```html
<App l={0} r={1} fn={(v) => v > 0} />
```

在线代码


<iframe src="https://codesandbox.io/embed/determined-maxwell-dpuv1?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="determined-maxwell-dpuv1"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

# Angular(我本地调也爆栈，但是在线的可以

html
```html
<demo
  *ngIf="l !== newl() || r !== newr();else ShowResult"
  [l]="newl()"
  [r]="newr()"
  [fn]="fn"
>
</demo>
<ng-template #ShowResult>
  [{{ l }} , {{ r }}]
</ng-template>
```

js

```js
import { Component, Input } from "@angular/core";

@Component({
  selector: "demo",
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.css"]
})
export class DemoComponent {
  @Input() l: number;
  @Input() r: number;
  @Input() fn: (v: number) => boolean;

  newl() {
    const mid: number = (this.l + this.r) / 2;
    return this.fn(mid) ? this.l : mid;
  }

  newr() {
    const mid: number = (this.l + this.r) / 2;
    return this.fn(mid) ? mid : this.r;
  }
}
```

使用

```html
<demo [l]="0" [r]="1" [fn]="fn"> </demo>
```

在线代码

<iframe src="https://codesandbox.io/embed/gifted-mestorf-zeb2m?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="gifted-mestorf-zeb2m"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

本地一旦把ngIf 去了也能跑，迷。

搜了半天，没学会ng怎么做完全的无wrapper的页面元素。

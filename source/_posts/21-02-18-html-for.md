---
title: v-for, ngFor, react(for) 列表真的需要key吗
date: 2021-02-18 21:58:14
tags: [vue2,angular,react,for]
category: [frontend]
mathjax: true
---

# Related articles

https://vuejs.org/v2/guide/list.html#Maintaining-State

https://forum.vuejs.org/t/v-for-with-simple-arrays-what-key-to-use/13692

https://www.jianshu.com/p/4bd5e745ce95

https://www.zhihu.com/question/61064119

# 总述问题

列表渲染时，在对列表插入和移除之类的操作时，会因为其设计的“替换算法”，导致语义上的对应映射错误

原始列表

```
 [ ] A
 [勾选] B
 [ ] C
```

## 实际效果(Vue/React)

删除B

```
 [ ] A
 [勾选] C
```

头部增加D

```
 [ ] D
 [勾选] A
 [ ] B
 [ ] C
```

## 期望效果(Ng)

删除B

```
 [ ] A
 [ ] C
```

头部增加D

```
 [ ] D
 [ ] A
 [勾选] B
 [ ] C
```

# Vue

https://cromarmot.github.io/VueDemo/#/VueForDemo

```html
<template>
  <div>
    <div>
      <input v-model="name" type="text" />
      <button @click="add">添加</button>
    </div>
    <div>With key</div>
    <ul>
      <li v-for="item in list" :key="item.id">
        <input type="checkbox" /> {{ item.name }}
      </li>
    </ul>
    <div>Without key</div>
    <ul>
      <li v-for="item in list"><input type="checkbox" /> {{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      newId: 3,
      list: [
        { id: 1, name: 'Name0' },
        { id: 2, name: 'Name1' },
        { id: 3, name: 'Name2' },
      ],
    }
  },
  methods: {
    add() {
      this.list.unshift({ id: ++this.newId, name: this.name })
      this.name = ''
    },
  },
}
</script>
```


# React

Same with Vue, try it on https://codesandbox.io/

```js
import React, { Component } from "react";

export default class CharShop extends Component {
  newId = 3;
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      list: [
        { id: 1, name: "Name0" },
        { id: 2, name: "Name1" },
        { id: 3, name: "Name2" }
      ]
    };
  }

  add = () => {
    this.state.list.unshift({ id: ++this.newId, name: this.state.name });
    this.setState({ name: "", list: this.state.list });
  };

  handleChange = (e) => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <div>
        <div>
          <input
            value={this.state.name}
            onChange={this.handleChange}
            type="text"
          />
          <button onClick={this.add}>添加</button>
        </div>
        <ul>
          {this.state.list.map((item) => (
            <li>
              <input type="checkbox" /> {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
```

```
Warning: Each child in a list should have a unique "key" prop.

Check the render method of `CharShop`. See https://reactjs.org/link/warning-keys for more information.
    at li
    at CharShop
```

# Ng

https://cromarmot.github.io/NgDemo/#/for-demo

Smarter !?

```html
<div>
  <input [(ngModel)]="name" type="text" />
  <button (click)="add()">添加</button>
</div>
<div>Without key</div>
<ul>
  <li *ngFor="let item of list"><input type="checkbox" /> {{ item.name }}</li>
</ul>
```

```js
import {Component} from '@angular/core';

@Component({
  selector: 'app-for-demo',
  templateUrl: './for-demo.component.html',
})
export class ForDemoComponent {
  name = '';
  newId = 3;
  list = [
    {id: 1, name: 'Name0'},
    {id: 2, name: 'Name1'},
    {id: 3, name: 'Name2'},
  ];

  add(): void {
    this.list.unshift({
      id: ++this.newId,
      name: this.name,
    });
    this.name = '';
  }
}
```

# 总

总的来说就是一个 设计上导致的Bug

从代码语义上，`Vue`和`React`在此时已经就不符合语义了，`for出来的input元素内容`和`渲染列表的内容`是挂钩的。渲染为空(默认状态)都比现在这样的更正确。

从设计上讲，既然都想到了做`值的ob`和`拦截set/get`，同样对于数组数据的每一项，可以用包裹的方式跟踪上，因为它们毕竟是会渲染到页面上的，从语义上 既然作为data(vue),state(react),class成员(ng)。

然而vue/react都没有

  于是甩锅给用户，让用户提供`key`（虽然这部分主要是`eslint`在管理提示，但默认`error`，或者`warn`都会让用户难受），（而且在官方文档中,`for的基础使用`又是支持完全没有，虽然详细文档里有）, `ng`是`trackBy`非一定要提供。

然而实际上，如果真的需要跟踪，因该有相应的数据（VM层面），怎么想都不会“复用错误”，比如上面的勾选，如果真的要用应该会有对应的勾选数组VM层进行跟踪

而还有不少是简单列表，非动态列表，key其实不必要的情况更多。

甚至产生不少用`index`作为`key`来解决`eslint`报错的代码，跟没写一样，单纯是为了不让eslint报错而写的代码

或者简单页面有两块列表时，要么塞额外字符串前后缀，要么再拆一个没啥卵用的组件层级来解决`key`冲突。

而又不建议用了 非数字和字符串的key，有些时候，对象的地址甚至也是在没有`id`时，更好的值

所以 直接关掉`key`的需求，每个列表的渲染有VM上的数据跟踪感觉更合理

`key`应该作为真的后台能提供`唯一id`时再使用的辅助功能

所以从实现上，Vue/React 也“不那么需要”修复这个Bug，使用者该做的是VM层有对应的数据跟踪，而不是打开必须key的lint配置，然后提供一个无意义/无语义的key


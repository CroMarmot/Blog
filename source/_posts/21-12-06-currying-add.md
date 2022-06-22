---
title: currying 加法
date: 2021-12-06
tags: [frontend]
category: [code, js]
mathjax: true
---

# 问题

一个支持 任意多参数，可以柯里化的加法函数

# 思路

直接返回函数 保留已传内容的加和

toString 支持输出值

# 实现

```js
function add() {
  const createF = (v) => {
    const b = function () {
      return createF(v + [...arguments].reduce((s, cur) => s + cur, 0));
    };
    b.toString = () => v;
    return b;
  };
  return createF([...arguments].reduce((s, cur) => s + cur, 0));
}
```

# 使用

```js
console.log(+add(1));
console.log(+add(1, 2));
console.log(+add(1, 2)(3));
console.log(+add(1, 2)(3)(4));
const x = add(5);
console.log(+x(6));
console.log(+x(7)(8));
const y = x(9)(9, 10);
console.log(+y());
```

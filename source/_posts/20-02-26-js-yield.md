---
title: js yield
date: 2020-02-26 11:20:14
tags: frontend
category: [js,yield]
---

# refs

[yield](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield)

[yield*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*)

[function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function*)

[function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)

# demo

直接丢浏览器或者node里跑代码

函数的值产生和继续执行

```js

function* countAppleSales () {
  let saleList = [3, 7, 5]
  for (let i = 0; i < saleList.length; i++) {
    console.log('in func before yield');
    yield saleList[i];
    console.log('in func after yield');
  }
}

let appleStore = countAppleSales()  // Generator { }
setInterval(()=>{
  console.log(appleStore.next());
},2000);
```

嵌套

```js
function* g1() {
  yield 2;
  yield 3;
  yield 4;
}

function* g2() {
  yield 1;
  yield* g1(); // here
  yield 5;
}

const iterator = g2();

console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: 4, done: false}
console.log(iterator.next()); // {value: 5, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

遍历输出

```js
function* foo() {
  yield 'a';
  yield 'b';
  yield 'c';
}

let str = '';
for (const val of foo()) { // here
  str = str + val;
}

console.log(str);
```

在函数调用是可以传参数，同时，在next调用也是可以传参数

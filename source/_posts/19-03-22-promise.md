---
title: promises分析
date: 2019-03-22 11:20:14
tags: [promise]
category: [code, frontend]
---

个人其实建议阅读下方的参考链接`zh.javascript.info`,本篇整理的主要是基于个人已有经验进行提要，简化和再解释，不够完整


# 使用Promise 和简单解释

## 例子
```js
let promise = new Promise(function(resolve, reject) {
  // executor (生产者代码，"singer")
  // 根据你自己的逻辑
  //   调用resolve(value)
  //   或者调用reject(error)
});
```

## Promise的内部状态

 - state —— 最初是 “pending”，然后被改为 “fulfilled” 或 “rejected”，
 - result —— 一个任意值，最初是 undefined。

当 executor 完成任务时，应调用下列之一：

 - resolve(value) —— 说明任务已经完成：
    - 将 state 设置为 "fulfilled"，
    - sets result to value。
 - reject(error) —— 表明有错误发生：
    - 将 state 设置为 "rejected"，
    - 将 result 设置为 error。

![状态图](https://zh.javascript.info/article/promise-basics/promise-resolve-reject.png)


总之，executor 应该完成任务（通常会需要时间），然后调用 resolve 或 reject 来改变 promise 对象的对应状态。

**注意的是** 状态一旦从pending变化后， 其它代码都会被忽略

let promise = new Promise(function(resolve, reject) {
  resolve("done");

  reject(new Error("…")); // 被忽略
  setTimeout(() => resolve("…")); // 被忽略
});

## then/catch 结果处理

then返回的是一个promise对象（准确的说是带有then方法的对象）

then(处理resolve的结果的函数,处理reject状态的函数)

then(处理resolve的结果的函数)

then(null,处理reject状态的函数) || .catch(处理reject状态的函数)

> 更确切地说，当`.then/catch` 处理器应该执行时，它会首先进入内部队列。`JavaScript` 引擎从队列中提取处理器，并在当前代码完成时执行 `setTimeout(..., 0)`。

> 换句话说，`.then(handler)` 会被触发，会执行类似于 `setTimeout(handler, 0)` 的动作。

在下述示例中，`promise` 被立即 `resolved`，因此 `.then(alert)` 被立即触发：`alert` 会进入队列，在代码完成之后立即执行。

```
 // an immediately resolved promise
let promise = new Promise(resolve => resolve("done!"));

promise.then(alert); // 完成！（在当前代码完成之后）

alert("code finished"); // 这个 alert 会最先显示
```

因此在 `.then` 之后的代码总是在处理器之前被执行（即使实在预先解决 promise 的情况下）。通常这并不重要，只会在特定情况下才会重要。

## Promise 链

首先因为then返回的是promise对象(准确说是带有then方法的对象)，和原来的不同，从api角度看是一个新的对象，其中return改变了 结果值

和原来的不同，不会覆盖原来的

![图意](https://zh.javascript.info/article/promise-chaining/promise-then-many.png)

然后处理程序的返回值里也可以 返回promise

```js
new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
}).then(function(result) {
  alert(result); // 1
  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => resolve(result * 2), 1000);
  });
})
```

所以假设`loadScript = function(url){ return Promise ...; }`

那么可以,来顺序加载脚本

```js
loadScript("/article/promise-chaining/one.js")
  .then(function(script) {
    return loadScript("/article/promise-chaining/two.js");
  })
  .then(function(script) {
    return loadScript("/article/promise-chaining/three.js");
  })
  .then(function(script) {
    //  work on one two three
  });
```

### 链上的错误处理

promise 链在这方面做的很棒。当一个 promise reject 时，代码控制流程跳到链中最近的 rejection 处理程序。这在实践中非常方便。

隐式 try…catch ,如果在execute中出现 throw，那么会和 reject方法传递的类似，被promise丢入catch里,所以这里意味着非同步的代码不会被处理，例子

```js
new Promise(function(resolve, reject) {
  setTimeout(() => {
    throw new Error("Whoops!");
  }, 1000);
}).catch(alert);
```

同样 如果在过程中 throw 或发生错误，也就意味着返回一个rejected promise

在catch块中可以重新再抛出错误，也可以处理掉错误

```js
XXX
.catch(e=>{/*处理*/})
.then(()=>{/*如果上面catch正常处理*/})
```


这里的建议是 继承实现你希望的Error类，在处理过程中控制错误对象的类型

如果没有错误处理，浏览器中 通过`unhandledrejection`捕获它

```
window.addEventListener('unhandledrejection', function(event) {
  // the event object has two special properties:
  alert(event.promise); // [object Promise] - the promise that generated the error
  alert(event.reason); // Error: Whoops! - the unhandled error object
});

new Promise(function() {
  throw new Error("Whoops!");
}); // no catch to handle the error
```

# js+promise+cache example

```
function loadCached(url) {
  let cache = loadCached.cache || (loadCached.cache = new Map());

  if (cache.has(url)) {
    return Promise.resolve(cache.get(url)); // (*)
  }

  return fetch(url)
    .then(response => response.text())
    .then(text => {
      cache[url] = text;
      return text;
    });
}
```

之后使用`loadCached(url).then(…)`

# Promise.all

```js
Promise.all([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 3000)), // 1
  new Promise((resolve, reject) => setTimeout(() => resolve(2), 2000)), // 2
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 1000))  // 3
]).then(alert); // 1,2,3 when promises are ready: each promise contributes an array member
```

在 3 秒之后被处理，然后它的结果就是一个`[1, 2, 3]`数组：

它们的相对顺序是相同的。尽管第一个 promise 需要很长的时间来解决，但它仍然是结果数组中的第一个。

这里可以看到，不同处理之间是并行的，结果位置是对应插槽的

实例，并行获取资源，统一等待结束

```
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://api.github.com/users/jeresig'
];

// map every url to the promise fetch(github url)
let requests = urls.map(url => fetch(url));

// Promise.all waits until all jobs are resolved
Promise.all(requests)
  .then(responses => responses.forEach(
    response => alert(`${response.url}: ${response.status}`)
  ));
```

如果任何 promise 为 rejected，Promise.all 就会立即以 error reject。重要的细节是 promise 没有提供 “cancel” 或 “abort” 执行方法。因此，其他 promise 会继续执行，并最终为 settle，但它们的结果会被忽略。

所以建议的是，如果要使用all，那么在每个处理内部把错误处理掉，这样就不会单个的错误导致整个promise结束

```
Promise.all(
  fetch('https://api.github.com/users/iliakan').catch(err => err),
  fetch('https://api.github.com/users/remy').catch(err => err),
  fetch('http://no-such-url').catch(err => err)
)
```

原始

```
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://api.github.com/users/jeresig'
];

// make fetch requests
Promise.all(urls.map(url => fetch(url)))
  // map each response to response.json()
  .then(responses => Promise.all(
    responses.map(r => r.json())
  ))
  // show name of each user
  .then(users => {  // (*)
    for(let user of users) {
      alert(user.name);
    }
  });
```

改进

```
let urls = [
  'https://api.github.com/users/iliakan',
  '/',
  'http://no-such-url'
];

Promise.all(
    urls.map(url => fetch(url).catch(err => err))
  )
  .then(responses => Promise.all(
    // if it's an error then pass on
    // otherwise response.json() and catch errors as results
    responses.map(r => r instanceof Error ? r : r.json().catch(err => err))
  ))
  .then(results => {
    alert(results[0].name); // Ilya Kantor
    alert(results[1]); // SyntaxError: Unexpected token < in JSON at position 0
    alert(results[2]); // TypeError: failed to fetch (text may vary)
  });
```


## Promise.race

相对于`Promise.all`类似,区别是只会等最快的完成

# async/await

更舒适的方法使用promise

## async

放在函数前，总会返回promise,如果不是则会把函数封装成promise

## await

await 关键字使 JavaScript 等待，直到 promise 得到解决并返回其结果。

不能在常规函数中使用 await,await 在顶层代码中无效, 我们需要将 await 代码封装在一个async 函数中

await + promise/thenable函数

## 结果

正常的话 返回结果，否则抛出error

# 总结

![img](https://zh.javascript.info/article/promise-chaining/promise-handler-variants.png)

# ref

[【翻译】Promises/A+规范](http://www.ituring.com.cn/article/66566)

[Promise Tutorial](https://zh.javascript.info/promise-basics)

[Promise chaining](https://zh.javascript.info/promise-chaining)

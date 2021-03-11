---
title: vue2 reactive基本原理demo
date: 2021-01-13 21:58:14
tags: [vue2]
category: [backend]
mathjax: true
---

# 总

以下代码均可以在nodejs和chrome的console里运行

以下均未考虑兼容,空判断,父类属性,解除绑定, 多层关系, 循环调用,多次调用等

# Step 1 接管赋值和取值

```js
const demo = {};
demo._dAtA = {};
Object.defineProperty(demo, 'x', {
  get: function(){
    return demo._dAtA['x'] * 2;
  },
  set(val){
    console.log(val);
    demo._dAtA['x'] = val;
  }
})
demo.x = 123
console.log(demo.x)
```

专门做了个赋值取值不一致的乘2

<!--more-->

# Step 2 函数订阅与触发

```js
class Demo {
  subs = []
  sub(fn) {
    this.subs.push(fn)
  }
  unsub(fn) {
    for(let i = this.subs.length - 1;i >= 0 ;i--){
      if(this.subs[i] === fn){
        this.subs.splice(i,1);
        return
      }
    }
  }
  notify() {
    console.log('nofity start');
    for(let i = 0; i < this.subs.length; i ++){
      (this.subs[i])();
    }
    console.log('nofity end');
  }
}

const d = new Demo();

const hello0 = ()=>{console.log('hello 0')}
d.sub(hello0)
d.notify()
d.unsub(hello0)
d.notify()

d.sub(()=>{console.log('hello 1')})
d.unsub(()=>{console.log('hello 1')})
d.notify()
```

专门写了两种，对于函数指针不了解的，也可以通过这个理解一下

# Step 3 data + computed

有了上面的基本工具，结合一下

```js
'use strict';
class Sub{
  subs = []
  sub(fn) {
    this.subs.push(fn)
  }
  notify(){
    this.subs.forEach(fn=>{fn()});
  }
}

// currentReactiveValue
let curV = null;
function defineReactive(obj, key, value, db){
  let subs = new Sub();
  obj[db][key] = value;
  Object.defineProperty(obj, key, {
    get(){
      if(curV){
        // not bind self
        if(!(curV.vm === obj && curV.key === key)){
          const rv = curV;
          subs.sub(()=>{
            rv.vm[rv.key] = rv.fn();
            console.log(`\t[info][${rv.key}] set to [${rv.vm[rv.key]}]`);
          });
        }
      }
      return obj[db][key];
    },
    set(v){
      obj[db][key] = v
      subs.notify();
    }
  })
}

function defineComputed(obj, key, fn) {
  curV = {vm: obj, key, fn: fn.bind(obj)};
  let d = (fn.bind(obj))();
  defineReactive(obj, key, d, '_computed');
  curV = null;
}

class VDemo{
  constructor(config){
    const d = config.dAtA();
    this._data = {};
    for(let key in d) {
      defineReactive(this, key, d[key], '_data');
    }
    this._computed = {}
    for(let key in config.computed){
      defineComputed(this, key, config.computed[key])
    }
  }
}

const vDemo = new VDemo({
  dAtA(){
    return {
      vAl0: 'hey',
      vAl1: 'world'
    }
  },
  computed: {
    x() {
      return this.vAl0 + ' ' + this.vAl1;
    },
    y() {
      return 'y: ' + this.x;
    }
  }
})

console.log(vDemo.vAl0)
console.log(vDemo.vAl1)
console.log(vDemo.x)
vDemo.vAl0 = 'hello'
console.log(vDemo.x)
vDemo.vAl1 = ' ?'
console.log(vDemo.x)
console.log(vDemo.x)
console.log(vDemo)
```

这样，改变值，依赖的值就会自动跟着变化，而在依赖的值不变时，不会多次调用函数。

# 相关文档

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty


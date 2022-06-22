---
title: Simple Deep Clone
date: 2023-02-14
tags: [js]
category: [frontend]
mathjax: true
---

# 问题

实现一个简单的deepclone 支持循环结构体

```js
let x= {'y':{'z': 3},'w':2,'?':[0,1,2],q:()=>{console.log('hello');}};

x.y.z=x;
x['?'][1]=x;

function deepCloneInner(src, mp){
  if(src == null) return null;
  if(mp.has(src)) return mp.get(src);
  if(Array.isArray(src)){
    const res = [];
    mp.set(src,res);
    for(let i =0;i<src.length;i++) res.push(deepCloneInner(src[i],mp));
    return res;
  }
  if(typeof src == 'object'){
    const res = {};
    mp.set(src,res);
    for(let key in src){
      if(src.hasOwnProperty(key)){
        res[key] = deepCloneInner(src[key],mp);
      }
    }
    return res;
  }
  return src;
}

function deepClone(src){
  return deepCloneInner(src,new Map());
}

let w= deepClone(x);
console.log(w);
console.log(w.y.z==w);
console.log(w.y.z==x.y.z);
```

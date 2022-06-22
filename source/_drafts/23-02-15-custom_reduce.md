---
title: Custom Reduce
date: 2023-02-15
tags: [js]
category: [frontend]
mathjax: true
---

# 问题

实现一个reduce


```js
Object.defineProperty(Array.prototype,'myreduce',{
    value: function(fn, init){ let res = init; for(let i=0;i<this.length;i++) res=fn(res,this[i]); return res; }
});

[1,2,3,4].myreduce((s,a)=>s+a,0)
```


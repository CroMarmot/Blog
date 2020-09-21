---
title: 宏任务 微任务
date: 2020-09-21 16:58:14
tags: [microTasks,macroTasks,schedule]
category: [frontend]
mathjax: true
---

# 参考

https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/

有精力建议，直接看上面原文，作者的demo做得很好的！

以外的话 还有mdn的文档看

https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide

# 总结

setTimeout 启动的宏任务

promise(以及await的写法) 和 observer 都是微任务

执行是单线程，当宏任务执行完后，把所有等待的微任务执行后，才会执行下一个宏任务。

然后作者举例了一个稍微特殊一点的，html的事件冒泡，父子元素都有点击事件。

 - 鼠标点击子元素。分发是靠浏览器分发，对于js的任务是两个click。

 - 代码调用子元素点击事件，也会触发冒泡，但是对于js的任务是 这个调用代码。

因此上面两种看似相同的点击会有不同的执行顺序。


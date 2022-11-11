---
title: ios13.5.1+, vue2 vShow,css transform rotate, BUG
date: 2020-08-06 10:37:14
tags: [ios13.5.1,ios,vue2,bug]
category: [ frontend]
mathjax: true
---

# 描述

期望

```
点击按钮
显示div
旋转4.5秒
隐藏div
```

BUG:

在android和ios(系统版本<=12)上正常的代码，在ios(>=13.5.1)上 如果前后角度相同会无法旋转

# 代码vue

<!--more-->

```vue
<template>
  <div
    class="container"
  >
    <div
      v-show="display"
      :style="{ transform: angle }"
      class="demo-div"
    >Hey
    </div>

    <h1>expect: show div, rotate div. rotate angle({{ rotateA }}), hide div</h1>
    <div v-if="!unClickable">
      <h2 @click="onClick(0)">Same angle(bug)</h2>
      <h2 @click="onClick(60)">+60 angle</h2>
    </div>
  </div>
</template>

<script>
// rotate stuck on ios ( >=13.5.1 ) , works well on android and ios ( <= 12 )
export default {
  data() {
    return {
      unClickable: false,
      display: false,
      angle: 'rotate(0deg)',
      rotateA: 0
    }
  },
  methods: {
    onClick(deg) {
      if (this.unClickable) {
        return
      }
      this.unClickable = true
      this.display = true
      setTimeout(() => {
        // if rotate don't change the rotation will stucked
        this.rotateA = (this.rotateA + deg) % 360
        this.angle = `rotate(${(6 * 360 + this.rotateA)}deg)`
      }, 100)
      // change 100 to 1000 works well

      setTimeout(() => {
        this.angle = 'rotate(0deg)'
        this.display = false
        this.unClickable = false
      }, 5500)
    }
  }
}
</script>
<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

h2 {
  background-color: lightgrey;
  padding: 1em;
}

.demo-div {
  transition: transform ease-out 4.5s;
  width: 50vw;
  height: 50vh;
  background-color: lightblue;
}
</style>
```

# 一些调试结果

如果和上一次结束的角度不同，则可以旋转。

如果把setTimeout调整到1000则可以旋转。

如果把`v-show`设置成始终显示也没有问题。

可能和vue关系不大，因为通过把v-show换成 纯js对的display操作也能重现

没有可以直接调试ios webview的工具。猜测是ios的 webview和 vue 的 `v-show` 某些处理出现了问题

# 在线demo

https://42zc6.csb.app

<iframe src="https://codesandbox.io/embed/naughty-nobel-42zc6?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="naughty-nobel-42zc6"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


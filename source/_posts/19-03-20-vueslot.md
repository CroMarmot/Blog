---
title: vue slot
date: 2019-03-20 11:20:14
tags: [vue2, vue slot]
category: [ frontend, vue2]
---

参考:https://blog.csdn.net/qq_38128179/article/details/85273522


父组件

```html
<Child>
  <span slot="header">我是header</span>
  <span slot="footer">我是footer</span>
  <span slot="abcdef">我是abcdef</span>
</Child>
```

Child
```html
<template>
  <div>
    <slot name="abcdef"></slot>
    <slot name="header"></slot>
    <h1>我是子组件</h1>
    <slot name="footer"></slot>
  </div>
</template>
```

父组件中没有标注`slot=""`的会被插入到 没有标注的子组件的`<slot></slot>`

---

父组件反过来解构`slot-scope`

Child

```html
<template>
  <div>
    <slot :data="data"></slot>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: ['Neinei','Laoba','Demi','Feiyan']
    }
  }
}
</script>
```

父组件 这里的`.data` 和子组件的`:data`对应
```html
<template>
    <!-- 循环数据列表 -->
    <Child>
      <div slot-scope="msg">
        <span v-for="item in msg.data">{{item}} </span>
      </div>
    </Child>
 
    <!-- 直接显示数据 -->
    <Child>
      <div slot-scope="msg">
        <span>{{msg.data}} </span>
      </div>
    </Child>
 
    <!-- 不使用其提供的数据, 作用域插槽退变成匿名插槽 -->
    <Child>
      <div>我是插槽</div>
    </Child>
  </template>
```



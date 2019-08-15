---
title: vue custom v-model
date: 2019-04-01 11:20:14
tags: [vue2, v-model]
category: [code,frontend, vue]
---

# 感谢

https://scotch.io/tutorials/add-v-model-support-to-custom-vuejs-component

To let our component support v-model two-way binding, I stated earlier that the component needs to accept a `value` prop and emit an `input` event.

```js
<template>
  <input @input="handleInput" />
</template>

<script>
export default {
  prop: ['value'],
  data () {
    return {
      content: this.value
    }
  },
  methods: {
    handleInput (e) {
      this.$emit('input', this.content)
    }
  }
}
</script>
```

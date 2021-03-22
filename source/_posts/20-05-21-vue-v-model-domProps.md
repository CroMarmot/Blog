---
title: vue vmodel domprops
date: 2020-05-21 11:20:14
tags: [js,vue2]
category: [code, frontend, vue]
---

# 起因

在业务页面 希望对输入框进行额外操作，例如 当输入长度大于 10则截取到前10位

BUG产生，业务页面写了如下的代码

```
data(){
  return {
    someInputValue:'',
  }
},
watch:{
  someInputValue(newVal){
    this.someInputValue = newVal.substr(0,10);
  }
}
```

然后 前技术经理写的输入框 却可以一直输入

我用render函数 写的没有问题

直接裸的input也没问题

# 定位

加了一堆console，基本确定bug的原理是

1. 内部输入更新
2. 触发组件emit
3. 业务页面得到超过长度的值
4. 修改为只有长度为10的值
5. 通过props传递给组件
6. 触发组件内对value的watch (这次能成功
7. 用户继续输入
8. 触发组件emit
9. 业务页面得到超过长度的值
10. 修改为只有长度为10的值
11. 通过props传递给组件
12. 没有触发组件内对value的watch

# 对比

官方直接`input`能用，但不知道是怎么封装的

我封装的是参考`https://cn.vuejs.org/v2/guide/render-function.html#v-model`的

然而,如果你直接尝试上面所写的你会发现并不如愿

没有使用watch，而是使用`domProps`

我封装的是参考`https://cn.vuejs.org/v2/guide/render-function.html#v-model`的没有使用watch，而是使用`domProps`

# 解决

直接的话就是用`domProps` 但是有个问题，如果使用者

另外的话，我本来实现的是会提供一个接受过滤函数的props，业务层可以传递过滤函数而不是通过外部watch

# 结论

目前看起来，双向绑定就应该做全，不要单向使用。

有些时候不设置默认值？

# 代码

```vue
<template>
  <div>
    <h1>v-model</h1>
    <div class="row">
      <div> input(默认)<input v-model="x1"> {{ x1 }}</div>
      <div>Input2(官方文档)<Input2 v-model="x2" />  {{ x2 }}</div>
      <div>Input3(我)<Input3 v-model="x3" />      {{ x3 }}</div>
      <div>Input4(历史遗留代码)<Input4 v-model="x4" />      {{ x4 }}</div>
    </div>
    <h1>@input only</h1>
    <div class="row">
      <div>input(默认)<input @input="(e)=>{input1 = e.target.value;}">    {{ input1 }}</div>
      <div>Input2(官方)<Input2 @input="(v)=>{input2=v;}" />    {{ input2 }}</div>
      <div>Input3(我)<Input3 @input="(v)=>{input3=v;}" />    {{ input3 }}</div>
      <div>Input4(历史遗留代码)<Input4 @input="(v)=>{input4=v;}" />    {{ input4 }}</div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    Input3: {
      name: 'FormInputJsx',
      // inheritAttrs: false,
      props: {
        inputFilter: {
          type: Function,
          default: null
        },
        // 传入类型
        value: String
      },
      data() {
        return {
          valueIn: this.value
        }
      },

      methods: {
        updateValue(value) {
          let newVal = value
          if (this.inputFilter) {
            newVal = this.inputFilter(newVal)
          }
          // this.valueIn = newVal
          // if (this.$refs.input.value !== this.valueIn) {
          //   this.$refs.input.value = this.valueIn
          // }
          this.$emit('input', newVal)
        }
      },
      render(h) {
        const inputConfig = {
          ref: 'input',
          // input 原始属性不改动 自动下发-
          // attrs: Object.assign({ ...this.$attrs }),
          on: Object.assign({ ...this.$listeners }, {
            input: event => this.updateValue(event.target.value) // 输入框改变
          })
        }
        if (typeof this.value !== 'undefined') {
          inputConfig.domProps = {
            value: this.value
          }
        }
        return h('input', inputConfig)
      }
    },
    Input4: {
      render(h) {
        const self = this
        return h('input', {
          domProps: {
            value: self.value
          },
          on: {
            input (event) {
              self.Amount = event.target.value
            }
          }
        })
      },
      props: {
        value: {
          type: String,
          default: ''
        }
      },
      data() {
        return {
          Amount: ''
        }
      },
      watch: {
        value(newVal) {
          this.Amount = newVal
        },
        Amount(newVal) {
          // 从前截取 不带$
          this.Amount = newVal.match(/^\d*(\.?\d{0,2})/g)[0] || ''
          if (isNaN(this.Amount)) {
            this.Amount = ''
          }
          this.$emit('input', this.Amount)
        }
      }
    },
    Input2: {
      props: ['value'],
      render (createElement) {
        const self = this
        return createElement('input', {
          domProps: {
            value: self.value
          },
          on: {
            input (event) {
              self.$emit('input', event.target.value)
            }
          }
        })
      }
    }
  },
  data() {
    return {
      x1: '',
      x2: '',
      x3: '',
      x4: '',
      input1: '',
      input2: '',
      input3: '',
      input4: ''
    }
  },
  watch: {
    x1(nv) {
      this.x1 = nv.substr(0, 3)
    },
    x2(nv) {
      this.x2 = nv.substr(0, 3)
    },
    x3(nv) {
      this.x3 = nv.substr(0, 3)
    },
    x4(nv) {
      this.x4 = nv.substr(0, 3)
    },
    input1(nv) {
      this.input1 = nv.substr(0, 3)
    },
    input2(nv) {
      this.input2 = nv.substr(0, 3)
    },
    input3(nv) {
      this.input3 = nv.substr(0, 3)
    },
    input4(nv) {
      this.input4 = nv.substr(0, 3)
    }
  }

}
</script>

<style>
.row{
  display:flex;
  flex-direction:column;
}
</style>
```


# refs

[vue render v-model](https://cn.vuejs.org/v2/guide/render-function.html#v-model)

[vue pull requests 9331](https://github.com/vuejs/vue/pull/9331)

---
title: eleme vue msgbox 简单看看实现原理
date: 2019-09-04 11:20:14
tags: 
category: [code,vue,js,alert]
---

# 依赖版本

element-ui 版本 10592d12ea981912165542920160669fd8874bd9

文档 https://element.eleme.io/#/zh-CN/component/message-box

# 要解决的问题

像是

```
$msgbox(options)
$alert(message, title, options) 或 $alert(message, options)
$confirm(message, title, options) 或 $confirm(message, options)
$prompt(message, title, options) 或 $prompt(message, options)
```

这样的api是怎么实现的

# 代码阅读

大概看一眼怎么搞的

`src/index.js` 看 这些方法 ,都是来自 `import MessageBox from '../packages/message-box/index.js';`

```js
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
```

那么看 `packages/message-box/src`文件夹

两个文件 `main.js`和 `main.vue`

`main.vue`瞄一眼,都是我们常见的写法

`main.js`，看这些方法 最后 都是 调用 `MessageBox(配置参数)`的形式调用

再看`const MessageBox = function(options, callback) {`的实现

都是 先`msgQueue.push(配置参数) + showNextMsg()`

`msgQueue`和 `showNextMsg`,分别是个数组，和从数组中`shift()` 取出值 进行具体展示执行

然后 看 `showNextMsg()` 

```
  if (!instance) {
    initInstance();
  }
```

然后

```
const initInstance = () => {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  });

  instance.callback = defaultCallback;
};
```

和

```
const MessageBoxConstructor = Vue.extend(msgboxVue);
```

说明了基本这就是 工厂模式+单例模式+`Vue.extend`来创建弹框单例,所以我们页面上不需要写什么,就能直接调用

然后这些`confirm`调用过程 也就是对这个单例的参数改动 比如控制样式 数据 显示之类的

# 总结

1. 用户调用 `$msgbox`
2. 调用到`packages/message-box/src/main.js`的 `MessageBox(options,callback)`
3. `MessageBox(options,callback)`通过 数组 + 数组.shift,依次提取数据展示
4. 对于展示的实例 是 通过 `Vue.extend(packages/message-box/src/main.vue)` + 工厂单例来产生的一个实例
5. 他们 搞了一个`element/examples/components/demo-block.vue` 可以在`markdown`写示例代码,并且在网页上查看 可以运行 66666

> 那常见的问题可能有说，连续调用2此带有回调函数的`$msgbox`会怎样


我们可以看`showNextMsg()`实现

```js
//得到 instance
  if (!instance.visible || instance.closeTimer) {
 //...
      let oldCb = instance.callback;
      instance.callback = (action, instance) => {
        oldCb(action, instance);
        showNextMsg();
      };
      //...
      Vue.nextTick(() => {
        instance.visible = true;
      });
      //...
```


意思就是如果我们同步调用两个，

 * 因为我们visible设置为true是 异步里发生的,那么 这两个调用时 visible默认都是false,所以 只会最后一个生效
 * 如果我们异步调用两次msgbox,那么 后一个调用 会在`!visible`的地方为false,不会直接触发，但是因为设计了msgQueue,因此 会放在数组中，然后看到 上面的callback,会在调用oldCb以后 再调用showNextMsg,所以会在对话框回调以后 再回调 那个时刻，msgQueue里首个 并从数组中移除



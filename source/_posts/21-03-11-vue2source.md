---
title: vue2源码阅读(由xmind笔记生成, 修改中...)
date: 2021-03-11
tags: [js,vue2,source code]
category: [code, frontend, vue]
mathjax: true
---

# 源代码

## commit hash:

4f81b5db9ab553ca0abe0706ac55ceb861344330

## src

- server
- platforms
- core 6600 行
- shared
- compiler
- sfc

	- 134 ./sfc/parser.js

## dist

- 生成的文件

## typings

- TypeScript的定义文件

## 本地调试代码环境搭建

- ```
yarn
yarn dev -m
```

	- 产生的文件之后可以浏览器或node中调用输出
	- -m 是 rollup 启用sourcemap

- https://github.com/numbbbbb/read-vue-source-code/issues/9

## <!--more-->

# 阅读

## src/platforms/weex

- 阿里之前的，已经弃用了？上次更改2020年1月

## entry

- package.json: scripts::dev

	- `rollup -w -c scripts/config.js --environment TARGET:web-full-dev`

		- grep一下，在 scripts/config.js 中找到 web-full-dev 配置

- 配置指向 `resolve('web/entry-runtime-with-compiler.js')`

	- resolve基于alias，来自文件scripts/alias.js

		- `web =   resolve('src/platforms/web')` 相对路径解析

			- vue 对应 `src/platforms/web/entry-runtime-with-compiler.js`

				- `Vue = ./runtime/index`
				- 把原来的Vue.prototype.$mount 做了一层校验包裹

					- 和把template通过 compileToFunctions 变成render和staticRenderFns 
					- 调用 idToTemplate ， getOuterHTML

				- `Vue.compile = ./compiler/index`

					- 子主题 1

				- IE兼容

					- `import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'`

## src/platforms/web/runtime/index.js

- 通过core/index.js 引入Vue
- 平台特有的utils

	- vue.config.mustuseprop = mustuseprop
	- vue.config.isreservedtag = isreservedtag
	- vue.config.isreservedattr = isreservedattr
	- vue.config.gettagnamespace = gettagnamespace
	- vue.config.isunknownelement = isunknownelement

- `extend(Vue.options.directives, platformDirectives)`
- `extend(Vue.options.components, platformComponents)`
- `Vue.prototype.__patch__ = inBrowser ? patch : noop`

	- 更新操作DOM（稍后提到）

- `Vue.prototype.$mount` 定义
- 浏览器内，开发工具devtools相关的 console提示

## core/index.js

- 通过core/instance/index引入Vue
- initGlobalAPI(Vue)
- $isServer （原型链）
- $ssrContext（原型链）
- FunctionalRenderContext
- .version

## core/instance/index

- 提供Vue函数，并调用多个 Mixin初始化

  函数本身 判断是否是new 产生的，并调用`this._init(options)`

	- 这一部分都是实例化Vue对象之前，我们可以略过的看看方法的内部实现，因为这个阶段，只是把Vue上去定义 字段和函数，和Vue.prototype上去定义字段和函数，其函数内容都还尚未执行，在调用new 之后才会进入到真正实例化

- 这也是 在创建Vue的Class的最里层了
- `core/instance/init.js::initMixin(Vue)`

	- 提供用户 new Vue({.....})时，会去调用的_init()函数

- `core/instance/state.js::stateMixin(Vue)`

	- Object.defineProperty(Vue.prototype, '$data',{get : function () { return this._data }}
	- Object.defineProperty(Vue.prototype, '$props',{get : function () { return this._props }}
	- 原型链定义$set (target: Array<any> | Object, key: any, val: any): any {)
	- 原型链定义$delete(target: Array<any> | Object, key: any) {
	- 原型链定义$watch(expOrFn: string | Function,    cb: any,    options?: Object  ): Function {

- `core/instance/events.js::eventsMixin(Vue)`

	- 这里数组 用的Array.isArray 判断的，而这个方法我查了一下， < IE9 不支持，还是说有相关的polyfill
	- 原型链定义$on

		- 这为啥Array 还要递归，string直接，这还可以 $on([[],[],[[[]]]]) 这样来写？
		- 这里也可以看到为了把 _hasHookEvent 移动到 $on 判断，修改了代码，但是测试没有保护，而对应的$off 没有加任何操作, 所以这里从逻辑意义上实现已经不对了，做成enable的语义，不改变实现或许都更好

			- 对应的我们能找到提交记录 7ffa77f3df1d9ec5253657daa4a59bf7af7f503e
			- 果然根据提交记录，就是从原本始终都触发的变成了 增加字段来判断，而再删除时不对称，真的是十分业务的实现（假设的前提是 大量的代码不使用hook，否则这些实现增加字段降低效率）
			- 从callHook 可以看到 生命周期的事件会多一个 hook:<xxxx> 的事件出来

	- 原型链定义$once

		- once，包裹了一层，在off里面 去fn.fn 去判断的相等

			- 也就是正常的函数 和 once 调用还有区别，一个是直接括号，一个是点fn括号

	- 原型链定义$off

		- if(!fn) 关掉所有 对应event...

			- 这里有 undifined/null/空数组/有值的数组，都有可能
			- 这里插入同一个函数可能插入多次，删除一次一个，从 尾部 找到 函数指针相等的删除

	- 原型链定义$emit

		- invokeWithErrorHandling

			- 调用函数，有错报错

				- 增加 _handled 来阻止 nested calls

- `core/instance/lifecycle.js::lifecycleMixin(Vue)`

	- 原型链定义_update 方法

		- 考虑说，vm._vnode 有无 而不是增加state去做状态判断,有点magic number的意味，也不完全是
		- `if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {` 父组件是高阶组件的判断？

			- 只替换高阶的 $el, 没替换 `__vue__`, _vnode 等？

	- 原型链定义$forceUpdate 方法

		- vm._watcher.update()

	- 原型链定义$destroy 方法

		- _isBeingDestroyed 状态
		- hook

			- 和我们外部看到的生命周期相关了

		- 拆卸 vm._watcher

			- .... 怎么又是 watcher又是watchers 数组

		- 引用计数 vmCount--
		- mountComponent 方法

			- beforeMount的周期

- `core/instance/render.js::renderMixin(Vue)`

	- 一堆被压缩成 `_字母`的方法
	- 方法 $nextTick
	- _render 方法

## Vue._init()

- 前面的代码 都是在 new Vue 之前 import阶段发生的事情,往后就是，Vue整个类被构建好了，还是真正产生实例的过程
- 这个函数是 initMixin 在原型链中定义的
- 这部分的时候，先忽略 defineReactive，ast等，Watcher 相对复杂的实现，主要看一个流程 和 一些相对不那么复杂的调用实现。
- 用户代码举例

  ```js
  new Vue({
  	el:'#app',
  	data(){
  		return {
  			message: 'Hello Vue!'
  		}
  	}
  })
  ```

- `src/core/instance/init.js:: _init(options)`

	- _uid = uid++ ("全局" uid)
	- _isVue = true
	- $options

		- 根据_isComponent 静态创建

			- function initInternalComponent

				- 因为动态options merging很慢，内部组件特殊处理

		- 否则 mergeOptions 动态创建

			- function resolveConstructorOptions

				- 动态 递归向根节点的 解析options
				- resolveModifiedOptions

					- 支持热更新 修改 options
					- https://github.com/vuejs/vue/issues/4976

	- 定义`_renderProxy`

		- 是否生产用的不同的渲染函数

			- 重复的 env 判断?

	- `_self`指向自己

- initLifecycle

	- 定义一些实例上的一些字段
	- `$parent` (递归向上找，和$parent通过 上面的$children 建立联系)
	- `$root = parent ? parent.$root : vm`
	- `$children = []`
	- `$refs = {}`
	- _watcher = null
	- _inactive = null
	- _directInactive = false
	- _isMounted = false
	- _isDestroyed = false
	- _isBeingDestroyed = false

- initEvents

	-   vm._events = Object.create(null)
	-   vm._hasHookEvent = false
	- 基于`vm.$options._parentListeners`增加listeners

		- `__WEEX__` 又塞进来了？
		- 这里又不用null用undefined了，而且也不是闭包一个 增删来控制vm?

- initRender

	- _vnode = null
	- _staticTrees = null
	- $slots = resolveSlots(options._renderChildren, renderContext)
	- $scopedSlots = emptyObject
	- _c = (a, b, c, d) => createElement(vm, a, b, c, d, false)

		- 这里可以看到在js实现函数重载然后封装的体验 XD

	- $createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
	- $attrs

		- 通过defineReactive创建
		-     defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)

	- $listeners

		- 通过defineReactive创建

			- 这一块用了，emptyObject, 一个不可更改的空对象，我真的不看变量名，看不出它不可更改， 但刚刚才看的另一段代码没有用...不一致啊

		-     defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)

	- 主要作用是，提供vm上实例的函数， scoped信息 和 响应式属性 之类

- callHook(vm, 'beforceCreate') 生命周期
- initInjections

	- inject.js

		- 这个文件在上面的5个mixin中没有出现过，但是初始化会调用
		- 通过 toggleObserving 包裹，中间的部分不触发响应式相关的
		- 注入也是通过 defineReactive 挨个key注入

		  ```js
		  ﻿// 核心实现
		  const result = ﻿resolveInject(vm.$options.inject, vm)
		  Object.keys(result).forEach(key => {
		        defineReactive(vm, key, result[key])
		      }
		  })
		  ```

		- 来源 就是当前级别递归向上找`_provided`

	- resolve injections before data/props
	- 对于使用者，当前级别或父/祖先级别提供provide的东西，任意层级子级别，需要用，直接写inject，就能获得到对应的数据，而中间层级完全不需要描述

- initState

	- _watchers = []
	- proxy 函数

	  ```js
	  export function proxy (target: Object, sourceKey: string, key: string) {
	    sharedPropertyDefinition.get = function proxyGetter () {
	      return this[sourceKey][key]
	    }
	    sharedPropertyDefinition.set = function proxySetter (val) {
	      this[sourceKey][key] = val
	    }
	    Object.defineProperty(target, key, sharedPropertyDefinition)
	  }
	  ```

		- 也可以看到这里的用了 defineProperty

	- porps 核心实现

	  ```js
	  const props = vm._props = {}
	  vm._propsKeys = []
	  for (const key in vm.$options.props﻿) {
	    defineReactive(props, key, value)
	    if (!(key in vm)) {
	      proxy(vm, `_props`, key)
	    }
	  }
	  ```

		- 非 root，都是关闭响应式 进行操作的

	- methods 核心实现

	  ```js
	  const methods = vm.$options.methods
	  for (const key in methods) {
	    vm[key] = bind(methods[key], vm)
	  }
	  ```

		- 这一块有做 保留词判断，对于`$` 和 `_`开头的视作保留词 isReserved
		- initMethods 中可以看到 和_props中做冲突检查，但是这里是直接提出了_props? 为啥不是专门建立冲突表，毕竟data，computed里都可能会有冲突检查
		- 这里也可以看到，我面试喜欢问人 为啥function中的this是怎么来的，或者让你实现会怎么实现，这里bind

			- 稍微多dig一下代码，发现了还有nativebind和pollyfillBind 为了解决不支持默认的bind的情况

	- _data

		- 有data时，核心实现

		  ```js
		  ﻿const data = vm._data = typeof data === 'function'
		    ? getData(data, vm)
		    : data || {}
		  const keys = Object.keys(data)
		  let i = keys.length
		  while (i--) {
		    const key = keys[i]
		      proxy(vm, `_data`, key)
		  }
		  // observe data
		  observe(data, true /* asRootData */)
		  ```

			- ...为啥相邻3个函数，传参设计还有的自己取，有的提取出来，再传入
			- 刚刚说了，冲突校验越写越多
			- 哦 原来这里data调用时会传递实例本身，可以this.去拿，也可以直接 通过传入的vm获得this
			- 感觉，这里如果是裸的data，完全可以加一个 深拷贝来做，但是为啥 就只是报个错？历史原因？
			- 也有isReserved判断是否是 `$`,`_`开头
			- 最后observe(data, true)

		- 无data时，observe(vm._data={}, true)

	- initComputed

	  ```js
	  const watchers = vm._computedWatchers = Object.create(null)
	  
	  for (const key in this.$options.computed) {
	    const userDef = computed[key]
	    const getter = typeof userDef === 'function' ? userDef : userDef.get
	      watchers[key] = new Watcher(
	        vm,
	        getter || noop,
	        noop,
	        computedWatcherOptions
	      )
	  Object.defineProperty(target, key, sharedPropertyDefinition) // 其中 sharedPropertyDefinition是基于用户提供的函数创建的 带有cache或直接的 调用函数﻿
	  }
	  ```

		- `this._computedWatchers = Object.create(null)` 真实存储在 这个field的键值对里
		- 对于 服务端渲染ssr的情况，computed就是作为getter计算
		- 这里可以看到，漏掉了和methods冲突校验？只有$data 和 props
		-     sharedPropertyDefinition.get = shouldCache       ? createComputedGetter(key) : createGetterInvoker(userDef)

			- 这两块实现细节与 响应式有关，在后面响应式讲解的地方再细说。总之从现在的视角就是通过把用户传入的包装后的函数

	- initWatch

	  ```js
	  for (const key in this.$options.watch) {
	    vm.$watch(key,watch[key])
	  }
	  ```
	  
	  $watch，闭包内watcher，留一个unwatchFn支持取消
	  
	  ```js
	  const watcher = new Watcher(vm, key, watch[key], {})
	  ```

		- 这里代码做的是单watch的情况会走的代码，watch还可以数组函数, 可以immediate，这些官方文档上统统都没有
		- createWatcher又见函数重载

- initProvide

	- 函数则vm调用，值则直接取，放在 vm._provided

- callHook(vm, 'created') 生命周期
- 上面就完成了js部分的创建，vm什么都好了，接下来就是渲染出html
- vm.$mount(vm.$options.el)

	- 来自上面在设置Class时多次包裹的$mount

		- web/entry-runtime-with-compiler.js
		- web/runtime/index.js
		- core/instance/lifecycle.js:: mountComponent

- 之后的内容就是用户操作和 对应函数/事件的触发了

## 响应式

- defineReactive(内部调用的 Observer), Watcher, Dep, 

	- 先看分别的实现，再看实际使用时候的调用

- Dep

	- core/observer/dep.js

	  ```js
	  export default class Dep {
	    static target: ?Watcher;
	    id: number;
	    subs: Array<Watcher>;
	    constructor () {
	      this.id = uid++
	      this.subs = []
	    }
	    addSub (sub: Watcher) 
	    removeSub (sub: Watcher) 
	    depend ()
	    notify () 
	  }
	  ```

	- 虽然我们直接看到的是 defineReactive, 但是我们从Dep开始看
	- 这也会有一个自己的单增 uid
	- Dep增删自己subs里的Watcher ： addSub/removeSub
	- 在当前Dep.target(是个Watcher)中增加自己 Dep.target.addDep(this)

		- 这里Dep.target又是，存在值/null/undefined 都有可能
		- 这是个静态成员
		- 通过 pushTarget/popTarget 来维护的，是个栈，啊 搞这么多变量干嘛，直接取栈顶不就好了。从代码看起来在其它地方有前置判断，目测还是所谓性能相关？<!--我就不懂了，perf都是靠这样破坏层级的搞，那还得了，真把自己当后端了-->

			- 看起来是 #7824 对应提交id： 6b1d431a8

	- 触发所有subs数组中watcher的update方法，notify()

- Watcher

	- core/observer/watcher.js

	  ```js
	  export default class Watcher {
	   vm: Component;
	   expression: string;
	   cb: Function;
	   id: number;
	   deep: boolean;
	   user: boolean;
	   lazy: boolean;
	   sync: boolean;
	   dirty: boolean;
	   active: boolean;
	   deps: Array<Dep>;
	   newDeps: Array<Dep>;
	   depIds: SimpleSet;
	   newDepIds: SimpleSet;
	   before: ?Function;
	   getter: Function;
	   value: any;
	  
	   constructor (
	    vm: Component,
	    expOrFn: string | Function,
	    cb: Function,
	    options?: ?Object,
	    isRenderWatcher?: boolean
	   ) {
	   }
	  
	   /**
	    * 计算getter并重新收集dep
	    */
	   get () {
	   }
	  
	   /**
	    * 向当前watcher增加dep
	    */
	   addDep (dep: Dep) {
	   }
	  
	   /**
	    * 清理dep
	    */
	   cleanupDeps () {
	   }
	  
	   /**
	    * 当dep改变时会被调用
	    */
	   update () {
	   }
	  
	   /**
	    * 调度器会调用
	    */
	   run () {
	   }
	  
	   /**
	    * 只有lazy watcher 会调用，计算值
	    */
	   evaluate () {
	   }
	   /**
	    * 和所有收集的dep建立联系
	    */
	   depend () {
	   }
	   /**
	    * 移除自身订阅的所有dep列表
	    */
	   teardown () {
	   }
	  }
	  ```

	- vm._watcher = this
	- vm.watchers.push(this)
	- 等等一堆初始化
	- 根据 expOrFn 产生this.getter
	- 最后    this.value = this.lazy ? undefined : this.get()
	- get(), 会把当前watcher通过dep里提供的 pushTarget 压栈，再调用 getter，结束后popTarget

		- 其中如果设置deep，会遍历对象元素，触发每个层级的计算其中用set避免递归无限循环
		- 注意到上面的Dep类，在get触发计算函数过程中会调用这里的addDep，在addDep的实现是通过 newDepIds/newDep 去记录，到最后结束的时候，通过cleanupDeps 函数完成 从new开头的移动到depIds/deps 中

	- 我们来看看Dep和Watcher之间的触发关系（不看移除）

		- Dep::addSub 在dep中记录watcher
		- Dep::depend 当前watchers栈顶的addDep方法传入dep
		- Dep::notify 当前dep中的watchers 依次触发 update()
		- Watcher::get 触发自己getter函数，收集依赖（通过依赖自己的addDep）,最后 cleanupDeps
		- Watcher::update 调用自己的run 或 调用queueWatcher 或 标记dirty

			- lazy

				- dirty标识

			- sync

				- run

					- 这里会调用get，如果有设置callback，例如用户设置的watch函数，则会 callback.call(实例，新值，旧值)
					- 这里我们从代码可以看到，deep不光会影响 深的对象，同时如果是基础类型其实这里即使和原来值相同也会触发callback

			- queueWatcher（传入当前Watcher）

				- 如果队列中没它，则加入到watcher队列中
				- 这里可以看到nextTick 的使用，从promise/MutationObserver/setImmediate/setTimeout0 逐级下降，所以不要靠 nextTick猜执行顺序来控制
				- 通过 一个 scheduler 享有的has 集合，来记录 是否有当前的 watcher.id

					- 哎哟 好难受 又是 undefined/null/true 这里就是双等于，而不是三等于

				- 是否flushing决定是 排到队列最后，还是根据id从尾部插入来排序

					- flushing默认false，在flushSchedulerQueue时置为true

				- nextTick 再调用 flushSchedulerQueue

					- 本身队列会根据id来sort
					- 这里我们可以看到 watcher.before会被调用

						- 例如 mountComponent 中 new Watcher(vm,updateComponent) 提供的before函数 提供了 beforeUpdate 的生命周期

					- waiting 保证有且只有一个 queueWatcher 调用了或者 已经准备被调用了
					- flushing 意味着 queue是否在执行中

				- 本质上，实现了 队列加入和执行，同时支持执行时加入。保证单一执行队列

		- Watcher::evaluate 会被 用在设置了lazy的computed的getter里， 调用时会触发上面的get函数

			- 这为什么要在外部访问一个对象的属性，再掉对象的方法而不做任何其它事呢，那不直接把属性内置到对象内更好吗

		- Watcher::depend  触发记录的所有dep的 depend方法，也是被computed的getter调用

			- 这里可以看到是，watcher是更主动的类，而Dep是被动的类，也就是watcher通过计算收集自己的deps，然后对deps里面再和自己建立关系

				- computedGetter->watcher::depend->deps::depend->watcher::adddep, 区别是前后的watcher可能因为压栈而不是同一个吗？？？

		- 也就是，我们把会收到影响的object push到Dep.target上，然后，每次运算中触发“响应式”的值相关的时候，会通过 dep.depend()->Target::addDep(dep) -> dep.addSub (响应式属性) 和它建立影响关系，(数据的值) 也会 childOb.dep.depend() -> .dep.depend()->Target::addDep(dep) -> dep.addSub 

- observer/index.js

	- Observer

	  ```js
	  export class Observer {
	    value: any;
	    dep: Dep;
	    vmCount: number; // number of vms that have this object as root $data
	  
	    constructor (value: any) {
	      this.value = value
	      this.dep = new Dep()
	      this.vmCount = 0
	      def(value, '__ob__', this)
	      if (Array.isArray(value)) {
	        if (hasProto) {
	          protoAugment(value, arrayMethods)
	        } else {
	          copyAugment(value, arrayMethods, arrayKeys)
	        }
	        this.observeArray(value)
	      } else {
	        this.walk(value)
	      }
	    }
	  
	    /**
	     * Walk through all properties and convert them into
	     * getter/setters. This method should only be called when
	     * value type is Object.
	     */
	    walk (obj: Object) {
	      const keys = Object.keys(obj)
	      for (let i = 0; i < keys.length; i++) {
	        defineReactive(obj, keys[i])
	      }
	    }
	  
	    /**
	     * 对数组每个元素 调用observe函数
	     */
	    observeArray (items: Array<any>)
	  ```

		- 只给 object 且 instanceof VNode 增加 可ob
		- `__ob__`

			- 防止无限循环?指向 Observer实例，observe函数不会重复创建

		- value 为初始化传入的value
		- dep = new Dep()
		- vmCount ( asRootData 时会增加
		- 如果是数组修改了数组的push之类的函数

			- 遍历每个 observe

		- 如果是对象，调用defineReactive处理每个属性

			- 具体的defineReactive 向后讲

	- observe 创建的是 Observer

		- 只会对对象创建，原始类型不会创建
		- observe 传递true时，自定义的vmCount计数会+1

			- src/core/instance/lifecycle.js:      `vm._data.__ob__.vmCount--`
			- src/core/observer/index.js:  vmCount: number; // number of vms that have this object as root $data
			- src/core/observer/index.js:    this.vmCount = 0
			- src/core/observer/index.js:    ob.vmCount++
			- src/core/observer/index.js:  if (target._isVue || (ob && ob.vmCount)) {
			- src/core/observer/index.js:  if (target._isVue || (ob && ob.vmCount)) {
			- 看起来，判断是否是root data的？

	- defineReactive

		- 获取对象的key原有的set和get

			- Object.getOwnPropertyDescriptor

		- 修改的是原有的属性，自定义了set/get方法
		- 自己比包内有dep，childOb和val来维持

			- childOb

				- 在 $attrs/$listener 时失效，只做到最外层dep
				- 其余的会，对数据调用observe函数产生Observer对象，用对象内的dep建立关系

			- dep

				- get时建立关系
				- set时通知有关系的watcher

		- defineReactive->Observer->defineReactive 递归所有key
		- 最简单的测试是通过vue官网浏览器，console里面调用 

			- const obj = {};
			- obj._data = {xxx:'x value',yyy:{zzz:'z value',v:'v value'}};
			- Vue.util.defineReactive(obj,'_data');
			- 通过展开 可以看到，被defineReactive的obj本身会增加 `__ob__` 是个Observable, 内部的字段会递归的 defineReactive 变成 setter/getter. 
			- 上面这些是直接在结构体上 / 属性上的，而dep 和 childOb和 val 不在结构体上，是在 闭包里的

				- 因为这个缺点，想要尝试修改并运行代码，可以改 vue的源码然后，跑生成，再自己去调用 输出
				- 不论是读代码，还是调试，childOb 其实就是 通过 observe方法绑定在对应对象上的`__ob__`

					- 本身observer上也会有 value,vmCount,dep

						- Observer 这个this.value 有啥用呢，感觉只有看看也许调试工具使用，本质上，感觉没卵用，可以尝试把初始化的赋值删掉，测试也是能运行的。

				- 数据呢，通过闭包放在函数里的val上

		- defineProperty 中的set

			- 如果和旧值一致，则返回
			- 这里有自己比较自己， 是因为？get方法可能返回不同值还是为什么？
			- 如果有设置函数调用设置函数
			- 通过闭包，修改childOb 和 val
			- dep.notify()

				- 被更新的内容 是调用的update()方法

					- lazy，置dirty为true

						- 每次computedGetter()->state.js::evaluate()，先调用，dirty置为false， createComputedGetter
						- 从实现上讲，就是 如果配置的lazy，那么计算过程 和 更新过程就会走 lazy 单独的 方案

							- 从理解的角度，其实这里是手工去做了，C++里面的同父类指针不同子类指针的虚函数，实际上如果以C++的角度来写，就是根据是否lazy是不同的子类实现，从而提供不同的方法。

						- 例子 computed的 lazy是true

					- 如果 sync 设置，直接调用run

						- 基于一个没太懂的active，为了防止内存泄漏还在跑？

							- 因为这个变量默认true，在 teardown完成后才会置为false

					- 最终值都是来自 get()函数

	- 这边提供了 没法触发defineReactive 时的 set和del函数，比如对象新增字段啊 之类的时候用
	- 如何控制更新的顺序

		- 场景，页面上 一个 {{something}}, computed 里 something， something依赖data中某个 val

			- 当val变化了，如何触发
			- 初始化时，一个 响应属性 val，两个Watcher: vm 和 computed watcher 

				- 简单的方法就是 写个test.html和test.js，然后跑vue的run dev，在watcher的实现中增加 console.log(expOrFn,this.id)
				- 通过上面的方法，或者理解代码，可以看到，computed属性的id(1) 是小于页面的id(2)的

			- watcher里的update函数增加 console.log('update', this.id, {lazy:this.lazy,sync:this.sync})

				- 可以看到 先computed更新，后update页面
				- 但是注意到输出的computed配置的是lazy

			- computedGetter中增加console.log('computedGetter',this._computedWatchers, key);

				- 可以看到，虽然从触发顺序是 先computed，但是因为lazy，在首次触发时不会触发，而是标记dirty，后页面刷新，在 页面刷新时去计算 computed时，才会触发对应的Getter，才真正的evaluate

## 渲染

- 开端

	- 上面的部分，已经完成了 Class定义，实例产生，以及看了其中的实践方案，下面就是最后一步`$mount`
	- 从实践上来讲，我们其实已经有响应式了，那么要做的是说把它运用到渲染里，因为从抽象层面讲，响应式不也就是一个函数么
	- 直接从`$mount`函数开始挖，核心就是

	  ```js
	   new Watcher(vm, () => {
	  	vm.__patch__(vm._vnode,vm._render())
	  }, noop, {
	    before () {
	     if (vm._isMounted && !vm._isDestroyed) {
	      callHook(vm, 'beforeUpdate')
	     }
	    }
	   }, true /* isRenderWatcher */)
	  ```

		- _vnode 老的虚拟节点
		- _render() 是计算新虚拟节点的
		- `__patch__`是做替换工作的，修改真正的html
		- Watcher复用实现的响应式，来完成响应式触发

			- lazy: false
			- 这里watcher传入设计上本来是getter，但实际上，这里就是返回undefined的箭头函数，所以 对应 Watcher实例里面的 value 一直undefined

				- 和直接的 响应式区别是，响应式实现的是变量，没有“直接的”的函数触发，例如这里的 updateComponent 实际上走的是getter的设计。所以说看上去有点“没有符合原始设计的实现方案”

- core/instance/render.js::_render()

	- 根据父节点scopedSlots / slots / 之前计算的scopedSlots 生成当前节点的scopedSlots
	-     vm.$vnode = _parentVnode

		-   $vnode: VNode; // the placeholder node for the component in parent's render tree

	-       vnode = render.call(vm._renderProxy, vm.$createElement)

		- render 根据平台不同而不同，对于web，在platforms/web/entry-runtime-with-compiler.js中找到实现，在$mount 调用时，当没有设置render函数时，由 compileToFunctions 返回

			- compiler/index.js :: createCompilerCreator
			- compiler/create-compiler.js
			- 函数返回函数，函数返回函数，层层返回
			- ast = parse(template.trim(),options) , optimize(ast, options), {render,staticRenderFns} = generate(ast, options)

				- 其中，这一部分的 parse/optimize/generate 其实都是可以换的
				- 本质上 提供一个 (template,options) => {ast,render,staticRenderFns} 的函数就行
				- https://en.wikipedia.org/wiki/Abstract_syntax_tree

			- 把上述函数提供给 createCompilerCreator, 就能得到真的 createCompiler, 它接受的是 baseOptions, 返回的依然是模板处理函数，最后这个函数也就是 compileToFunctions处理用户编写的 template，产生render函数

	-     vnode.parent = _parentVnode
	- return vnode
	- 虽然上面说是可选，但是我们可以看看 默认的实现
	- 当在浏览器中的时候 core/vdom/patch.js::createPatchFunction 创建的patch 函数
	- parser:: compiler/parser/index.js

		- 简单说就是把 字符串的 模版，变成 AST

			- ASTELement 的结构体可以在 flow/compiler.js 里看到，很多字段

		- 320 行的

			- 定义4个函数
			- 最终调用parseHTML
			- 然后 return  root

		- 黑箱视角

			-   我们在调用parse之后输出ast，然后， console.log(JSON.stringify(ast, (key, value) => {if (key === '') {value.children.forEach(item => {item.parent = undefined;});}; return value; }, 2));

				- html上的 花括号被 _s 函数包裹

	- compiler/optimizer.js

		- 优化 据说老版本始终调用，现在看 options.optmize 是否设置
		- 从调用的角度来说，从代码函数名字和 执行结果通过vimdiff看起来不会“更改” ast，只会在分析结果上 增加 static/staticRoot 字段

	- generate compiler/codegen/index.js

		- 功能呢就是 从ast生成render
		- 我们把从code打出来，是 with(this) 开头的字符串

			- 其中我们可以看到 页面的click事件会变成 被 function($event) 包裹，再return的。一定程度上解释了，如果希望在for里既能接受内部的事件，又能传递例如index之类的值，为什么是写 $event
			- 从构成上，看的到有 _v,_s,_c

				- _s 目测 就是上面ast中能看到的模版中 的 双花括号解析

					- core/instance/render-helpers/index.js

						- 这里我们也能看到 json对象为啥可以直接花括号 输出

				- _c 就是如果我们手写render接受的那个h或者说createElement 函数

					- core/instance/render.js

				- 而_v 呢 目测 是想对于_c 更具体用于 渲染页面元素的？

					- core/instance/render-helpers/index.js

						- 这里的编码，甚至直接把，变量写作a,b,c,d,只有向下翻原函数，才知道是 tag/data/children/normalizationType

							- core/vdom/create-element.js

						- 但是实际上因为 前端喜欢 去模仿C++之类的支持 重载函数，所以也不一定是100%上面的顺序

				- 对于上面三个，可能在不同的平台编译下有对应的替代函数，比如ssr的时候

			- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with

				- 不推荐使用with，在 ECMAScript 5 严格模式中该标签已被禁止。推荐的替代方案是声明一个临时变量来承载你所需要的属性。

- `__patch__`

	- 接受 render()计算的虚拟节点的结果
	- 如果是新的node，它会创建DOM节点
	- 如果是更新，它会更新DOM
	- platforms/web/runtime/patch.js

		- createPatchFunction({ nodeOps, modules })

			- nodeOps: platforms/web/runtime/node-ops.js

				- https://stackoverflow.com/questions/8173217/createelement-vs-createelementns
				- 本质上做的是同名函数封装

			- modules

				- core/vdom/modules/index.js
				- platforms/web/runtime/modules/index.js
				- 包括一些 class/ attr 等操作

		- 优化dom操作效率

			- 抛开用户可见的讲，我们有的是vm层面和渲染函数，其中更新的部分由vue内部实现的响应式解决了，那么我们有了老的vdom和新的vdom，接下来就是 如何去做dom的替换了
			- 有一些跨语言经验的都知道，c++ 写的加法编译出来的的代码每秒大约1e8~1e9 次，但是一旦和显示相关，就会很慢的
			- core/vdom/patch.js::createPatchFunction

				- 顶部注释  * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)

				- 定义了蛮多 函数
				- 我们专注一下 最后的 返回 return function patch

					- 没新节点，销毁老节点
					- 没老节点 createElm
					- nodeType 判断?

						- https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType

					- 不是真element(仅仅虚拟节点) 且 通过 key/tag/isComment/data/isAsyncPlaceholder/asyncFactory 等字段判断是同一个，调用 patchVnode

						- 函数名可以看出仅仅 虚拟vnode? 好像也不是 注释上是 patch existing root node
						- 这里我们看到有异步占位
						- 有static tree且 isCloned

							- hot-reload 相关

						- 如果都不是，则 触发 vnode.data.hook.prepatch(oldVnode,vnode)

							- 已经看到，这里开始放肆的用变量i了
							- 感觉如果有 Ng的问号写法支持，岂不好看又好用 vnode?.data?.hook?.prepatch?(oldVnode,vnode)

						- 之后 如果isPatchable, 把闭包内的cbs.update 数组的 函数触发一遍，并触发data.hook.update
						- 接着就是 updateChildren/addVnodes/removeVnodes/setTextContent 的修改

							- 如果有text就是叶子节点。。。。？
							- 除了updateChildren以外 都是直接的操作
							- updateChildren 递归操作

								- 函数里可以看到 removeOnly 在 trasition-group 里会 启用，也就是做动画效果 其实会影响 替换实现！
								- https://github.com/snabbdom/snabbdom/blob/d66905438dc6866b2a7ab21d719c45a156d1252e/src/package/init.ts#L203
								- 把原来的child子数组 和 新子数组 做4个包裹指针，（每个数组一个开头指针一个结尾指针）
								- 头同，patch 头
								- 尾同，patch尾
								- 原头=新尾，patch
								- 原尾=新头，patch
								- 剩余，通过建立老的元素的key到idx映射，然后把新放入时去查这个映射表，找到后记得删除老的表，继续while
								- 如果找不到创建新的
								- 感觉似乎很多面试喜欢问讲讲实现原理，实际上抽象出成问题可能也就一个leetcode easy难度

						- vnode.data.hook.postpatch(oldVnode,vnode)

					- 是真节点

						- 这里我们看到了 硬编码1，虽然不灵活，但是不应该是用 Node.ELEMENT_NODE 来代替1吗, 还是serverside？？？
						- 然后这个isTrue函数 是认真的吗，不接受非零的其它值，只接受true值
						- 这里可以看到如果是ssr，渲染的节点 会有SSR_ATTR 属性，这里会移除它

							- 如果hydrate返回false且非生产，可以看到之前见过的 服务端和前端渲染不一致的提示
							- 最后如果不是 服务端渲染的，或者 hydrate失败 emptyNodeAt 来代替它

- vm._update 是包裹`__patch__`更新节点

	- 这里我们可以看到keep-alive 相关的 setActiveInstance 方法
	- 在 render.call(vm._renderProxy, vm.$createElement) 之后增加 console.log(vnode)

		- 定义两个 多个component，可以看到 render的顺序是 先父级别的，后子级别的

			- 在context里可以看到 前面的 _c / _data / _watchers

		- 但是在children 数组里的tag会变成 "vue-component-1-<你的组件名>"
		- 在子组件的vnode 输出里，parent的tag 是 "vue-component-1-<你的组件名>"
		- 而当 我们跟新数据的时候，能够看到vnode被重新计算

- 本质上，我们已经有了，响应式实现的核心部分了，接下来是，在界面上如何使用的

# 总结

## Flow

- 一个typescript类的工具，让编写的时候假装是强类型 可以转换成js
- 区别 是静态代码检查
- Vue 2.0 为什么选用 Flow 进行静态代码检查而不是直接使用 TypeScript？ - 尤雨溪的回答 - 知乎
https://www.zhihu.com/question/46397274/answer/101193678

	- 尤雨溪说 还是历史依赖 导致的成本问题，下个版本用TS

- https://flow.org/en/
- https://zhuanlan.zhihu.com/p/26204569

## 首先整个Vue的原型，或者说Class 是通过多层不同文件共同写一个Vue来实现的。再之后产生实例的时候是通过配合用户的配置触发一个 Vue._init() 函数，再触发这些不同文件创建的方法来完成 实例化对象。之后就是用户操作引发刚刚实例化的事件发生，Vue对应变化

- 而目前的方式一层层包裹，却都是在Vue这一个 实例/原型 上面 做操作

	- 带来的问题是

		- 不同的包裹之间，不能有冲突的字段
		- 层级在代码上实现了分层，但是在对应的创建出来的实例并没有分层
		- 类型标注上，希望字段分层增加是没有起到工具提供保护作用。

	- 可能可以通过ts的 类型描述解决

- 定义Vue的类时包裹，包裹再包裹

	- src/core/instance/index.js

		- 导出Vue

	- src/core/index.js

		- 包裹Vue并导出

	- src/platforms/web/runtime/index.js

		- 包裹Vue并导出

	- src/platforms/web/entry-runtime-with-compiler.js

		- 包裹Vue并导出

- 实例化时

	- 初始化$options

		- 工作内容，根据默认配置和用户传入的配置，产生合并的$options

	- 然后是依次init和 穿插hook的触发
	-     vm.$mount(vm.$options.el)

## 常见方法

- 自定义alias

	- scripts/alias.js

		- 可能的替代方案，利用typescript+idea的重构功能

- version

	- `src/core/index.js`：`Vue.version = '__VERSION__'`

- `$on`,`$once` 等方法都返回了原始的实例，C++里有时能见到这样的写法，可以链式书写调用
- toArray

	- array like的转换成array

- 报错封装

	- handleError(error,vm,info)

- 用户可能不传true/false时的代码 = !!value
- 手工 实现 重载
- 手工 实现 多态
- 如果有比较复杂的历史bug，利用上github，在注释中，写上对应的issue id
- 和其它语言写东西一样，都是主逻辑以外的错误判断有不少

## 体验上难受的点

- 阅读代码时，非纯函数的确读起来相对更头疼，但是我在想，虽然是非纯函数，但实际上 如果变成一个class，也是类似的，因为有些内容不应该暴露出来的，而对于class内部的一些状态，把它取出来判断再只调用class内的操作，还不如直接class封好
- 文档也不全，官方档有些部分没三方博客描述全
- 可以看到是入侵式编码 性能测试，用 NODE_ENV 包裹，这个利用了rollup/webpack等编译时能去掉，但从编码上还是入侵式的，如果有办法做切面编程是不是更好
- <!-- 在代码上，虽然都不愿意口头承认很多时候用的内容都是过度设计的，而现实的使用其实已经表明了观点，对于很多公司，其实jquery甚至都能胜任，在jquery上封一层类似框架或者ng1，vue1也都完全够用。而vue能火到今天的地步，是社区吹水+入门低+劣币驱逐良币等等的共同结果。随着源码阅读的深入，真的很惊叹这么多公司在用。 -->
- 不够完备的测试，不太能做到重构保护

	- 覆盖报告的 ignore
	- 例如事件的$on 设计是 有hook:冒号则置为true，否则是默认false，而测试覆盖 根本不全test/unit/features/options/lifecycle.spec.js 就简单做了覆盖

	  if (hookRE.test(event)) {
	    vm._hasHookEvent = true
	  }
	  改为 （语义变了，代码错了，测试依然通过）
	  vm._hasHookEvent = hookRE.test(event)

	- 这样也就意味着，能用就不会再有代码更新，不炸就没有对应测试，这类的测试代码对应的测试报告形同虚设，真的是为了写测试代码而写测试代码

- 光是看core 相关的内容，发现是缺少自动生成文档的注释的

	- 相关工具比如commit msg检查的不一致性已经导致了多达百个commit不一致的问题

- 很多的空判断，放在调用者而不是执行者，这样好码？

	- 比如 if(a){f(a)}, 而不是在f里面判断

- 还是有不少的 ?Object / any / vm 飞来飞去，没有一个“严格”的类型管制，有些地方读代码还是比较困难，没有angular那样的注释，也是一个困难
- 又有undefined，又有null，阅读还是有些难受
- 没有具体看weex相关的，但是就阅读体验来说，weex感觉是侵入的写到了vue里

## 抽象内容

- 响应式触发
- 空处理
- 定义冲突校验
- 生命周期
- 函数参数多时，参数顺序问题，代码格式一致

	- 所以还是done is better than perfect

- 有办法让 js的参数接受能像C++ 那样区别而优雅吗？
- 保留前缀判断

## 写xmind，生成markdown比直接markdown更舒服

xmind可以在分支上增加笔记，好处是转换成markdown就不会变成目录层级，缺点是xmind上不能直接展开。 然后xmind不能指定导出的目录层级。
另外xmind写一遍，整理成markdown时能对读的过程进行修剪补充可以再温习一遍。

## feature

- 如何ssr
- 如何keep-alive

# ref

## https://github.com/numbbbbb/read-vue-source-code/

## https://www.youtube.com/watch?v=OrxmtDw4pVI&t=45s&ab_channel=Honeypot

## https://www.bilibili.com/video/BV1d4411v7UX

## https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

*XMind - Trial Version*

---
title: vue router 源码阅读
date: 2019-08-30 11:20:14
tags: 
category: [code,vue,js,router]
---

本文对应版本 `638278b334199f17e052a54a0837c97624940c0c`

> 获得代码

```bash
git init
git remote add origin https://github.com/vuejs/vue-router.git
git fetch origin 638278b334199f17e052a54a0837c97624940c0c
git reset --hard FETCH_HEAD
```

# 前置知识

https://cn.vuejs.org/v2/guide/mixins.html

https://cn.vuejs.org/v2/guide/plugins.html

# 总览

|行数|文件|
|--:|:--|
|    262 |[index.js](#install-js)|
|    200 |[create-matcher.js](#create-matcher-js)|
|    353 |[history/base.js](#base-js)|
|     22 |[history/errors.js](#errors-js)|
|     69 |[history/abstract.js](#abstract-js)|
|     80 |[history/html5.js](#html5-js)|
|    157 |[history/hash.js](#hash-js)|
|    190 |[components/link.js](#link-js)|
|    124 |[components/view.js](#view-js)|
|     52 |[install.js](#install-js)|
|    193 |[create-route-map.js](#create-route-map-js)|
|      6 |[util/misc.js](#misc-js)|
|     95 |[util/query.js](#query-js)|
|      3 |[util/dom.js](#dom-js)|
|     25 |[util/warn.js](#warn-js)|
|    152 |[util/scroll.js](#scroll-js)|
|     35 |[util/params.js](#params-js)|
|    132 |[util/route.js](#route-js)|
|     64 |[util/location.js](#location-js)|
|     22 |[util/state-key.js](#state-key-js)|
|     18 |[util/async.js](#async-js)|
|     42 |[util/push-state.js](#push-state-js)|
|     74 |[util/path.js](#path-js)|
|    108 |[util/resolve-components.js](#resolve-components-js)|

总共2478行 

## 目录

```
src/
├── components
│   ├── link.js 控制url显示
│   └── view.js 控制页面渲染
├── create-matcher.js 路由匹配
├── create-route-map.js
├── history
│   ├── abstract.js
│   ├── base.js
│   ├── errors.js
│   ├── hash.js
│   └── html5.js
├── index.js 包含 VueRouter 类
├── install.js 日常mixin
└── util
    ├── async.js
    ├── dom.js
    ├── location.js
    ├── misc.js
    ├── params.js
    ├── path.js
    ├── push-state.js
    ├── query.js
    ├── resolve-components.js
    ├── route.js
    ├── scroll.js
    ├── state-key.js
    └── warn.js
```

回顾那个只有1100行左右的vuex源码，你发现 除了两者都有`index.js`,其它目录结构大不相同了

# 准备

首先我们看一段代码，最好先了解它的功能，所以没有用过vue-router的建议先照着tutorial知道它大概的功能

然后看看源码里的demo:

在`npm install`后 `PORT=8085 npm run dev`即可在`localhost:8085`上查看，把上面每个example都看一看

然后就可以看看flow文件夹里的，也不长,'类'的数量也不多，通过阅读flow的文件，你可以对 整个router有个印象

从代码使用上看
 * 实例类router
 * 配置路径 和 对应component
 * 页面`<router-view>`,`<router-link>` 以及 a标签等跳转
 * Vue.use(VueRouter) // 注册插件
 * new Vue({router传入实例})

this上会有`$route`和`$router`

# src/

## 代码阅读 

1. 先看[install.js](#install-js),调用`Vue.mixin` 注入
2. 然后[index.js](#index-js), 看完这一部分基本 就大概看到了 主要是靠XXXHistory来 实现 `this.history`然后方法 不少只是对 `this.history`的方法转发
3. 既然知道了主要是XXXHistory来实现，那么 反过来 先按照顺序看[util](#util)文件夹,伴随着test里的测试用例看完util的代码,把大多代码看懂即可，少部分比较复杂也没有测试用例的大自看看
4. 然后看`history`的代码,顺序就[errors.js](#errors-js) ,[base.js](#base-js),最后 `abstract/hash/html5`这三个任意顺序
5. 然后是两个`create-*.js`，工具人 工具函数
6. 最后看两个`components`

**下面目录是按字典序排列的,不是按照阅读顺序**

## components

### link.js

emmm, `noop = ()=>{}`

所以 也就会想到说 ，是 函数内 增加一堆if来处理 有值 无值 空值，还是说 强行要求传入符合格式,这两种方式 如何选择

也就是 render函数

可以看到 有从 初始化的options中 读取 linkActiveClass/linkExactActiveClass用什么 或者用默认的`router-link-active`/`router-link-exact-active`

这里实现了一个 `guardEvent(e)` 不会拦截 `metaKey,altKey,ctrlKey,shiftKey`等等

当拦截时，执行replace或者push

定义变量on配置了click和 传入的event或event数组里所有事件 调用 handler也就是 guardEvent

这里通过 `this.$scopedSlots.default({` 拿去默认slot

然后对它渲染， 这里又可以看到 如果有多个default slot,在production时会报warn

然后 props的tag默认是'a'标签，

如果是 `tag=='a'`那么 绑上`on`和`attrs`

如果不是`tag=='a'` 则`// find the first <a> child and apply listener and href`

`const a = findAnchor(this.$slots.default)` 递归 找第一个 achild

如果没找到`data.on = on;`

最后 调用 `h(this.tag, data包含了on class 等等, this.$slots.default)` 

其中提供 的两个辅助函数 `guardEvent`和`findAnchor`分别时 用来 拦截默认 a标签事件和 深搜找到首个a标签的

### view.js

也就是 渲染html上的 `RouterView` 或者说`<router-view>`

functional:true

意味着 没有响应式数据，没有this上下文

https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6

接受一个props, 

```js
name: {
  type: String,
  default: 'default'
}
```

可以看到接受的render 也和 link的不一样,link的是 `render(h)`

```js
render (_, { props, children, parent, data }) {
```

给devtools用的

```js
    // used by devtools to display a router-view badge
    data.routerView = true
```

因为没有this,没有接受 h ，这里是通过 `h = parent.$createElement`

此外 `$route`,`_routerViewCache`也是从 parent拿的 

通过 比较 `parent == parent._routerRoot` 来看parent是否为根节点,并递归向上找根节点

如果 某个祖先上有`parent.$vnode.data.routerView` 那么 `深度计数++`

如果 某个祖先上有`parent.$vnode.data.keepAlive`且`parent._inactive` 那么 inactive标识为 true

`data.routerViewDepth = 深度计数`

如果非活跃

```js
if (inactive) {
  return h(cache[name], data, children)
}
```

通过 `$route.matched[深度]` 当前的路由的matched数组

```js
const matched = route.matched[depth]
// render empty node if no matched route
if (!matched) {
  cache[name] = null
  return h()
}
```

更新cache指针

`const component = cache[name] = matched.components[name]`

也就是 我们在`src/install.js`中看到的 `registerRouteInstance`

```js
// attach instance registration hook
// this will be called in the instance's injected lifecycle hooks
data.registerRouteInstance = (vm, val) => {
  // val could be undefined for unregistration
  const current = matched.instances[name]
  if (
    (val && current !== vm) ||
    (!val && current === vm)
  ) {
    matched.instances[name] = val
  }
}
```

注册 prepatch 和 init的钩子,这个一个应该是 vue相关的

```js
    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = (_, vnode) => {
      matched.instances[name] = vnode.componentInstance
    }
    
    // register instance in init hook
    // in case kept-alive component be actived when routes changed
    data.hook.init = (vnode) => {
      if (vnode.data.keepAlive &&
        vnode.componentInstance &&
        vnode.componentInstance !== matched.instances[name]
      ) {
        matched.instances[name] = vnode.componentInstance
      }
    }
```

只搜到了 `https://github.com/vuejs/vue/issues/8657`

最后是 传递`matched.props[name]`的内容

具体代码就是 把在data.props中,不在 components.props中的 key以及对应的值搬运到 data.attrs里

最后 `return h(component, data, children)`

> 层级`router-view`实现原理

`index.js -> createMatcher-> createRoute -> .matched = record ? formatMatch(record) : []`

其中record是 RouteRecord类型,formatMatch通过 递归 parent 来把 它变 数组

其中parent的来源 是`create-route-map`中 `addRouteRecord`递归计算的

然后 在 解析 元素时 可以通过当前 `$route.matched[depth]`直接获得实例

## create-matcher.js

```js
export function createMatcher (
  routes: Array<RouteConfig>,
  router: VueRouter
): Matcher {
  const { pathList, pathMap, nameMap } = createRouteMap(routes)
}
```

```js
  function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
```

`匹配name(nameMap找) -> 匹配 location.path(pathList + pathMap) -> create 一个新的Route`

这里用list 也可以看出 这里期望的个数应该要小(?)，否则效率O(n)大了性能会较差?(不过O(n*操作)似乎1000个也不会很久? 反正这也不是频繁操作?所以不用在意?

```js
  function redirect (
    record: RouteRecord,
    location: Location
  ): Route {
```

同样是`redirect（record.redirect）`中的 name匹配 path匹配

```js
  function alias (
    record: RouteRecord,
    location: Location,
    matchAs: string
  ): Route {
```

通过匹配 `fillParams(matchAs, location.params,...)` 到path 同样返回Route


```js
  function _createRoute (
    record: ?RouteRecord,
    location: Location,
    redirectedFrom?: Location
  ): Route {
```

再调用 `真的createRoute` 或者 调上面的 `redirect/alias` 只要 `record.redirect/matchAs`存在， 也就是 可能产生无限循环?的了 

## create-route-map.js

```js
export function createRouteMap (
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>
): {
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>
} {
```

还会自动把 `'*'` wildcard routes 放到最后

```js
function addRouteRecord (
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
```

为什么 其他地方 都是直接 用true/false,这边 `route.caseSensitive`要判断`typeof === 'boolean'`

递归对`.children`节点调用 addRouteRecord

这两个函数 主要是封装 对 传入的 pathList,pathMap,nameMap 这些 进行 添加

因为处理了没有传值的情况，所以也可以用于初始化

## history

### abstract.js

正如其名,所有浏览器上地址栏,url，scroll都没有了,取代的 是 实现了 `stack:Array<Route>`和`index:number`

### base.js

是整个源码中最大的单个文件了, `hash/html5/abstract` 这三个 都是基于base实现的,反过来想在 index.js中我们有看到根据模式不同 把`this.history` 赋予了不同的值 也就会想要这三个有共同的基类

对外只提供一个History类

这些 加号 是干嘛的,我看flow的文档只看到 说 readonly,是我没有找到正确的位置吗

```js
  // implemented by sub-classes
  +go: (n: number) => void
  +push: (loc: RawLocation) => void
  +replace: (loc: RawLocation) => void
  +ensureURL: (push?: boolean) => void
  +getCurrentLocation: () => string
```

初始化

```js
  constructor (router: Router, base: ?string) {
    this.router = router
    this.base = normalizeBase(base)
    // start with a route object that stands for "nowhere"
    this.current = START
    this.pending = null
    this.ready = false
    this.readyCbs = []
    this.readyErrorCbs = []
    this.errorCbs = []
  }
```

`listen(cb)` 简单粗暴 直接 `this.cb=cb`

```js
onReady (cb: Function, errorCb: ?Function) {}
```

如果当前ready同步执行cb,否则`readyCbs`数组push进cb,错误回调push进`readyErrorCbs`

```js
onError (errorCb: Function) {`
```

push进`errorCbs`

```js
  transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {}
```

调用 `confirmTransition`

成功执行`this.updateRoute(route)` & `onComplete(route)` & `this.ensureURL()`调用所有 `readyCbs` Once

失败`onAbort(err)` 所有`readyErrorCbs`

```js
  confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {}
```

如果目标和当前Route一样, 触发 `NavigationDuplicated(route)`,调用`errorCbs`再 调用`onAbort(err)`

```js
    const { updated, deactivated, activated } = resolveQueue(
      this.current.matched,
      route.matched
    )
    
    const queue: Array<?NavigationGuard> = [].concat(
      // in-component leave guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // in-component update hooks
      extractUpdateHooks(updated),
      // in-config enter guards
      activated.map(m => m.beforeEnter),
      // async components
      resolveAsyncComponents(activated)
    )
```

设计了一个`iterator`函数,用`runQueue`对上面`queue`进行执行

真是艹了 就非要重复使用变量名吗？？ 这里queue

上面的每个如果都成功了，那么执行

```js
      extractEnterGuards(activated, postEnterCbs, ()=> this.current === route)
      this.router.resolveHooks
```

这里 各种调用，也就意味着可能 不同步 吗? 反正这边是用 pending在 做 跳转前和跳转后的route一样保证

如果上面再成功则 回调`onComplete` 和 异步回调所有 `postEnterCbs`

```js
  updateRoute (route: Route) {}
```

更新`this.current` 回调`this.cb`,调用所有`afterHooks`

> 其它自产自用函数

```js
function normalizeBase (base: ?string): string {}
```

// 这里是不是漏处理了`file://`开头的 对应之前有个bugfix类型

传了base值就前面加个/，否则有`<base>` tag就取 其中base的部分，否则就空

```js
function resolveQueue (
  current: Array<RouteRecord>,
  next: Array<RouteRecord>
): {
  updated: Array<RouteRecord>,
  activated: Array<RouteRecord>,
  deactivated: Array<RouteRecord>
} {}
```

找第一个current和next中不一样的，下标idx,返回 

```js
{
  updated: next.slice(0, idx),
  activated: next.slice(idx),
  deactivated: current.slice(idx)
}
```

```js
function extractGuards (
  records: Array<RouteRecord>,
  name: string,
  bind: Function,
  reverse?: boolean // 控制是返回的数组的顺序
): Array<?Function> {}

  function extractGuard (
  def: Object | Function,
  key: string
): NavigationGuard | Array<NavigationGuard> {}
```

把records中所有 `_Vue.extend(具体元素).options[name]`处理，如果是数组 对每一个 bind，如果非数组单个bind,最后`flatten`


```js
function extractLeaveGuards (deactivated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard: NavigationGuard, instance: ?_Vue): ?NavigationGuard {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments) // 这里把参数`带`过去
    }
  }
}
```

```js
function extractEnterGuards (
//  和上面同理绑定的是 'beforeRouteEnter' 和 'bindEnterGuard'
) 
```

```js
function bindEnterGuard (
  guard: NavigationGuard,
  match: RouteRecord,
  key: string,
  cbs: Array<Function>,
  isValid: () => boolean
): NavigationGuard {}
```

增加回调调用poll

```js
function poll (
  cb: any, // somehow flow cannot infer this is a function
  instances: Object,
  key: string,
  isValid: () => boolean
) {}
```

`instances[key]._isBeingDestroyed`为false时 调用`cb(instances[key])` 

这里 用`isValid()`也就是上面传入的`this.current === route`+ `setTimeout(16ms)`来判断要不要调用 poll

这是为了页面跳转了 但是 instances没有实例化完成 所以不停异步尝试?

### errors.js

一个错误类 NavigationDuplicated

`//support IE9` emmm

### hash.js

和 html5,index 一样 都是继承于上面的 History

```js
// check history fallback deeplinking
```

```js
export function getHash (): string {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  let href = window.location.href
  const index = href.indexOf('#')
  // empty path
  if (index < 0) return ''

  href = href.slice(index + 1)
  // decode the hash but not the search or hash
  // as search(query) is already decoded
  // https://github.com/vuejs/vue-router/issues/2708
  const searchIndex = href.indexOf('?')
  if (searchIndex < 0) {
    const hashIndex = href.indexOf('#')
    if (hashIndex > -1) {
      href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex)
    } else href = decodeURI(href)
  } else {
    if (searchIndex > -1) {
      href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex)
    }
  }

  return href
}
```

`setupListeners()`调用 `setupScroll()`

监听`popstate`或者`hashchange` 触发 `transitionTo()`

push和replace也都是 调用 `transitionTo()` 回调的时候 `push/replace Hash()`然然后handleScroll, 和onComplete(route)

### html5.js

和 hash不同的是， 在`constructor`里直接 初始化了 ，比如`setupScroll()`和 增加`popstate`事件触发,而不是让index.js调用

在 这里默认 pushState和replaceState都是可以用的

这里我在想 因为兼容而写的代码 值得吗，留多久，多久抛弃呢？

## index.js

import引入,不用细看，总之是引入依赖的

> VueRouter类实现

想说 这种

```ts
  static install: () => void;
  static version: string;

  app: any;
  apps: Array<any>;
  ready: boolean;
  readyCbs: Array<Function>;
  options: RouterOptions;
  mode: string;
  history: HashHistory | HTML5History | AbstractHistory;
  matcher: Matcher;
  fallback: boolean;
  beforeHooks: Array<?NavigationGuard>;
  resolveHooks: Array<?NavigationGuard>;
  afterHooks: Array<?AfterNavigationHook>;
```

写法对阅读来说真香，这是flow还是ts 来着

 * this.matcher = createMatcher(options.routes || [], this) // 用户传入的routes

三种 mode

'hash'(默认 只识别井号后面的路径前面的忽略? window.location.hash),'history','abstract'(服务端node)

分别调用

 * this.history = new HTML5History(this, options.base)
 * this.history = new HashHistory(this, options.base, this.fallback)
 * this.history = new AbstractHistory(this, options.base)

实例对外提供的方法 整理如下 
 * match ( raw: RawLocation, current?: Route, redirectedFrom?: Location): Route
 转发了一下`this.matcher.match(...)
 * get currentRoute (): ?Route 取的`this.history.current`的内容
 * init (app: any /* Vue component instance */) TODO 暂时不知道这个怎么用

 * beforeEach (fn: Function): Function
 * beforeResolve (fn: Function): Function
 * afterEach (fn: Function): Function
这三个 都是i把函数注册通过registerHook注册到对应的XXXHooks数组中,返回的是从数组中移除他们的函数 
 
 * onReady (cb: Function, errorCb?: Function)
 * onError (errorCb: Function)
 转发了`this.history`上对应的方法
 
 * push (location: RawLocation, onComplete?: Function, onAbort?: Function)
 * replace (location: RawLocation, onComplete?: Function, onAbort?: Function)
 !onComplete 且 !onAbort 且 Promise可用时，返回promise,否则同步执行，都是调用`this.history.push/replace(...)`
 
 * go (n: number)
 * back ()
 * forward ()
 对`this.history.go(数值)`的转发
 
 * getMatchedComponents (to?: RawLocation | Route): Array<any>
 通过对to解析成一个Route,获取其matched中的所有components
 
 * resolve (to: RawLocation,current?: Route,append?: boolean): { location: Location, route: Route, href: string, normalizedTo: Location, resolved: Route } 
 这里 实际只有三个返回， 其中 location和normalizedTo一样,resolved 和route一样， 多最后两个 只是为了 向后兼容
 
 * addRoutes (routes: Array<RouteConfig>)
 
```js
this.matcher.addRoutes(routes)
if (this.history.current !== START) {
  this.history.transitionTo(this.history.getCurrentLocation())
}
```

然后是两个工具函数

registerHook(list,fn),  注册一个函数fn到list, 返回它的移除函数,概念就是以c++角度看作函数指针可以搜，同时问题就是， 没有防止重复，也就是同一个函数可以 加到list两次，而移除 每次只会移除一个，所以整体还是基于函数指针，并没有完全的实现 返回移除自己的函数。不过只要正确调用就不会出问题

和

createHref 完整路径拼接

最后是 向Vue里注入的 window.Vue.use(VueRouter)

## install.js

防重install

```js
beforeCreate(){
  注入和调用 registerInstance(this,this)
  延伸到vm.$options._parentVnode.data.registerRouteInstance(this,this)
}
```

mixin 渲染顺序  vue的组件 前序深搜, 子组件从父组件拿

属性定义 `$router`(实例),`$route`(当前状态),并且通过`Vue.util.defineReactive(this, '_route', this._router.history.current)` 来保证改变时相应式触发

component定义 `RouterView`和`RouterLink`

```js
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
```

## util

这一块的使用可以看`test/unit/specs`里的用例

### async.js

`export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {`

对数组中逐个调用 函数`fn(queue[index],回调)`,在上一个回调后调用下一个函数,最后触发`cb()` 

用的 自定义`step`箭头函数 依次`step(index)`

### dom.js

`export const inBrowser = typeof window !== 'undefined'`

### location.js

```js
export function normalizeLocation (
  raw: RawLocation,
  current: ?Route,
  append: ?boolean,
  router: ?VueRouter
): Location {}
```

`_normalized`来标记处理过

其它字段 `path`,`query:resolveQuery(...)`,`hash`,`name`,`params`

### misc.js

```js
export function extend (a, b) {
  for (const key in b) {
    a[key] = b[key]
  }
  return a
}
```

### params.js

用`regexpCompileCache` 缓存 编译后的正则

使用`path-to-regexp`来完成 路径正则匹配

https://www.npmjs.com/package/path-to-regexp

```js
export function fillParams (
  path: string,
  params: ?Object,
  routeMsg: string
): string {}
```

### path.js

比如这个文件感觉 看测试 比看代码更能理解函数功能

```js
export function resolvePath (
  relative: string,
  base: string,
  append?: boolean
): string {}
```

路径解析咯 甚至还"解析"了 `.`和`..`

```js
export function parsePath (path: string): {
  path: string; // 去掉 query和 hash的部分
  query: string; // 问号以后  
  hash: string; // 井号及以后
}
```

cleanPath(path: string):string ,把路径里的连续两个斜杠变为一个斜杠

### push-state.js

 * 常量布尔 supportsPushState, 可以从这个源代码 看到特殊判断不支持的ua,剩余的 通过window.history是否有 pushState方法进行判断
 * function pushState (url?: string, replace?: boolean) { 依赖于 `window.history
 .pushState/replaceState`这俩个那个方法，通过replace参数决定调用哪个,如果挂掉(..) 则改为调用`window.location.replace/assign(url)`的方法
 * function replaceState (url?: string) { 调用封装的pushState

这里可能挂掉的注释是

```js
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
```

### query.js

```js
export function resolveQuery (
  query: ?string,
  extraQuery: Dictionary<string> = {},
  _parseQuery: ?Function
): Dictionary<string> {}
```

基本就是,把url里的请求参数query 和 字典里的extraQuery，转化为 Dictionary<string>

如果有相同的让extraQuery覆盖query里的 这里明明是可以用`misc.js`的`extend` 为何没用=。= 是有什么考虑么

然后默认内部实现了如上所述的parseQuery函数，你也可以自己实现一个传进去，从测试样例上看，是没有测这个`_parseQuery`


```js
export function stringifyQuery (obj: Dictionary<string>): string {}
```

转化为url上的请求参数格式 记得encode

此外就是上面 使用了一些 url的编码解码 函数

### resolve-components.js

```js
export function flatMapComponents (
  matched: Array<RouteRecord>,
  fn: Function
): Array<?Function> {}
```

对matched的每个元素`m`,中`m.components`的每个`key` 调用`fn(m.components[key],m.instances[key],m,key)`

```js
export function resolveAsyncComponents (matched: Array<RouteRecord>): Function {}
```

返回一个闭包函数 `(to,from,next)=>{}`

使用了上面的`flatMapComponents`

通过内部 两个变量`hasAsync`和`pending`来控制 next()

这里没有使用`to`和`from`只有 `next()`和`matched` 

没有很懂的是 这里`def = matched某个 的components[key]`,就是其某个`_Vue.extend()`

但是这里`resolve,reject`都是`once`

下面为什么 既有`res = def(resolve,reject)`又有 `res.then(resolve, reject)`

emmmmmmmmm所以这里正向功能 是配置所有 `components[key]` 之后调用 `next()`?

然后似乎为了兼容不同语法，写了比较神奇的

```js
export function flatten (arr: Array<any>): Array<any> {}
```

emmm名为flatten，实际 只是 `Array.prototype.concat.apply([],arr)`,所以最多flatten一层

比如`[1,[2,[3,[4]]]] -> [1,2,[3,[4]]]`

### route.js

```js
export function createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {}
```

返回的是一个`Object.freeze(Route)`


```js
// the starting route that represents the initial state
export const START = createRoute(null, {
  path: '/'
})
```

```js
export function isSameRoute (a: Route, b: ?Route): boolean {}
```

如果`b=== START`,那么 `return a===START` 所以不会再生成`START`?

对 a和b的path,name,hash,query,params 这些 需要比较的进行深比较

```js
export function isIncludedRoute (current: Route, target: Route): boolean {}
```

目标path是当前path的前缀，目标hash为空或者和当前hash相等，目标query的key在当前key中都出现过 =.=这个规则 好迷啊


这里 有单独实现`clone`和`isObjectEqual`两个方法，都实现了深度处理，但是没有实现可能出现的循环引用。不过因为都是 Route中的 "可控制的"参数,认为是不会出现循环引用的。

### scroll.js

```js
export function setupScroll () {}
```

看得出自闭的感受了 这里三个注释 `Fix #balabala`

`监听popstate =>  export function saveScrollPosition () { positionStore[当前 状态key] = 保存x,y偏移` 

```js
export function handleScroll (
  router: Router,
  to: Route,
  from: Route,
  isPop: boolean
) {}
```

// wait until re-render finishes before scrolling

`router.app.$nextTick()`里执行 调用`router.options.scrollBehavior.call(router,to,from,isPop?position:null)` 来判断是否需要滚动，如果需要
 则调用 `scrollToPosition(...)`

### state-key.js

上面文件会用到 `gen/get/set StateKey`,然后 值是直接取用的 `Time.now().toFixed(3)`

至于`Time` 可能取 `window.performance`或者`Date`

### warn.js

`assert/warn/isError/isExtendedError`

如果grep代码 发现 都是说 `process.env.NODE_ENV !== 'production'`

那么问题来了 为什么 不写成 只在 函数内,外部直接调用

或者说

为什么不写成，传递参数增加一个env?

再或者

详细命名出一个函数 warnNonPro

# 总结


Onhashchange 的触发来源
 * 修改浏览器地址 增加改变#hash
 * 修改location.href / location.hash
 * 点击锚点链接
 * 浏览器前进后退变化

hash

routeLink负责
 * 阻止默认行为 如click e.preventDefault()
 * 设置 location.hash
 
routeView负责
 * window.addEventListener('hashchange',e=>{具体工作 比如页面渲染});

history(用的h5 api)

pushState 不触发页面刷新，只改变history对象，是同源策略保护限制的

popstate 页面组件刷新

routeLink负责
 * 阻止默认行为 如click e.preventDefault()
 * polyfill补丁，支持低版本浏览器。新版本的才有history.pushState()
 * window.history.pushState(对象,link,link);
routeView负责
 * window.addEventListener('popstate',e=>{具体工作 比如页面渲染}); 由浏览器前进后退按钮 触发,或者history方法触发

不支持pushState会降级到hash模式

# examples

> 对照 源码里的 example再来回顾实现

在源码的`examples/`文件夹里

通过`npm run dev`来启动

## basic

    mode: 'history',
    base: __dirname,

`grep -r "base" src/` 可以回顾一下 base相关的实现


        <router-link tag="li" to="/bar" :event="['mousedown', 'touchstart']">
          <a>/bar</a>
        </router-link>
        
这一部分 回顾 link的实现 , tag不为a 则会 递归在this.$slots.default找第一个a元素,然后 绑上事件, 然后 event 是对应 在找到的标签a上的所有 on事件改为 阻止默认事件 调用 
`router.push/replace`,

所以这个`/bar`鼠标点击下 就会触发， 页面上另一个`/bar` 要释放才会触发
     
那么，跟觉源码的逻辑 这样 做后会触发两次 push ,两次 transitionTo，两次 confirmTransition，然后 通过 base.js中的isSameRoute中判读是否是同一个Route,如果是 则调用ensureURL,最后调用 abort,

而 abort中 如果是 NavigationDuplicated的 错误 则不会 warn,会调用 回调函数(如果传递了),

当然 如果你已经在一个路径下 那么你点击 一个指向当前的路由 也会 走上面的逻辑(不是两次),在`isSameRoute`后就不会再走动

其中的`to` 是通过`router.resolve(this.to,current,this.append)`解析出的目标地址
      
    navigateAndIncrement () {

实现了直接去调用`$router.push`方法 ,你可以通过浏览器的返回看到push的效果

        <router-link to="/foo" v-slot="props">
          <li :class="[props.isActive && 'active', props.isExactActive && 'exact-active']">
            <a :href="props.href" @click="props.navigate">{{ props.route.path }} (with v-slot).</a>
          </li>
        </router-link>

这一段 会对应link中的 scopedSlot, 注意到 它并没有 传递`activeClass` 和 `exactActiveClass`而是 自己组件里 动态计算class,然后这里 

这里也是把 源码中传递的所有参数都用到了

```js
this.$scopedSlots.default({
  href,
  route,
  navigate: handler,
  isActive: classes[activeClass],
  isExactActive: classes[exactActiveClass]
})
```

html最下面 

      <pre id="query-t">{{ $route.query.t }}</pre>
      <pre id="hash">{{ $route.hash }}</pre>

都是 过程中计算出来的当前 Route上的参数 query

同时可以发现 当 路由改变时 所有 RouterLink 的render函数 都被重新调用

## hash-mode

和basic vimdiff一下 

首先 最主要的变化是 `mode:'hash'`

此外这里加入了 `/xxx/:yyy`这样的匹配

然后在`router-link`部分 就只使用了最基本的写法

mode也就是 直接文件`history/hash.js`

然后 冒号路径 同样是 `link.js`中render里的 router.resolve, 源码反过去搜的话是 `index.js: resolve(to...) ->  location.js: normalizeLocation(raw...), -> index.js:match(raw...) -> create-matcher.js:match `

这里 有点问题! 虽然说`index.js::match` 和 `create-matcher.js`里都是有返回Route的,但是，在 match的一些情况下 传入的raw被更改了 比如加上了params，因为 在 normalizeLocation里 返回的location == raw,就有了 后面 match中修改改location时修改了 raw,

也就是 说 在link中 这个返回的location可能是带上 params 也可能没有，所以这是不可靠的=.=

每当这时 就会怀念 c++中的 const引用参数 

然后 当点击时 是触发`hash.js::push -> bash.js::transitionTo -> router.match 匹配出Route -> base.js updateRoute 跟心 current = route`

其中处理冒号格式的是靠 `src/util/params.js` 中使用'path-to-regexp',在 match函数中使用 

这样也就是 把 计算出的params 之类的 丢到了`$route`上

## nested-routes

1. 是`route`表中 有 `name'` 这样写to就可以 不用写详细路径

实现就是靠 `create-matcher.js`的`nameMap`来实现`名字-> url/:xxx/yy` 以及 对应的正则

emmmmm 经过调试 都在 createRouteMap中把 nameMap做好了,在 下面 `record=nameMap[name]`始终 都有值

路径也在`create-matcher.js`中的`locatoin.path = fillParams`合并

例如

`fillParams('/parent/qux/:quxId/quux',{quxId: "1", zapId: 2})`

我们可以尝试添加 `fillParams /parent/qux/:quxId/quux {quxId: "1", zapId: 2}`

你会发现 点击会跳转到根(如果没有 quxId) 会报warn `[vue-router] missing param for named route "quux": Expected "quxId" to be defined`

在url上是根但是 在 router-view上 还是 按照 name的层次渲染的

这里一个问题就是 说 name 不能重复 会报错 `[vue-router] Duplicate named routes definition: { name: "quuy", path: "/parent/qux/:quxId/quuy" }` 但如果不管的话, name根据不重复建立 只会保存第一个

第二个就是说 即使从`xxx/:quxId` 直接跳 `name:'quux'`也是会回到主页, 因为虽然原来 quxId有值,但树形解析 上并没有quxId的值

2. 是嵌套的 路由表 和 嵌套的 router-view

路由表嵌套 上面1.已经说了，然后 router-view 嵌套 靠的就是上面 源码阅读中讲的 matched 的计算,见[view.js](router-view.js)

即每一层`router-view`渲染是通过depth 去`$route.matched[depth]`取值

## named-routes

基本就是 router配置的时候 带name，然后 router-link 的to时 配置 name,也可以配置 params

没啥新的东西 

上面nested-routes都展示了

## named-view

`router-view` 上加上了 name

路由里配置

      components: {
        default: Baz,
        a: Bar,
        b: Foo
      }

那么在 取的时候 根据props的name 去`matched.components[name]`中获得


# 个人其它收获

0. vuex,vue-router的example 都是 用express写的
1. vuex,vue-router的文档都是vuepress生成的
2. vuex的开发测试 目测没有flow，vue-router的测试有用到flow，两者似乎都用到了tsc
3. dev,测试,release 全部脚本化了
4. 之前有不少地方建议用typeof == 'undefined'来比较undefined,这里源码写的依然是 !== undefined来比较，感觉这些就算可有可无的建议吧(吗)
5. 另外就是 之前有想过说 代码里尽量避免字符串 作为逻辑运算，用enum或者常量，或者常量意义的变量代替，这里看源码依然后很多case 字符串，或者字符串直接比较的。
6. 又多了一点源码阅读经验，因为 很多源码现在都已经有自动测试了，所以在直接看 util /helper之类的 代码时，先看对应的测试代码可以 快速知道这个代码是干啥用的，再阅读代码就会更容易理解
7. 比如query里明明是可以用`misc.js`的`extend` 为何没用=。= 是有什么考虑么
8. Object.freeze，没有深入研究，但拉去属性可以看到writable都变成false
9. 这里为了兼容多种语法，采用的是在具体的函数里接受+一堆if来处理，而不是提供单一标准参数让调用者控制参数。
10. `this.$scopedSlots.default({`没有查到,但是 看源码中的ts 是 `$scopedSlots[slot名字]=(props:any)=>ScopedSlotChildren;`)
11. 看多了源码 你会发现很多`process.env.NODE_ENV !== 'production'` 时会报warn,同时 也知道了如果你要负责构建打包，看似 一个字符串'production'其实是会参与逻辑
12. [functional 组件](https://vuejs.org/v2/guide/render-function.html#Functional-Components) 
13. 里面实现的函数有一些潜在side-effect的 比如 match,可能会修改到raw,这种时候就会怀念C++的const引用

# 参考

[hashchange 事件 mozilia文档](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)

[popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)

[flow](https://flow.org/en/docs/)

[base tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)

# TODO

看一下 mixin文档了，不然有些方法看得不太理解
 * install, beforeCreate, $options registerRouteInstance?,defineProperty

https://vuejs.org/v2/api/#optionMergeStrategies

Vue.util.defineReactive(this, '_route', this._router.history.current)

pwa

vue-ssr

ivew

单元测试

nuxtjs

https://npmdoc.github.io/node-npmdoc-vue/build..beta..travis-ci.org/apidoc.html#apidoc.element.vue.util.defineReactive


---
title: react js 提炼笔记 and more
date: 2021-05-31 11:20:14
tags: reactjs
category: [frontend, react]
---

一点总结提炼

# Thinking in react

https://reactjs.org/docs/thinking-in-react.html

1. 从UI和后台获得设计稿和接口以及接口返回
2. 单一功能原则 组件层级划分
3. 编写静态html(无用户交互,官方上面没有,仅结构,无样式?)
4. 转换成静态react(无用户交互,无state,仅展示,数据流均为父向子)
5. 最小(且完整)的state状态,其它的内容全部由这些state产生, (例如保存数组,而不需要专门保存数组长度的变量), 主要完成的内容是 **单向数据流与state**,注意:父组件传递的不应该是state,随时间推移的不应该是state, 能由其它state计算得到的不应该存储
6. 反向数据流


有一点不同的是, 真实开发中, 可能不会一个业务+组件同时提供. 思考顺序会变为,开发组件,再开发业务,而上面的思路其实也是有效的. 而对组件开发的思路比较像是, 先考虑出入参数,就像思考函数一样,考虑它的复用性以及编码迭代改版的设计性

# props vs state

https://reactjs.org/docs/faq-state.html#what-is-the-difference-between-state-and-props

https://github.com/uberVU/react-guide/blob/master/props-vs-state.md

https://lucybain.com/blog/2016/react-state-vs-pros/


props: 外部传递给组件, 应该看成只读的, 传递回调函数

state: 组件内部自己管理, 初始状态主要由客户事件变化, setState异步(一般传递函数, 这是实现细节,注意官方文档说不要依赖这种实现,相关问题可以看最近发生的rust的二分搜索引发的问题(与react无关))

相同点: 纯js对象, 变化触发更新, 相同的(props,state)输入输出应该是恒定的(for就有问题?)

?? state不可由子组件修改, props, state不应太多?

---

就目前项目实践的感受,对于业务开发, 基本只有业务层关联的(顶层)需要state,而基础组件内都不持有state,主要是事件触发和props渲染.

# setState 非同步的一些举例

https://github.com/facebook/react/issues/11527#issuecomment-360199710

即使 state同步,props是不同步的, react的props 是只读不会变的,和vue是对象引用不同

```
state触发
props 触发
state触发
props 触发 // 这种情况 可能是老的props,而真实的props或许已经更新了
state触发
```

为了说明不是理论上的,然后还翻出了多个历史issue













# Flux 单向数据流

https://facebook.github.io/flux/docs/in-depth-overview

https://www.youtube.com/watch?v=nYkdrAPrdcw&list=PLb0IAmt7-GS188xDYE-u1ShQmFFGbrk0v&t=621s&ab_channel=FacebookDevelopers

https://facebook.github.io/flux/docs/overview

https://github.com/facebook/flux/tree/master/examples

https://code-cartoons.com/a-cartoon-guide-to-flux-6157355ab207

action -> dispatcher -> store -> view -> action

action: type + payload

dispatcher(同步), 可以waitFor 等待其它dispatcher

store: 数据储存 更新view

controller view & view: store变化被通知,让view把数据渲染

> 执行流程

初始state数据

state去dispatcher "订阅"?

controller view 从state获取数据,给view渲染

controller view 去store "订阅"?

> 用户事件

view 通知 action, 或其它Action

action 通知dispatcher

dispatcher 给对应的store

store内部处理,如果需要更新state,更新完以后,通知controller view , 根据 type 分发

controller view获取新state并通知view渲染

从根本上讲,仅从上述的角度来看, 根本在规范了流程和代码位置, 对于新进入的开发来说, 能直接通过代码,知道各个层级的内容. 本质上解决的更多是一个软件工程的质量管理工程经验得到解决方案, 甚至可以脱离redux到不同的框架内使用. 相对于MVC是 给MVC内部调用关系错综复杂的解决方案

从另一个角度讲, 只能通过触发Action来修改store里的内容

单元测试更容易!

从其它技术来讲,现在有rxjs, 直接描述关系式的开发,和vue这样的自己实现的reactive的关系式描述开发, 当然也有 rxjs + flux 的方案

不过facebook说他们的消息显示1 的更新问题,现在还有不少应用持续有这种bug :-)

然后看youtube视频上小姐姐的展示,实际上再回想开发, 这里的数据流的每一条线,实际上是多条线

# redux

`npx create-react-app redux-ts-demo --template redux-typescript`

> redux有可以与react无关单独使用的`redux core`, 也就是一个具体的flux实现?

官方的 [Basic Example](https://redux.js.org/introduction/getting-started#basic-example) 里能看到

用户实现reducer, 提供 createStore(reducer), subscribe(fn), getState(), dispatch()

> 有`@reduxjs/toolkit`

提供 createSlice(提供导出 acitions,reducer), configureStore(替代上面的 createStore, reducer可以单个或者store的map)

其它getState,subscribe,dispatch上面有的还是有

同样要用户实现reducer,不过写法可以像是操作state(之所以说像是,是因为它并不是真的更改,而是toolkit内Immer去做的变化检测一类,也要注意因为只有这里用Immer,所以只能在createSlice或createReducer里面这样写)

Redux Slices: A "slice" is a collection of Redux reducer logic and actions for a single feature in your app

这个角度是对root state的划分,

同时简化了reducer和actions的写法,并且在ts加持下能不再靠字符串(或额外自己写控制)保持一致


reducer规则:

1. 计算结果应该只由old state和 action的传入相关(也就是不依赖 其它变量), 纯函数能让它"可以预测"易测试,更加工程友好
2. 不修改现有state,而是产生新的修改后的state
3. 不应该有异步或其它副作用

time-travel debugging 也是一个特点

> thunks 异步, 直接使用是`redux-thunk`,现有的toolkit里`configureStore`能简化

外部是包裹,返回thunk函数, 中间是异步

内部是调用dispatch 和 getState

官方demo( async+await看起来就很自然舒服了, 对于外部调用thunk的包裹, 也是直接和同步调用看上去类似,fetchUserById()

```js
// the outside "thunk creator" function
const fetchUserById = userId => {
  // the inside "thunk function"
  return async (dispatch, getState) => {
    try {
      // make an async call in the thunk
      const user = await userAPI.fetchById(userId)
      // dispatch an action when we get the response back
      dispatch(userLoaded(user))
    } catch (err) {
      // If something went wrong, handle it here
    }
  }
}
```

`import { useSelector, useDispatch } from 'react-redux' ` 可以 解决把redux中的state用在react里和调用redux里的dispatch ( 作为对比默认是useState

官方说, 还是通过使用react提供的useState和useEffect,来构建自己的逻辑

在ts demo生成的模板里是

```
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

官方`export const selectCount = (state: RootState) => state.counter.value;`

并且注释说,也可以不定义直接在使用的地方写`useSelector((state) => state.counter.value)`

你也可以不完全是暴露值,也可以是函数处理映射后`const countPlusTwo = useSelector(state => state.counter.value + 2)`

The answer is NO. Global state that is needed across the app should go in the Redux store. State that's only needed in one place should be kept in component state.







提供了+1,+n,条件+2,异步+的四种demo




> 总结

redux基本是一个flux的实现

`@reactjs/toolkit` 简化了redux中 actions,reducer 编写和使用

thunk: 异步的 



# 对比Vue

TODO 三个框架的工程解决方案和实际产出对比

1. props, Vue也提供,但是没有强制限死为只读,导致接手的不少前端经理的代码还有修改props的行为, 而即使不是因为代码也会因为用户操作,没有对应的vm更改时,展示的页面不是"vm渲染的", 最常见的就是input只传value
2. Vue凡是要渲染的 都是data/computed/props, 但对于这种完全, 其实没有静态的划分,虽然可以通过const配置 + js语法引入到data里
3. 回调和emit的区别就是需要忽略时的体验了
4. flux/redux vs vuex, vuex(以我的视角vuex一定上是为了仿照其它框架的解决产物,其设计理念一定程度上和vue本身是相互违背的, vuex完成了简单共享js完成不了的动态触发(其实核心是调用了Vue.data), 提供了 mutation/actions 看上去划分了 同步异步, 也可以devtools调试, 也可以有插件支持,但就我看目前的开发来说,很多很多只是使用了 数据共享这一点, 而vue的简单设计理念,在我看来更适合直接等号而不是修改需要调用函数,+声明化的使用,剩下的就是module和这里无关, 所以vuex本质是一个vue reactive + flux 的类似实现)

# 延伸阅读

[ts](https://github.com/type-challenges/type-challenges)

[Immer](https://immerjs.github.io/immer/)

---
title: Vue transition
date: 2021-09-02
tags: [vue2]
category: [code, frontend, vue]
mathjax: true
---

# 对于transition的一个核心问题是时间哪里来的

因为name这些感觉能拿到, 拼接也就当然

而 transition包裹的内部元素销毁，如果能拿到时间，那其实跟keep-alive 原理类似，在时间以后再销毁即可

然而我们并没有传递一个时间给元素，它却能知道时间

# source code

## vue2


`src/platforms/web/runtime/transition-util.js`

中

```cpp
export function getTransitionInfo (el: Element, expectedType?: ?string): {
  type: ?string;
  propCount: number;
  timeout: number;
  hasTransform: boolean;
} {
  const styles: any = window.getComputedStyle(el)
  // JSDOM may return undefined for transition properties
  const transitionDelays: Array<string> = (styles[transitionProp + 'Delay'] || '').split(', ')
  const transitionDurations: Array<string> = (styles[transitionProp + 'Duration'] || '').split(', ')
  const transitionTimeout: number = getTimeout(transitionDelays, transitionDurations)
  const animationDelays: Array<string> = (styles[animationProp + 'Delay'] || '').split(', ')
  const animationDurations: Array<string> = (styles[animationProp + 'Duration'] || '').split(', ')
  const animationTimeout: number = getTimeout(animationDelays, animationDurations)
```



## vue3

`packages/runtime-dom/src/components/Transition.ts`

```
export function getTransitionInfo(
  el: Element,
  expectedType?: TransitionProps['type']
): CSSTransitionInfo {
  const styles: any = window.getComputedStyle(el)
  // JSDOM may return undefined for transition properties
  const getStyleProperties = (key: string) => (styles[key] || '').split(', ')
  const transitionDelays = getStyleProperties(TRANSITION + 'Delay')
  const transitionDurations = getStyleProperties(TRANSITION + 'Duration')
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations)
  const animationDelays = getStyleProperties(ANIMATION + 'Delay')
  const animationDurations = getStyleProperties(ANIMATION + 'Duration')
  const animationTimeout = getTimeout(animationDelays, animationDurations)
```

## 所以

核心是`window.getComputedStyle`



---
title: amd/cmd/commonjs/umd/esm/iife/systemjs
date: 2021-03-09 21:58:14
tags: [js]
category: [frontend,backend]
mathjax: true
---

# 总

为了模块拆分

# AMD(asynchromous module definition 异步模块定义)

RequireJS,前端，异步

```js
define('module1', ['jquery'], ($) => {
  //do something...
});

define(模块, [依赖的模块], ($) => {
  //do something...
});
```

<!--more-->

# CMD(Common Module Definition - 公共模块定义) 有些地方都不再单独提及

CMD是SeaJS在推广过程中对模块定义的规范化产出，对于模块的依赖，CMD是延迟执行

```js
define((require, exports, module) => {
  module.exports = {
    fun1: () => {
       var $ = require('jquery');
       return $('#test');
    }
  };
});

define((require, exports, module) => {
  module.exports = {
    函数: () => {
       var $ = require(依赖的模块);
       return $('#test');
    }
  };
});
```

# CommonJS(cjs)

CommonJS服务端,Node.js,同步

使用require / module.exports

file1.js

```js
moudle.exports = {
  a: 1
};
```

file2.js
```js
var f1 = require('./file1');
var v = f1.a + 2;
module.exports ={
  v: v
};
```

# umd(Universal Module Definition - 通用模块定义)

amd(浏览器，异步) 和 commonjs(服务器，同步) 合并



使用诸如Rollup/ Webpack之类的bundler时通常用作备用模块

```js
((root, factory) => {
  if (typeof define === 'function' && define.amd) {
    //AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    //CommonJS
    module.exports = factory(require('jquery'));
  } else {
    //都不是，浏览器全局定义
    root.returnExports = factory(root.jQuery);
  }
})(this, ($) => {
  //    方法
  function myFunc(){};

  //    暴露公共方法
  return myFunc;
});
```

# ESM(ECMA Script Modules)

es6 模块化规范 (nodejs新版本可直接用,现代化浏览器script标签加`type="module"` 可用)

常见的 export / import

```js
// 写法一
export var m = 1;
// 写法二
var m = 1; export { m };
// 写法三
var n = 1; export { n as m };
// 写法四
var n = 1; export default n;
// 写法五
if (true) { import('./myModule.js').then(({ export1, export2 }) => { /* ... */ }); }
// 写法六
Promise.all([import('./module1.js'),
import('./module2.js'),
import('./module3.js')]).then(([module1, module2, module3]) => { /* ... */ });
```

# iife(立即 调用 函数 表达)

A self-executing function suitable for inclusion as a `<script>` tag. If you want to create a bundle for your application, you probably want to use this.

示例

```js
(function () {
  'use strict';

  // maths.js

  // This function gets included
  function cube ( x ) {
    // rewrite this as `square( x ) * x`
    // and see what happens!
    return x * x * x;
  }

  /* TREE-SHAKING */

  console.log( cube( 5 ) ); // 125

}());
```



# systemjs

示例

```js
System.register('myBundle', [], function () {
  'use strict';
  return {
    execute: function () {

      // maths.js

      // This function gets included
      function cube ( x ) {
        // rewrite this as `square( x ) * x`
        // and see what happens!
        return x * x * x;
      }

      /* TREE-SHAKING */

      console.log( cube( 5 ) ); // 125

    }
  };
});
```

universal module loader that supports CJS, AMD, and ESM modules

SystemJS is a hookable, standards-based module loader. It provides a workflow where code written for production workflows of native ES modules in browsers (like Rollup code-splitting builds), can be transpiled to the System.register module format to work in older browsers that don't support native modules, running almost-native module speeds while supporting top-level await, dynamic import, circular references and live bindings, import.meta.url, module types, import maps, integrity and Content Security Policy with compatibility in older browsers back to IE11.

简单说在老的浏览器依然可以跑native module,且效率不差


# 表格

|amd(requirejs)|cmd|commonjs(cjs)|umd|esm|iife|systemjs|
|---|---|---|---|---|---|---|
|异步模块定义|公共模块定义|服务端模块规范|通用模块定义|ecma脚本模块|立刻自执行模块|系统js??翻译不能?|
|异步|异步|同步|服务端同步浏览器异步|es6手动编写,被webpack打包成amd,umd,cjs|同步立即|用于在老浏览器跑其它格式的js module|
|浏览器|相关seajs|服务器(nodejs), (通过Browserify用于浏览器)|先判断服务器再浏览器|新版nodejs支持，老版本可以用webpack/rollup等打包|浏览器script标签|浏览器|

# Tree Shaking

rollup 提出

见rollup 的 repl(Read-Eval-Print-Loop) 的在线 tree-shaking 示例, 上面的几种生成转换也是可以在在线的repl上看的


1. 只能作为模块顶层的语句出现，不能出现在 function 里面或是 if 里面。（ECMA-262 15.2)
2. import 的模块名只能是字符串常量。(ECMA-262 15.2.2)
3. 不管 import 的语句出现的位置在哪里，在模块初始化的时候所有的 import 都必须已经导入完成。换句话说，ES6 imports are hoisted。(ECMA-262 15.2.1.16.4 - 8.a)
4. import binding 是 immutable 的，类似 const。比如说你不能 import { a } from './a' 然后给 a 赋值个其他什么东西。(ECMA-262 15.2.1.16.4 - 12.c.3)

切记副作用

# 总结

上面提到的几种 仅仅是写法示例，完整的书写规则见各自的官方文档，或者下面的参考链接

现代书写来说，基本就是书写esm了，剩下的事情就由 rollup/webpack之类的工具去完成了

# ref

[requirejs::define a module](https://requirejs.org/docs/api.html#define)

[commonjs](http://wiki.commonjs.org/wiki/Modules/Async/B)

[umd](https://github.com/login?return_to=%2Fumdjs%2Fumd)

[iife](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)

[systemjs](https://github.com/systemjs/systemjs#systemjs)

[rollup repl](https://rollupjs.org/repl)

[知乎 尤雨溪 tree-shaking](https://www.zhihu.com/question/41922432/answer/93346223)

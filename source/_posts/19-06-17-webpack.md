---
title: webpack文档 阅读笔记
mathjax: true
date: 2019-06-17 01:01:01
categories: [ frontend]
tags: [webpack]
---

# 参考

https://webpack.js.org/concepts/

**警告！虽然有`.com`的中文文档，但是存在没有更新文档的问题，不是webpack4版本的文档！！例如CommonsChunkPlugin已经被弃用，CleanWebpackPlugin的引入和使用方法不同版本不同**


# 核心概念

## 入口entry

对应配置中的`entry`属性

如`webpack.config.js`

```js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

常见 分离应用程序和三方库入口

```js
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
}
```

根据经验：每个 HTML 文档只使用一个入口起点。多页面应用

```js
const config = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```

**注意** 以上都可以用`CommonsChunkPlugin`来优化公用代码


## 输出output

在哪里输出所建立的bundles以及命名

<!-- more -->

```js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

多个入口起点

```js
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
}
```

> 高级

用hash或者 运行时path


## loader

webpack 本身只理解js，

loader 可以 把所有类型 转换为 webpack可以处理 引用的模块

`test`: 哪些文件应该被转换处理

`use`: 转换应该使用哪个loader

```js
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};

module.exports = config;
```

例如`ts`和`css`的`loader`

```bash
npm install --save-dev css-loader
npm install --save-dev ts-loader
```

```js
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
};
```

在上面use中也可以1个test，数组的use,

除了配置还有`import Styles from 'style-loader!css-loader?modules!./styles.css';`内联写法

和CLI写法`webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'`这样`.jade`和`.css`用不同的loader

## 插件plugins

和loader相比，loader 主要用于转换某些类型的模块

而 plugins一般功能范围更广，从打包优化，压缩，一直到重新定义环境中的变量

例如

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

const config = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```

定位 完成loader 无法实现的其它事

一个插件 是 具有apply方法的class，它的apply会被webpack compiler调用

配置使用：需要new

样例:

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const webpack = require('webpack'); //访问内置的插件
const path = require('path');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```

通过node主动 调用 webpack示例

```js
  const webpack = require('webpack'); //访问 webpack 运行时(runtime)
  const configuration = require('./webpack.config.js');

  let compiler = webpack(configuration);
  compiler.apply(new webpack.ProgressPlugin());

  compiler.run(function(err, stats) {
    // ...
  });
```


## 模式mode


通过选择`development`或`production`之中的一个，来设置`mode`参数，你可以启用相应模式下的`webpack`内置的优化

```js
module.exports = {
  mode: 'production'
};
```

或者从cli传递`webpack --mode=production`

差异

建立不同的配置文件`webpack.development.config.js`和`webpack.production.config.js`

### development

会将 `process.env.NODE_ENV` 的值设为 `development`。启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`。

### production

会将 `process.env.NODE_ENV` 的值设为 `production`。启用 `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin` 和 `UglifyJsPlugin`.

## 模块

关于模块引入 分为3种


1. 绝对路径 
2. 相对路径
3. 模块路径，将在`resolve.modules` 中指定的所有目录内搜索，

一旦根据上述规则解析路径后，解析器(resolver)将检查路径是否指向文件或目录。如果路径指向一个文件：

 * 如果路径具有文件扩展名，则被直接将文件打包。
 * 否则，将使用 [resolve.extensions] 选项作为文件扩展名来解析，此选项告诉解析器在解析中能够接受哪些扩展名（例如 .js, .jsx）。

如果路径指向一个文件夹，则采取以下步骤找到具有正确扩展名的正确文件：

 * 如果文件夹中包含 package.json 文件，则按照顺序查找 resolve.mainFields 配置选项中指定的字段。并且 package.json 中的第一个这样的字段确定文件路径。
 * 如果 package.json 文件不存在或者 package.json 文件中的 main 字段没有返回一个有效路径，则按照顺序查找 resolve.mainFiles 配置选项中指定的文件名，看是否能在 import/require 目录下匹配到一个存在的文件名。
 * 文件扩展名通过 resolve.extensions 选项采用类似的方法进行解析。

## manifest

在使用 webpack 构建的典型应用程序或站点中，有三种主要的代码类型：

 * 你或你的团队编写的源码。
 * 你的源码会依赖的任何第三方的 library 或 "vendor" 代码。
 * webpack 的 runtime 和 manifest，管理所有模块的交互。

`__webpack_require__`+`manifest` 来做运行时模块检索


## target

```js
var path = require('path');
var serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
  //…
};

var clientConfig = {
  target: 'web', // <=== 默认是 'web'，可省略
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
  //…
};

module.exports = [ serverConfig, clientConfig ];
```

打分别服务端js和 网页端js

## 模块热替换(hot module replacement)

webpack watch mode

webpack-dev-server

webpack-dev-middleware

...

# 使用webpack

编写代码

配置`webpack.config.json`

# webpack-cli

```
npm i webpack-cli @webpack-cli/init
npx webpack-cli init
```

例如ts支持

`npm install --save-dev typescript ts-loader`

增加`tsconfig.json`文件

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true
  }
}
```

编辑`webpack.config.js`

把`index.js`换为`index.ts`

```diff
 module.exports = {
   mode: 'development',
-  entry: './index.js',
+  entry: './index.ts',
 
   output: {
     filename: '[name].[chunkhash].js',
```

在`module.exports.module.rules`增加

```diff
   module: {
     rules: [
+      {
+        test: /\.tsx?$/,
+        use: 'ts-loader',
+        exclude: /node_modules/
+      },
       {
         test: /.(js|jsx)$/,
```

然后新建文件`index.ts`

# plugins

用已有的就见文档了

说说自定义plugins:

https://webpack.js.org/contribute/writing-a-plugin/#creating-a-plugin

你需要实现

```js
class MyExampleWebpackPlugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  // 你需要一个带apply的类 或者说 prototype里有 apply方法
  apply(compiler) {
    // 在这里 监听 comipler的钩子并处理

    // https://webpack.js.org/api/plugins/#tapable
    // 这里的tap是同步函数 有替代函数 包括 tapAsync, tapPromise 
    compiler.hooks["事件名称"].tap('你的插件名称',处理函数); // 处理函数会传递 compilation

    //https://webpack.js.org/api/plugins/#custom-hooks
    // 也可以自定义同步钩子事件 require('tapable').SyncHook
    // https://github.com/webpack/tapable
    compiler.hooks.myCustomHook = new SyncHook(['a', 'b', 'c']); // 拟定的参数名
    // 调用自定义钩子
    compiler.hooks.myCustomHook.call(a, b, c);
  }
}
```

关于所有hook可以看`https://webpack.js.org/api/compiler-hooks/` 也可以输出 `compiler.hooks`的key

Compiler 和 Compilation 源码

`https://github.com/webpack/webpack/blob/master/lib/Compiler.js`

`https://github.com/webpack/webpack/blob/master/lib/Compilation.js`

一个既有`compiler`也有`compilation`的

```js
function HelloCompilationPlugin(options) {}

HelloCompilationPlugin.prototype.apply = function(compiler) {

  // 设置回调来访问 compilation 对象：
  compiler.plugin("compilation", function(compilation) {

    // 现在，设置回调来访问 compilation 中的步骤：
    compilation.plugin("optimize", function() {
      console.log("Assets are being optimized.");
    });
  });
};
```



# 坑

如果使用 init 生成，在填写entry point的时候不是文件夹，则在你生成的`webpack.config.js`的 loader的include有问题可能为`[]`

例如实现代码见`~/.npm_global/lib/node_modules/@webpack-cli/init/node_modules/@webpack-cli/generators/utils/languageSupport.js`的 `getTypescriptLoader` 等的include实现，也就是`getEntryFolders`返回为空

`https://github.com/webpack/webpack-cli/pull/817/files`


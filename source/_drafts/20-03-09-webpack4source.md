---
title: webpack 4 source code
date: 2020-03-09 11:20:14
tags: [webpack4, webpack]
category: [frontend,webpack]
---

两个仓库 `git@github.com:webpack/webpack.git` 和`git@github.com:webpack/webpack-cli.git `

正流程,假设以来已经安装完了,并且用`webpack-cli init`初始化

这里我选择的是 `不要bundle`+`typescript`+`less`


`/bin/webpack.js`通过`require( webpack-cli/bin/cli.js)`执行这个文件

`webpack-cli/bin/cli.js` 通过 `importLocal(__filename)` 启用当前工程下的`node_modules/webpack-cli/bin/cli.js`

执行的是`yargs.parse(process.argv.slice(2), (err, argv, output) => {`

通过`options = require("./utils/convert-argv")(argv);`获取配置

进入到下面 `processOptions(options)`,其中`options`如下(其中`/home/cromarmot/Desktop/webpackdemo/`是我用于测试的工程目录)

```
{
  "mode": "development",
  "entry": "./src.ts",
  "output": {
    "filename": "[name].[chunkhash].js",
    "path": "/home/cromarmot/Desktop/webpackdemo/dist"
  },
  "plugins": [
    { // 这个是ProgressPlugin
      "profile": false,
      "modulesCount": 500,
      "showEntries": false,
      "showModules": true,
      "showActiveModules": true
    },
    { // 这个是HtmlWebpackPlugin
      "options": {
        "template": "/home/cromarmot/Desktop/webpackdemo/node_modules/html-webpack-plugin/default_index.ejs",
        "filename": "index.html",
        "hash": false,
        "inject": true,
        "compile": true,
        "favicon": false,
        "minify": false,
        "cache": true,
        "showErrors": true,
        "chunks": "all",
        "excludeChunks": [],
        "chunksSortMode": "auto",
        "meta": {},
        "title": "Webpack App",
        "xhtml": false
      }
    }
  ],
  "module": {
    "rules": [
      {
        "test": {},
        "loader": "ts-loader",
        "include": [],
        "exclude": [
          {}
        ]
      }
    ]
  },
  "optimization": {
    "splitChunks": {
      "cacheGroups": {
        "vendors": {
          "priority": -10,
          "test": {}
        }
      },
      "chunks": "async",
      "minChunks": 1,
      "minSize": 30000,
      "name": true
    }
  },
  "devServer": {
    "open": true
  },
  "resolve": {
    "extensions": [
      ".tsx",
      ".ts",
      ".js"
    ]
  },
  "context": "/home/cromarmot/Desktop/webpackdemo"
}
```

可以看到`webpack.config.js`基本一样，变化是正则在`JSON.stringify`中没有直接显示，另一个是 `plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin()]` 中的内容被执行

```
			const firstOptions = [].concat(options)[0];
			const statsPresetToOptions = require("webpack").Stats.presetToOptions;
```

`isArg` 配合`argv`使用,其中 `argv`是

```json
{
  _: [],
  cache: null,
  bail: null,
  profile: null,
  color: { level: 1, hasBasic: true, has256: false, has16m: false },
  colors: { level: 1, hasBasic: true, has256: false, has16m: false },
  'info-verbosity': 'info',
  infoVerbosity: 'info',
  '$0': 'node_modules/webpack-cli/bin/cli.js'
}
```

下面一串的`isArg`都是配合修改 `outputOptions`

这里学了一招, 为了合并参数，不采用“覆盖”，而是对一个对象使用`Object.create(对象)`来完成 不同途径传递的参数的优先级问题

# 总结

1. `Object.create`来在原型链赋值来实现不同途径参数的优先级


# 感谢

idea+nodejs调试

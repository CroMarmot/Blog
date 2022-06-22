---
title: vsc extension 入门尝试
mathjax: true
date: 2019-07-25 01:01:01
tags: [nodejs, vscode ,extension]
categories: [code, ide]
---

# 开始 & 安装

## 文档

https://code.visualstudio.com/api/get-started/your-first-extension

https://github.com/microsoft/vscode-extension-samples

## install & Run

```bash
npm install -g yo generator-code
yo code
```

选择你希望的选项

`code ./新建目录`

按`F5`启动

按`Ctrl+Shift+P`输入`Hello world`回车

当你修改了代码后，在新打开的窗口`Ctrl+Shift+P`再输入`Reload Window`就重新加载了代码

# 解剖

看`package.json`

 * 注册 `onCommand` Activation Event:`onCommand:extension.helloWorld` ,so the extension becomes activated when user runs the `Hello World` command.
 * 使用`contributes.commands` Contribution Point 来让`Hello World`命令 在Command Palette 可用，并且绑定到命令id`extension.helloWorld`
 * 使用`commands.registerCommand`的VS Code API绑定到已注册的命令ID `extension.helloWorld`

 * [Activation Events](https://code.visualstudio.com/api/references/activation-events): events upon which your extension becomes active.
 * [Contribution Points](https://code.visualstudio.com/api/references/contribution-points): static declarations that you make in the package.json Extension Manifest to extend VS Code.
 * VS Code API: 代码中API，可以在你的extension代码中调起

其它配置文件

 * `launch.json` used to configure VS Code Debugging
 * `tasks.json` for defining VS Code Tasks
 * `tsconfig.json` consult the TypeScript Handbook

package.json

vsc使用 `<publisher>.<name>`作为一个插件的`unique ID`




# tree-view

emmmmmm 看了一会代码 发现有文档 https://code.visualstudio.com/api/extension-guides/tree-view

直接看文档吧...


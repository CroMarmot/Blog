---
title: dev in VSCode + docker
date: 2023-03-09
tags: [docker,linux,vscode]
category: [software, linux]
description: develop env with vscode in docker
---

TLDR: 有可实施性,但是作为更简单的方案是像我现在这样直接用Ubuntu

# 背景

众所周知，在以前，通过vim+ssh可以容易的远端开发, 并且当我的主系统一直是Ubuntu时，连vmware里，连windows的wsl2里的linux都十分容易

但现实是很多win下的程序员,和不会vim的程序员, 以及大的项目需要用一下vscode

以及手上项目各种各样，不同语言的，同语言不同版本的，不同工具依赖同样三方库的不同版本的(虽然现在不少语言的隔离有了各自的方案，而且五花八门的，这个直接从上层解决了,甚至同时帮助了系统更换)

## 解决了什么问题

- 远离了windows的ntfs,使用了Unix file permissions防止777
- 统一了环境，即使linux也是一堆环境，解决了下游环境安装难的问题，现在只需要安装docker
- 使用了现代化vscode(可以vim插件支持vim快捷键)
- 性能不差

<!--more-->

# 开始

## 前置知识

**2023年了,我以前还会给点官方文档的链接，现在不论是google还是newbing都可以瞬间得到官方文档链接，所以直接给keywords**

 - 例如python2/pthon3/clang++/g++/nodejs(nvm)/...在不同系统下的安装, win,debian,archlinux,macos
 - 不同语言的依赖库的管理工具pip/npm/...
 - docker的基础命令，docker与虚拟机的区别
 - git(用起来似乎外部的git配置会被自动带入到docker里)

并且完成docker,vscode,git的安装

## vscode

扩展 -> 安装 `Dev Containers`

使用Demo仓库: `git clone https://github.com/MicrosoftDocs/mslearn-python-products`

在vscode中打开 这个clone的文件夹

按`F1`,输入`Dev containers`,选择`Dev Containers: Add Development Container Configuration Files.`

三次输入框分别选择

|提示|选择|
|---|---|
|Select a container configuration template|Python 3|
|Python version|3.11|
|Select additional features to install|Select "OK"|

你会发现 vscode的这个插件创建了`.devcontainer/devcontainer.json`

再次`F1`, 输入`reopen in container`,选择`Dev Containers: Reopen in Container` 即可

---

在内部就可以开发了, 在container的terminal中

```
# 安装依赖
pip3 install --user -r requirements.txt
```

运行

```
python app.py
```

在外部浏览器查看`http://127.0.0.1:5000`

---

这解决了 原来在实机上开发变成了docker里开发

还有问题是，环境安装依然是手动的，如何自定义更多

办法就是 修改`.devcontainer/devcontainer.json`中的image为你的image (也就是自己去做一个docker image)

比如一些features: https://containers.dev/features ,例如

```
{
  "features":{
    "ghcr.io/devcontainers/features/git:1": {
      "version": "latest",
      "ppa": "false"
    },
    "ghcr.io/devcontainers/features/node:1": {
      "version": "18"
    }
  }
}
```

// 这样在你的python3的container里也可以用node

比如对于container和本地之间的端口映射，就是`devcontainer.json`中的`forwardPorts`

比如要自动运行依赖安装`postCreateCommand`中增加命令

其实这些都在自动生成的`devcontainer.json`中的注释中了

这是 微软的例子: https://github.com/devcontainers/images/blob/main/src/python/.devcontainer/devcontainer.json

对于vscode插件的添加,例如`jinja`,在插件的齿轮按钮中复制它的`extensions ID`,或者直接点击`add to devcontainer.json`

```
{
	"customizations": {
		"vscode": {
			"extensions": [
				"wholroyd.jinja"
			]
		}
	},
}
```

---

基于Dockerfile

```
{
  "build": { "dockerfile": "Dockerfile" },
  // 不要"image"
}
```

# 总结一下

总的来说，自定义docker可以自己改image, 也可以不提供image直接基于Dockerfile

如果用基于微软提供的image，可以通过配置features, postCreateCommand来安装额外需要的功能

`customizations.vscode.extensions`可以来指定预安装内部的vscode插件

缺点也是有的，一个是体积，像pnpm, pip3 这些对于多个项目相同的都安在根下不重复安装肯定更小，但实际上就使用来说，有时也会开venv一类的，所以这个缺点其实还好

第二个就是依赖还不稳定时，每次rebuild都需要全部重新下载, 很耗时，所以没稳定之前为了节省时间，还是每次增加依赖时，先不要rebuild, 累积到一定稳定程度或者时间后再rebuild

# 问题

微软提供的docker bash的默认自动补全支持似乎不好,比如git的

对git worktree支持不好, 会识别不到git

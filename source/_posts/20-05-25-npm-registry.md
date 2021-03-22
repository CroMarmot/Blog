---
title: npm registry
date: 2020-05-25 11:20:14
tags: [js,npm]
category: [code, frontend]
---

# npm发布仓库

## 步骤

1. 注册账户 https://www.npmjs.com/signup
2. 命令行登录 `npm login`
3. 建立github仓库
4. 初始化仓库 `npm init`
5. 编写代码
6. 发布`npm publish` & github仓库更新

## 注意事项

如果是之前用taobao的镜像，记得发布时 更改设置为官方地址

个人建议一些“没有建设意义”的仓库，就不要去抢名字了，带上自己的scope发布

发布前** 记得清理敏感信息**，似乎npm虽然可以unpublish但是,不能重置版本号 https://www.npmjs.com/policies/unpublish

### 生成类发布

例如源码是用typescript写的，发布要发布编译后的文件，但是git中不会跟踪。

不建议使用`.npmignore` (会使`.gitignore`在publish时无效)，建议的是在`package.json`中增加`"files":["dist/**/*"]`这样的白名单

## 本地调试

例如

在开发的库中构建后调用`yarn link` 会提示`success Registered "@cromarmot/isNumberOne"`

在用来测试的文件夹中 调用 `yarn link "@cromarmot/isNumberOne"` 即可使用

取消link：把上面link替换为unlink,使用对应的`yarn unlink`命令即可

link以后，代码更新只需要编译原来的库代码，不需要重新link

## 实例

一个基于莫比乌丝反演的数字1判断

https://www.npmjs.com/package/@cromarmot/is-number-one

## refs

https://docs.npmjs.com/


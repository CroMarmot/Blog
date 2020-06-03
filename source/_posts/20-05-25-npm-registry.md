---
title: npm registry
date: 2020-05-25 11:20:14
tags: [js,npm]
category: [frontend]
---

# npm发布仓库

步骤

1. 注册账户 https://www.npmjs.com/signup
2. 命令行登录 `npm login`
3. 建立github仓库
4. 初始化仓库 `npm init`
5. 编写代码
6. 发布`npm publish` & github仓库更新

# 注意事项

如果是之前用taobao的镜像，记得发布时 更改设置为官方地址

个人建议一些“没有建设意义”的仓库，就不要去抢名字了，带上自己的scope发布

发布前记得清理敏感信息，似乎npm虽然可以unpublish但是,不能重置版本号 https://www.npmjs.com/policies/unpublish

# 实例

一个基于莫比乌丝反演的数字1判断

https://www.npmjs.com/package/@cromarmot/is-number-one

# refs

https://docs.npmjs.com/


---
title: console source url
date: 2020-02-19 11:20:14
tags: [chrome, debug, code]
category: [code, frontend]
---

# 问题

chrome里有命令行输出的时候，右侧会有`VM:xxx`或者`源文件名:行数`的一个跳转链接

然而如果封装了console函数或者例如用了vconsole之类的库，

它的错误输出，可能就不是你所期望的自己的代码

# 解决

如果只是简单的封装log

搜到的大多方案都是形如`var newlogfunction = console.log.bind(window.console)`

或者是原来的调用变成返回函数，然后再调用大概变成`newconsole()()`的写法

然而和我期望的需求有些不符，

目前期望的是一个通用的函数内，增加一点调试时的参数输出，希望能输出调用者的位置

也搜索了call stack相关，目前看来有些地方能用`console.trace()`,但在webpack里就不行了？

有搜到过用`new Error()`但它的stack字段是个string ，还真有人字符分割解析这个string

目前一个比较科学的方案是用chrome的blackbox文件功能，对webpack里的无效，但是可以对例如vconsole进行blackbox，这样就能展示到原来调用的位置。

同时根据这个思考，可以在调试的版本中对文件的分块进行指定，让公共文件和具体文件webpack打分开的chunk

# 参考

https://gist.github.com/paulirish/c307a5a585ddbcc17242

https://stackoverflow.com/questions/9559725/extending-console-log-without-affecting-log-line

https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number/32928812

https://developer.mozilla.org/en-US/docs/Web/API/Console/trace

https://developers.google.com/web/tools/chrome-devtools/javascript/reference

https://developer.chrome.com/devtools/docs/blackboxing

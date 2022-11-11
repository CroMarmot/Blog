---
title: chrome inspect 404
date: 2020-12-14
tags: [debug, chrome, android]
category: [frontend]
---

# 问题

`chrome://inspect` 调试android 打开404

常见的问题是 因为这个网址是在线的被墙了

挂个代理就行

但并不是这个问题(同一个手机里面 chrome的页面能调试，但要调的应用的页面打开404)

手机应用里的 浏览器版本`@6cd201cc270433b22442a58084295da1ff3c1370` 并没有对应的调试 (87.0.4280.86)

作为对比`@d8a506935fc2273cfbac5e5b629d74917d9119c7` (86.0.4240.198) 是可用的

`https://chrome-devtools-frontend.appspot.com/serve_file/@7f3cdc3f76faecc6425814688e3b2b71bf1630a4/inspector.html`


最近 ubuntu snap 管理的chromium 貌似停在了一个尴尬的版本上, 升级了一下？似乎也不是这个问题

# 解决

让客户端给了一个新的包（浏览器版本换了）

# 参考

https://snapcraft.io/chromium

https://stackoverflow.com/questions/33632793/chrome-inspect-without-internet-connection

https://stackoverflow.com/questions/47723176/remote-debugging-chrome-on-android-while-offline

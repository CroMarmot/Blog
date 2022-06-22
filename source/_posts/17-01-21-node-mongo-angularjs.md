---
title: nodejs mongodb angularjs 个人笔记
mathjax: true
date: 2017-01-21 01:01:01
tags: [nodejs, AngularJS, mongodb]
categories: [notes]
---

# mongodb 学习记录
  
## 本文依赖
                                                                                                                                                       
`nodejs`
 
`mongodb`
 
`angularjs`

## 记录

[工作总图](P7)

## Detail

### nodejs

事件驱动可扩展性，端到端

> npm install

> npm search

> npm install -g

> npm install -g npm-check

> npm-check -u -g

[模块封装](P43-45)

[事件模型 阻塞I/O](P51-P55)

#### 发送接受P59

``` javascript
var events = require("events");
var emitter=events.EventEmitter();
emitter.emit(eventName,data);
.addListener(eventName,callback(data))
.on(eventName,callback(data))
.once(eventName,callback(data))
```
json/buffer/stream(网页流数据/压缩解压) -P90

文件系统 -P107

require("fs")

HTTP:
```
require("http")
require("url")
require("querystring")
```

HTTPS:P127-
```javascript
/*
openssl genrsa -out server.pem 2048
openssl req -new -key server.pem -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.pem -out server.crt
*/
var https = require("https");                                                                                                                          
var fs = require("fs");
var options = {
  key: fs.readFileSync("./server.pem"),
  cert: fs.readFileSync("./server.crt")
};
https.createServer(options,function(req,res){
  res.writeHead(200);
  res.end("Hello Secure World\n");
}).listen(8128);
```

socket P132-

多处理器

`process`

`child_process`

`cluster,worker`实现多个"线程"监听一个port并可自动处理`cluster_server.js /cluster_worker.js/cluster_client.js`

```
process.stdin.on("data",function(data){;});
process.on("SIGINT",function(){;});
process.on("SIGBREAK",function(){;});
```
`https://raw.githubusercontent.com/bwdbooks/nodejs-mongodb-angularjs-web-development/master/ch09/process_info.js`

`exec() / execFile()/spawn()`

其它模块介绍,runnoob上也有https://nodejs.org/api/

`os`见`os_info.js`

`util`有`format,log,debug,checktype,转对象为字串`原型继承见`util_inherit.js`

`dns`有lookup不同level的resolve

#### Express(server)

npm install express

route,Error handle,易于集成,cookie,会话缓存

`_http_https.js` `require('url')`

```
app.get('/user/:userid',function(req.res){
	res.send("Get User: "+ req.param("userid"));
});
```

`express_routes.js` 路由demo/req.params/正则/Request对象/Response对象

`express_json.js/express_send_file.js/res.download([path])/res.redirect()`

模板引擎`ejs+jade`,`express_templates.js and other files`

中间件大法

`app.use(path,bodyParser()).use(path,bodyParser()).use(path,bodyParser());`

`app.get(path,bodyParser(),function(req,res){});`

 * `static 内置 流式处理静态文件访问`
 * `express-logger `
 * `basic-auth-connect基本身份验证`
 * `cookie-parser读取设置cookie`
 * `cookie-session/会话支持`
 * `express-session,相当强大会话实现`
 * `body-parser req正文中的JSON解析为req.body`
 * `compression 对客户端大响应提供Gzip支持`
 * `csurf 跨站点请求 伪造保护`

res.query. 用于查询把url转化为json

静态文件服务

`app.use(pathurl,express.static(path_file_or_dir_local)[,config]);//maxAge hidden redirect index`

`auth_session.js` 会话+验证

### mongodb(NoSQL)

针对文档，高性能，高可用性，高可扩展性

[安装](https://docs.mongodb.com/manual/installation/)

[mongodb类型](https://docs.mongodb.com/manual/reference/bson-types/)

[基础教程](http://www.runoob.com/mongodb/mongodb-tutorial.html)

封顶集合(capped collection) 超过大小以旧的替代新的

索引？分片？复制？

生命周期？应用程序代码控制或者TTL

```
help <option>
use <database>
show <option> (such as dbs,collections,profile,log)
exit
```

用户管理身份验证-P196

数据库管理

```
db.copyDatabase(origin,destination)
db.dropDatabase()
db.createCollection("collectionname")
coll =db.getCollection("collectionname")
coll.drop()
coll.find({'key':'value'})
coll.insert({'key':'value'})
coll.remove({'key':'value'})
coll.update(where,set,other option) //inc set push sort等update运算符
```

mongo+nodejs

```
npm install mongo
npm install mongoose
```

见 `db_connect_object.js`

[demo](http://www.cnblogs.com/zhongweiv/p/node_mongodb.html#node_mongodb)

`db,Admin,Collection,Cursor`对象

`atomically:findAndModify()/findAndRemove()`

`upsert()/save()/remove()`

mongo可以直接执行js :`generate_data.js`

count / limit

`aggregate([{$match:{tasdf:X"}},{$group:{asdf:"agqwe",sdfo:{$sum:"agqwe"}}}])` //mapreduce? 聚合

mongoose结构化模式与验证 

`mongoose/schema/query/Document`

`mongoose_find.js/_create.js/_save/_update_one`

`***.validate(function(value){;})`

中间件

`pre/post`

mongoDB高级

ensureIndex /MongoClient

分片集群等等 GridFS/GridStore

修复 备份

### angularjs
 
 数据绑定，可扩展性，整洁，可重用，整洁，支持，兼容性

MVC

`node_server.js`simple demo

专有对象提供器`animation,controller,filter,directive`

服务提供器`value,constant,factory,service,provider`

注入`21 injector.js`

作用域+`广播emit/broadcast/on`->`event`的属性`targetScope/currentScope/name/stopPropagation/preventDefault/defaultPrevented`

`ng-model,data-ng-model,x-ng:model,ng_model` 都被规范化为`ngModel`

内置过滤器`currency,filter:exp:compare,json,limitTo:limit,lowercase,uppercase,number[:fraction],orderBy:exp:reverse,date[:format]`

DIY过滤器
```
angular.module(***).filter('fff',function(){return function(leftinput,argument){return result;}})
controller('aController',['$scope','fffFilter',function($scope,fffFilter){
	;//直接在html上用 或者 用作函数也行
}])
```

支持AngularJS模板功能的指令/表单 P411-419

24`directive_custom.js/html`

 * `template`允许你定义插入指令的元素的AngularJS模板
 * `templateUrl`同上但是是url
 * `restrict`允许你指定该指令 `A`属性名`E`元素名`C`类名
 * `replace`取代元素
 * `transclude`内部是否可以访问内部作用域以外的作用域
 * `scope`指定内部作用域，`{}`隔离 `@funcname`/`@` 绑定到DOM `=` 双向绑定 `&` 局部绑定到指定scope
 * `link`指定 作用域 DOM元素 和其它能操作DOM属性的链接函数
 * `controller`
 * `require`所需要的其它指令

内置常用服务

`animate(css),cacheFactory,compile,cookies,document,http,interval,locale,location,resource,rootElement,rootScope,route,sce,templateCache,timeout/interval,window.alert,`

`$http` 请求`delete/get/head/jsonp/post/put`

26章完整登陆注册验证实例

社交媒体账户作为身份验证来源 `npm install passport/passport-google/passport-facebook/passport-twitter` 已验证后的序列化和反序列化 `google_auth.js`

27定义评论回复照片和页面模型 /mongoose model schema的应用 更复杂的控制实现 和 angularJS的service应用/

28购物车 mongoose model schema的应用

建议的代码文件结构方式,代码编码顺序[bg(node)/view(html[css])/fg(angularJS)]

29 选项卡 天气服务 可拖动组件 交互表格数据

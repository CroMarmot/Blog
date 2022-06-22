---
title: javaforwebapplications 笔记
date: 2017-04-26 11:20:14
tags: [java]
category: [code,backend, java]
---

该书版本2015.06

**基于个人已有知识整理 低分享价值**

# 章节

 1. java 是什么 java web是什么
 2. 各种java web容器 以及IDE的使用
 3. Servlet without jsp
 4. basic jsp syntax ,jsp 和servlet 在server端的互相forward
 5. cookie/session 以及相关安全知识
 6. jsp 表达式语句 $,#
 7. jsp 标签库 c fmt fn x sql
 8. jsp 自定义标签与函数库 .tag .tld
 9. 过滤器 (日志 验证 压缩加密 错误处理)
10. WebSocket 进行交互 (ajax,adobe flash等 各类访问 的设计) 在线对战井字棋 集群
11. 日志监控
12. Spring
13.
14.
15.
16.
17.
18.
19.
20.
21.
22.
23.
24.
25.
26.
27.
28.

# Source code

[Here](https://github.com/YeXiaoRain/Professional-Java-for-Web-Applications)

# 相关

[runnoob jsp](http://www.runoob.com/jsp)

# tomcat 个人理解

和php+apache类似

遇到请求是jsp则找jsp

如果是其它url则根据`/WEB-INF/web.xml`的servlet配置去找对应的class (这些都没有main函数 继承自HttpServlet)

配置web.xml也可以用java 的@WebServlet注解代替

# 依赖

`sudo apt-get install default-jdk idea tomcat8`

把个人用户添加到tomcat8的组里[???必要么]

# servlet

文件上传 @MultipartConfig()


```java
@MultipartConfig(
        fileSizeThreshold = 5_242_880,//小于5MB保存在内存中
        maxFileSize = 20_231L ,       //5~20MB保存在location(可设置 不设置则java默认)
        maxRequestSize = 41_943_040L  //拒绝>20MB文件 或 >40MB请求
)
```

通过request.getParameter("action")来判断 是要 请求 上传 下载 还是什么操作(下载需要注意设置返回头)

request.getPart("file1")来接受上传的文件

# jsp

<%@ 指令 %>  例如说明文档 类型 引入依赖等
<% page  %>
<% include  %>
<% taglib  %>
<%! 声明 %>  如声明定义变量 函数
<% 脚本 %>   赋值运算 貌似也可以在这里声明
<%= 表达式 %>运算
<%-- 注释 --%>运算

表达式语句保留字 true false null instanceof empty div mod and or not eq ne lt gt le ge

表达式 的流处理 以及lambda

java 标准标签库规范的5个标签库 c 核心,fmt 格式化, fn 函数, sql, x XML

```jsp
<%@ taglib prefix="c" uri="https://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="https://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="https://java.sun.com/jsp/jstl/fn" %>
<%@ taglib prefix="sql" uri="https://java.sun.com/jsp/jstl/sql" %>
<%@ taglib prefix="x" uri="https://java.sun.com/jsp/jstl/x" %>


<c:out value="${exp}" default="value is null">
<c:out value="${exp}">value is null</c:out>

<c:url value="http://....../today.jsp">
  <c:param name="story" value="${storyId}">
  <c:param name="seo" value="${seoString}">
</c:url>

<c:if test=>
balabala
</c:if>
c:choose c:when c:otherwise c:forEach c:forTokens c:redirect c:import c:set c:remove

fmt:message fmt:setLocale fmt:bundle fmt:setBundle fmt:requestEncoding fmt:timeZone fmt:setTimeZone fmt:formatDate fmt:parseDate fmt:formatNumber fmt:parseNumber
对应还有i18n的配置

(不推荐)sql:transaction sql:update sql:param sql:dateParam sql:query

(x 命名空间)
```

# 过滤器

继承Filter 重写函数doFilter init destroy，通过chain.doFilter向下传递

也可以在java内用代码配置 FilterGegistration

因为排序问题请勿使用注解来配置过滤器 (URL映射优先级 > Servlet映射)

`filter-mapping`可以用 不同方式配置 需要过滤的链接

```xml
<filter>
  <filter-name>myf</filter-name>
  <filter-class>com.wrox.fff</filter-class>
</filter>
<filter-mapping>
    <filter-name>myf</filter-name>
    <url-pattern>/foo</url-pattern>
    <servlet-name>ticketServlet</servlet-name>
</filter-mapping>
```

压缩过滤器extends HttpServletResponnseWrapper

# WebSocket

会使用443(wss)端口 以及Http/1.1中的 Connection:Upgrade

HTTP开始 然后用TCP连接的WebSocket交流

```javascript
var connection = new WebSocket('ws://www.example.net/safsd');
var connection = new WebSocket('wss://secure.example.net/safsd');
var connection = new WebSocket('ws://www.example.net/safsd','asdf');
var connection = new WebSocket('ws://www.example.net/safsd',{'wer','qwef'});

if(connection.readyState == WebServlet.OPEN){qwer;}


connection.onopen = function(event){}
connection.onclose = function(event){}
connection.onerror = function(event){}
connection.onmessag = function(event){}
```

利用WebSocket可以实现 在线对战游戏 比如 井字棋

Server:

session来记录用户

`@ServerEndpoint("/ticTacToe/{gameId}/{username}")`

`onOpen()`

`onMessage()`

`onClose()`

发送消息

`session.getBasicRemote().sendText(ttttteeeeexxxxxttttt)`以及 close的另外的函数

前端js

上面的`new WebSocket(*)`和`on*` + `server.send`

---

用WebSocket 做集群

@ClientEndpoint

`ClusterMessage`

做用户端的 extends HttpServlet

# 日志监控

maven -> `org.apache.logging.log4j` -> `log4j-api/log4j-core/...` 

`System.err.println/Sytem.out.println`并不完美 因为它们永远启用 并在代码中

要记录的内容:错误/警告/错误类型/栈/JVM状态/一些需要审核的事的记录 比如医院

记录方法:普通的println/平面日志/XML/JSON/ linux的syslog/套接字/SMTP SMS/DB

分级:重要性 n MB/s的日志 = 无日志 ,例如`java.util.logging.Level`分类 (也有其它分类 如apache的不同级别)

* 致命/崩溃 无常量
* 错误 SEVERE
* 警告 WARNING
* 信息 INFO
* 配置细节 CONFIG
* 调试 FINE
* 追踪1/2 FINER FINEST

通过 `java.util.logging.LogManager`解耦合，注意日志必要性和性能影响的权衡

框架 log4j,slf4j,logback,log4j2

log4j2的 记录器(),日志储存器,布局,过滤器

log4j2将寻找 `log4j2`或`log4j2-test`支持的扩展类型有`.xml`,`.json`和`.jsn`

# Spring framework





# 其它

java编译后 单个实现不能超过65535个字节=.=..........

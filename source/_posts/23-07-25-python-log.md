---
title: Python3 logging best? practice
date: 2023-07-25
category: [python3]
tags: [python3,logging]
description: python3 logging 最佳实践
---

众所周知, 常用的输出有print,而调bug有logging, 用起来就是 info/debug/warning/error

但还有一些常见的问题

- 在命令行输出一些,在日志文件输出一些,两边等级和格式不同
- 希望日至记录 时间/文件/输出的行数/上下文
- 直接使用的软件的logging 和 库的logging有什么不同
- 想重定向所用的库的logging, 调整库的logging的等级是否可行

<!--more-->

## 实践

常见的命令行工具的交互是 stdout, 而"没有用"的额外信息是stderr, logging默认就是到他stderr很好

---

首先层级 有 print, 和logging的info/warning/error,exception/critical

---

通过format参数进行格式 控制, 这里可以查到 所有可选参数 https://docs.python.org/3.10/library/logging.html#logrecord-attributes

```python
# 例子
logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s][%(name)s %(levelname)s][%(threadName)s][%(filename)s %(funcName)s %(lineno)d]:%(message)s')
```

![logging flow](https://docs.python.org/3.10/_images/logging_flow.png)


常用 Logger.setLevel/addHandler/addFilter

getLogger, 以 `.`分割的 层级名称, 如果子层级logger没有设定level则会向父级别找

有用的Handlers: https://docs.python.org/3.10/howto/logging.html#useful-handlers 例如StreamHandler 和FileHandler

对于 多线程,日志大,可以考虑rotatingFilehandler/timedrotatingFilehandler

对于 多进程, sockethanlder+日志收集服务器 / datagramhandler

---

cookbook 建议的是对于同一个代码中

顶层 `logger = logging.getLogger('spam_application')`

辅助的module是 `module_logger = logging.getLogger('spam_application.auxiliary')`

这样只需要在顶层的`logger`上addHandler增加想要的handler即可

---

flask 采用的是 根据传递的app.name 来作为logging.getLogger的key

所以类似的, 作为纯函数库,可以考虑传递名称,或者传递logger

```python
#: Log messages to :func:`~flask.logging.wsgi_errors_stream` with the format
#: ``[%(asctime)s] %(levelname)s in %(module)s: %(message)s``.
default_handler = logging.StreamHandler(wsgi_errors_stream)  # type: ignore
default_handler.setFormatter(
    logging.Formatter("[%(asctime)s] %(levelname)s in %(module)s: %(message)s")
)

def create_logger(app: Flask) -> logging.Logger:
    """Get the Flask app's logger and configure it if needed.

    The logger name will be the same as
    :attr:`app.import_name <flask.Flask.name>`.

    When :attr:`~flask.Flask.debug` is enabled, set the logger level to
    :data:`logging.DEBUG` if it is not set.

    If there is no handler for the logger's effective level, add a
    :class:`~logging.StreamHandler` for
    :func:`~flask.logging.wsgi_errors_stream` with a basic format.
    """
    logger = logging.getLogger(app.name)

    if app.debug and not logger.level:
        logger.setLevel(logging.DEBUG)

    if not has_level_handler(logger):
        logger.addHandler(default_handler)

    return logger
```

---

回到最初的问题

- 在命令行输出一些,在日志文件输出一些,两边等级和格式不同: 通过多个handler解决
- 希望日至记录 时间/文件/输出的行数/上下文: 通过format解决
- 直接使用的软件的logging 和 库的logging有什么不同: 软件的一般会指定basicConfig或者顶层的handler, 而库的一般通过调用者传递logger的name,可以库自己配一些logger
- 想重定向所用的库的logging, 调整库的logging的等级是否可行: 需要库支持logger name传递,然后利用logging本身提供的 点分割层级,控制顶层即可
 
## 参考

https://docs.python.org/3.10/howto/logging.html

https://docs.python.org/3.10/howto/logging-cookbook.html

https://github.com/pallets/flask/blob/main/src/flask/logging.py
---
title: python3 setuptools 发包
date: 2022-07-23
tags: [python3, setuptools]
category: [backend,python3]
---

# Step by Step

install build

```
pip install --upgrade build
```

## 基础使用

提供`pyproject.toml`文件, 包含`build-system` section

``` 例子
[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "yourname-packagename"
version = "0.0.1"
dependencies = [
    "requests",
]
```

描述依赖的library 和library中被实际用到的

除此以外, 还可以提供`metadata, contents, dependencies` 等描述, (老式的配置在`setup.py / setup.cfg`中

`pyproject.toml` 可选配置参数 https://setuptools.pypa.io/en/stable/userguide/pyproject_config.html

---

目前来说`pip` 仍然需要 setup.py 来支持可编辑安装

`setup.py` 一个简单版本

```py
from setuptools import setup

setup()
```

---

至此 执行

```
python -m
```

就可以打包了

打包输出到dist文件夹, 会产生tar.gz 和whl文件

## 常用概览

** 以下均是 `pyproject.toml`的配置, 如果需要setup.cfg/setup.py 的配置方法, 在 https://setuptools.pypa.io/en/stable/userguide/quickstart.html 上阅读 **

### 打包发现

简单的项目, `setuptools` 可以自动检测所有 packges 和 namespaces

但对于复杂的来说, 哪些需要被打包, 哪些不需要被打包, 无法自动分别, 可以通过自定义配置

默认

```toml
[tool.setuptools.packages]
find = {}  # Scan the project directory with the default parameters
```

指定 文件夹, 包含 和 不包含

```toml
[tool.setuptools.packages.find]
where = ["src"]  # ["."] by default
include = ["mypackage*"]  # ["*"] by default
exclude = ["mypackage.tests*"]  # empty by default
namespaces = false  # true by default
```

### 命令行提供

如果你的包, 期望安装完后, 能直接有个命令行工具

```toml
[project.scripts]
cli-name = "mypkg.mymodule:some_func"
```

`cli-name` 就是你期望的工具的名称

后面一截对应你编写的某个 脚本文件 `mypkg/mymodule.py`

### 依赖管理

你的工具 运行时 依赖于其它工具

```toml
[project]
# ...
dependencies = [
    "docutils",
    "requires <= 0.4",
]
```

### 包含Data Files

```toml
[tool.setuptools]
include-package-data = true
# 如果使用pyproject.toml默认就是true
# 可以通过`include-package-data = false` 关闭
```

会自动包含所有在 `MANIFEST.in` 中声名的Data Files

### 开发模式

通过链接形式把你开发中的包 安装到你要用的地方

在本地其它项目中预先使用包进行调试

```
pip install --editable <你的包的路径>
```

### 打包文件以外的项目结构

https://packaging.python.org/en/latest/tutorials/packaging-projects/

```toml
packaging_tutorial/
├── LICENSE
├── pyproject.toml
├── README.md
├── src/
│   └── example_package_YOUR_USERNAME_HERE/
│       ├── __init__.py
│       └── example.py
└── tests/
```

文件`example.py`内容:

```py
def add_one(number):
    return number + 1
```


## Twine 发布

https://twine.readthedocs.io/en/stable/

安装

```
pip install twine
```

`build`打包以后

为了避免真的传上去出问题,可以先传到[Test PyPI](https://packaging.python.org/en/latest/guides/using-testpypi/)

```
twine upload -r testpypi dist/*
```

测试

```
python3 -m pip install --index-url https://test.pypi.org/simple/ your-package
```

真实发布到`PyPI`

```
twine upload dist/*
```

发布前登录`twine register`


# 参考

https://setuptools.pypa.io/en/stable/userguide/quickstart.html

https://packaging.python.org/en/latest/tutorials/packaging-projects/

包的下载量统计

https://pepy.tech/

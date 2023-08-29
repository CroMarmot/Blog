---
title: ubuntu + pip + setuptool bug 体验
date: 2022-09-08
tags: [backend,python3,pip,setuptool]
category: [backend, python3]
---

# 第一次被pip搞了几个小时

壮着胆子,在Ubuntu 22.10还没发布前,把系统从20.04.5升级到了22.04.1, 以我从12->14,14->16,16->18,18->20多年的经验来看, 这次竟然没问题! 厉害了, 以前每次升级都会炸点东西, 然后最终还是重装式升级, 这次竟然没啥严重的炸掉

然后`pip3 install -e .`出问题了

先是报没权限,但看报的路径,没往用户目录下写,在写root, 作为一个胆小的人, 向来杜绝777的

翻了半天google和github

看到一个[方案](https://github.com/pypa/pip/issues/7953#issuecomment-645133255):`setup.py`中加上

```
import site
import sys
site.ENABLE_USER_SITE = "--user" in sys.argv[1:]
```

加完以后, 恩 是没有问题了

然后报错

```
    × python setup.py develop did not run successfully.
    │ exit code: 1
    ╰─> [29 lines of output]
        running develop
        /usr/lib/python3/dist-packages/setuptools/command/easy_install.py:158: EasyInstallDeprecationWarning: easy_install command is deprecated. Use build and pip and other standards-based tools.
          warnings.warn(
        Traceback (most recent call last):
          File "<string>", line 2, in <module>
          File "<pip-setuptools-caller>", line 34, in <module>
          File "/home/cromarmot/Documents/computer/oiTerminalv2dev/setup.py", line 6, in <module>
            setup()
          File "/usr/lib/python3/dist-packages/setuptools/__init__.py", line 153, in setup
            return distutils.core.setup(**attrs)
          File "/usr/lib/python3/dist-packages/setuptools/_distutils/core.py", line 148, in setup
            return run_commands(dist)
          File "/usr/lib/python3/dist-packages/setuptools/_distutils/core.py", line 163, in run_commands
            dist.run_commands()
          File "/usr/lib/python3/dist-packages/setuptools/_distutils/dist.py", line 967, in run_commands
            self.run_command(cmd)
          File "/usr/lib/python3/dist-packages/setuptools/_distutils/dist.py", line 985, in run_command
            cmd_obj.ensure_finalized()
          File "/usr/lib/python3/dist-packages/setuptools/_distutils/cmd.py", line 107, in ensure_finalized
            self.finalize_options()
          File "/usr/lib/python3/dist-packages/setuptools/command/develop.py", line 52, in finalize_options
            easy_install.finalize_options(self)
          File "/usr/lib/python3/dist-packages/setuptools/command/easy_install.py", line 270, in finalize_options
            self._fix_install_dir_for_user_site()
          File "/usr/lib/python3/dist-packages/setuptools/command/easy_install.py", line 400, in _fix_install_dir_for_user_site
            self.select_scheme(scheme_name)
          File "/usr/lib/python3/dist-packages/setuptools/command/easy_install.py", line 741, in select_scheme
            scheme = INSTALL_SCHEMES[name]
        KeyError: 'unix_user'
        [end of output]
```

又搜,发现的确是setuptools有bug,然后[60.0.2修复了](https://github.com/pypa/setuptools/issues/2938#issuecomment-998293346)

<!--more-->

我看了下`pip3 list | grep setuptools`, 版本是59

升级了一下到65 依然不行

而且上面的所有操作前后,只要是`venv`里,就没问题

又搜了半天,一个发现是,似乎大家都是ubuntu

---

另一问题是我注意到名称是UNKNOWN, 就去搜了下这个UNKNOWN

后来看到[这个issue](https://github.com/pypa/setuptools/issues/3269#issuecomment-1100426325)

还学到了一下py隔离环境快速搭建和测试, 她似乎也是[venv可以但是外面不行](https://github.com/pypa/setuptools/issues/3269#issuecomment-1100434792)

然后我也跟着清理了一下dist和egg-info 都没用, 说查看pip, 我看了pip也是都是2.22.2

老哥说 可能是 [pypa/pip#6264 (comment)](https://github.com/pypa/pip/issues/6264#issuecomment-1086882745)

也就是debian提供的

让升级一下`/usr/local/lib/python3.10/dist-packages/setuptools`

然后,她通过把系统的`setuptools`给卸载了就好了

```
sudo apt purge python3-setuptools
```

## 问题总结

这样看起来是 setuptools 实际写了bug

然后ubuntu目前apt里版本就正好是有bug的

然后pip list的setuptools版本, 和执行install的版本竟然不一样???????

这真是搞锤子

看看linux的whereis which 都教了你们如何对多个公共同名的做处理的, 竟然pip还能有这个锅, 就离谱

然后删除以后,连setup.py里加东西也不需要了

## 学一手 py 隔离环境测试

虽然我一般习惯是用venv

---

本机+virtualenv

```bash
cd /tmp
git clone https://github.com/nschloe/setuptools-UNKNOWN-bug.git
cd setuptools-UNKNOWN-bug

virtualenv -p python3.10 .venv
.venv/bin/python -m pip install .

---

docker

> docker run --rm -it python:3.10-bullseye /bin/bash

cd /tmp
git clone https://github.com/nschloe/setuptools-UNKNOWN-bug.git
cd setuptools-UNKNOWN-bug
pip install .
```



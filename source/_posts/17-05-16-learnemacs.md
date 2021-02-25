---
title: emacs 笔记
date: 2017-05-16 11:20:14
tags: [code,emacs]
category: [ide]
---

突然无聊 学学emacs [该记录用vim编写]

交换

`setxkbmap -option "ctrl:swapcaps"`

```
显示行号
M-x linum-mode
```

```
                 M-v
                 C-p
                  |
M-a C-a M-b C-b Cursor C-f M-f C-e M-e
                  |
                 C-n
                 C-v
取消 操作 C-g
退出     C-x C-c
剪切 删除 C-d
         C-k
粘贴      C-y
撤销      C-x u
         C-/
         C-_
```

# 文件


```
打开 C-x C-f
保存 C-x C-s
    C-x C-w : save file as

保存多个缓存区 C-x s

显示缓冲区 C-x C-b

切换缓存区 C-x b

关闭其它所有窗格 只保留一个
C-x 1
```

---

```
文字替换      M-x repl s<Return>src<Return>dst<Resturn>
恢复自动保存的 M-x recover

切换模式
    M-x fundamental-mode (主模式)
    M-x text-mode (文本模式)
    M-x auto-fill-mode (自动 折 行 模式) C-u 20 C-x f 设置折叠字符数为20
    M-q 手动折叠行

查看主模式的文档 C-h m

搜索 C-s
在搜索中再按C-s可以往后搜索 C-r 与之搜索方向相反

C-x 2 上下分割窗口
C-x 3 左右

C-M-v下别的移动 C-M-S-v上移动
切换到其它窗口 C-x o

打开文件 并跳过去
C-x 4 C-f 上下
`

```
显示行号
M-x linum-mode
```

```
                 M-v
                 C-p
                  |
M-a C-a M-b C-b Cursor C-f M-f C-e M-e
                  |
                 C-n
                 C-v
取消 操作 C-g
退出     C-x C-c
剪切 删除 C-d
         C-k
粘贴      C-y
撤销      C-x u
         C-/
         C-_
```

# 文件


```
打开 C-x C-f
保存 C-x C-s
    C-x C-w : save file as

保存多个缓存区 C-x s

显示缓冲区 C-x C-b

切换缓存区 C-x b

关闭其它所有窗格 只保留一个
C-x 1
```

---

```
文字替换      M-x repl s<Return>src<Return>dst<Resturn>
恢复自动保存的 M-x recover

切换模式
    M-x fundamental-mode (主模式)
    M-x text-mode (文本模式)
    M-x auto-fill-mode (自动 折 行 模式) C-u 20 C-x f 设置折叠字符数为20
    M-q 手动折叠行

查看主模式的文档 C-h m

搜索 C-s
在搜索中再按C-s可以往后搜索 C-r 与之搜索方向相反

C-x 2 上下分割窗口
C-x 3 左右

C-M-v下别的移动 C-M-S-v上移动
切换到其它窗口 C-x o

打开文件 并跳过去
C-x 4 C-f 上下
```

=.= 已经基本放弃了 继续vim


---
title: python3 依赖注入
date: 2025-04-27
tags:
  - python3 
  - fastapi
category:
  - backend
description: python3 依赖注入
---

# 前言

当我发现几百条荣耀笔记，只能在手机上看时，我感觉吃屎了一样，用了一段时间nextcloud notes还是挺不错，看看有没有其它方案
- 不用荣耀h电脑（狗屎应用不在荣耀电脑上不给运行，网页版也没有）
- 还意味着绑定了品牌, 没有批量导出

## TLDR

轻量碎片: nextcloud notes

## 需求

目标：碎片想法所以对手机支持有一定需求 分类tag/category(层级的)也是一个需求
- 因为更大的整理，目前采用是obsidian的本地存储（有的obsidian的体验还不如vscode+markdown插件），hexo+gh-pages的在线内容，同一个文件夹都是markdown支持了

功能需求：
- 时间戳
- 文本最好markdown+
- 小文件上传(图片类), 用得也不多
- docker（或者其它一键的部署方案）
- 导出(虽然 selfhost 持有了数据，但是当未来想进一步处理时，没有导出还是难受的)
- 二次编辑
- tag/category 需要有个查看所有未分类的功能
- 搜索
- 手机app 需要能支持离线写，连上局域网时再同步，因为不想server暴露到公网里
- 额外:
  - tex(大多数时候用不到tex)
  - 支持api
  - telegram bot

不需要的：富文本编辑，表格等


## selfhosted

nextcloud notes:
- https://apps.nextcloud.com/apps/notes
- 不支持tex
- 支持单层category 没有tag

memos: https://www.usememos.com/docs
- 支持tag 没有支持category, 不能查看所有未分类
- 额外支持贴代码好像没啥用
- 多平台: https://www.usememos.com/docs/contribution/community 
  - android https://memos.moe/ 测了一下不支持离线创建, 然后手机端没支持tex渲染，那我有网了 为啥不直接网页版呢?
- 没有直接导出功能，不过看起来用得的sqlite，可以拿到可操作的源数据 https://github.com/usememos/memos/issues/778
  - 它配置可以选择: 数据库，文件系统，S3

standard notes: 
- https://github.com/standardnotes/server
- 有些功能是付费的，而不是存储是付费的
- android 不知道为啥能访问电脑的url，但是登录报错 failed to fetch ？？？？？ 不应该啊, 放弃,(确定不是网络问题)

joplin: https://github.com/laurent22/joplin/
- 看起来 也是高star 大量用户的, 几乎full featured的, 以支持比较重的场景
- 有tag category(笔记本)
- 支持selfhosted 它同时也有官方的付费方案支持
- 它还支持 nextcloud !!!
- 手机app是离线支持+full featured的
- 有docker compose看起来能一键 https://github.com/tborychowski/self-hosted-cookbook/blob/master/apps/notes/joplin.md

Trilium Notes:
- 有tree folder好评
- 也是full featured
- 看了下似乎是nodejs+什么前端写的，所以桌面版，和docker网页版是一样的
- 停止维护了

siyuan:
- https://github.com/siyuan-note
- 这名字就很国产, 很好关键部分也是开源依赖(官方README.md 里面有相关的表)
- tree folder!
- docker 一键启动
- 看起来没有开箱即用的 android - 服务 同步方案

logseq(劝退,还不如obsidian)

## 非selfhosted

阿里云盘

百度云盘(文本还行，图片类下载速度不行)

印象笔记（这玩意是不是要倒闭了都）

## ActivityPub

这里面 就更多的用户之间的了大多是不需要的

https://www.w3.org/TR/activitypub/

https://w3c.wholetrans.org/activitypub/#social-web-working-group
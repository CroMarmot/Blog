---
title: Hexo Static Blog in 2022
date: 2022-08-15
tags: [frontend,static blog]
category: [framework, blog]
mathjax: true
---

# 写在 2022 年的 静态博客选择

## 调研

用了Hexo很久了,期间也有不少其它产品, 也试了试这些框架

对于我, 核心需求是markdown + code高亮 + tex + rss支持, 操作期望是0代码, 可以简单yaml配置,和复制配置的配置行为, 然后有个基本不错的theme, 最好能支持二进制分页

毕竟主要产出在markdown而不是搭建

目前看起来有一些解决方案

> vuepress

下载和声量很高, 然而光是跟着tutorial走,建立目录就需要重启server,图片不存在就整个页面渲染失败, 加上github issue 对询问者态度差, 连基本的本地热更都做不好, 直接tutorial都没走完就抛弃了

> ngx-markdown

本身不是博客解决方案, 只是angular的一个lib, 但是上手很容易, 从0到code+tex渲染支持成功, 不到10min就架好了, 看起来有写代码,实际上都是官方readme里的内容复制来就能用了. 然后暂时没找rss,以及如果想做 tags等,列表等最终还是需要编码, 还是放弃了

> 11ty

看起来十分轻量, 而且目测核心也是做静态网站的, 这个我对它还是很抱期望的, 目前问题是, 你要用得自己写网页, 没看到不错的blog的theme模板, 感觉未来做一些static的时候可能会考虑它

> Gatsby/Next/Nuxt

都需要code, 而且是for 静态网站 而 不只是静态博客, 所以也没有直接针对性的东西, 配置起来比angular难了太多

> hugo

这个很倾向, 看到有基于这个做的 < 150 行代码 的 支持code + tex的theme很不错 https://github.com/yihui/hugo-xmin , 有个我本地的小问题是, hugo官方只给了基于homebrew的安装, 没有apt/pip/npm 之类的安装, 我本地linux, 为了一个hugo去装个homebrew让我还是有点不能接受, 如果mac的话应该就很好了, 以及我看oi-wiki 就是基于hugo搭建的

> hexo

很老的一个了,之前一直用的, 缺点是感觉有点渐渐年久失修了(大版本到更新了不少), 文档有点对不上代码了, 没法"升级", 但是可以新建一个然后移动所有markdown , 外加本身有支持 tex, code高亮, rss以及二进制翻页i的插件

比如 现在已经version 6 了, 然后官方 https://hexo.io/docs/setup 的package.json 还在 `"hexo": "^3.8.0"`, (其实我本地的还真就3.8.0), 然后几个star很多和我之前用的theme 已经很久没有更新维护了,(虽然好像也真不需要多少维护

---

总的来说, 0代码 + tex + code 高亮 + rss, 目前看起来就, hugo/hexo, 当然需要去找个喜欢的theme, 小改一下

以及一些在线方案比如博客园,简书,csdn等等, 但这些有我完全不能接受的问题, 无法直接git管理, 则导致 一旦出现文章禁封和平台故障, 内容说没就没, 当然这有些解决方案, 但只能把它们作为输出端, 可以做点python脚本, git 管理的内容自动发送到这些平台

## Hexo 6 + theme-next-docs

### 初始化

```bash
yarn global add hexo-cli
hexo init <folder> && cd <folder>
yarn
git clone https://github.com/next-theme/hexo-theme-next themes/next --depth=1
```

```diff _config.yml
-theme: landscape
+theme: next
```

预览

```bash
hexo s
```

生成静态文件

```bash
hexo g
```

### 数学tex支持(MathJax)

https://theme-next.js.org/docs/third-party-services/math-equations.html?highlight=katex

```bash
yarn remove hexo-renderer-marked
yarn add hexo-renderer-pandoc
```


```diff theme/next/_config.yml
 math:
   # Default (false) will load mathjax / katex script on demand.
   # That is it only render those page which has `mathjax: true` in front-matter.
   # If you set it to true, it will load mathjax / katex script EVERY PAGE.
-  every_page: false
+  every_page: true

   mathjax:
-    enable: false
+    enable: true
```

简单测试是否成功,`source/_posts/hello-world.md`

```tex
$\pi \gamma^x \int_{i=0}^1 dx$
```

### 本地搜索支持

```
yarn add hexo-generator-searchdb
```

```diff _config.yml
+search:
+  path: search.xml
+  field: post
+  content: true
+  format: html
```

```diff theme/next/_config.yml
 local_search:
-  enable: false
+  enable: true
```

### Disqus 评论支持


```diff theme/next/_config.yml
 # Disqus
 # For more information: https://disqus.com
 disqus:
-  enable: false
-  shortname:
+  enable: true
+  shortname: cromarmot
```

### RSS 支持

```bash
yarn add hexo-generator-feed
```


```diff _config.yml
+feed:
+  enable: true
+  type: atom
+  path: atom.xml
+  limit: 20
+  hub:
+  content:
+  content_limit: 140
+  content_limit_delim: ' '
+  order_by: -date
+  icon: icon.png
+  autodiscovery: true
+  template:
```

### 字数统计

```bash
yarn add hexo-word-counter
```

```diff _config.yml
symbols_count_time:
  symbols: true
  time: true
  total_symbols: true
  total_time: true
  exclude_codeblock: false
  awl: 4
  wpm: 275
  suffix: "mins."
```

### 二进制分页

```
yarn add hexo-bin-pagination
```

### 杂项


```diff _config.yml
index 3bc8a42..0599fdd 100644
--- a/_config.yml
+++ b/_config.yml
@@ -3,18 +3,19 @@
 ## Source: https://github.com/hexojs/hexo/
 
 # Site
-title: Hexo
+title: "Cro-Marmot's Blog"
 subtitle: ''
 description: ''
 keywords:
-author: John Doe
-language: en
-timezone: ''
+author: 'Cro-Marmot'
+language: 'zh-TW'
+timezone: 'Asia/Shanghai'
 
 # URL
 ## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'
-url: http://example.com
-permalink: :year/:month/:day/:title/
+url: https://cromarmot.github.io/Blog
+root: /Blog/
+permalink: :title/
 permalink_defaults:
 pretty_urls:
   trailing_index: true # Set to false to remove trailing 'index.html' from permalinks
@@ -62,7 +63,7 @@ prismjs:
 # order_by: Posts order. (Order by date descending by default)
 index_generator:
   path: ''
-  per_page: 10
+  per_page: 5
   order_by: -date
 
 # Category & Tag
```

```diff themes/next/_config.yml
@@ -67,7 +67,7 @@ creative_commons:
   # Available values: big | small
   size: small
   sidebar: false
-  post: false
+  post: true
   # You can set a language value if you prefer a translated version of CC license, e.g. deed.zh
   # CC licenses are available in 39 languages, you can find the specific and correct abbreviation you need on https://creativecommons.org
   language:
@@ -95,11 +95,12 @@ open_graph:
 # Value before `||` delimiter is the target link, value after `||` delimiter is the name of Font Awesome icon.
 # External url should start with http:// or https://
 menu:
-  #home: / || fa fa-home
+  home: / || fa fa-home
+  archives: /archives/ || fa fa-archive
+  rss: /atom.xml || fa fa-rss
   #about: /about/ || fa fa-user
-  #tags: /tags/ || fa fa-tags
-  #categories: /categories/ || fa fa-th
-  #archives: /archives/ || fa fa-archive
+  categories: /categories/ || fa fa-th
+  tags: /tags/ || fa fa-tags
   #schedule: /schedule/ || fa fa-calendar
   #sitemap: /sitemap.xml || fa fa-sitemap
   #commonweal: /404/ || fa fa-heartbeat
@@ -107,7 +108,7 @@ menu:
 # Enable / Disable menu icons / item badges.
 menu_settings:
   icons: true
-  badges: false
+  badges: true
 
 
 # ---------------------------------------------------------------
@@ -117,8 +118,8 @@ menu_settings:
 
 sidebar:
   # Sidebar Position.
-  position: left
-  #position: right
+  #position: left
+  position: right
 
   # Manual define the sidebar width. If commented, will be default for:
   # Muse | Mist: 320
@@ -130,7 +131,7 @@ sidebar:
   #  - always  expand for all pages automatically.
   #  - hide    expand only when click on the sidebar toggle icon.
   #  - remove  totally remove sidebar including sidebar toggle.
-  display: post
+  display: hide
 
   # Sidebar padding in pixels.
   padding: 18
@@ -140,9 +141,9 @@ sidebar:
 # Sidebar Avatar
 avatar:
   # Replace the default image and set the url here.
-  url: #/images/avatar.gif
+  url: https://avatars.githubusercontent.com/u/24691835?v=4
   # If true, the avatar will be displayed in circle.
-  rounded: false
+  rounded: true
   # If true, the avatar will be rotated with the cursor.
   rotated: false
 
@@ -154,8 +155,8 @@ site_state: true
 # Key is the link label showing to end users.
 # Value before `||` delimiter is the target permalink, value after `||` delimiter is the name of Font Awesome icon.
 social:
-  #GitHub: https://github.com/yourname || fab fa-github
-  #E-Mail: mailto:yourname@gmail.com || fa fa-envelope
+  GitHub: https://github.com/cromarmot || fab fa-github
+  E-Mail: mailto:yexiaorain@gmail.com || fa fa-envelope
   #Weibo: https://weibo.com/yourname || fab fa-weibo
   #Google: https://plus.google.com/yourname || fab fa-google
   #Twitter: https://twitter.com/yourname || fab fa-twitter
@@ -178,7 +179,8 @@ links_settings:
   layout: block
 
 links:
-  #Title: https://example.com
+  AtCoder: https://atcoder.jp/users/cromarmot
+  Codeforces: https://codeforces.com/profile/Cro-Marmot
 
 # Table of Contents in the Sidebar
 # Front-matter variable (nonsupport wrap expand_all).
@@ -211,7 +213,7 @@ footer:
     # Icon name in Font Awesome. See: https://fontawesome.com/icons
     name: fa fa-heart
     # If you want to animate the icon, set it to true.
-    animated: false
+    animated: true
     # Change the color of icon, using Hex Code.
     color: "#ff0000"
 
@@ -261,7 +263,7 @@ symbols_count_time:
   item_text_total: false
 
 # Use icon instead of the symbol # to indicate the tag at the bottom of the post
-tag_icon: false
+tag_icon: true
 
 # Donate (Sponsor) settings
 # Front-matter variable (nonsupport animation).
@@ -288,7 +290,7 @@ follow_me:
 # Related popular posts
 # Dependencies: https://github.com/sergeyzwezdin/hexo-related-posts
 related_posts:
-  enable: false
+  enable: true
   title: # Custom header, leave empty to use the default one
   display_in_home: false
 
@@ -372,9 +374,9 @@ codeblock:
     dark: prism-dark
   # Add copy button on codeblock
   copy_button:
-    enable: false
+    enable: true
     # Available values: default | flat | mac
-    style:
+    style: flat
 
 back2top:
   enable: true
@@ -385,7 +387,7 @@ back2top:
 
 # Reading progress bar
 reading_progress:
-  enable: false
+  enable: true
   # Available values: left | right
   start_at: left
   # Available values: top | bottom
@@ -396,7 +398,7 @@ reading_progress:
 
 # Bookmark Support
 bookmark:
-  enable: false
+  enable: true
   # Customize the color of the bookmark.
   color: "#222"
   # If auto, save the reading progress when closing the page or clicking the bookmark-icon.
@@ -469,7 +471,7 @@ font:
 
 # If true, site-subtitle will be added to index page.
 # Remember to set up your site-subtitle in Hexo `_config.yml` (e.g. subtitle: Subtitle)
-index_with_subtitle: false
+index_with_subtitle: true
 
 # Automatically add external URL with Base64 encrypt & decrypt.
 exturl: false
@@ -531,11 +533,11 @@ fancybox: false
 # A JavaScript library for zooming images like Medium.
 # Warning: Do not enable both `fancybox` and `mediumzoom`.
 # For more information: https://medium-zoom.francoischalifour.com
-mediumzoom: false
+mediumzoom: true
 
 # Vanilla JavaScript plugin for lazyloading images.
 # For more information: https://apoorv.pro/lozad.js/demo/
-lazyload: false
+lazyload: true
 
 # Pangu Support
 # For more information: https://github.com/vinta/pangu.js
@@ -546,12 +548,12 @@ pangu: false
 # For more information: https://getquick.link
 # Front-matter variable (nonsupport home archive).
 quicklink:
-  enable: false
+  enable: true
 
   # Home page and archive page can be controlled through home and archive options below.
   # This configuration item is independent of `enable`.
   home: false
-  archive: false
+  archive: true
 
   # Default (true) will initialize quicklink after the load event fires.
   delay: true
```


#!/usr/bin/env sh

######################################################################
# @author      : cromarmot (yexiaorain@gmail.com)
# @file        : update
# @created     : 星期二 4月 23, 2019 14:41:11 CST
#
# @description : 
######################################################################

git add . && git commit -m "update" && git push origin gh-pages-dev
hexo g && cd public && git add . && git commit -m "update" && git push origin gh-pages && cd ../

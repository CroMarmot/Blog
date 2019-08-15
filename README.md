Blog
====

## INIT

> DOWNLOAD

`git clone git@github.com:CroMarmot/Blog.git -b gh-pages-dev`

> INSTALL DEP

`npm install`

> clone theme

`git clone https://github.com/theme-next/hexo-theme-next themes/next`

> repo for gh-pages

```
mkdir public
cd public
git add origin git@github.com:CroMarmot/Blog.git
git fetch
git checkout -b gh-pages origin/gh-pages
```

## USE

> local server

`hexo s`

> generate

`hexo g`

> update code & generate

`./update.sh`

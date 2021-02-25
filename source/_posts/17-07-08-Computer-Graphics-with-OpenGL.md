---
title: 计算机图形学个人整理
mathjax: true
date: 2017-07-08 01:01:01
categories: note
tags: [algorithm]
---

opengl自己的全以gl开头


识别图元，识别凹多边形，通过计算相邻边的叉积 来找到大于180°的角，再以此将凹多边形分割为多个凸多边形。

将凸多边形分割为多个三角形

内/外的判定，奇偶规则 或 非零环绕规则

多边形表 顶点表(x,y,z描述) 边表(用顶点描述) 面片表(用边描述)

× 平面方程与平面方程的求解 Ax+By+Cz+D=0, <0 在面的后面 >0在面的前面

绘制六边形`GL_POLYGON/GL_TRIANGLES/GL_TRIANGLES_STRIP/GL_TRIANGLES_FAN`的不同效果

四边形 `GL_QUAD/GL_QUAD_STRIP`

顶点数组 GLint points [NUM][3] ={ {0,0,0},{0,1,0}...}

glBitmap 位图函数


















---
title: 考研数学复习个人整理
mathjax: true
date: 2016-12-20 01:01:01
categories: daily
tags: [数学,考研]
---

<script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>

### 高数

术语：

第一类间断点：左右两侧 极限都存在

第二类间断点：左右两侧 至少有一个极限不存在

1拆2换3分部

$${\begin{matrix}\int {\frac  {1}{x}}\,{\mathrm  {d}}x=\ln \left|x\right|+C\end{matrix}}$$

$${\begin{matrix}\int a^{ {x}}\,{\mathrm  {d}}x={\frac  {a^{ {x}}}{\ln a}}+C\end{matrix}}$$

$${\displaystyle {\begin{matrix}\int \tan x\,\mathrm {d} x=\ln \left|\sec x\right|+C\end{matrix}}}$$

$${\begin{matrix}\int \cot x\,{\mathrm  {d}}x=\ln \left|\sin x\right|+C\end{matrix}}$$

$${\begin{matrix}\int \sec x\,{\mathrm  {d}}x=\ln \left|\sec x+\tan x\right|+C={\frac  {1}{2}}\ln \left|{\frac  {1+\sin x}{1-\sin x}}\right|+C\end{matrix}}$$

$${\begin{matrix}\int \csc x\,{\mathrm  {d}}x=\ln \left|\csc x-\cot x\right|+C={\frac  {1}{2}}\ln \left|{\frac  {1-\cos x}{1+\cos x}}\right|+C\end{matrix}}$$

$${\begin{matrix}\int \sec ^{ {2}}x\,{\mathrm  {d}}x=\tan x+C\end{matrix}}$$

$${\begin{matrix}\int \csc ^{ {2}}x\,{\mathrm  {d}}x=-\cot x+C\end{matrix}}$$

$${\begin{matrix}\int {\frac  {1}{ {\sqrt  {a^{2}-x^{2}}}}}\,{\mathrm  {d}}x=\arcsin {\frac  {x}{a}}+C\end{matrix}}$$

$${\begin{matrix}\int {\frac  {1}{a^{2}+x^{2}}}\,{\mathrm  {d}}x={\frac  {1}{a}}\arctan {\frac  {x}{a}}+C\end{matrix}}$$

$${\begin{matrix}\int {\frac  {1}{a^{2}-x^{2}}}\,{\mathrm  {d}}x={\frac  {1}{2a}}\ln |{\frac  {a+x}{a-x}}|+C\end{matrix}}$$

$${\begin{matrix}\int \operatorname {sinh}\,x\,{\mathrm  {d}}x=\operatorname {cosh}\,x\,+C\end{matrix}}$$

$${\begin{matrix}\int \operatorname {cosh}\,x\,{\mathrm  {d}}x=\operatorname {sinh}\,x\,+C\end{matrix}}$$

$${\begin{matrix}\int {\frac  1{ {\sqrt  {x^{2}+a^{2}}}}}{\mathrm  {d}}x=\operatorname {ln}(x+{\sqrt  {x^{2}+a^{2}}})+C\end{matrix}}$$

$${\begin{matrix}\int {\frac  1{ {\sqrt  {x^{2}-a^{2}}}}}{\mathrm  {d}}x=\operatorname {ln}|x+{\sqrt  {x^{2}-a^{2}}}|+C\end{matrix}}$$

$$\tan \frac{x}{2} = t$$

$$\int _{0}^{\frac {\pi }{2}}\sin ^{n}{x}\,dx=\int _{0}^{\frac {\pi }{2}}\cos ^{n}{x}\,dx={\frac {1\cdot 3\cdot 5\cdot \cdots \cdot (n-1)}{2\cdot 4\cdot 6\cdot \cdots \cdot n}}{\frac {\pi }{2}},$$

(if n is an even integer and n ≥ 2) 

$$\int _{0}^{\frac {\pi }{2}}\sin ^{n}{x}\,dx=\int _{0}^{\frac {\pi }{2}}\cos ^{n}{x}\,dx={\frac {2\cdot 4\cdot 6\cdot \cdots \cdot (n-1)}{3\cdot 5\cdot 7\cdot \cdots \cdot n}},$$

(if n is an odd integer and n ≥ 3)

$$\int _{ {-\infty}}^{ {\infty }}e^{-x^2}dx=\sqrt{\pi}$$

Q: 极坐标弧长公式

$$s=\int_a^b \sqrt {r^2(\theta)+r'^2(\theta)} d\theta $$

曲率

$$\kappa ={\frac  {|f''(x)|}{(1+f'^{2}(x))^{ {3/2}}}}={\frac  {|x'(t)y''(t)-x''(t)y'(t)|}{(x'^{2}(t)+y'^{2}(t))^{ {3/2}}}}$$

~~Q: 曲面为柱面~~

~~Q: 曲线积分~~

~~二维曲线积分~~

转动惯量

$$I = \sum_{i=1}^N {m_i r_i^2}$$

对于一个质点， $$ I=mr^2$$，其中 $$m$$是其质量， $$r$$ 是质点和转轴的垂直距离。

幂级数展开/麦克劳林展开/泰勒展开

$${\frac  {1}{1-x}}=\sum _{ {n=0}}^{\infty }x^{n}=1+x+x^{2}+x^{3}+\cdots ,|x|<1$$

$$e^{x}=\sum _{ {n=0}}^{\infty }{\frac  {x^{n}}{n!}}=1+x+{\frac  {x^{2}}{2!}}+{\frac  {x^{3}}{3!}}+\cdots $$

$$\sin(x)=\sum _{ {n=0}}^{\infty }{\frac  {(-1)^{n}x^{ {2n+1}}}{(2n+1)!}}=x-{\frac  {x^{3}}{3!}}+{\frac  {x^{5}}{5!}}-{\frac  {x^{7}}{7!}}+\cdots $$

$$\forall x\in [-1,1],\,\arctan \,x=\sum _{ {n=0}}^{ {+{\infty }}}(-1)^{n}\,{ {\frac  {x^{ {2\,n+1}}}{2\,n+1}}}\;$$

$$\forall x\in (-1,1],\,\ln(1+x)=\sum _{ {n=1}}^{ {+{\infty }}}(-1)^{ {n+1}}{x^{ {n}} \over {n}}.$$

$$\forall x\in \,(-1,1),\ \forall \alpha \,\not \in \,{\mathbb  {N}},\,(1+x)^{\alpha }\,=1\;+\;\sum _{ {n=1}}^{ {+{\infty }}}{ {\frac  {\alpha \,(\alpha -1)\cdots (\alpha -n+1)}{n!}}\,x^{n}}.$$

二元函数泰勒展开

傅里叶级数

$${\begin{aligned}s_{N}(x)&={\frac  {a_{0}}{2}}+\sum _{ {n=1}}^{N}\left(\overbrace {a_{n}}^{ {A_{n}\sin(\phi _{n})}}\cos({\tfrac  {2\pi nx}{P}})+\overbrace {b_{n}}^{ {A_{n}\cos(\phi _{n})}}\sin({\tfrac  {2\pi nx}{P}})\right)\\&=\sum _{ {n=-N}}^{N}c_{n}\cdot e^{ {i{\tfrac  {2\pi nx}{P}}}},\end{aligned}}$$

$$a_{n}={\frac  {2}{P}}\int _{ {x_{0}}}^{ {x_{0}+P}}s(x)\cdot \cos({\tfrac  {2\pi nx}{P}})\ dx$$

$$b_{n}={\frac  {2}{P}}\int _{ {x_{0}}}^{ {x_{0}+P}}s(x)\cdot \sin({\tfrac  {2\pi nx}{P}})\ dx$$

$$f(x,y) = \frac 1{2\pi\sigma_1\sigma_2\sqrt{1-\rho^2}}exp\{ -\frac1{2(1-\rho^2)}[{(x-\mu_1 )^2 \over 2\sigma_1^2}-{2\rho(x-\mu_1 )(y-\mu_2) \over \sigma_1\sigma_2}+{(y-\mu_2 )^2 \over 2\sigma_2^2}]\}$$

梯度方向导数

$$\vec{n}=\{F'_x(x_0,y_0,z_0),F'_y(x_0,y_0,z_0),F'_z(x_0,y_0,z_0)\}$$

u沿着n方向导数

$$\nabla \vec u * \frac {\vec{n}}{|\vec n|}$$

$$\frac{\partial z}{\partial x} = -\frac{F'_x}{F'_z}$$

$${\begin{cases}F(x,u,v)=0\\G(x,u,v)=0\end{cases}}$$

$${\begin{cases}F'_x+F'_u\frac{du}{dx}+F'_v\frac{dv}{dx}=0\\G'_x+G'_u\frac{du}{dx}+G'_v\frac{dv}{dx}=0\end{cases}}$$

$$grad(u)=(\frac{∂u}{∂x},\frac{∂u}{∂y},\frac{∂u}{∂z})$$

$$div((a,b,c))=\frac{∂a}{∂x}+\frac{∂b}{∂y}+\frac{∂c}{∂z}$$

$$\iiint _{D}f(x,y,z)\,dx\,dy\,dz=\iiint _{T}f(\rho \sin \theta \cos \phi ,\rho \sin \theta \sin \phi ,\rho \cos \theta )\rho ^{2}\sin \theta \,d\rho \,d\theta \,d\phi $$

$${\begin{bmatrix}{\frac  {\partial y_{1}}{\partial x_{1}}}&\cdots &{\frac  {\partial y_{1}}{\partial x_{n}}}\\\vdots &\ddots &\vdots \\{\frac  {\partial y_{m}}{\partial x_{1}}}&\cdots &{\frac  {\partial y_{m}}{\partial x_{n}}}\end{bmatrix}}.$$

$$\iint\limits_{D}(\frac{\partial Q}{\partial x} -\frac{\partial P}{\partial y})dxdy=\oint_{L^{+}}(Pdx+Qdy),逆时针环绕$$

|微分方程|解|
|---|---|
|$$y'+p(x)y=q(x)$$|$$e^{-\int p(x)dx}[\int q(x)e^{\int p(x)dx}dx+C]$$|
|$$y''+by'+cy=r(x)$$|$$y_{c}=C_{1}e^{\left(-b+{\sqrt {b^{2}-4c}}\right){\frac {x}{2}}}+C_{2}e^{-\left(b+{\sqrt {b^{2}-4c}}\right){\frac {x}{2}}}\,\!,两个不等根$$|
|$$e^{xi}=cos(x)+i*sin(x)(变换公式↑→)$$|$${\displaystyle y_{c}=(C_{1}x+C_{2})e^{-{\frac {bx}{2}}}\,\!},两个等根$$|
|$$y''+by'+cy=P_m(x)e^{ax}\,\!$$|$$y=x^kQ_m(x)e^{ax},k=[a为特征根的重数]$$|
|$$y''+by'+cy=P_m(x)e^{ax}cos(nx)+Q_m(x)e^{ax}sin (nx)\,\!$$|$$y=x^k(R_m(x)e^{ax}cos(nx)+S_m(x)e^{ax}sin(nx)),k=[a+in为特征根的重数]$$|
|$$x^2y''+axy'+by=f(x)$$|令$$x=e^t$$转化为y-t的方程|

常见 

$$y'=y^2=> y''=2y * y'$$

二元函数极值

$$A=F''_{xx}(x,y),B=F''_{xy}(x,y),C=F''_{yy}(x,y)$$

$$B^2-AC<0,A<0,极大$$

$$B^2-AC<0,A>0,极小$$

$$B^2-AC>0,不是$$

级数收敛可用：泰勒展开取等价无穷小

证明级数 利用"保号性"取定值

泰勒展开再和已知收敛数列做比

注意和函数的S(0)特殊值


数列。。。没有导数概念

洛必达法则的结果不存在也不为无穷大，洛必达法则失效但并不说明原式无极限

在某lim x时f(x)趋近于正负无穷大也是无穷大

驻点：一阶导数为零

拐点：凹凸性变化

f(x)原函数不存在：f(x)有第一类间断点，也就是F(x)在f(x)间断点不可导(导数不等)

斯托克斯公式

$$\iint_{\Sigma}\begin{vmatrix} \cos \alpha & \cos \beta & \cos \gamma \\ \frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\ P & Q & R \end{vmatrix}dS=\oint_{\Gamma}Pdx+Qdy+Rdz$$

$$\iint_{S}\left(\frac{\partial R}{\partial y}-\frac{\partial Q}{\partial z}\right)dydz+\left(\frac{\partial P}{\partial z}-\frac{\partial R}{\partial x}\right)dzdx+\left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)dxdy=\oint_{\Gamma}Pdx+Qdy+Rdz$$

高斯散度定理

$$\iiint _{{\Omega }}\left({\frac  {\partial P}{\partial x}}+{\frac  {\partial Q}{\partial y}}+{\frac  {\partial R}{\partial z}}\right)dv=P\,dy\land dz+Q\,dz\land dx+R\,dx\land dy$$

$$\iiint _{{\Omega }}\left({\frac  {\partial P}{\partial x}}+{\frac  {\partial Q}{\partial y}}+{\frac  {\partial R}{\partial z}}\right)dv=(P\cos\alpha+Q\cos\beta+R\cos\gamma)\,dS$$

### 线性代数

$$\sum_{i=1}^n \lambda _i= \sum_{i=1}^n a_{i,i}$$

$$\prod_{i=1}^n \lambda _i= |A|$$

$$|AB|=|A||B| ,用\begin{bmatrix} A & O  \\ -E & B \end{bmatrix}证明$$

$$r(A)+r(B)\ge r(A+B)$$

$$AB=O,r(A)+r(B)\le n$$

$$名词:正交矩阵A,A^TA=E$$

$$名词：特征矩阵 \lambda E - A$$

实对称矩阵 性质

A是实对称矩阵 则A的所有特征值为实数 永远可以对角化

实对称阵 属于不同特征值的的特征向量是正交的

非奇异矩阵 $$P$$，使得  $$P^{T}AP=B$$，则称 $$A,B$$是合同或相合的

###  概统

$$独立：概率密度函数乘积=联合概率密度，相关 期望乘积=乘积期望$$

$$样本均值和样本方差相互独立$$

$$f(x) = {1 \over \sqrt{2\pi}\sigma }\,e^{- { {(x-\mu )^2 \over 2\sigma^2}}}$$

$$二维正态(X,Y)分布独立和不相关等价$$

$$相关系数\rho _{X,Y}={\mathrm {cov} (X,Y) \over \sigma _{X}\sigma _{Y}}={E((X-\mu _{X})(Y-\mu _{Y})) \over \sigma _{X}\sigma _{Y}}$$

$$\sigma _{X}^{2}=E(X^{2})-E^{2}(X)$$

$$D(X+Y)=D(X)+D(Y)+2cov(X,Y)$$

$$协方差\mathrm {cov} (X,Y) = E(XY)-E(X)E(Y)$$

$$E(X)=p,D(X)=p(1-p),[0-1]$$

$$E(X)=np,D(X)=np(1-p),X\sim B(n,p)$$

$$E(X)=\lambda,D(X)=\lambda,X\sim P(\lambda)$$

$$E(X)=\frac1p,D(X)=\frac{1-p}{p^2},P\{X=k\}=p(1-p)^{k-1}几何分布$$

$$E(X)=\frac{a+b}2,D(X)=\frac{(b-a)^2}{12},X\sim U(a,b)$$

$$E(X)=\frac1\lambda,D(X)=\frac1{\lambda ^2},X\sim E(\lambda)$$

$$E(X)=\mu,D(X)=\sigma^2,X\sim N(\mu,\sigma)$$

切比雪夫不等式

$$P\{|X-E(X)|\geq \epsilon\}\leq \frac {D(X)}{\epsilon ^2}$$

切比雪夫大数定律（弱大数定律，两两不相关序列）

$$\lim _{n\to \infty }P\left(\,|{\overline {X}}_{n}-\mu |>\varepsilon \,\right)=0. D(x_i)\le C$$

伯努利大数定律

$$\lim _{n\to \infty }{P{\left\{\left|{\frac {n_{x}}{n}}-p\right|<\varepsilon \right\}}}=1,X_n \sim B(n,p)$$

辛钦大数定律（独立同分布）

$$\lim _{n\to \infty }\operatorname {P} (\left|{\overline {X}}_{n}-\mu \right|<\varepsilon )=1, E(X_i)=\mu$$

棣莫佛-拉普拉斯中心极限定理

$$P\{a\leq {\frac {\mu _{n}-np}{\sqrt {np(1-p)}}}<b\}\to \int _{a}^{b}\varphi (x)dx，X_n \sim B(n,p)$$

林德伯格－列维定理（独立同分布）

$$E(X_{i})=\mu ，D(X_{i})=\sigma ^{2},\lim _{n\rightarrow \infty }P\left({\frac { {\bar {X}}-\mu }{\sigma /{\sqrt {n}}}}\leq z\right)=\Phi \left(z\right)$$

常用统计分布

卡方分布

$$\chi^2(k)=\sum _{ {i=1}}^{k}Z_{i}^{2},Z_i\sim N(0,1),E(\chi^2(k))=k,D(\chi^2(k))=2k$$

t分布

$$T \sim t(n)=\frac {N(0,1)}{\sqrt {\frac{ \chi^2(n)}{n}}}$$

F分布

$$F(n_1,n_2)=\frac {\chi^2(n_1)/n_1} {\chi^2(n_2)/n_2}$$

$$F(n_1,n_2) \sim \frac 1 {F(n_2,n_1)}$$

$$F_{1-a}(n_1,n_2) = \frac 1 {F_a(n_2,n_1)}$$

置信区间P507

|未知参数|1-a置信区间|
|---|---|
|$$\mu$$ ($$\sigma^2$$已知)|$$(\bar X-u_{\frac a 2}\frac \sigma {\sqrt n},\bar X+u_{\frac a 2}\frac \sigma {\sqrt n})$$|
|$$\mu$$ ($$\sigma^2$$未知)|$$(\bar X-t_{\frac a 2}(n-1)\frac S {\sqrt n},\bar X+t_{\frac a 2}(n-1)\frac S {\sqrt n})$$|
|$$\sigma^2$$|$$(\frac {(n-1)S^2} {\chi _{a/2}^2(n-1)},\frac {(n-1)S^2} {\chi _{1-a/2}^2(n-1)})$$|
|$$\mu_1-\mu_2 (\sigma_1,\sigma_2已知)$$|P508|
|$$\mu_1-\mu_2 (\sigma_1=\sigma_2未知)$$|P508|
|$$\frac{\sigma_1^2}{\sigma_2^2}$$|P508|

假设验证表


---
title: latex on debian
date: 2021-05-12
tags: [latex]
category: [ latex]
mathjax: true
---

# 安装

`sudo apt install texlive-full`

包还蛮大的，3GB下载，5GB展开

# Interface zh_CN

`Options->Configure TeXstudio->General->Language`

# Hello world

```tex
% !TEX program = xelatex
% !Mode:: "TeX:UTF-8"
%Save as UTF-8, run xelatex.

\documentclass{article}

\usepackage{xeCJK}

\begin{document}

hello,你好

\end{document}
```

<!-- more -->

# Big Demo

```tex
% !TEX program = xelatex
% !Mode:: "TeX:UTF-8"
% Save as UTF-8, run xelatex.

\documentclass{article}
\title{My first document}
\date{2013-09-01}
\author{John Doe \thanks{funded by the Overleaf team}}
\usepackage{xeCJK}

\begin{document}
	\pagenumbering{gobble}
	\maketitle
	\newpage
	\pagenumbering{arabic}
	
	\begin{abstract}
		This is a simple paragraph at the beginning of the 
		document. A brief introduction about the main subject.
	\end{abstract}

\tableofcontents

\section{Introduction}

This is the first section.

Lorem  ipsum  dolor  sit  amet,  consectetuer  adipiscing  
elit.   Etiam  lobortisfacilisis sem.  Nullam nec mi et 
neque pharetra sollicitudin.  Praesent imperdietmi nec ante. 
Donec ullamcorper, felis non sodales...

\subsection{First Subsection}
Praesent imperdietmi nec ante. Donec ullamcorper, felis non sodales...

\subsection{Second Subsection}
Praesent imperdietmi nec ante. Donec ullamcorper, felis non sodales...

\subsubsection{subsubsection}
subsubsection

\paragraph{paragraph}
paragraph

\subparagraph{subparagraph}
subparagraph

\section{Second Section}

Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  
Etiam lobortis facilisissem.  Nullam nec mi et neque pharetra 
sollicitudin.  Praesent imperdiet mi necante...

\section*{Unnumbered Section}
\addcontentsline{toc}{section}{Unnumbered Section}

Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  
Etiam lobortis facilisissem.  Nullam nec mi et neque pharetra 
sollicitudin.  Praesent imperdiet mi necante...

hello,你好 \LaTeX{}

% This line here is a comment. It will not be printed in the document.

Some of the \textbf{greatest}
discoveries in \underline{science} 
were made by \textbf{\textit{accident}}.

% Unordered lists

\begin{itemize}
	\item The individual entries are indicated with a black dot, a so-called bullet.
	\item The text in the entries may be of any length.
\end{itemize}

%Ordered lists

\begin{enumerate}
	\item This is the first entry in our list
	\item The list numbers increase with each entry we add
\end{enumerate}

In physics, the mass-energy equivalence is stated 
by the equation $E=mc^2$, discovered in 1905 by Albert Einstein.

The mass-energy equivalence is described by the famous equation
\[ E=mc^2 \]
discovered in 1905 by Albert Einstein. 
In natural units ($c = 1$), the formula expresses the identity
\begin{equation}
	E=m
\end{equation}


Subscripts in math mode are written as $a_b$ and superscripts are written as $a^b$. These can be combined an nested to write expressions such as

\[ T^{i_1 i_2 \dots i_p}_{j_1 j_2 \dots j_q} = T(x^{i_1},\dots,x^{i_p},e_{j_1},\dots,e_{j_q}) \]

We write integrals using $\int$ and fractions using $\frac{a}{b}$. Limits are placed on integrals using superscripts and subscripts:

\[ \int_0^1 \frac{dx}{e^x} =  \frac{e-1}{e} \]

Lower case Greek letters are written as $\omega$ $\delta$ etc. while upper case Greek letters are written as $\Omega$ $\Delta$.

Mathematical operators are prefixed with a backslash as $\sin(\beta)$, $\cos(\alpha)$, $\log(x)$ etc.


\begin{center}
	\begin{tabular}{ c c c }
		cell1 & cell2 & cell3 \\ 
		cell4 & cell5 & cell6 \\  
		cell7 & cell8 & cell9    
	\end{tabular}
\end{center}

\begin{center}
	\begin{tabular}{ |c|c|c| } 
		\hline
		cell1 & cell2 & cell3 \\ 
		cell4 & cell5 & cell6 \\ 
		cell7 & cell8 & cell9 \\ 
		\hline
	\end{tabular}
\end{center}

Table \ref{table:data} is an example of referenced \LaTeX{} elements.

\begin{table}[h!]
	\centering
	\begin{tabular}{||c c c c||} 
		\hline
		Col1 & Col2 & Col2 & Col3 \\ [0.5ex]
		\hline\hline
		1 & 6 & 87837 & 787 \\ 
		2 & 7 & 78 & 5415 \\
		3 & 545 & 778 & 7507 \\
		4 & 545 & 18744 & 7560 \\
		5 & 88 & 788 & 6344 \\ [1ex] 
		\hline
	\end{tabular}
	\caption{Table to test captions and labels}
	\label{table:data}
\end{table}

\end{document}
```

# 文件类型

https://hopf.math.purdue.edu/doc/html/suffixes.html

`.log` ... denotes a log file for any flavour of TeX

`.aux` ... denotes an auxiliary file generated by running latex (or etex) on a source file. It typically contains information latex needs on a second pass to construct \refs and \cites and information that bibtex needs to construct a .bbl file. See BibTeX.

`.toc` ... denotes an table of contents file generated by latex when the source file contains the line `\tableofcontents`

`.bib` ... denotes a BibTeX source file such files contain the database from which the `.bbl` bibliography file is generated. See BibTeX.

`.bst` ... denotes a BibTeX style file the style in which bibtex presents the `.bbl` bibliography file.

`.cls` ... denotes a LaTeX 2e class file

`.sty` ... denotes a LaTeX (or AmS-TeX) package/style file LaTeX 2.09 made no distinction between classes and packages ... all such files were style files - hence the suffix. LaTeX 2e has retained the suffix for what it now terms as packages

# 结构

 - preamble
    - documentclass 引入class文件，常见的article，和自定义
    - usepackage 引入 一些额外的功能函数
      - 例如 such as amsmath for additional math formatting
 - main document 以 `\begin{document} \end{document}`包裹
    - section/subsection/subsubsection/paragraph/subparagraph/author/title/date/maketitle/tableofcontents/newpage 完成层级相关的操作
    - 图片 $\begin{figure} \end{figure}$ 包裹, includegraphics/caption
    - section/label/ref  段落引用
    - usepackage{biblatex}  / bibliography{FILENAME}, 和 bib文件来 引别的书目内容, printbibliography
    - 通过csv文件生产table/plot图 等 https://latex-tutorial.com/tutorials/pgfplotstable/
    - tikz 绘图 https://latex-tutorial.com/tutorials/tikz/

# more tutorial

https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes

https://latex-tutorial.com/wp-content/uploads/2021/03/latex-quick-start-tutorial.pdf

https://latex-tutorial.com/quick-start/


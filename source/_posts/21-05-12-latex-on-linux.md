---
title: latex on debian
date: 2021-05-12
tags: [latex]
category: [code, latex]
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


# more tutorial

https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes




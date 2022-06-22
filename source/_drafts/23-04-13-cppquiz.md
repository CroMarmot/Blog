---
title: Cpp Quiz
date: 2023-04-13
tags: [cpp]
category: [backend,cpp]
description: C++ Quiz
---

源 https://cppquiz.org/quiz/question/1

辅助 https://godbolt.org/  https://cppinsights.io/

C++17 标准

Undefined: 一般是不可预期的行为，可能编译器在特定的时候特定处理了, 在使用不可移植的或错误的程序结构或错误的数据时的行为，而本国际标准对此没有规定要求。编译器可以 完全无视情况，产生不可预测(运行时)的结果；在翻译或程序执行过程中，以环境所特有的记录方式行事（无论是否发出诊断信息）；终止翻译或执行（发出诊断信息）。如 integeer overflow

Implementation-defined: 标准未定义，编译器需要在编译器文档中 说明如何实现的

Unspecified: 使用一个未指定的值，或其他行为，本国际标准提供了两种或更多的可能性，并对在任何情况下选择哪一种没有进一步的要求。 未指定的行为的一个例子是函数的参数被评估的顺序。

<!--more-->

# 类型

> Q1

```cpp
#include <iostream>
template <class T> void f(T &i) { std::cout << 1; }
template <> void f(const int &i) { std::cout << 2; }

int main() {
  int i = 42;
  f(i);
}
```

先第一模板推理得到`int &`, 而第一个产生的`int &` 比 `const int &`优先级高

> Q2

```
#include <iostream>
#include <string>
void f(const std::string &) { std::cout << 1; }
void f(const void *) { std::cout << 2; }

int main() {
  f("foo");
  const char *bar = "bar";
  f(bar);
}
```

字符串字面量是`const char[]`, 当没有后面的时候能转换到`const std::string&`是因为有用户定义的转换，但是对于编译器来说,`const void*`比`const std::string&`优先级高

> Q3

```
#include <iostream>
void f(int) { std::cout << 1; }
void f(unsigned) { std::cout << 2; }

int main() {
  f(-2.5);
}
```

编译错误，因为它既不是`int`,也不是`unsigned`, 两者对于编译器转换来说是同样优先级, `ill-formed`

> Q4

```
#include <iostream>

void f(float) { std::cout << 1; }
void f(double) { std::cout << 2; }

int main() {
  f(2.5);
  f(2.5f);
}
```

字面量浮点数是`double`

> Q115

```
#include <iostream>

void f(int) { std::cout << "i"; }
void f(double) { std::cout << "d"; }
void f(float) { std::cout << "f"; }

int main() {
  f(1.0);
}
```

字面量浮点数是`double`

> Q24

```
#include <iostream>
#include <limits>

int main() {
  unsigned int i = std::numeric_limits<unsigned int>::max();
  std::cout << ++i;
}
```

unsigned integers overflow是well defined behaviour, 虽然可以用clang++的参数对其报warning,但是它是明确结果的

> Q25

```
#include <iostream>
#include <limits>

int main() {
  int i = std::numeric_limits<int>::max();
  std::cout << ++i;
}
```

integers overflow 是未定义行为

> Q26

```
#include <iostream>

int main() {
  int i = 42;
  int j = 1;
  std::cout << i / --j;
}
```

除0是未定义行为

> Q30

```
#include <iostream>
struct X {
  X() { std::cout << "X"; }
};

int main() { X x(); }
```

这里是函数原型，而不是变量，要么移除括号，要么`X x{}`才是变量声明

> Q31

```
#include <iostream>

struct X {
  X() { std::cout << "X"; }
};

struct Y {
  Y(const X &x) { std::cout << "Y"; }
  void f() { std::cout << "f"; }
};

int main() {
  Y y(X());
  y.f();
}
```

同上，这里y是函数原型，所以y.f会编译报错, 改成`Y y{X{}}`

> Q37

```
#include <iostream>

int main() {
  int a = 0;
  decltype(a) b = a;
  b++;
  std::cout << a << b;
}
```

a是`int`,`decltype(a)`则也是`int`

> Q38

```
#include <iostream>

int main() {
  int a = 0;
  decltype((a)) b = a;
  b++;
  std::cout << a << b;
}
```

decltype, 加了括号，且是lvalue, 所以是`int &`

> Q41

```
#include <iostream>
int main() {
  std::cout << 1["ABC"];
}
```

C++中数组与汇编的关系, `E1[E2] = *((E1)+(E2))`

> Q241

```
#include <iostream>
#include <type_traits>

using namespace std;

template<typename T, typename U>
void f(T, U) {
    cout << is_same_v<T, U>;
}

int main() {
    int i = 0;
    double d = 0.0;
    f(i, d);
    f<int>(i, d);
    f<double>(i, d);
}
```

省略的类型自动推断

> Q153

```
#include <iostream>
int main() {
    char* str = "X";
    std::cout << str;
}
```

string常量是 `const char[]` 所以从C++11开始不能转换成`char *`, 然而实际上的话有不少编译器依然可以编译，并运行, 但标准上这其实不合法, 通过`str[0]='a'` 可以触发编译错误。 所以从标准上应该要编译错误。

http://dev.krzaq.cc/stop-assigning-string-literals-to-char-star-already/

> Q120

```
#include <iostream>

int main() {
  int a = 10;
  int b = 20;
  int x;
  x = a, b;
  std::cout << x;
}
```

赋值优先级高于`,`

> Q244

```
#include <iostream>

using namespace std;

template <typename T>
struct A {
    static_assert(false);
};

int main() {
    cout << 1;
}
```

没有对A的实例化, 又A的实现与其T无关，因此是ill-formed, no diagnostic required, 因此是未定义行为

> Q159

```
#include <iostream>

int i;

void f(int x) {
    std::cout << x << i;
}

int main() {
    i = 3;
    f(i++);
}
```

函数中的`i++` 在 进入函数以前被`++`

> Q277

```
#include <iostream>

int main() {
    std::cout << sizeof("");
}
```

字符串结尾有`\0`字符

> Q313

```
#include <iostream>

void f(float &&) { std::cout << "f"; }
void f(int &&) { std::cout << "i"; }

template <typename... T>
void g(T &&... v)
{
    (f(v), ...);
}

int main()
{
    g(1.0f, 2);
}
```

变成

```cpp
void g<float, int>(float && __v0, int && __v1) {
  f(static_cast<int>(__v0)) , f(static_cast<float>(__v1));
}
```

因为g中lvalue不能直接转换成move, 所以触发了`floating-integral conversion`, 而触发以后又变成xvalue 可以move

> Q161

```
#include <iostream>

int main() {
    int n = 3;
    int i = 0;

    switch (n % 2) {
    case 0:
    do {
    ++i;
    case 1: ++i;
    } while (--n > 0);
    }

    std::cout << i;
}
```

很怪，但是可以编译, 关键词`Duff's device` 可以手工实现loop unrolling (也就是大量减少了汇编中的判断和跳转)

> Q236

```
#include <iostream>

struct Foo {
  operator auto() {
    std::cout << "A";
    return 1;
  }
};

int main() {
  int a = Foo();
  std::cout << a;
}
```

`A conversion function template shall not have a deduced return type`, 但是`The type of the conversion function (§11.3.5) is “function taking no parameter returning conversion-type-id”.`

所以函数返回int, 但是实际是`int a = static_cast<int>(Foo().operator auto());`

> Q279

```
#include <iostream>
#include <variant>

struct C
{
    C() : i(1){}
    int i;
};

struct D
{
    D() : i(2){}
    int i;
};

int main()
{
    const std::variant<C,D> v;
    std::visit([](const auto& val){ std::cout << val.i; }, v);
}
```

variant可以粗略看成会自动析构的union, 这里使用了C,没有用D, `std::visit`只是一个工具能把variant里的拆开来访问,

> Q332

```
#include <iostream>

struct S {
    template <typename Callable>
    void operator[](Callable f) {
        f();
    }
};

int main() {
    auto caller = S{};
    caller[ []{ std::cout << "C";} ];
}
```

问题在于连续的两个左括号 是`[[attributes]]`语法，所以上面需要对lambda函数套一层`()`

> Q147

```
#include<iostream>

int main(){
  int x=0; //What is wrong here??/
  x=1;
  std::cout<<x;
}
```

之前有个东西叫`trigraph`, 在`C++17`中不再有了, 在之前的版本中`??/`等价于`\`


> Q179

```
#include <iostream>

int main() {
    const int i = 0;
    int& r = const_cast<int&>(i);
    r = 1;
    std::cout << r;
}
```

在const对象生命期间 对其修改是未定义行为, 因为实际可以非const传递变成const,再通过`const_cast` 指向最前面的const完成修改， 但对于本身就是const, `const_cast`并不能让它可改

> Q107

```
#include <iostream>
#include <vector>

int f() { std::cout << "f"; return 0;}
int g() { std::cout << "g"; return 0;}

void h(std::vector<int> v) {}

int main() {
    h({f(), g()});
}
```

函数参数没有顺序要求(unspecified)，但是这里是`{}` 是顺序的

> Q259

```
#include <iostream>

void f(unsigned int) { std::cout << "u"; }
void f(int)          { std::cout << "i"; }
void f(char)         { std::cout << "c"; }

int main() {
    char x = 1;
    char y = 2;
    f(x + y);
}
```

未定义char+char，有的编译器会看作int,有的会看作unsigned int

> Q197

```
#include <iostream>

int j = 1;

int main() {
  int& i = j, j;
  j = 2;
  std::cout << i << j;
}
```

i指向了全局的j,而后面的`j`是局部的

> Q129

```
#include <vector>
#include <iostream>

using namespace std;

int main() {
  vector<char> delimiters = { ",", ";" };
  cout << delimiters[0];
}
```

这里不是char数组，而是字符串数组，所以初始化方法先不匹配， 然后可能和模板匹配`template <class InputIterator> vector(InputIterator first, InputIterator last)`, 而这竟然是未定义行为，因为你加成1个/3个字符串就肯定报错了, 而同理来说`{"a","a"}`初始化会让vector大小为0

> Q205

```
#include <iostream>

int main() {
   constexpr unsigned int id = 100;
   unsigned char array[] = { id % 3, id % 5 };
   std::cout
      << static_cast<unsigned int>(array[0])
      << static_cast<unsigned int>(array[1]) ;
}
```

在初始化中 uint向uchar转换(向更窄) 是ill-formed 除非 源是const且满足表示范围

> Q273

```
#include <iostream>

struct A {
    A() { std::cout << "A"; }
    ~A() { std::cout << "a"; }
};

int main() {
    std::cout << "main";
    return sizeof new A;
}
```

sizeof 在编译时期，就被转换了，因此编译后根本没有new A

> Q227

```
#include <iostream>

using Func = int();

struct S {
    Func f;
};

int S::f() { return 1; }

int main() {
    S s;
    std::cout << s.f();
}
```

> Q207

```
#include <iostream>
#include <map>
using namespace std;

int main() {
    map<int, int> m;
    cout << m[42];
}
```

> Q347

```
#include <iostream>
#include <type_traits>

template <typename T>
void foo(T& x)
{
    std::cout << std::is_same_v<const int, T>;
}

template <typename T>
void bar(const T& x)
{
    std::cout << std::is_same_v<const int, T>;
}

int main()
{
    const int i{};
    int j{};

    foo(i);
    foo(j);
    bar(i);
    bar(j);

}
```

注意后面bar的T只是int

> Q248

```
#include <algorithm>
#include <iostream>

int main() {
    int x = 10;
    int y = 10;

    const int &max = std::max(x, y);
    const int &min = std::min(x, y);

    x = 11;
    y = 9;

    std::cout << max << min;
}
```

首先max/min返回的是引用, 然后有相等时返回的是第一个

> Q196

```
#include <iostream>

namespace x {
  class C {};
  void f(const C& i) {
    std::cout << "1";
  }
}

namespace y {
  void f(const x::C& i) {
    std::cout << "2";
  }
}

int main() {
  f(x::C());
}
```

`Koenig lookup`的 参数依赖lookup会让本来不能调用f,因为有`x::C`所以`x`也会被加入到被搜索的范围中

> Q287

```
#include <string>
#include <iostream>

int main() {
  using namespace std::string_literals;
  std::string s1("hello world",5);
  std::string s2("hello world"s,5);

  std::cout << s1 << s2;
}
```

第一个是C-style string,`basic_string(const charT* s, size_type n, const Allocator& a = Allocator());`,第二个是`basic_string `, `basic_string(const basic_string& str, size_type pos, const Allocator& a = Allocator());`

一个是长度，一个是开始位置

> Q233

```
#include <type_traits>
#include <iostream>

using namespace std;

struct X {
    int f() const&&{
        return 0;
    }
};

int main() {
    auto ptr = &X::f;
    cout << is_same_v<decltype(ptr), int()>
         << is_same_v<decltype(ptr), int(X::*)()>;
}
```

返回类型是函数类型的一部分，所以这里是`int(X::*)() const&&`

> Q291

```
#include <iostream>

int _global = 1;

int main() {
  std::cout << _global;
}
```

未定义，任何包含双下划线，或单下划线大写字母开头，保留给任何用途

单下划线保留给 global namespace

> Q289

```
#include <iostream>

void f(int a = []() { static int b = 1; return b++; }())
{
   std::cout << a;
}

int main()
{
   f();
   f();
}
```

函数参数里的默认参数的lambda调用，是同一个函数,同样`void (*a)() = ([]() { static int b = 1; std::cout << b++; })`写在里面，两次的lambda也是同一个函数

> Q151

```
#include <iostream>
#include <type_traits>

int main()
{
    std::cout << std::is_signed<char>::value;
}
```

It is implementation-defined whether a char object can hold negative values.

> Q152

```
#include <iostream>
#include <type_traits>

int main() {
    if(std::is_signed<char>::value){
        std::cout << std::is_same<char, signed char>::value;
    }else{
        std::cout << std::is_same<char, unsigned char>::value;
    }
}
```

第一个表达式同上，但即使实现了符号不符号，`char,signed char,unsigned char`是三种类型(而int和singed int一样)

> Q177

```cpp
#include <limits>
#include <iostream>

int main() {
    std::cout << std::numeric_limits<unsigned char>::digits;
}
```

char/unsigned char/signed char需要足够大存下unsigned char, 但不一定是8, 看编译器实现,(gcc,clang都是8)

> Q251

```
#include <iostream>

template<class T>
void f(T) { std::cout << 1; }

template<>
void f<>(int*) { std::cout << 2; }

template<class T>
void f(T*) { std::cout << 3; }

int main() {
    int *p = nullptr;
    f( p );
}
```

`T*`比`T`更精确，而第二种是一种T的实际对应,所以也比第三种优先级低, 当然如果有 `void f(int*) { std::cout << 4; }` 则更精确

> Q106

```
#include <iostream>

extern "C" int x;
extern "C" { int y; }

int main() {

	std::cout << x << y;

	return 0;
}
```

x是声明,y是定义, x未被定义，编译器可以选择报告错误，所以是program is undefined

> Q191

```
#include<iostream>

namespace A{
  extern "C" int x;
};

namespace B{
  extern "C" int x;
};

int A::x = 0;

int main(){
  std::cout << B::x;
  A::x=1;
  std::cout << B::x;
}
```

这里上面是 声明 不是定义, 指向同一个

> Q198

```
#include <iostream>

namespace A {
  extern "C" { int x; }
};

namespace B {
  extern "C" { int x; }
};

int A::x = 0;

int main() {
  std::cout << B::x;
  A::x=1;
  std::cout << B::x;
}
```

这里int x都是定义不是声明，所以冲突，同时和`int A::x`定义冲突

> Q220

```
#include <iostream>

bool f() { std::cout << 'f'; return false; }
char g() { std::cout << 'g'; return 'g'; }
char h() { std::cout << 'h'; return 'h'; }

int main() {
    char result = f() ? g() : h();
    std::cout << result;
}
```

> Q174

```
#include<iostream>

void f(int& a, const int& b) {
  std::cout << b;
  a = 1;
  std::cout << b;
}

int main(){
  int x = 0;
  f(x,x);
}
```

const 只保证不能通过当前这个来修改，并不保证指向的不被修改

> Q125

```
#include <iostream>

using namespace std;

template <class T> void f(T) {
  static int i = 0;
  cout << ++i;
}

int main() {
  f(1);
  f(1.0);
  f(1);
}
```

会推断出double/int 对应两个函数

> Q118

```
#include <iostream>

void print(char const *str) { std::cout << str; }
void print(short num) { std::cout << num; }

int main() {
  print("abc");
  print(0);
  print('A');
}
```

对于"abc", 上面更好, 对于'A', 下面更好, 而对于`0`, 两者没有比另一个更好

> Q335

```
#include <cstddef>
#include <iostream>

void f(void*) {
    std::cout << 1;
}

void f(std::nullptr_t) {
    std::cout << 2;
}

int main() {
    int* a{};

    f(a);
    f(nullptr);
    f(NULL);
}
```

a和`nullptr`很清晰， 但是对于NULL 有的编译器用long 有的用int， 有时也允许是`prvalue` of`std::nullptr_t`

> 135

```
#include <iostream>
#include <map>
using namespace std;

int main()
{
  map<bool,int> mb = {{1,2},{3,4},{5,0}};
  cout << mb.size();
  map<int,int> mi = {{1,2},{3,4},{5,0}};
  cout << mi.size();
}
```

int被转换成bool

> Q105

```
#include <iostream>

using namespace std;

class A {
public:
  A() { cout << "a"; }
  ~A() { cout << "A"; }
};

int i = 1;

int main() {
label:
  A a;
  if (i--)
    goto label;
}
```

goto 会对 跳转之间的初始化的进行 destruction, 而不论从汇编角度，还是和goto的destruction配合，都会二次初始化和destruction

> Q219

```
#include <iostream>

template<typename T>
T sum(T arg) {
    return arg;
}

template<typename T, typename ...Args>
T sum(T arg, Args... args) {
    return arg + sum<T>(args...);
}

int main() {
    auto n1 = sum(0.5, 1, 0.5, 1);
    auto n2 = sum(1, 0.5, 1, 0.5);
    std::cout << n1 << n2;
}
```

注意返回是 首个参数的类型，所以是float, int 分别处理, 然后c++/python3 这些都是截断不是四舍五入， 所以int(0.5)=0

> Q286

```
#include<iostream>

int main()
{
    unsigned short x=0xFFFF;
    unsigned short y=0xFFFF;
    auto z=x*y;
    std::cout << (z > 0);
}
```

乘法会让它们类型先变化，变成 有符号int ，而结果overflow,所以是UB

> Q206


```
#include <iostream>

int main() {
   int n = sizeof(0)["abcdefghij"];
   std::cout << n;
}
```

需要注意的是, 是 `sizeof`后面所有, 而不是`sizeof(0)`, 因此 后面返回一个char,而sizeof char = 1

> Q254

```
#include <iostream>
#include <type_traits>

int main() {
    std::cout << std::is_same_v<
        void(int),
        void(const int)>;

    std::cout << std::is_same_v<
        void(int*),
        void(const int*)>;
}
```

很入门

> Q185

```cpp
#include <iostream>

template <typename T> void f() {
  static int stat = 0;
  std::cout << stat++;
}

int main() {
  f<int>();
  f<int>();
  f<const int>();

}
```

有两个 function type 一样的，但是不同的function

> Q228

```cpp
template <typename ...Ts>
struct X {
  X(Ts ...args) : Var(0, args...) {}
  int Var;
};

int main() {
  X<> x;
}
```

每一个有效的变体模板的特殊化都需要一个空的模板参数包,[the program is ill-formed, no diagnostic required.], 不需要编译器诊断错误，但是执行undefined

> Q276

```
#include <iostream>

auto sum(int i)
{
  if (i == 1)
    return i;
  else
    return sum(i-1)+i;
}

int main()
{
    std::cout << sum(2);
}
```

auto 需要所有分支返回类型相同，已知i是int, 从而直接对于未知的`sum+i`认为也是int, 但如果把return i和return sum+i 顺序交换，则会进入推断死循环，编译错误

> Q144

```
#include <iostream>
#include <limits>

int main()
{
    int N[] = {0, 0, 0};

    if constexpr (std::numeric_limits<long int>::digits == 63 &&
        std::numeric_limits<int>::digits == 31 &&
        std::numeric_limits<unsigned int>::digits == 32)
    {
        for (long int i = -0xffffffff; i; --i)
        {
            N[i] = 1;
        }
    }
    else
    {
        N[1] = 1;
    }

    std::cout << N[0] << N[1] << N[2];
}
```

C++17 中有符号的digits的确31,63

0xffffffff 是uint, uint的负值为`2^n-它=2^32 - 0xffffffff = 4294967296 - 4294967295 = 1`, well defined

(当然 可以开额外编译开关让它报错

> Q157

```cpp
#include <iostream>
#include <typeinfo>

struct A {};

int main()
{
    std::cout<< (&typeid(A) == &typeid(A));
}
```

typeid 返回的是const std::type_info 类型的左值, 但两次返回并不保证返回的是同一个

> Q188

```
#include <iostream>

int main() {
  char* a = const_cast<char*>("Hello");
  a[4] = '\0';
  std::cout << a;
}
```

The effect of attempting to modify a string literal is undefined. 而转换真的有用的情况还是当 非const => const => 非const这类二次变换

> Q305

```cpp
#include <iostream>

void print(int x, int y)
{
    std::cout << x << y;
}

int main() {
    int i = 0;
    print(++i, ++i);
    return 0;
}
```

函数参数解析顺序 是 unspecified

> Q333

```cpp
#include <iostream>

int main()
{
    int x = 3;
    while (x --> 0) // x goes to 0
    {
        std::cout << x;
    }
}
```

入门语法, -- 和 大于

> Q113

```
#include <iostream>

using namespace std;

template<typename T>
void f(T) {
    cout << 1;
}

template<>
void f(int) {
    cout << 2;
}

void f(int) {
    cout << 3;
}

int main() {
    f(0.0);
    f(0);
    f<>(0);
}
```

匹配优先级，直接配 > 模板配 > 转换, 第三个不嫩配普通只能配模板

> Q338

```
#include <type_traits>
#include <iostream>
#include <string>

template<typename T>
int f()
{
    if constexpr (std::is_same_v<T, int>) { return 0; }
    else { return std::string{}; }
}

int main()
{
    std::cout << f<int>();
}
```

模板函数, 不依赖template出现错误(int 和 return std::string()), 则ill-formed 不需要诊断的ub

目前gcc,clang是编译错误，而msvc是输出0

> Q337

```
#include <iostream>
#include <type_traits>

int main() {
    auto a = "Hello, World!";
    std::cout << std::is_same_v<decltype("Hello, World!"), decltype(a)>;

    return 0;
}
```

decltype(e) 如果e的类型是T,且e是左值，则返回T&

decltype( const char的数组) = const char(&)[14]

而 auto a 得到的a是 指针: const char *

> Q148

```
#include <iostream>

volatile int a;

int main() {
  std::cout << (a + a);
}
```

volatile 首先意义是 可能程序外的其它程序/硬件 会对这个内容修改，所以编译器不要相关优化，而不影响初始化为0，而读写volatile是有副作用，表达式中计算顺序没有规定,所以一个表达式中有 不确定顺序的多个副作用则 ub, 和(i++)+(++i)

> Q119

```
#include <iostream>

int main() {
  void * p = &p;
  std::cout << bool(p);
}
```

分配了栈，p指向了自己栈空间上的地址

> Q238

```
#include <iostream>

int main() {
    std::cout << +!!"";
}
```

空字符串 是 string literal, 有指针

> Q193

```
#include <iostream>

int main() {
    int a[] = <%1%>;
    std::cout << a<:0:>;
}
```

C++ 提供一些可替换符号, `<%`,`%>`可替代`{`,`}`,而 `<:`,`:>`可替代`[`,`]`

> Q231

```cpp
#include <iostream>

struct override {};

struct Base {
    virtual override f() = 0;
};

struct Derived : Base {
    virtual auto f() -> override override{
        std::cout << "1";
        return override();
    }
};

int main() {
    Derived().f();
}
```

override不是保留字(final也不是)，它们只有特殊上下文才有特殊用处，因此上面也可以改成

```
#include <iostream>

struct foo {};

struct Base {
  virtual foo f() = 0;
};

struct Derived : Base {
  virtual auto f() -> foo override{
    std::cout << "1";
    return foo();
  }
};

int main() {
  Derived().f();
}
```

> Q250

```cpp
#include<iostream>

template<typename T>
void foo(T...) {std::cout << 'A';}

template<typename... T>
void foo(T...) {std::cout << 'B';}

int main(){
   foo(1);
   foo(1,2);
```

能否转化（都能），比较更好，比较隐式类型转换精准性 按顺序(这里两个一样), foo1能deduce成foo2,但foo2不能deduce成foo1

对于第二个调用, foo1(int,...), foo2(int,int) (更精准)

> Q293

```
#include <iostream>

int main(int argc, char* argv[]) {
    std::cout << (argv[argc] == nullptr);
}
```

是越界访问，但是规定了argv[argv]是0

> Q140

```
#include <iostream>
using namespace std;

size_t get_size_1(int* arr)
{
  return sizeof arr;
}

size_t get_size_2(int arr[])
{
  return sizeof arr;
}

size_t get_size_3(int (&arr)[10])
{
  return sizeof arr;
}

int main()
{
  int array[10];
  //Assume sizeof(int*) != sizeof(int[10])
  cout << (sizeof(array) == get_size_1(array));
  cout << (sizeof(array) == get_size_2(array));
  cout << (sizeof(array) == get_size_3(array));
}
```

sizeof 是编译时，参数 int arr[]和int * arr等价, sizeof指针只有指针大小

> Q121

```
#include <iostream>

int main() {
  int a = 10;
  int b = 20;
  int x;
  x = (a, b);
  std::cout << x;
}
```

逗号表达式

> Q222

```cpp
#include <variant>
#include <iostream>

using namespace std;

int main() {
   variant<int, double, char> v;
   cout << v.index();
}
```

未赋初始值时 内部`_npos` 为0, index()返回持有的值的类型的index,或者`_npos`

> Q109

```cpp
#include <functional>
#include <iostream>

template <typename T>
void call_with(std::function<void(T)> f, T val)
{
    f(val);
}

int main()
{
    auto print = [] (int x) { std::cout << x; };
    call_with(print, 42);
}
```

lambda是lambda一种特殊的，并不是`function<void(int)>` 但是可以转换成，所以这里deduce会失效，要手动指定`call_with<int>`

另一个就是C++20 中支持辅助

```
template <typename T>
struct type_identity
{
    typedef T type;
};
template <typename T>
void call_with(typename type_identity<std::function<void(T)>>::type f, T val)
{
    f(val);
}
```

> Q319

```cpp
#include <iostream>

struct A {
    A() { std::cout << "a"; }

    void foo() { std::cout << "1"; }
};

struct B {
    B() { std::cout << "b"; }
    B(const A&) { std::cout << "B"; }

    void foo() { std::cout << "2"; }
};

int main()
{
    auto L = [](auto flag) -> auto {return flag ? A{} : B{};};
    L(true).foo();
    L(false).foo();
}
```

一个问题是函数的返回类型，不应该同时是A和B, `B(const & A)` 被称作转换构造函数, 因此类型被推断为B

> Q186

```
#include <iostream>
#include <typeinfo>

void takes_pointer(int* pointer) {
  if (typeid(pointer) == typeid(int[])) std::cout << 'a';
  if (typeid(pointer) == typeid(int*)) std::cout << 'p';
}

void takes_array(int array[]) {
  if (typeid(array) == typeid(int[])) std::cout << 'a';
  if (typeid(array) == typeid(int*)) std::cout << 'p';
}

int main() {
  int* pointer = nullptr;
  int array[1];

  takes_pointer(array);
  takes_array(pointer);

  std::cout << (typeid(int*) == typeid(int[]));
}
```

`int *` 和 `int[]` 可以互相转换，但不一样

类型为 “array of N T” or “array of unknown bound of T” 的 左值或右值 可以被转化成 T的指针的 prvalue

所以匹配上都匹配了各自的函数，但在函数匹配完成以后

"After determining the type of each parameter, any parameter of type “array of T” (...) is adjusted to be “pointer to T”".

> Q235

```
#include <initializer_list>
#include <iostream>

class C {
public:
    C() = default;
    C(const C&) { std::cout << 1; }
};

void f(std::initializer_list<C> i) {}

int main() {
    C c;
    std::initializer_list<C> i{c};
    f(i);
    f(i);
}
```

i对c拷贝构造, 而在传递`std::initializer_list`时不会对里面的元素再次拷贝

> Q252

```
#include <iostream>

int main() {
    int i = '3' - '2';
    std::cout << i;
}
```

char 与 int的转换成ascii

> Q192

```
#include <vector>
#include <iostream>

std::vector<int> v;

int f1() {
  v.push_back(1);
  return 0;
}

int f2() {
  v.push_back(2);
  return 0;
}

void g(int, int) {}

void h() {
 g(f1(), f2());
}

int main() {
  h();
  h();
  std::cout << (v[0] == v[2]);
}
```

首先 函数参数解析顺序是 unspecified, 其次即使两次调用，也允许执行顺序不同

> Q288

```cpp
#include <iostream>

int main() {
    int I = 1, J = 1, K = 1;
    std::cout << (++I || ++J && ++K);
    std::cout << I << J << K;
}
```

我真不建议背诵 优先级，除了基本的括号和乘除法，其它的直接暴力上括号最好，&& 优先级高于 ||，而且短路运算, 但C++的短路最后还是会有bool值转换

> Q275

```cpp
#include <iostream>

int main()
{
    std::cout << (sizeof(long) > sizeof(int));
}
```

在标准中，`signed char`, `short int`, `int`, `long int`, and `long long int` 每个要能存下自己且不比前一个的小

int 至少是16,

long int至少是32

但是都可以是32

https://en.cppreference.com/w/cpp/language/types#Properties

注意的是当在64位系统中,int 32, long int 64

幸运的是在C++20中，就都是具体规定了的

> Q278

```
#include <iostream>
#include <tuple>

int main()
{
    const auto t = std::make_tuple(42, 3.14, 1337);
    std::cout << std::get<int>(t);
}
```

get调用时候指定的type,需要恰好一次出现在 tuple中，否则是ill-formed

> Q122

```cpp
#include <iostream>

typedef long long ll;

void foo(unsigned ll) {
    std::cout << "1";
}

void foo(unsigned long long) {
    std::cout << "2";
}

int main() {
    foo(2ull);
}
```

注意的是，第一个实际是`foo(unsigned int 变量名)`

> Q242

```
#include <iostream>
#include <type_traits>

void g(int&) { std::cout << 'L'; }
void g(int&&) { std::cout << 'R'; }

template<typename T>
void f(T&& t) {
    if (std::is_same_v<T, int>) { std::cout << 1; }
    if (std::is_same_v<T, int&>) { std::cout << 2; }
    if (std::is_same_v<T, int&&>) { std::cout << 3; }
    g(std::forward<T>(t));
}

int main() {
    f(42);
    int i = 0;
    f(i);
}
```

42 rvalue, i lvalue,

对于模板参数P, 若P是引用类型，the type referred to by P is used for type deduction.

P:T&&, 42:int, T:int

A forwarding reference is an rvalue reference to a cv-unqualified(no const or volatitle) template parameter [...].

T&& 的确是 一个cv-unqualified 模板参数的 右值引用，所以它是 forwarding reference.

If P is a forwarding reference and the argument is an lvalue, the type “lvalue reference to A” is used in place of A for type deduction.

注意到 42不是 lvalue, 不会用这个规则

i是lvalue,因此 使用T=int&, (这里看上去并不会是 (int& &&t),而是相当于(T && t)是模板语法中的一个feature?

在f内部t都是lvalue, 如果没有forward,g(int&)会被调用，而加了forward

f(42),T=int, forward返回 `static_cast<int&&>(t)`, rvalue

f(i),T=int&, forward返回 `static_cast<int&&&>(t)`, lvalue

注: Reference collapsing: int&&& above collapsed to int&

```
int i;
typedef int& LRI;
typedef int&& RRI;

LRI& r1 = i;                    // r1 has the type int&
const LRI& r2 = i;              // r2 has the type int&
const LRI&& r3 = i;             // r3 has the type int&

RRI& r4 = i;                    // r4 has the type int&
RRI&& r5 = 5;                   // r5 has the type int&&

decltype(r2)& r6 = i;           // r6 has the type int&
decltype(r2)&& r7 = i;          // r7 has the type int&
```

> Q229

```cpp
#include <iostream>

int a = 1;

int main() {
    auto f = [](int b) { return a + b; };

    std::cout << f(4);
}
```

lambda 的 [] 不会capture 自动存储(automatic storage)的变量，但是a是static storage,能访问到

> Q111

```cpp
#include <iostream>

int main() {
    int i=1;
    do {
        std::cout << i;
        i++;
        if(i < 3) continue;
    } while(false);
    return 0;
}
```

这和 while放前面还是for中的一样的，只是C++写法上放在后面，但它依然是继续循环的条件, 所以这里false 改成任何其它表达式，也都会在每次循环中再检查

> Q132

```cpp
#include <iostream>
using namespace std;

int foo() {
  cout << 1;
  return 1;
}

void bar(int i = foo()) {}

int main() {
  bar();
  bar();
}
```

这就是c++转python必踩的坑, py的就只执行一次

```py
def h(): print(1);
def f(x = h()): pass;
f();f();
```

# 类

> Q5

```
#include <iostream>

struct A {
  A() { std::cout << "A"; }
};
struct B {
  B() { std::cout << "B"; }
};

class C {
public:
  C() : a(), b() {}

private:
  B b;
  A a;
};

int main() {
    C();
}
```

成员函数的初始化顺序是根据 声明顺序，而不是初始化顺序，`gcc`编译时有`-Wrorder`可以提示Warning

> Q7

```
#include <iostream>

class A {
public:
  void f() { std::cout << "A"; }
};

class B : public A {
public:
  void f() { std::cout << "B"; }
};

void g(A &a) { a.f(); }

int main() {
  B b;
  g(b);
}
```

因为`A`中的`f`不是`virtual`所以不会有`覆盖`去找对应实际类的函数

> Q18


```cpp
#include <iostream>

class A {
public:
  virtual void f() { std::cout << "A"; }
};

class B : public A {
private:
  void f() { std::cout << "B"; }
};

void g(A &a) { a.f(); }

int main() {
  B b;
  g(b);
}
```

引用+虚函数

> Q8

```
#include <iostream>

class A {
public:
  virtual void f() { std::cout << "A"; }
};

class B : public A {
public:
  void f() { std::cout << "B"; }
};

void g(A a) { a.f(); }

int main() {
  B b;
  g(b);
}
```

这里不是引用和指针，而是真的类型变换了

> Q13

```
#include <iostream>

class A {
public:
  A() { std::cout << "a"; }
  ~A() { std::cout << "A"; }
};

class B {
public:
  B() { std::cout << "b"; }
  ~B() { std::cout << "B"; }
};

class C {
public:
  C() { std::cout << "c"; }
  ~C() { std::cout << "C"; }
};

A a;
int main() {
  C c;
  B b;
}
```

A不是`constexpr` 因此是dynamic, 它可能在main之前初始化，也可能在任何same translation unit之前，但都在c,b之前，A(static storage)的析构发生在main return以后, 对于b,c的析构是与其construction相反的(在函数main的最后的括号)，而不是看所在的最后使用，

> Q14

```
#include <iostream>

class A {
public:
  A() { std::cout << "a"; }
  ~A() { std::cout << "A"; }
};

class B {
public:
  B() { std::cout << "b"; }
  ~B() { std::cout << "B"; }
};

class C {
public:
  C() { std::cout << "c"; }
  ~C() { std::cout << "C"; }
};

A a;

void foo() { static C c; }
int main() {
  B b;
  foo();
}
```

多了个`static c`, 它是在首次访问时初始化的，而destruct是和A属于同样的，所以是和construct相反的顺序

> Q15

```
#include <iostream>
#include <exception>

int x = 0;

class A {
public:
  A() {
    std::cout << 'a';
    if (x++ == 0) {
      throw std::exception();
    }
  }
  ~A() { std::cout << 'A'; }
};

class B {
public:
  B() { std::cout << 'b'; }
  ~B() { std::cout << 'B'; }
  A a;
};

void foo() { static B b; }

int main() {
  try {
    foo();
  }
  catch (std::exception &) {
    std::cout << 'c';
    foo();
  }
}
```

成员函数先于自身construct, 失败的static初始化等效于还未初始化, exception以后会略过任何函数(destruct函数一样略过)

> Q16

```
#include <iostream>

class A {
public:
  A() { std::cout << 'a'; }
  ~A() { std::cout << 'A'; }
};

class B {
public:
  B() { std::cout << 'b'; }
  ~B() { std::cout << 'B'; }
  A a;
};

int main() { B b; }
```

成员初始, 自己初始, 自己结束, 成员结束

> Q17

```
#include <iostream>

class A {
public:
  A() { std::cout << 'a'; }
  ~A() { std::cout << 'A'; }
};

class B : public A {
public:
  B() { std::cout << 'b'; }
  ~B() { std::cout << 'B'; }
};

int main() { B b; }
```

父类初始，自己初始，自己结束，父类结束

> Q27

```
#include <iostream>

struct A {
  virtual std::ostream &put(std::ostream &o) const {
    return o << 'A';
  }
};

struct B : A {
  virtual std::ostream &put(std::ostream &o) const {
    return o << 'B';
  }
};

std::ostream &operator<<(std::ostream &o, const A &a) {
  return a.put(o);
}

int main() {
  B b;
  std::cout << b;
}
```

对`operator <<`实现多态的一个方法

> Q28

```
#include <iostream>

struct A {
  A() { std::cout << "A"; }
  A(const A &a) { std::cout << "B"; }
  virtual void f() { std::cout << "C"; }
};

int main() {
  A a[2];
  for (auto x : a) {
    x.f();
  }
}
```

C++11 standard, §8.5/6, 虽然函数中`int x[2]`不会初始化到0,但是对于类，构造函数会被调用,`for(auto x:a)`是新建变量的写法

> Q29

```
#include <iostream>

struct A {
  A() { foo(); }
  virtual ~A() { foo(); }
  virtual void foo() { std::cout << "1"; }
  void bar() { foo(); }
};

struct B : public A {
  virtual void foo() { std::cout << "2"; }
};

int main() {
  B b;
  b.bar();
}
```

constructors 和destructors 中不会考虑 virtual, 而bar虽然本身不是virtual,但从实现角度实际上是`(B::bar()->B::foo())`, 所以串连调用到的依然是`virtual`

> Q23

```
#include <iostream>

struct X {
  X() { std::cout << "a"; }
  X(const X &x) { std::cout << "b"; } // copy constructor
  const X &operator=(const X &x) { // copy assignment
    std::cout << "c";
    return *this;
  }
};

int main() {
  X x;
  X y(x); // copy constructor
  X z = y; // copy constructor
  z = x;
}
```

> Q33

```
#include <iostream>

struct GeneralException {
  virtual void print() { std::cout << "G"; }
};

struct SpecialException : public GeneralException {
  void print() override { std::cout << "S"; }
};

void f() { throw SpecialException(); }

int main() {
  try {
    f();
  }
  catch (GeneralException e) {
    e.print();
  }
}
```

类型真的变了,不是指针和引用

> Q42

```
#include <initializer_list>
#include <iostream>

struct A {
  A() { std::cout << "1"; }

  A(int) { std::cout << "2"; }

  A(std::initializer_list<int>) { std::cout << "3"; }
};

int main(int argc, char *argv[]) {
  A a1;
  A a2{};
  A a3{ 1 };
  A a4{ 1, 2 };
}
```

0个参数`{}`用`()`, `initializer-list constructor`优先级更高

> Q44

```
#include <iostream>
struct X {
  virtual void f() const { std::cout << "X"; }
};

struct Y : public X {
  void f() const { std::cout << "Y"; }
};

void print(const X &x) { x.f(); }

int main() {
  X arr[1];
  Y y1;
  arr[0] = y1;
  print(y1);
  print(arr[0]);
}
```

类型真的变了

> Q52

```
#include <iostream>

class A;

class B {
public:
  B() { std::cout << "B"; }
  friend B A::createB();
};

class A {
public:
  A() { std::cout << "A"; }

  B createB() { return B(); }
};

int main() {
  A a;
  B b = a.createB();
}
```

B中要friend A 的函数, 需要在之前知道A中有这个函数，不仅仅知道有A

> Q133

```
#include <iostream>
using namespace std;

class A
{
public:
    A() { cout << "A"; }
    A(const A &) { cout << "a"; }
};

class B: public virtual A
{
public:
    B() { cout << "B"; }
    B(const B &) { cout<< "b"; }
};

class C: public virtual A
{
public:
    C() { cout<< "C"; }
    C(const C &) { cout << "c"; }
};

class D:B,C
{
public:
    D() { cout<< "D"; }
    D(const D &) { cout << "d"; }
};

int main()
{
    D d1;
    D d2(d1);
}
```

父类先构, 多依赖顺序构，虚基类depth-first left-to-right不重复(如果不是`虚`则会重复), 用户定义的D的copy构造需要里面用户去描述依赖的如何处理，ABC不会走依赖的copy

> Q307

```
#include <iostream>

struct S
{
  S() = delete;
  int x;
};

int main()
{
  auto s = S{};
  std::cout << s.x;
}
```

S的默认构造函数是user-declared, 但不是user-provided(= user-declared + not explicitly defaulted or deleted on its first declaration.), `S{}`是`aggregate initialization`, 不调用初始化函数

s的x会从 空的initializer list调用 拷贝构造, 如果初始列表没有元素，则会value-initialized, 对int来说是0

注意: 此行为C++20(P1008R1), 因为有user-declared构造，因此它会编译错误

> Q187

```
#include <iostream>

struct C {
  C() { std::cout << "1"; }
  C(const C& other) { std::cout << "2"; }
  C& operator=(const C& other) { std::cout << "3"; return *this;}
};

int main() {
  C c1;
  C c2 = c1;
}
```

拷贝构造

> Q283

```
#include <iostream>

class show_id
{
public:
    ~show_id() { std::cout << id; }
    int id;
};

int main()
{
    delete[] new show_id[3]{ {0}, {1}, {2} };
}
```

delete 和 new对称，所以保持destruct和construct的顺序是反的,


> Q190

```
#include <iostream>

struct A {
  A(int i) : m_i(i) {}
  operator bool() const { return m_i > 0; }
  int m_i;
};

int main() {
  A a1(1), a2(2);
  std::cout << a1 + a2 << (a1 == a2);
}
```

没有默认比较函数，都会调用int转换，所以先到bool再到int

> Q140

```
#include <iostream>
#include <memory>
#include <vector>

class C {
public:
  void foo()       { std::cout << "A"; }
  void foo() const { std::cout << "B"; }
};

struct S {
  std::vector<C> v;
  std::unique_ptr<C> u;
  C *const p;

  S()
    : v(1)
    , u(new C())
    , p(u.get())
  {}
};

int main() {
  S s;
  const S &r = s;

  s.v[0].foo();
  s.u->foo();
  s.p->foo();

  r.v[0].foo();
  r.u->foo();
  r.p->foo();
}
```

`vector`是`const-correct`实现的，所以`r.v[0].foo()`会调用`foo() const`版本, 对于指针来说，与本身是否const无关, 至于`C *const p` 是`p`不变而不是`p`指向的是`const`因此， 只会有上面一个B,其它都是A

> Q184

```
#include <iostream>

struct Base {
  void f(int) { std::cout << "i"; }
};

struct Derived : Base {
  void f(double) { std::cout << "d"; }
};

int main() {
  Derived d;
  int i = 0;
  d.f(i);
}
```

会隐藏掉父类的，尽管看上去是不同的overload

> Q130

```
#include <iostream>
using namespace std;

template<typename T>
void adl(T)
{
  cout << "T";
}

struct S
{
};

template<typename T>
void call_adl(T t)
{
  adl(S());
  adl(t);
}

void adl(S)
{
  cout << "S";
}

int main ()
{
  call_adl(S());
}
```

`adl(S())`独立于模板会立刻查询，而之前的定义只有`adl(T)`, 对于`adl(t)`依赖于模板会延后查询，所以会找到更精确的`adl(S)`

> Q158

```
#include <iostream>
#include <vector>

struct Foo
{
    Foo() { std::cout<<"a"; }
    Foo(const Foo&) { std::cout<<"b"; }
};

int main()
{
    std::vector<Foo> bar(5);
}
```

vector默认初始化调用的是`T()`

> Q160

```
#include <iostream>

struct A {
    virtual void foo (int a = 1) {
        std::cout << "A" << a;
    }
};

struct B : A {
    virtual void foo (int a = 2) {
        std::cout << "B" << a;
    }
};

int main () {
    A *b = new B;
    b->foo();
}
```

虚函数+指针，这里选中了`foo(int)` 所以肯定是"B",但是在参数放置的时候是A, 选函数，放参数，调用函数

> Q162

```
#include <iostream>

void f()
{
    std::cout << "1";
}

template<typename T>
struct B
{
    void f()
    {
        std::cout << "2";
    }
};

template<typename T>
struct D : B<T>
{
    void g()
    {
        f();
    }
};

int main()
{
    D<int> d;
    d.g();
}
```

问题在于f调用的是继承于B的还是全局的, 定义class template, 基类有template 参数, 因此应该调用全局的f

https://stackoverflow.com/questions/4643074/why-do-i-have-to-access-template-base-class-members-through-the-this-pointer

> Q318

```
#include <iostream>

struct S {
  operator void() {
    std::cout << "F";
  }
};

int main() {
  S s;
  (void)s;
  static_cast<void>(s);
  s.operator void();
}
```

A conversion function is never used to convert a (possibly cv-qualified) object to the (possibly cv-qualified) same object type (or a reference to it), to a (possibly cv-qualified) base class of that type (or a reference to it), or to (possibly cv-qualified) void, 因此只有最后的显式调用函数才会触发，而只是调用转换并不会触发函数

> Q131

```
#include <iostream>

class C {
public:
  explicit C(int) {
    std::cout << "i";
  }
  C(double) {
    std::cout << "d";
  }
};

int main() {
  C c1(7);
  C c2 = 7;
}
```

大多数情况 直接初始化 和 copy构造 一样，但是这里 explicit 意味着只接受`(),{}`两种不包括 copy构造

> Q296

```
#include <iostream>

struct S {
    int one;
    int two;
    int three;
};

int main() {
    S s{1,2};
    std::cout << s.one;
}
```

可以比原来更短， 但是对应位置能够有对应的初始化，否则是ill-formed

> Q126

```
#include<iostream>

int foo()
{
  return 10;
}

struct foobar
{
  static int x;
  static int foo()
  {
    return 11;
  }
};

int foobar::x = foo();

int main()
{
    std::cout << foobar::x;
}
```

`A name used in the definition of a static data member of class X (...) is looked up as if the name was used in a member function of X`

> Q225

```
#include <iostream>

struct X {
    X() { std::cout << "1"; }
    X(const X &) { std::cout << "3"; }
    ~X() { std::cout << "2"; }

    void f() { std::cout << "4"; }

} object;

int main() {
    X(object);
    object.f();
}
```

全局的1, 而这里`X(object)` (§8.2.3), 是声明一个新的 变量object,所以这里其实和`X(foo)`等价, 并不是零时的 无名变量，

> Q124

```cpp
#include <iostream>

using namespace std;

struct A {};
struct B {};

template<typename T = A>
struct X;

template<>
struct X<A> {
   static void f() { cout << 1; }
};

template<>
struct X<B> {
   static void f() { cout << 2; }
};

template< template<typename T = B> class C>
void g() {
   C<>::f();
}

int main() {
   g<X>();
}
```

https://timsong-cpp.github.io/cppwp/n4659/temp.param#14

模板中模板变量的模板变量允许有默认参数，这样指定默认参数后，会用这个默认参数。

template template-parameter is `C`

scope of C is the function g()

the default arguments of C (i.e. T = B) are applied and `C < B >::f()` is called inside g()

> Q221

```cpp
#include <iostream>

struct C {
    int& i;
};

int main() {
    int x = 1;
    int y = 2;

    C c{x};
    c.i = y;

    std::cout << x << y << c.i;
}
```

i是引用

> Q312

```cpp
#include <iostream>

class A {};

class B {
public:
    int x = 0;
};

class C : public A, B {};

struct D : private A, B {};


int main()
{
    C c;
    c.x = 3;

    D d;
    d.x = 3;

    std::cout << c.x << d.x;
}
```

基类class,的public被另一个类public,则在另一个类中是public,

基类class,的public被另一个类private,则在另一个类中是private,

但这里B并没有指明，只指明了A, 而 `class` C隐含private, `struct` D隐含public, 因此对c.x访问编译错误

> Q163

```
#include <iostream>

class A {
  int foo = 0;

public:
  int& getFoo() { return foo; }
  void printFoo() { std::cout << foo; }
};

int main() {
  A a;

  auto bar = a.getFoo();
  ++bar;

  a.printFoo();
}
```

auto bar = a.getFoo(); 中 auto的推断 和 下面模板推断过程相同

```
template<typename T> void f(T t);
f(a.getFoo());
```

模板deduct中：如果表达式是对T的引用，则先调整为T

> Q284

```
#include <iostream>
#include <string>

auto main() -> int {
  std::string out{"Hello world"};
  std::cout << (out[out.size()] == '\0');
}
```

虽然string可能没有像char[]那样多存一个结束位，但 当 下标访问等于长度时，被要求返回'\0'

> Q243

```
#include <iostream>

template <typename T>
struct A {
    static_assert(T::value);
};

struct B {
    static constexpr bool value = false;
};

int main() {
    A<B>* a;
    std::cout << 1;
}
```

除非类模板专业化被显式实例化（17.7.2）或显式专业化（17.7.3），否则当专业化在需要完全定义的对象类型的上下文中被引用时，或者当类类型的完整性影响到程序的语义时，类模板专业化被隐式实例化。

类模板特化`A<B>`没有被显式实例化，也没有显式特化，那么问题就在于它是否隐式实例化了。我们只是声明了它的一个指针，这不需要一个完全定义的对象类型，所以它不是实例化的。程序编译得很好，1被打印出来。

> Q350

```cpp
#include<iostream>
#include<functional>
class Q{
    int v=0;
    public:
        Q(Q&&){
            std::cout << "M";
        }
        Q(const Q&){
            std::cout << "C";
        }
        Q(){
            std::cout << "D";
        }
        void change(){
            ++v;
        }
        void func(){
            std::cout << v;
        }
};
void takeQfunc(std::function<void(Q)> qfunc){
    Q q;
    q.func();
    qfunc(q);
    q.func();
}
int main(){
    takeQfunc([](Q&& q){
        q.change();
    });
    return 0;
}
```

关键是 `qfunc(q)`, lambda中是 rvalue引用`Q&&`, 但是实际是 q => 先copy产生 => 再传递

> Q224

```cpp
#include <iostream>

struct Base {
    virtual int f() = 0;
};

int Base::f() { return 1; }

struct Derived : Base {
    int f() override;
};

int Derived::f() { return 2; }

int main() {
    Derived object;
    std::cout << object.f();
    std::cout << ((Base&)object).f();
}
```

可以在外部给纯虚函数声明, 依然保持虚函数性质

> Q264

```cpp
#include <iostream>

struct C {
    C() = default;
    int i;
};

int main() {
    const C c;
    std::cout << c.i;
}
```

> Q230

```
#include <iostream>

struct X {
    int var1 : 3;
    int var2;
};

int main() {
    X x;
    std::cout << (&x.var1 < &x.var2);
}
```

主要是这个语法 bit-fields 是 https://en.cppreference.com/w/c/language/bit_field

它non-static 成员,不能用&,因此“没有”地址

> Q323

```cpp
#include <iostream>
#include <stdexcept>

struct A {
    A(char c) : c_(c) {}
    ~A() { std::cout << c_; }
    char c_;
};

struct Y { ~Y() noexcept(false) { throw std::runtime_error(""); } };

A f() {
    try {
        A a('a');
        Y y;
        A b('b');
        return {'c'};
    } catch (...) {
    }
    return {'d'};
}

int main()
{
    f();
}
```

如果每个具有自动存储期限的对象在进入try块后已经被构建，但还没有被销毁，则会被销毁。如果在销毁临时变量或返回语句的局部变量的过程中抛出一个异常，返回对象（如果有的话）的析构器也会被调用。对象被销毁的顺序与它们的构造完成的顺序相反。

因此是 b销毁，y出错，销毁返回的对象c，销毁a,再销毁d,而目前 gcc,clang,msvc都没有遵循标准

> Q145

```cpp
#include <iostream>

struct E
{
  E() { std::cout << "1"; }
  E(const E&) { std::cout << "2"; }
  ~E() { std::cout << "3"; }
};

E f()
{
  return E();
}

int main()
{
  f();
}
```

最后的E()是prvalue(is an expression whose evaluation initializes an object or a bit-field, or computes the value of the operand of an operator, as specified by the context in which it appears.)

prvalue只有在需要的时候才会创建一个临时的

return 语句用 glvalue/prvalue 来拷贝构造初始化，如果拷贝初始化表达式是prvalue并且源类型的cv-unqualified版本与目标类型的类相同，初始化器表达式被用来初始化目标对象。

因此no copy 也 no move


# 循环

> Q6

```
#include <iostream>

int main() {
  for (int i = 0; i < 3; i++)
    std::cout << i;
  for (int i = 0; i < 3; ++i)
    std::cout << i;
}
```

入门

# 引用

> Q9

```
#include <iostream>

int f(int &a, int &b) {
  a = 3;
  b = 4;
  return a + b;
}

int main() {
  int a = 1;
  int b = 2;
  int c = f(a, a);
  std::cout << a << b << c;
}
```

引用始终指向同一个内容

# 初始化

> Q11

```
#include <iostream>
int a;
int main () {
    std::cout << a;
}
```

全局变量初始化0

> Q12

```
#include <iostream>

int main() {
  static int a;
  std::cout << a;
}
```

static local变量初始化0

# STL

> Q35

```
#include <iostream>
#include <vector>

int main() {
  std::vector<int> v1(1, 2);
  std::vector<int> v2{ 1, 2 };
  std::cout << v1.size() << v2.size();
}
```

vector初始化写法 `(size,value)` 和 List-initialization

# future

> Q48

```
#include <iostream>
#include <string>
#include <future>

int main() {
  std::string x = "x";

  std::async(std::launch::async, [&x]() {
    x = "y";
  });
  std::async(std::launch::async, [&x]() {
    x = "z";
  });

  std::cout << x;
}
```

async返回的在行末尾 destructor, 所以一定有序

> Q340

```
#include <future>
#include <iostream>

int main()
{
    try {
        std::promise<int> p;
        std::future<int> f1 = p.get_future();
        std::future<int> f2 = p.get_future();
        p.set_value(1);
        std::cout << f1.get() << f2.get();
    } catch(const std::exception& e)
    {
        std::cout << 2;
    }
}
```

promise 只能get_future一次，否则throw exception

> Q339

```
#include <future>
#include <iostream>

int main()
{
    std::promise<int> p;
    std::future<int> f = p.get_future();
    p.set_value(1);
    std::cout << f.get();
    std::cout << f.get();
}
```

get只能一次，否则是undefined behaviour, (大多数实现是 throw exception




# 生命周期

> Q49

```
#include <iostream>

class C {
public:
  C(int i) : i(i) { std::cout << i; }
  ~C() { std::cout << i + 5; }

private:
  int i;
};

int main() {
  const C &c = C(1);
  C(2);
  C(3);
}
```

临时变量 在最后使用时触发析构, 但是`C(1)`被引用持有

# copy

> Q281

```
#include <iostream>

class C
{
public:
    C(){}
    C(const C&){} //User-declared, disables move constructor
};

int main()
{
    C c;
    C c2(std::move(c));
    std::cout << "ok";
}
```

`c2`用一个rvalue构造, 但没有用户定义的copy构造时才会隐式生成move构造所以这里没有move构造,

这里实际上是 表达式`rvalue`看作`converted initializer`,而表达式产生的值是`glvalue`,因此`const C&`绑定的`glvalue`, `std::move`产生的同时是`rvalue`和`glvalue`

https://blog.knatten.org/2018/03/09/lvalues-rvalues-glvalues-prvalues-xvalues-help/

![values all](https://aknatten.files.wordpress.com/2018/03/all.png)

> Q217

```
#include <iostream>

int main() {
    int i = 1;
    int const& a = i > 0 ? i : 1;
    i = 2;
    std::cout << i << a;
}
```

关键是a 是否是i的引用? 这里i是lvalue, 1是prvalue, 所以问题就是三元运算符在这种情况产生的是什么，这里是prvalue , 所以右侧是表达式， 左侧引用的是表达式的结果

> Q249

```
#include <iostream>

using namespace std;

int main() {
    int a = '0';
    char const &b = a;
    cout << b;
    a++;
    cout << b;
}
```

这里 char和int 不是`reference-related`, 因此实际上引用的是产生的 `prvalue`

> Q112

```
#include <iostream>
#include <utility>

struct A
{
	A() { std::cout << "1"; }
	A(const A&) { std::cout << "2"; }
	A(A&&) { std::cout << "3"; }
};

struct B
{
	A a;
	B() { std::cout << "4"; }
	B(const B& b) : a(b.a) { std::cout << "5"; }
	B(B&& b) : a(b.a) { std::cout << "6"; }
};

int main()
{
	B b1;
	B b2 = std::move(b1);
}
```

这里就是`std::move` 让结果变成`xvalue` 触发`(B&&b)`, 虽然`b`是`rvalue`的引用,但是`b`是`lvalue`, 所以说触发 copy构造 `(const &A)`

> Q178

```
#include <iostream>

int main() {
 int a = 5,b = 2;
 std::cout << a+++++b;
}
```

并不会被解析成`a++ + ++b`, 有一个`maximal munch principle`, 最长的序列产生token即使会语法错误, 因此被解析成`a++ ++ +b`, `rvalue`不能`++`

这里有问题是 `std::vector<std::vector<int>>` 在C++11以后可以被正确解析，而在之前需要加空格

类似相关问题还有`y/*z`要写作`y/(*z)`


> Q226

```
#include <iostream>
#include <utility>

struct X {
    X() { std::cout << "1"; }
    X(X &) { std::cout << "2"; }
    X(const X &) { std::cout << "3"; }
    X(X &&) { std::cout << "4"; }
    ~X() { std::cout << "5"; }
};

struct Y {
    mutable X x;
    Y() = default;
    Y(const Y &) = default;
};

int main() {
    Y y1;
    Y y2 = std::move(y1);
}
```

使用Y的隐式move拷贝, y1变成rvalue以后，因为x是mutable让const 无效, 所以`(X &)`

> Q195

```
#include <iostream>
#include <cstddef>
#include <type_traits>

int main() {
  std::cout << std::is_pointer_v<decltype(nullptr)>;
}
```

`nullptr` 是`std::nullptr_t`的`prvalue` 并不真的是个指针类型, instead, `nullptr`是一个`null pointer constant` 可以被转换成pointer

> Q116

```
#include <iostream>
#include <utility>

int y(int &) { return 1; }
int y(int &&) { return 2; }

template <class T> int f(T &&x) { return y(x); }
template <class T> int g(T &&x) { return y(std::move(x)); }
template <class T> int h(T &&x) { return y(std::forward<T>(x)); }

int main() {
  int i = 10;
  std::cout << f(i) << f(20);
  std::cout << g(i) << g(20);
  std::cout << h(i) << h(20);
  return 0;
}
```

`T&&`并不一定是rvalue引用, 这里`(i)`的lvalue调用`T&&x`变成了`T&x`(lvalue 的引用),而`(20)`则是`T&& x`(rvalue的引用), 在函数内`x`始终是lvalue, 而forward能保持x是lvalue ref还是rvalue ref



https://isocpp.org/blog/2012/11/universal-references-in-c11-scott-meyers

> Q208

```
#include <iostream>
#include <map>
using namespace std;

bool default_constructed = false;
bool constructed = false;
bool assigned = false;

class C {
public:
    C() { default_constructed = true; }
    C(int) { constructed = true; }
    C& operator=(const C&) { assigned = true; return *this;}
};

int main() {
    map<int, C> m;
    m[7] = C(1);

    cout << default_constructed << constructed << assigned;
}
```

临时值靠`(int)`, map的`[]`行为会创建`C()`,之后就是copy赋值

> Q265

```
#include <iostream>

void f(char*&&) { std::cout << 1; }
void f(char*&) { std::cout << 2; }

int main() {
   char c = 'a';
   f(&c);
}
```

`&c` 是 `rvalue`


# sstream

> Q261

```
#include <iostream>
#include <sstream>

int main() {
  std::stringstream ss("a");
  std::cout << ss.str();
  ss << "b";
  std::cout << ss.str();
}
```

注意是 初始字符串"a", 但是`<<`写入的"b"从buffer的结束位置(从头)，所以会覆盖掉`a`, 更明显的例子,可以用"axx"初始化,然后一次`<<"b"`,一次`<<"c"`,会得到`axxbxxbcx`

另外是在初始化时，可以用`std::stringstream ss("a", std::ios_base::out|std::ios_base::ate);`, 来让它从末尾增加

# 异常

> Q239

```
#include <stdexcept>
#include <iostream>

int main() {
    try {
        throw std::out_of_range("");
    } catch (std::exception& e) {
        std::cout << 1;
    } catch (std::out_of_range& e) {
        std::cout << 2;
    }
}
```

顺序判断+继承判断


## 总结

有一些是都遵守了的，而还是有一些，实际的编译器并没有遵守，而实际的编码中，有些是有办法更明确的写出而不需要耗过多额外代码的，这种情况还是不要依赖于其特性

反过来，可以看到当复杂到了一个语言，就有很多“肮脏的角落”，并不像很多数学引理那样干净，另一个角度就是如果是新语言，在模糊的地方总需要很多易读的强制

甚至实际到gcc clang msvc， 还是有个别standard没有遵守的

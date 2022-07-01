---
title: TS Cheat Sheet
date: 2022-06-30
tags: [frontend]
category: [code]
mathjax: true
---

# TS Cheat Sheet

## 为什么写这篇

[antfu的题目](https://github.com/type-challenges/type-challenges) 大多就是基础方法+递归, issues充斥着重复内容, 最开始还有点TS的味道, 后面完全变成了只有基础方法, 组合出一个东西, 感觉这个更适合作为递归练习题, 而不是TS练习题 (没有加减强行用数组拼接+length

TS也有文档,但是英文的,难以用中文检索

本篇呢,是cheatsheet,不是document,把实际会用到常用的一些列出来+一些场景描述

## 内容

### 官方文档

[TS默认类型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

[范围控制 通过各种if让一个范围内 的类型被自动推断](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing)

[函数](https://www.typescriptlang.org/docs/handbook/2/functions.html)

[对象](https://www.typescriptlang.org/docs/handbook/2/objects.html)

[Generic 通用类型](https://www.typescriptlang.org/docs/handbook/2/generics.html)

[Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

[Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

[模板字面类型](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

[类](https://www.typescriptlang.org/docs/handbook/2/classes.html)

[https://www.typescriptlang.org/docs/handbook/2/modules.html](https://www.typescriptlang.org/docs/handbook/2/modules.html)

### playground

https://www.typescriptlang.org/play

### 3方工具库

https://www.npmjs.com/package/ts-toolbelt

https://www.npmjs.com/package/utility-types

### 自定义类型名

```ts
type HelloWorld = string
```

### 有默认值的参数

```ts
type HelloWord<T,W = 默认值>
```

### 数组内容的类型Union

https://www.typescriptlang.org/docs/handbook/2/conditional-types.html

```ts
T[number]
```

### 对象

空对象

```ts
Record<string, never>
```

对象里面, 父类的required key不比子类多, 且对应的是public

```ts
type p0 = {} extends {}?true:false
// p0 = true
type p1 = {} extends {x?:3}?true:false
// p1 = true
type p2 = {} extends {x:3}?true:false
// p2 = false
type p3 = {x:3} extends {}?true:false
// p3 = true
```

### 条件类型

https://www.typescriptlang.org/docs/handbook/2/conditional-types.html

相当于引入了`if`逻辑, 有了这个你可以自定义很多默认未提供的操作符, 并且可以递归的定义

```ts
T extends U ? X : Y
```

注意的是 T 如果是Union类型, 会**分别**对Union的**每一个**进行校验, 见 https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types

为了防止 Union 被拆散 可以套一层括号

```ts
type W<T> = T extends never ? never : [T]
type K = W<1|2>
// K = [1] | [2] 而不是 [1|2]
```

`U` 可以是单独类型/数值/字符串,联合类型, 甚至

```ts
`${'a' | 'b'}${infer R}`
```

而且这似乎在`+?`,`-?`,`-readonly`,`+readonly`上没法用,还要拆开再合并

注意`+?` 会让类型多`|undefined`,`-?` 会去掉`undefined`, 所以对对象 `Required<Partial<Type>>` 操作, `undefined` 会变`never`

#### 在条件中提取未知的具体类型

https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types

```ts
type Flatten<Type> = Type extends Array<infer XXX> ? XXX : Type;
```

递归例子

```ts
W<T extends S<any>> = T extends S<infer U> ? (U extends S<any> ? W<U> : U) : never
```

可以递归提取数组, 对象值, 函数参数, 函数返回值

```ts
type Includes<T extends readonly any[], U> = T extends [infer A, ...infer R] ? (Equal<A, U> extends true ? true : Includes<R, U>) : false
```

函数参数类型 union 的提取

```ts
type Y =  ((x: {y:3}) => any) | ((z: {w:4}) => any)
type X = Y extends (x: infer V) => any ? V : never
// X = {y:3} & {w:4}
```

### Union

合并两个类型, 并让类型自动区别具体是哪个, 例如接口成功返回字段和失败返回字段不一样

```ts
interface SuccessResp{
  status: 0; // 枚举量
  value: string;
}

interface ErrorResp{
  status: 'error'; // 枚举量
  message: string;
}

type Resp = SuccessResp | ErrorResp
// ts

const r: Readonly<Resp> = api.xxx(...);
if (r.status == 'error'){
  // ... ErrorResp
}else{
  // ... SuccessResp
}
```

### 获取一个对象的所有键的字符串Union

https://www.typescriptlang.org/docs/handbook/2/keyof-types.html

有了这个你可以去对对象键操作做校验

```ts
type Point = { x: number; y: number };
type P = keyof Point;
// P = 'x' | 'y'
```

同理获得对象所有值的Union

```ts
type Point = { x: number; y: number };
type P = Point[keyof Point];
// P = number
```

### 同值类型不同键名

https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type

```ts
Record<Keys, Type>
```

```ts
interface CatInfo {
  age: number;
  breed: string;
}
 
type CatName = "miffy" | "boris" | "mordred";
 
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
```

### 字段相关工具 Pick / Omit / Mapped Types

字段相关工具

https://www.typescriptlang.org/docs/handbook/utility-types.html

从已有的类型中取其中部分字段建立新类型

https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys

```ts
Pick<Type, Keys>
```

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
 
type TodoPreview = Pick<Todo, "title" | "completed">;
```

从已有的类型中移除部分字段建立新类型

https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys

```ts
Omit<Type, Keys>
```

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}
 
type TodoPreview = Omit<Todo, "description">;
```

自定义需要哪些键, 从哪个Type中取, 甚至做一些去除 `?`, 键名重定义`as`的操作(可以`as`到`never` 消除这个键)

https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

```ts
[XXX in keyof T]: ...
```

```ts
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
 
interface Person {
    name: string;
    age: number;
    location: string;
}
 
type LazyPerson = Getters<Person>;
         
// type LazyPerson = {
//     getName: () => string;
//     getAge: () => number;
//     getLocation: () => string;
// }
```

更新对象部分内容时

```ts
Partial<Type>
```

```ts
interface Todo {
  title: string;
  description: string;
}
 
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}
 
const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};
 
const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

### Equal

https://stackoverflow.com/questions/53807517/how-to-test-if-two-types-are-exactly-the-same/53808212#53808212

```ts
type IfEquals<T, U, Y=unknown, N=never> =
  (<G>() => G extends T ? 1 : 2) extends
  (<G>() => G extends U ? 1 : 2) ? Y : N;
```

### 只读

只有首次赋值, 不能修改, 和freeze一样,不影响二级的内容,只是顶级的内容 

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype

```ts
Readonly<Type>
```

```ts
interface Todo {
  title: string;
}
 
const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};
```

### 从Union Type中去掉指定的一些Type

https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers

```ts
Exclude<UnionType, ExcludedMembers>
```

```ts
type T0 = Exclude<"a" | "b" | "c", "a">;
// type T0 = "b" | "c"
```

### 函数 参数数组 / 返回类型

参数数组

https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype

```ts
Parameters<Type>
```

```ts
type T1 = Parameters<(s: string) => void>;
// type T1 = [s: string]
```

构造函数参数

https://www.typescriptlang.org/docs/handbook/utility-types.html#constructorparameterstype

```ts
ConstructorParameters<Type>
```

函数返回类型

https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype

```ts
ReturnType<Type>
```

```ts
type T0 = ReturnType<() => string>; 
// type T0 = string
```

### this 标注

指定方法中/对象中的的this的字段, it serves as a marker for a contextual this type. Note that the noImplicitThis flag must be enabled to use this utility.

https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypetype

```ts
ThisType<Type>
```

```ts
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};
 
function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}
 
let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});
 
obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

移除Type的this参数。如果Type没有明确声明的this参数，结果只是Type。否则，一个没有this参数的新函数类型将从Type创建。泛型被擦除，只有最后的重载签名被传播到新的函数类型。

```ts
OmitThisParameter<Type>
```

```ts
function toHex(this: Number) {
  return this.toString(16);
}
 
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
 
console.log(fiveToHex());
```





### 艹 Any,unknown,object,void,undefined,null,never

https://www.typescriptlang.org/docs/handbook/type-compatibility.html#any-unknown-object-void-undefined-null-and-never-assignability



### 字符串 大小写,首字母

https://www.typescriptlang.org/docs/handbook/utility-types.html#intrinsic-string-manipulation-types

```ts
Uppercase<StringType>
Lowercase<StringType>
Capitalize<StringType>
Uncapitalize<StringType>
```

### Union 转 &

1. Generics + Union =>  ((x:U0)=>void) | ((x:U1)=>void) | ((x:U2)=>void) ...

2. extends + infer => U0 & U1 & U2

注意的是有不少基础类型的`&`会是never, 做成函数或对象, 不会有这个问题,
同时基础值还可以通过 `(A | B | D) & (A | C |D)` 得到`A|D`

### 合并多个 &

可以完成新对象生成

```ts
type Copy<T> = {
  [K in keyof T]:T[K]
}
```

### 直接写和写template 不一致的情况

https://stackoverflow.com/questions/72810324/why-does-typescript-union-mapped-types-work-differently-with-and-without-gener/72812486

https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types

```ts
type NodeA = {
  type: 'A'
  name: string
  flag: number
}

type NodeB = {
  type: 'B'
  id: number
  flag: number
}

type Nodes = NodeA | NodeB

type w0 = {
  [k in keyof Nodes]: Nodes[k]
}
/*
w0 = {
  type: "A" | "B";
  flag: number;
}
*/
type Calc<W> =  {
  [k in keyof W]: W[k]
}
type w1 = Calc<Nodes>
/*
w1 = Calc<NodeA> | Calc<NodeB>
*/
type z0 = Exclude<w0,NodeA>
// z0 = w0
type z1 = Exclude<w1,NodeA>
// z1 = NodeB
```

## Graphs

![控制流分析](https://www.typescriptlang.org/static/TypeScript%20Control%20Flow%20Analysis-8a549253ad8470850b77c4c5c351d457.png)

![接口](https://www.typescriptlang.org/static/TypeScript%20Interfaces-34f1ad12132fb463bd1dfe5b85c5b2e6.png)

![类型](https://www.typescriptlang.org/static/TypeScript%20Types-4cbf7b9d45dc0ec8d18c6c7a0c516114.png)

![类](https://www.typescriptlang.org/static/TypeScript%20Classes-83cc6f8e42ba2002d5e2c04221fa78f9.png)

## Ref

[antfu ts challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md)

[ts cheatsheets](https://www.typescriptlang.org/cheatsheets)
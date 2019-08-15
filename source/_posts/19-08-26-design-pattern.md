---
title: 设计模式 阅读笔记
mathjax: true
date: 2019-08-26 15:09:01
categories: code
tags: [design pattern]
---

> 19-08-26 -> 19-

https://www.runoob.com/design-pattern/design-pattern-tutorial.html

![relation](https://www.runoob.com/wp-content/uploads/2014/08/the-relationship-between-design-patterns.jpg)

# 创建型模式

这些设计模式提供了一种在创建对象的同时隐藏创建逻辑的方式，而不是使用 new 运算符直接实例化对象。这使得程序在判断针对某个给定实例需要创建哪些对象时更加灵活。

1、开闭原则（Open Close Principle）

开闭原则的意思是：对扩展开放，对修改关闭。在程序需要进行拓展的时候，不能去修改原有的代码，实现一个热插拔的效果。简言之，是为了使程序的扩展性好，易于维护和升级。想要达到这样的效果，我们需要使用接口和抽象类，后面的具体设计中我们会提到这点。

2、里氏代换原则（Liskov Substitution Principle）

里氏代换原则是面向对象设计的基本原则之一。 里氏代换原则中说，任何基类可以出现的地方，子类一定可以出现。LSP 是继承复用的基石，只有当派生类可以替换掉基类，且软件单位的功能不受到影响时，基类才能真正被复用，而派生类也能够在基类的基础上增加新的行为。里氏代换原则是对开闭原则的补充。实现开闭原则的关键步骤就是抽象化，而基类与子类的继承关系就是抽象化的具体实现，所以里氏代换原则是对实现抽象化的具体步骤的规范。

3、依赖倒转原则（Dependence Inversion Principle）

这个原则是开闭原则的基础，具体内容：针对接口编程，依赖于抽象而不依赖于具体。

4、接口隔离原则（Interface Segregation Principle）

这个原则的意思是：使用多个隔离的接口，比使用单个接口要好。它还有另外一个意思是：降低类之间的耦合度。由此可见，其实设计模式就是从大型软件架构出发、便于升级和维护的软件设计思想，它强调降低依赖，降低耦合。

5、迪米特法则，又称最少知道原则（Demeter Principle）

最少知道原则是指：一个实体应当尽量少地与其他实体之间发生相互作用，使得系统功能模块相对独立。

6、合成复用原则（Composite Reuse Principle）

合成复用原则是指：尽量使用合成/聚合的方式，而不是使用继承。

|模式名称|简单概括|
|---|---|
|工厂模式（Factory Pattern）|从new变为从工厂拿具体类|
|抽象工厂模式（Abstract Factory Pattern）|其它工厂的工厂|
|单例模式（Singleton Pattern）|某作用域唯一的，存在0或1个|
|建造者模式（Builder Pattern）|分离不变(基本元素)和易变模块(组合基本元素的方法)|
|原型模式（Prototype Pattern）|重写clone方法 控制重复对象克隆的代价|

## 工厂模式（Factory Pattern）

复杂对象适合使用工厂模式，而简单对象，特别是只需要通过 new 就可以完成创建的对象，无需使用工厂模式。如果使用工厂模式，就需要引入一个工厂类，会增加系统的复杂度。

![factory pattern](https://www.runoob.com/wp-content/uploads/2014/08/factory_pattern_uml_diagram.jpg)

主程序 new 工厂

通过工厂方法获得有某些接口实现的实例

调用实例的接口方法

如上图，对于main来说左边框中除了 interface Shape以外 是未知的，通过调用Shape Factory来创建具体实现了Shape的实例

## 抽象工厂模式（Abstract Factory Pattern）

其他工厂的工厂

![Abstract Factory Pattern](https://www.runoob.com/wp-content/uploads/2014/08/abstractfactory_pattern_uml_diagram.jpg)

讲就是，通过其它工厂的工厂来创建工厂，再通过创建出的工厂来调用具体的对象创建

## 单例模式（Singleton Pattern）

1. 单例类只能有一个实例。
2. 单例类必须自己创建自己的唯一实例。
3. 单例类必须给所有其他对象提供这一实例。

![singleton pattern](https://www.runoob.com/wp-content/uploads/2014/08/singleton_pattern_uml_diagram.jpg)

### 实现方式

是否 Lazy 初始化：是

是否多线程安全：否

```java
public class Singleton {  
  private static Singleton instance;  
  private Singleton (){}  

  public static Singleton getInstance() {  
    if (instance == null) {  
      instance = new Singleton();  
    }  
    return instance;  
  }  
}
```

是否 Lazy 初始化：是

是否多线程安全：是

这种方式具备很好的 lazy loading，能够在多线程中很好的工作，但是，效率很低，99% 情况下不需要同步
。

```java
public class Singleton {  
  private static Singleton instance;  
  private Singleton (){}  
  public static synchronized Singleton getInstance() { // 相对来说 保证了多线程安全
    if (instance == null) {  
      instance = new Singleton();  
    }  
    return instance;  
  }  
}
```
是否 Lazy 初始化：否

是否多线程安全：是

```java
public class Singleton {  
    private static Singleton instance = new Singleton(); // 默认初始化单例实例 但可能不会用到
    private Singleton (){}  
    public static Singleton getInstance() {  
      return instance;  
    }  
}
```
双检锁/双重校验锁（DCL，即 double-checked locking）

JDK 版本：JDK1.5 起

是否 Lazy 初始化：是

是否多线程安全：是

```java
public class Singleton {  
  private volatile static Singleton singleton;  
  private Singleton (){}  
  public static Singleton getSingleton() {  
    if (singleton == null) {   // 因为最多0次或1此创建 而如果使用大多数都是 != null
      synchronized (Singleton.class) {  
        if (singleton == null) {  
          singleton = new Singleton();  
        }  
      }  
    }  
    return singleton;  
  }  
}
```

登记式/静态内部类

利用了 classloader 机制来保证初始化 instance 时只有一个线程

```java
public class Singleton {  
  private static class SingletonHolder {  
    private static final Singleton INSTANCE = new Singleton();  
  }  
  private Singleton (){}  
  public static final Singleton getInstance() {  
    return SingletonHolder.INSTANCE;  // 只有通过显式调用 getInstance 方法时，才会显式装载 SingletonHolder 类，从而实例化 instance
  }  
}
```

JDK 版本：JDK1.5 起

是否 Lazy 初始化：否

是否多线程安全：是

这种实现方式还没有被广泛采用，但这是实现单例模式的最佳方法。它更简洁，自动支持序列化机制，绝对防止多次实例化。

这种方式是 Effective Java 作者 Josh Bloch 提倡的方式，它不仅能避免多线程同步问题，而且还自动支持序列化机制，防止反序列化重新创建新的对象，绝对防止多次实例化。不过，由于 JDK1.5 之后才加入 enum 特性，用这种方式写不免让人感觉生疏，在实际工作中，也很少用。

不能通过 reflection attack 来调用私有构造方法。

```java
public enum Singleton {  
    INSTANCE;  
    public void whateverMethod() {  
    }  
}
```

经验之谈：一般情况下，不建议使用第 1 种和第 2 种懒汉方式，建议使用第 3 种饿汉方式。只有在要明确实现 lazy loading 效果时，才会使用第 5 种登记方式。如果涉及到反序列化创建对象时，可以尝试使用第 6 种枚举方式。如果有其他特殊的需求，可以考虑使用第 4 种双检锁方式。

## 建造者模式（Builder Pattern）

分离 常变和不变的

![builder pattern](https://www.runoob.com/wp-content/uploads/2014/08/builder_pattern_uml_diagram.jpg)

如上，具体的食物 等是不变的，而 套餐组合是变化的=.=我暂时没有想到代码中的用例

使用场景： 1、需要生成的对象具有复杂的内部结构。 2、需要生成的对象内部属性本身相互依赖。

注意事项：与工厂模式的区别是：建造者模式更加关注与零件装配的顺序。

## 原型模式（Prototype Pattern）

原型模式（Prototype Pattern）是用于创建重复的对象，同时又能保证性能。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

这种模式是实现了一个原型接口，该接口用于创建当前对象的克隆。当直接创建对象的代价比较大时，则采用这种模式。例如，一个对象需要在一个高代价的数据库操作之后被创建。我们可以缓存该对象，在下一个请求时返回它的克隆，在需要的时候更新数据库，以此来减少数据库调用。

关键代码： 1、实现克隆操作，在 JAVA 继承 Cloneable，重写 clone()，在 .NET 中可以使用 Object 类的 MemberwiseClone() 方法来实现对象的浅拷贝或通过序列化的方式来实现深拷贝。 2、原型模式同样用于隔离类对象的使用者和具体类型（易变类）之间的耦合关系，它同样要求这些"易变类"拥有稳定的接口。

在实际项目中，原型模式很少单独出现，一般是和工厂方法模式一起出现，通过 clone 的方法创建一个对象，然后由工厂方法提供给调用者。原型模式已经与 Java 融为浑然一体，大家可以随手拿来使用。

![Prototype Pattern](https://www.runoob.com/wp-content/uploads/2014/08/prototype_pattern_uml_diagram.jpg)

# 结构型模式

这些设计模式关注类和对象的组合。继承的概念被用来组合接口和定义组合对象获得新功能的方式。

|模式名称|简单概括|
|---|---|
|适配器模式（Adapter Pattern）|解决 接口不兼容 如wine|
|桥接模式（Bridge Pattern）|抽象实体解耦|
|过滤器模式（Filter、Criteria Pattern）|抽象过滤方法 实现不同过滤器|
|组合模式（Composite Pattern）|树形结构|
|装饰器模式（Decorator Pattern）|不使用子类 包一层 增加方法|
|外观模式（Facade Pattern）|复杂化内部 简化对外接口|
|享元模式（Flyweight Pattern）|复用 大量细粒度对象|
|代理模式（Proxy Pattern）|中间商 抽象/管理cache等 os里常见|

## 适配器模式（Adapter Pattern）

不兼容借口之间的桥梁

1、美国电器 110V，中国 220V，就要有一个适配器将 110V 转化为 220V。 2、JAVA JDK 1.1 提供了 Enumeration 接口，而在 1.2 中提供了 Iterator 接口，想要使用 1.2 的 JDK，则要将以前系统的 Enumeration 接口转化为 Iterator 接口，这时就需要适配器模式。 3、在 LINUX 上运行 WINDOWS 程序。 4、JAVA 中的 jdbc。

这个自己有遇到过

1. 之前改写的oiTerminal,目的是同时兼容不同的oj 的页面访问请求 和解析
2. 之前也有在wukong项目里看过 网路访问做的 adapter

有动机地修改一个正常运行的系统的接口，这时应该考虑使用适配器模式。

![Adapter Pattern](https://www.runoob.com/wp-content/uploads/2014/08/adapter_pattern_uml_diagram.jpg)

## 桥接模式（Bridge Pattern）

用抽象解耦实现化

对于两个独立变化的维度，使用桥接模式再适合不过了。

![Bridge](https://www.runoob.com/wp-content/uploads/2014/08/bridge_pattern_uml_diagram.jpg)

## 过滤器模式（Filter、Criteria Pattern）

![Filter](https://www.runoob.com/wp-content/uploads/2014/08/filter_pattern_uml_diagram.jpg)

接口是 meetCriteria

不同的过滤器不同的实现方式

## 组合模式（Composite Pattern）

整体部分模式，树形模式?

![Composite Pattern](https://www.runoob.com/wp-content/uploads/2014/08/composite_pattern_uml_diagram.jpg)

## 装饰器模式（Decorator Pattern）

现有类的一个包装

动态的给一个对象添加额外的职责

比子类更灵活 比如rust的macro的 https://cromarmot.github.io/Blog/19-08-15-rust/#Macros

![Decorator Pattern](https://www.runoob.com/wp-content/uploads/2014/08/decorator_pattern_uml_diagram.jpg)

## 外观模式（Facade Pattern）

不符合开闭原则，如果要改东西很麻烦，继承重写都不合适。

使用场景： 1、为复杂的模块或子系统提供外界访问的模块。 2、子系统相对独立。 3、预防低水平人员带来的风险。

![Facade Pattern](https://www.runoob.com/wp-content/uploads/2014/08/facade_pattern_uml_diagram.jpg)

## 享元模式（Flyweight Pattern）

抽离出大量细力度对象复用

HashMap ,如下图的circleMap

![Flyweight Pattern](https://www.runoob.com/wp-content/uploads/2014/08/flyweight_pattern_uml_diagram-1.jpg)

## 代理模式（Proxy Pattern）

按职责来划分，通常有以下使用场景： 1、远程代理。 2、虚拟代理。 3、Copy-on-Write 代理。 4、保护（Protect or Access）代理。 5、Cache代理。 6、防火墙（Firewall）代理。 7、同步化（Synchronization）代理。 8、智能引用（Smart Reference）代理。

写过操作系统lab代码的应该是 再熟悉不过了

![Proxy Pattern](https://www.runoob.com/wp-content/uploads/2014/08/proxy_pattern_uml_diagram.jpg)

#行为型模式

这些设计模式特别关注对象之间的通信。


## 责任链模式（Chain of Responsibility Pattern）

1、不能保证请求一定被接收。 2、系统性能将受到一定影响，而且在进行代码调试时不太方便，可能会造成循环调用。 3、可能不容易观察运行时的特征，有碍于除错。

使用场景： 1、有多个对象可以处理同一个请求，具体哪个对象处理该请求由运行时刻自动确定。 2、在不明确指定接收者的情况下，向多个对象中的一个提交一个请求。 3、可动态指定一组对象处理请求。

我能想到的如nodejs中express的中间件?

自己能处理则处理否则传递给链上的下一个处理函数

![Chain](https://www.runoob.com/wp-content/uploads/2014/08/chain_pattern_uml_diagram.jpg)

链上所有的类都需要实现抽象类,如上面的AbstractLogger

## 命令模式（Command Pattern）

关键代码：定义三个角色：1、received 真正的命令执行对象 2、Command 3、invoker 使用命令对象的入口

![command](https://www.runoob.com/wp-content/uploads/2014/08/command_pattern_uml_diagram.jpg)

如上 Stock是实体用的类

Order的具体实现BuyStock 和 SellStock是要对一个具体Stock操作的方法

Broker是执行者

## 解释器模式（Interpreter Pattern）

如果一种特定类型的问题发生的频率足够高，那么可能就值得将该问题的各个实例表述为一个简单语言中的句子。这样就可以构建一个解释器，该解释器通过解释这些句子来解决该问题。

如之前写过的sparql解析器

![Interpreter Pattern](https://www.runoob.com/wp-content/uploads/2014/08/interpreter_pattern_uml_diagram.jpg)

## 迭代器模式（Iterator Pattern）

聚合对象内部遍历方法，但是不暴露具体内部实现

比如rust已经说做到用iter能和 for index做当相同效率的迭代器了

C++里常见的stl里各种迭代器

// 就我对迭代器使用理解来说，这里提出的缺点是个什么鬼

![iterator](https://www.runoob.com/wp-content/uploads/2014/08/iterator_pattern_uml_diagram.jpg)

## 中介者模式（Mediator Pattern）

何时使用：多个类相互耦合，形成了网状结构。

如何解决：将上述网状结构分离为星型结构。

2、机场调度系统。 3、MVC 框架，其中C（控制器）就是 M（模型）和 V（视图）的中介者。

![Mediator](https://www.runoob.com/wp-content/uploads/2014/08/mediator_pattern_uml_diagram.jpg)

## 备忘录模式（Memento Pattern）

存档，返回上一步，数据库事务管理

备忘录模式使用三个类 Memento、Originator 和 CareTaker。Memento 包含了要被恢复的对象的状态。Originator 创建并在 Memento 对象中存储状态。Caretaker 对象负责从 Memento 中恢复对象的状态。

MementoPatternDemo，我们的演示类使用 CareTaker 和 Originator 对象来显示对象的状态恢复。

![Memento](https://www.runoob.com/wp-content/uploads/2014/08/memento_pattern_uml_diagram.jpg)

这个东西 感觉没有什么真实实践经验

以前做过一个很简单版本管理，用的是二进制备份和恢复

也做过基于数据库的备份和恢复,但实际还是靠的数据库

所以在实践中 如果对于一个 大的内容，感觉直接备份整体 消耗是巨大的。看vim的undo tree或者 git的版本管理，这些工程实践过的东西，都是交互式但都是记录的差异

那么问题又是，如何记录差异，如果一个系统的操作是具有连带操作的，那么所有连带影响都应该被记录，而在恢复时不应该触发任何连带反应，从而设计上 感觉就这里所举的例子远远不够

## 观察者模式（Observer Pattern）

定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。

![Observer](https://www.runoob.com/wp-content/uploads/2014/08/observer_pattern_uml_diagram.jpg)

一个是 vue的 watch以及computed设计

另一个是RxJS里的 Observerable的设计

这种描述式的表述法直接代码阅读体验是会比命令式的好一些

比如 挖掘Vue的声明式的交互能力 https://www.bilibili.com/video/av37345007?from=search&seid=18134472664073504003

## 状态模式（State Pattern）

内部有状态，不同的状态下 不同的方法有不同的行为

使用场景： 1、行为随状态改变而改变的场景。 2、条件、分支语句的代替者。

![State Pattern](https://www.runoob.com/wp-content/uploads/2014/08/state_pattern_uml_diagram.png)

对于if 比较多且复杂的时候会考虑

然后作为简单的练习有 很多算法上的，比如AC自动机等等

## 空对象模式（Null Object Pattern）

一个空对象取代 NULL 对象实例的检查。Null 对象不是检查空值，而是反应一个不做任何动作的关系。这样的 Null 对象也可以在数据不可用的时候提供默认的行为。

![Null object](https://www.runoob.com/wp-content/uploads/2014/08/null_pattern_uml_diagram.jpg)

个人感觉可以看作是一种 数据的兜底行为,这个感觉要看具体是希望 抛错出去还是说用兜底行为保护，看具体业务希望

## 策略模式（Strategy Pattern）

![Strategy](https://www.runoob.com/wp-content/uploads/2014/08/strategy_pattern_uml_diagram.jpg)

多个封装起来可以“替换”的策略类

比如复杂的决策功能而不是简单的state

## 模板模式（Template Pattern）

![template](https://www.runoob.com/wp-content/uploads/2014/08/template_pattern_uml_diagram.jpg)

这样看 之前的 基类模式写的oiTerminal 应该是属于模板模式的

## 访问者模式（Visitor Pattern）

![visitor](https://www.runoob.com/wp-content/uploads/2014/08/visitor_pattern_uml_diagram.jpg)

需要对一个对象结构中的对象进行很多不同的并且不相关的操作，而需要避免让这些操作"污染"这些对象的类，使用访问者模式将这些封装到类中。

也就是　某一些方法　不应该直接放在　类和子类中时

优点： 1、符合单一职责原则。 2、优秀的扩展性。 3、灵活性。

缺点： 1、具体元素对访问者公布细节，违反了迪米特原则。 2、具体元素变更比较困难。 3、违反了依赖倒置原则，依赖了具体类，没有依赖抽象。

结构内很少改变　但需要在对象结构上定义新的操作

# J2EE 模式

这些设计模式特别关注表示层。这些模式是由 Sun Java Center 鉴定的。

## MVC 模式（MVC Pattern）

![mvc](https://www.runoob.com/wp-content/uploads/2014/08/1200px-ModelViewControllerDiagram2.svg_.png)

Model（模型） - 模型代表一个存取数据的对象或 JAVA POJO。它也可以带有逻辑，在数据变化时更新控制器。

View（视图） - 视图代表模型包含的数据的可视化。

Controller（控制器） - 控制器作用于模型和视图上。它控制数据流向模型对象，并在数据变化时更新视图。它使视图与模型分离开。

![mvc pattern](https://www.runoob.com/wp-content/uploads/2014/08/mvc_pattern_uml_diagram.jpg)

## 业务代表模式（Business Delegate Pattern）

客户端（Client） - 表示层代码可以是 JSP、servlet 或 UI java 代码。

业务代表（Business Delegate） - 一个为客户端实体提供的入口类，它提供了对业务服务方法的访问。

查询服务（LookUp Service） - 查找服务对象负责获取相关的业务实现，并提供业务对象对业务代表对象的访问。

业务服务（Business Service） - 业务服务接口。实现了该业务服务的实体类，提供了实际的业务实现逻辑。

![Business delegate](https://www.runoob.com/wp-content/uploads/2014/08/business_delegate_pattern_uml_diagram2.png)

我个人里的理解是　比如　有前端和服务端的交互，那么服务端会开发一层扁平的　接口给前端使用，前端直接调用的这一层就是

隐藏了内部实现

## 组合实体模式（Composite Entity Pattern）

![Composite](https://www.runoob.com/wp-content/uploads/2014/08/compositeentity_pattern_uml_diagram.jpg)

组合实体模式（Composite Entity Pattern）用在 EJB 持久化机制中。一个组合实体是一个 EJB 实体 bean，代表了对象的图解。当更新一个组合实体时，内部依赖对象 beans 会自动更新，因为它们是由 EJB 实体 bean 管理的。以下是组合实体 bean 的参与者。

 * 组合实体（Composite Entity） - 它是主要的实体 bean。它可以是粗粒的，或者可以包含一个粗粒度对象，用于持续生命周期。

 * 粗粒度对象（Coarse-Grained Object） - 该对象包含依赖对象。它有自己的生命周期，也能管理依赖对象的生命周期。

 * 依赖对象（Dependent Object） - 依赖对象是一个持续生命周期依赖于粗粒度对象的对象。

 * 策略（Strategies） - 策略表示如何实现组合实体。

没有理解到　具体的目的和解决的问题，查wikipedia有说，　消除实体之间关系 减少实体bean提高可管理性。

## 数据访问对象模式（Data Access Object Pattern）

数据访问对象模式（Data Access Object Pattern）或 DAO 模式用于把低级的数据访问 API 或操作从高级的业务服务中分离出来。以下是数据访问对象模式的参与者。

数据访问对象接口（Data Access Object Interface） - 该接口定义了在一个模型对象上要执行的标准操作。

数据访问对象实体类（Data Access Object concrete class） - 该类实现了上述的接口。该类负责从数据源获取数据，数据源可以是数据库，也可以是 xml，或者是其他的存储机制。

模型对象/数值对象（Model Object/Value Object） - 该对象是简单的 POJO，包含了 get/set 方法来存储通过使用 DAO 类检索到的数据。

![Data Access Object](https://www.runoob.com/wp-content/uploads/2014/08/dao_pattern_uml_diagram.jpg)

原来DAO的中文全称是这个

DAO在我的印象的java中是连接 数据库 和 java代码的

## 前端控制器模式（Front Controller Pattern）

前端控制器模式（Front Controller Pattern）是用来提供一个集中的请求处理机制，所有的请求都将由一个单一的处理程序处理。该处理程序可以做认证/授权/记录日志，或者跟踪请求，然后把请求传给相应的处理程序。以下是这种设计模式的实体。

前端控制器（Front Controller） - 处理应用程序所有类型请求的单个处理程序，应用程序可以是基于 web 的应用程序，也可以是基于桌面的应用程序。

调度器（Dispatcher） - 前端控制器可能使用一个调度器对象来调度请求到相应的具体处理程序。

视图（View） - 视图是为请求而创建的对象。

![Front Controller](https://www.runoob.com/wp-content/uploads/2014/08/frontcontroller_pattern_uml_diagram.jpg)

这个不是很理解 这样划分出的模式

我感觉上面没有讲到单独的dispatcher模式 ，但是有提到 业务代表模式

然后就这个图上看，我感觉 像是 业务代表模式和dispatcher模式的融合

## 拦截过滤器模式（Intercepting Filter Pattern）

拦截过滤器模式（Intercepting Filter Pattern）用于对应用程序的请求或响应做一些预处理/后处理。定义过滤器，并在把请求传给实际目标应用程序之前应用在请求上。过滤器可以做认证/授权/记录日志，或者跟踪请求，然后把请求传给相应的处理程序。以下是这种设计模式的实体。

过滤器（Filter） - 过滤器在请求处理程序执行请求之前或之后，执行某些任务。

过滤器链（Filter Chain） - 过滤器链带有多个过滤器，并在 Target 上按照定义的顺序执行这些过滤器。

Target - Target 对象是请求处理程序。

过滤管理器（Filter Manager） - 过滤管理器管理过滤器和过滤器链。

客户端（Client） - Client 是向 Target 对象发送请求的对象。

![intercepting filter](https://www.runoob.com/wp-content/uploads/2014/08/interceptingfilter_pattern_uml_diagram.jpg)

为什么看下面的实现代码 感觉是让每一个过滤管理器 都执行一边操作

而 过滤器链更像是一系列操作函数的数组。

执行过程是让数组中的一系列操作都 对输入数据执行一遍

## 服务定位器模式（Service Locator Pattern）

服务定位器模式（Service Locator Pattern）用在我们想使用 JNDI 查询定位各种服务的时候。考虑到为某个服务查找 JNDI 的代价很高，服务定位器模式充分利用了缓存技术。在首次请求某个服务时，服务定位器在 JNDI 中查找服务，并缓存该服务对象。当再次请求相同的服务时，服务定位器会在它的缓存中查找，这样可以在很大程度上提高应用程序的性能。以下是这种设计模式的实体。

 * 服务（Service） - 实际处理请求的服务。对这种服务的引用可以在 JNDI 服务器中查找到。

 * Context / 初始的 Context - JNDI Context 带有对要查找的服务的引用。

 * 服务定位器（Service Locator） - 服务定位器是通过 JNDI 查找和缓存服务来获取服务的单点接触。

 * 缓存（Cache） - 缓存存储服务的引用，以便复用它们。

 * 客户端（Client） - Client 是通过 ServiceLocator 调用服务的对象

![Service Locator](https://www.runoob.com/wp-content/uploads/2014/08/servicelocator_pattern_uml_diagram.jpg)

感觉算是上面 模式的合体了

## 传输对象模式（Transfer Object Pattern）


![Transfer Object](https://www.runoob.com/wp-content/uploads/2014/08/transferobject_pattern_uml_diagram.jpg)

传输对象模式（Transfer Object Pattern）用于从客户端向服务器一次性传递带有多个属性的数据。传输对象也被称为数值对象。传输对象是一个具有 getter/setter 方法的简单的 POJO 类，它是可序列化的，所以它可以通过网络传输。它没有任何的行为。服务器端的业务类通常从数据库读取数据，然后填充 POJO，并把它发送到客户端或按值传递它。对于客户端，传输对象是只读的。客户端可以创建自己的传输对象，并把它传递给服务器，以便一次性更新数据库中的数值。以下是这种设计模式的实体。

 * 业务对象（Business Object） - 为传输对象填充数据的业务服务。
 * 传输对象（Transfer Object） - 简单的 POJO，只有设置/获取属性的方法。
 * 客户端（Client） - 客户端可以发送请求或者发送传输对象到业务对象。

我们将创建一个作为业务对象的 StudentBO 和作为传输对象的 StudentVO，它们都代表了我们的实体。

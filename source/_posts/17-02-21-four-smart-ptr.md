---
title: four smart ptr
mathjax: true
date: 2017-02-21 01:01:01
tags: [smart ptr, c++]
categories: [code, backend, cpp]
---

# 四种指针

[参考文](http://www.cnblogs.com/TenosDoIt/p/3456704.html)

---

## 个人整理

四个智能指针: `auto_ptr`, `shared_ptr`, `weak_ptr`, `unique_ptr` 其中后三个是c++11支持，并且第一个已经被c++11弃用。

### 用于测试的结构体

```c
class Test
{
public:
    Test(string s)
    {
        str = s;
       cout<<"Test creat\n";
    }
    ~Test()
    {
        cout<<"Test delete:"<<str<<endl;
    }
    string& getStr()
    {
        return str;
    }
    void setStr(string s)
    {
        str = s;
    }
    void print()
    {
        cout<<str<<endl;
    }
private:
    string str;
};
```

### [auto_ptr](http://www.cplusplus.com/reference/memory/auto_ptr/)

```c 
int main()
{
    auto_ptr<Test> ptest(new Test("123"));
    ptest->setStr("hello 0");
    ptest->print();
    ptest.get()->print();
    ptest->getStr() += "world !";
    (*ptest).print();
    ptest.reset(new Test("567"));
    ptest->print();

    auto_ptr<Test> ptest(new Test("789"));
    auto_ptr<Test> ptest2(new Test("JQK"));
    ptest2 = ptest;
    ptest2->print();
    if(ptest.get() == NULL)cout<<"ptest = NULL\n";
    return 0;
}
```

输出

```
Test creat
hello 0
hello 0
hello 0world !
Test creat
Test delete:hello 0world !
567
Test creat
Test creat
Test delete:JQK
789
Test delete:789
Test delete:567
```

## [unique_ptr](http://www.cplusplus.com/reference/memory/unique_ptr/)

```c
unique_ptr<Test> fun()
{
    return unique_ptr<Test>(new Test("789"));
}
int main()
{
    unique_ptr<Test> ptest(new Test("123"));
    unique_ptr<Test> ptest2(new Test("456"));
    ptest->print();
    ptest2 = std::move(ptest);//不能直接ptest2 = ptest
    if(ptest == NULL)cout<<"ptest = NULL\n";
    Test* p = ptest2.release();
    p->print();
    ptest.reset(p);
    ptest->print();
    ptest2 = fun(); //这里可以用=，因为使用了移动构造函数
    ptest2->print();
    return 0;
}
```

输出

```
Test creat
Test creat
123
Test delete:456
ptest = NULL
123
123
Test creat
789
Test delete:789
Test delete:123
```

## [share_ptr](http://www.cplusplus.com/reference/memory/shared_ptr/)

```c
int main()
{
    shared_ptr<Test> ptest(new Test("123"));
    shared_ptr<Test> ptest2(new Test("456"));
    cout<<ptest2->getStr()<<endl;
    cout<<ptest2.use_count()<<endl;
    ptest = ptest2;//"456"引用次数加1，“123”销毁
    ptest->print();
    cout<<ptest2.use_count()<<endl;//2
    cout<<ptest.use_count()<<endl;//2
    ptest.reset();
    ptest2.reset();//此时“456”销毁
    cout<<"done !\n";
    return 0;
}

```

输出

```
Test creat
Test creat
456
1
Test delete:123
456
2
2
Test delete:456
```

---

总结

`auto_ptr` 
 * 手动释放**资源** `.reset()`
 * 将指针置空,返回**资源**控制权 `.release()`
 * 用 `.get()==NULL` 判断是否为空

`unique_ptr`
 * 和`auto_ptr`相似
 * 不能使用两个智能指针赋值操作，应该使用`std::move`
 * 可以直接用if(ptest == NULL)来判断是否空指针

`share_ptr`
 * 使用计数机制来表明资源被几个指针共享,`.use_count()`来查看资源的所有者个数
 * 没有release

`weak_ptr`
 * weak_ptr是用来解决shared_ptr相互引用时的死锁问题,如果说两个shared_ptr相互引用,那么这两个指针的引用计数永远不可能下降为0,资源永远不会释放。它是对对象的一种弱引用，不会增加对象的引用计数，和shared_ptr之间可以相互转化，shared_ptr可以直接赋值给它，它可以通过调用lock函数来获得shared_ptr。


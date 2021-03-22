---
title: code record
mathjax: true
date: 2014-12-07 01:01:01
categories: notes
tags: [notes]
---

String:
String.format
str.trim();// 返回 去前导 尾部空格 的字符串
import java.util.StringTokenizer;//P113
StringTokenizer(String str,String delim);//str 要去除空格的字符串 delim要去除的字符 返回去除后结果
StringBuffer
str.replaceAll(String regex,String replacement);//正则表达式
str.replace(String regex,String replacement);//字符(串)的替换
str.replaceFirst(regex,replacement);
str.split(delim);//会分出 无长字符
str.matches(String regex);//判断是否正则表达式
汉子匹配P133

StringBuilder:
.append(String str);
.append(StringBuffer str);
.insert(int offset,String str);

时间:
System.currentTimeMillis();//系统时间
Date date = new Date(); // 创建Date对象date

多个类文件前面要加package com.lzw;

import java.text.DecimalFormat;
DecimalFormat myFormat = new DecimalFormat(pattern);// 实例化DecimalFormat对象
String output = myFormat.format(value);                                                 
System.out.println(Object X)->调用String.valueof(X)->X.toString();//
自定义Class 调用Object默认的equals
getClass().getName();

不定长
	public static int add(int... a) { // 定义不定长参数方法
		int s = 0;
		for (int i = 0; i < a.length; i++)
			// 根据参数个数做循环操作
			s += a[i]; // 将每个参数累加
		return s; // 将计算结果返回
	}
add(1,2, 3,4, 5,6, 7, 8, 9);


10.10 接口 向上转型

A instanceof B;A和B的关系要是 A extends B or B extends A//返回A是否为B的子类
抽象类不能实例化

new innerClass 11.07;
接口向上转型 直接调用内部类 11.08
e.printStackTrace;//catch (MyException e) 

WindowConstants.DISPOSE_ON_CLOSE
||
JFrame.DISPOSE_ON_CLOSE

数据库:
加入数据
String sql= insert into tb_users (username,password,sex,age) values('adf','111','nan','22')
Statement stmt = conn.createStatement();
stmt.executeUpdate(sql);

String Sql =insert into tb_users (username,password,sex,age)value(?,?,?,?);
PreparedStatement ps =conn.prepareStatement(sql);
ps.setString(1,"");
ps.setString(2,"");
ps.setString(3,"");
ps.executeUpdate();
获得数据
String sql=select * from tb_users;
Statement stmt = conn.createStatement();
ResultSet rs =stmt.executeQuery(sql);
while(rs.next()){
	=rs.getInt("id");
	=rs.getStringInt(2);
	=rs.getString("password");
	=rs.getInt(4);
}

更改数据
String sql="update tb_users set age=20 where id=1"
Statement stmt = conn.createStatement();
stmt.executeUpdate(sql);

String sql="update tb_users set password=? where sex=?"
PreparedStatement ps=conn.prepareStatement(sql);
ps.setString(1,"admin");
ps.setString(2,"nan");
int count=ps.executeUpdate();
删除数据
String sql="delete from tb_users where id=1"
Statement stmt=conn.createStatement();
stmt.executeUpdate;
模糊查询
Statement stmt=conn.createStatement();
String sql="select * from tb_users where username like '%李%'";//通配符%=0个或多个字符 下划线_=一个字符
ResultSet rs =stmt.executeQuery(sql);
while(rs.next()){
	=rs.getInt("id");
	=rs.getStringInt(2);
	=rs.getString("password");
	=rs.getInt(4);
}

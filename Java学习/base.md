# Java 基础

## Java 版本

* #### Java SE (Java Standard Edition) 标准版

  包含完整的Java核心API，桌面应用API，支持面向桌面级应用的版本。

* #### Java EE (Java Enterprise Edition) 企业版

  包含完整的Java核心API，还包含Servlet、Jsp等内容，主要针对web应用。

* #### 其他暂时不关心的版本

  Java SE 和 Java EE是并列关系，其中的Java核心API是一样的，所以通常有的时候会把 Java SE 称为 Java EE 的基础，其实是指 Java SE 里边的核心API。

## Java 语言特性

1. 面向对象

  关于面向对象不做过多阐述。

  两个基本概念：类和对象
  三大特性：封装，继承，多态

2. 健壮性

  Java吸收了一些c/c++语言的优点，去掉了指针，内容申请、释放等这些影响程序健壮性的内容，添加了自动垃圾回收功能，提供了相对安全的内存管理和访问机制。

3. 跨平台性

  原理：在运行Java应用程序的系统之上，安装JVM(Java Virtual 
  Machine)，由JVM来负责Java程序的运行。

## JDK JRE

* JDK: Java development kit Java开发工具包，提供给开发人员使用，包含JRE。所以，在一般情况下，安装JDK之后是不需要额外安装JRE。

  包含的开发工具：编译工具（javac.exe），打包工具（jar.exe）等。

* JRE：Java runtime environment Java运行环境，包含JVM和Java程序所需的类库等。如果只是想运行一个Java程序，只需安装JRE即可。

## 安装JDK

  安装步骤不过多阐述，网上都有。下边是资源链接：

  1. oracle官网：[https://www.oracle.com/index.html](https://www.oracle.com/index.html)

  2. Java主页：[https://www.oracle.com/technetwork/java/index.html](https://www.oracle.com/technetwork/java/index.html)

  3. Java SE JDK下载地址：[https://www.oracle.com/technetwork/java/javase/downloads/index.html](https://www.oracle.com/technetwork/java/javase/downloads/index.html)

  4. jdk华为云下载地址：[https://repo.huaweicloud.com/java/jdk/](https://repo.huaweicloud.com/java/jdk/)

  **Java比较重要的两个版本：5.0和8.0。**
  
  * 2004年发布里程碑式版本，JDK1.5版本，增加了很多新特性并有大量改动，为了突出此版本重要性，更名为5.0。所以，JDK1.5 === JDK5.0。如果听到1.6的叫法，等同于JDK6.0。

  * 2014年发布JDK8.0，是继5.0以来变化最大的版本。应该是目前公司占比最大或者比较大一个版本。所以，最好选择8.0来进行学习。

  下载需要oracle账号，不知道为什么我这边注册页只能打开一半，所以从网上找了一个账号：

      账号：2696671285@qq.com

      密码：Oracle123

另外这个网站可以找到一些别人分享的oracle账号：[http://bugmenot.com/view/oracle.com](http://bugmenot.com/view/oracle.com)

## Java8官方文档

Java8官方文档：[https://docs.oracle.com/javase/8/docs/](https://docs.oracle.com/javase/8/docs/)

## Java程序

编写---编译（javac.exe）---执行（java.exe）

### 编写

开发者编写java代码的文件是以.java结尾的文件

一个.java文件中可以有多个类（class）声明，但是用public什么的类只能是一个，且该类名与当前文件命名同名。比如`Hello.java`文件中只能声明一个`public class Hello { .. }`类。

一个.java文件中至少要有一个类中有一个main方法，作为入口函数。

### 编译

编译的源文件是.java文件，输出文件为.class二进制文件，如果有一个class则输出一个.class二进制文件，如果有多个class，则输出多个.class二进制文件，文件命名与class名字相同。

### 执行

# 关键字

[https://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html)

## 用于定义数据类型的关键字

* class
* interface
* enum
* byts
* short
* int
* long
* float
* double
* char
* boolean
* void

## 定义流程的关键字

* if
* else
* switch
* case
* default
* while
* do
* for
* break
* continue
* return

## 定义访问权限修饰符的关键字

* private
* protected
* public

## 定义类、函数、变量修饰符的关键字

* abstract
* final
* static
* synchronized

## 定义类与类之间关系的关键字

* extends
* implements

## 用于定义建立实例，引用实例，判断实例的关键字

* new 
* this
* super
* instanceof

## 用于异常处理的关键字

* try
* cache
* finally
* throw
* throws

## 用于包的关键字

* package
* import

## 其他修饰符关键字

* native
* strictfp
* transient
* volatile
* assert

## 用于定义数据类型的字面量值

* true
* false
* null

# Java中常用命名规范

包名：多单词组成的所有字母都要小写 xxxyyyzzz
类名、接口名：首字母大写  XxxYyyZzz
变量名、方法名：第一个单词首字母小写，后面单词首字母大写 xxxYyyZzz
常亮：所有字母大写，且用下划线连接 XXX_YYY_ZZZ



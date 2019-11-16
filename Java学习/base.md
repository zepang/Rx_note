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

  **Java比较重要的两个版本：5.0和8.0。**
  
  * 2004年发布里程碑式版本，JDK1.5版本，增加了很多新特性并有大量改动，为了突出此版本重要性，更名为5.0。所以，JDK1.5 === JDK5.0。如果听到1.6的叫法，等同于JDK6.0。

  * 2014年发布JDK8.0，是继5.0以来变化最大的版本。应该是目前公司占比最大或者比较大一个版本。所以，最好选择8.0来进行学习。





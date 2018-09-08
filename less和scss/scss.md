# 简介

同 less 一样是 css 的预处理器语言，支持变量，mixin,继承，函数等特性

# 安装

~~~shell
npm i -g sass
~~~

# 基本使用

~~~shell
sass -h
~~~

# 特性

* 变量

~~~scss
$nav-color: #F90;
nav {
  $width: 100px;
  width: $width;
  color: $nav-color;
}
~~~

* 嵌套

~~~scss
#content {
  article {
    h1 { color: #333 }
    p { margin-bottom: 1.4em }
  }
  aside { background-color: #EEE }
}
~~~

* 选择器

~~~scss
// 选择紧跟着 article 后的 section 元素
article > section { border: 1px solid #ccc }
// header 后的同层 元素 p
header + p { font-size: 1.1em }
// 选择所有紧跟在 article 后的 article 元素
article ~ article { border-top: 1px dashed #ccc }
~~~

* 导入文件

![](https://www.sass.hk/images/p1.png)

* 嵌套导入

~~~scss
.blue-theme {@import "blue-theme"}
~~~

* 默认变量值

如果该变量未赋值，则用 default 值

~~~scss
$fancybox-width: 400px !default;
.fancybox {
width: $fancybox-width;
}
~~~

* 混合器

定义

~~~scss
@mixin rounded-corners {
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
~~~

使用

~~~scss
notice {
  background-color: green;
  border: 2px solid #00aa00;
  @include rounded-corners;
}
~~~

* 带参数和带参数默认值的混合

~~~scss
@mixin link-colors(
    $normal,
    $hover: $normal,
    $visited: $normal
  )
{
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
~~~

* 继承

~~~scss
//通过选择器继承继承样式
.error {
  border: 1px solid red;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
~~~

继承的高级用法，可以用来继承基本HTML的元素比如 a
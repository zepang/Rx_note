> 更新：2018年09月 5日 17:47:32
> 此处更新仅仅作为笔记，需要查看最新的文档 [less 官网](http://lesscss.cn)

# 简介

less 是 css 的一门预处理语言，它拓展了 css，增加了变量，函数，mixin等特性，是得 css 易于维护和拓展。

# 环境

less 可与运行在node环境和浏览器端

# 安装

~~~shell
npm install -g less
~~~

# 命令行使用

~~~shell
lessc -h
~~~

# 特性

* 变量 variables

~~~ less
@nice-blue: #5B83AD + #111;
~~~
- 变量插入
~~~less
// Variables
@my-selector: banner;

// 作为选择器
.@{my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}

// Variables
@images: "../img";

// URL
body {
  color: #444;
  background: url("@{images}/white-sand.png");
}

// Variables
@themes: "../../src/themes";

// 引入路径
@import "@{themes}/tidal-wave.less";


@property: color;
// 属性名
.widget {
  @{property}: #0ee;
  background-@{property}: #999;
}
~~~

* 继承 extend

~~~less
nav ul {
  &:extend(.inline);
  background: blue;
}
.inline {
  color: red;
}
~~~

* 混合 mixin

~~~less
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

a {
  .bordered; // 或者 .bordered();
}
~~~

* 带参数的混合

~~~less
.border-radius(@radius) {
  -webkit-border-radius: @radius;
     -moz-border-radius: @radius;
          border-radius: @radius;
}

#header {
  .border-radius(4px);
}
~~~

* @arguments 变量

~~~less
.box-shadow(@x: 0; @y: 0; @blur: 1px; @color: #000) {
  -webkit-box-shadow: @arguments;
     -moz-box-shadow: @arguments;
          box-shadow: @arguments;
}
.big-block {
  .box-shadow(2px; 5px);
}
~~~

* rest 变量

~~~less
.box-shadow(@rest...) {
  -webkit-box-shadow: @rest;
     -moz-box-shadow: @rest;
          box-shadow: @rest;
}

.big-block {
  .box-shadow(2px; 5px);
}
~~~

* 嵌套 nested rules

~~~less
#menu {
  width: 100%;
  a {
    display: inline-block;
  }
}
~~~

* 运算 operations

~~~less
// numbers are converted into the same units
@conversion-1: 5cm + 10mm; // result is 6cm
@conversion-2: 2 - 3cm - 5mm; // result is 1.5cm

// conversion is impossible
@incompatible-units: 2 + 5px - 3cm; // result is 4px

// example with variables
@base: 5%;
@filler: @base * 2; // result is 10%
@other: @base + @filler; // result is 15%
~~~

* 转义 escaping

允许将任意的字符串当做变量或者属性

~~~less
.weird-element {
  content: ~"^//* some horrible but needed css hack";
}
~~~

* 函数 function

less 提供了一些转换颜色，修改字符和做一些运算的函数

~~~less
@base: #f04615;
@width: 0.5;

.class {
  width: percentage(@width); // returns `50%`
  color: saturate(@base, 5%);
  background-color: spin(lighten(@base, 25%), 8);
}
~~~

* 命名空间 namespace

~~~less
#bundle {
  .button {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover {
      background-color: white
    }
  }
  .tab { ... }
  .citation { ... }
}
~~~

现在，当你想使用混合的时候，你可以
~~~less
#header a {
  color: orange;
  #bundle > .button;
}
~~~

* 作用域 scope

需要注意的是存在后者覆盖前者的

~~~less
.lazy-eval {
  width: @var;
}

@var: @a;
@a: 9%;
~~~

* 导入文件 import

~~~less
@import "library"; // library.less
@import "typo.css";
~~~

* 循环 loop

~~~less
.loop(@counter) when (@counter > 0) {
  .loop((@counter - 1));    // next iteration
  width: (10px * @counter); // code for each iteration
}

div {
  .loop(5); // launch the loop
}
~~~

* 父选择器

~~~less
.button {
  &-ok {
    background-image: url("ok.png");
  }
  &-cancel {
    background-image: url("cancel.png");
  }

  &-custom {
    background-image: url("custom.png");
  }
}
~~~

ouput

~~~less
.button-ok {
  background-image: url("ok.png");
}
.button-cancel {
  background-image: url("cancel.png");
}
.button-custom {
  background-image: url("custom.png");
}
~~~

* 合并 merge
  - 逗号合并属性
    ~~~less
    .mixin() {
      box-shadow+: inset 0 0 10px #555;
    }
    .myclass {
      .mixin();
      box-shadow+: 0 0 20px black;
    }
    ~~~

  - 空格合并属性
  ~~~less
  .mixin() {
    transform+_: scale(2);
  }
  .myclass {
    .mixin();
    transform+_: rotate(15deg);
  }
  ~~~

* 其他

  - 使用 js ， 由于 lesss 是由 js 编写，得天独厚的优势就是可以在 less 中使用 js 。

  ~~~less
    /* Less */
      @content:`"aaa".toUpperCase()`;
      #randomColor{
        @randomColor: ~"rgb(`Math.round(Math.random() * 256)`,`Math.round(Math.random() * 256)`,`Math.round(Math.random() * 256)`)";
      }
      #wrap{
        width: ~"`Math.round(Math.random() * 100)`px";
        &:after{
            content:@content;
        }
        height: ~"`window.innerHeight`px";
        alert:~"`alert(1)`";
        #randomColor();
        background-color: @randomColor;
      }
      /* 生成后的 CSS */
    
      // 弹出 1
      #wrap{
        width: 随机值（0~100）px;
        height: 743px;//由电脑而异
        background: 随机颜色;
      }
      #wrap::after{
        content:"AAA";
      }
  ~~~
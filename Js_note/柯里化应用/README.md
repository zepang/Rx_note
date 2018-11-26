# 柯里化函数的应用

我在网上搜索柯里化函数的学习资料的时候，总能看到另外一个相关概念“偏函数”。所以，在我们开始理解柯里化函数之前，先了解一下“偏函数”。

---

## 什么是偏函数？

我们先来看个例子：
~~~js
function renderTile (level, message) {
  return `<h${level}>${message}</h${level}>`
}
// useage
rederTitle (1, '标题') // <h1>标题<h3>
~~~
上边的函数通过传入 level 和 message 输出不同等级的标题，在这个基础之上，我们可以固定 level 参数，从而产生具有意义的函数

~~~js
function primaryTitle(message) {
  return `<h1>${message}</h1>`
}
function subTitle(message) {
  return `<h3>${message}</h3>`
}
~~~
通过固定一个某些参数，将通用的函数转化成具有象征意义的函数，此类做法就叫做“偏函数应用”。那么讲这个有什么用呢？主要是为了和后面的柯里化函数做个区分，方便大家理解柯里化函数。

---

## 什么是柯里化函数？

在维基百科和百度百科中，对柯里化的定义是这样的，如下：

    柯里化（Currying）是接受把多个参数的函数转换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受剩余的参数且返回结果的新函数的技术。

从上边的概念我们知道转换的函数就是柯里化函数。我们顺便把柯里化的函数的几个特性讲一下：

* 参数复用 - 复用最初函数的第一个参数（通常就是我们传入的 fn）
* 提前返回 - 返回接收剩余函数且返回结果的新函数
* 延迟执行 - 返回新的函数，等待某一个时刻执行。

## 简单的例子

咱们举个简单的例子加以说明：

有一个这样的 js 多参数函数
~~~js
function sum (a, b, c) {
  return a + b + c
}
~~~

我们依照柯柯里化函数的概念来改造这个函数，新的 sum 函数应该是一个接受单一参数，并且返回一个接受剩余参数且返回结果的函数

~~~js
function sum(single) {
  return function (args) {
    var args = Array.prototype.slice.call(arguments).concat(single)
    return args.reduce((a, b) => {
      return a + b
    })
  }
}

sum
~~~

--- 

## 柯里化的应用
概念性的东西比较抽象，我们来看下柯里化比较常见的应用场景：

* 兼容浏览器的事件监听
* 性能优化：防抖和节流
* 兼容低版本的 IE 的 bind 方法







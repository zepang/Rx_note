# 阅读更快的 async 和 promise 文章记录

## for await ... of （ES2018 新特性 异步迭代器）

文章中有举了一个 Node ReadableStreams 的例子：
~~~js
const http = require('http');
http.createServer((req, res) => {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    res.write(body);
    res.end();
  });
}).listen(1337);
~~~
之后用 for ... of 结合 await 简化成另一种写法：
~~~js
const http = require('http');
http.createServer(async (req, res) => {
  try {
    let body = '';
    req.setEncoding('utf8');
    for await (const chunk of req) {
      body += chunk;
    }
    res.write(body);
    res.end();
  } catch {
    res.statusCode = 500;
    res.end();
  }
}).listen(1337);
~~~
---
### 对于
的延伸：
ECMAScript 2015(ES6) 中 JavaScript 引入了迭代器接口（iterator）用来遍历数据，在 JavaScript 中，迭代器是一个对象，它知道如何每次访问集合中的每一项，并跟踪该序列中的当前位置。它提供了一个 next 方法，用来返回序列中的下一项，返回的下一项对象中包含两个属性: value（当前值） 和 done（是否是最后一项，布尔值）

依据这个特性，我们实现一个 makeIterator 函数来生成 Iterator

~~~js
function makeIterator (array) {
  let index = 0
  return {
    next: function () {
      while (index < array.length) {
        return {
          value: array[index++],
          done: false
        }
      }
      return {done: true}
    }
  }
}
~~~

一旦初始化，next()方法可以一次访问对象中的键值。

```js
const it = makeIterator(['j', 'u', 's', 't']);
it.next().value;  // j
it.next().value;  // u
it.next().value;  // s
it.next().value;  // t
it.next().value;  // undefined
it.next().done;   // true
it.next().value;  // undefined
```

ES6 在我们熟悉的 for 和 for ... in 的基础上新增了 for ... of循环，for ... of 的值必须是iterable，所谓的 iterable（可迭代），即指一个包含可以在其值上迭代的迭代器的对象，接合 for ... of 循环来讲，iterable 就是一个能够产
生迭代器供循环使用的对象

从 ES6 开始，从一个 iterable 中提取迭代器的方法是：iterable 必须支持一个函数，其名称
是专门的 ES6 符号值 Symbol.iterator 。调用这个函数时，它会返回一个迭代器。通常每
次调用会返回一个全新的迭代器，虽然这一点并不是必须的。

以上的亮点概念在 《你不知道的JavaScript-中》第二部分 生成器 与 《你不知道的JavaScript-下》这两本书中可以找到

接下来还是继续用书中的例子来说明Iterator 和 iterable:
~~~js
var something = (function () {
  var nextVal

  return {
    //
    [Symbol.iterator]: function () { return this },
    //
    next: function () {
      if (nextVal === undefined) {
        nextVal = 1
      } else {
        nextVal = (3 * nextVal) + 6
      }

      return { done: false, value: nextVal }
    }
  }
})()
~~~
按照我们之前的说明，Iterator 是一个对象，包含 next 函数，并且每次调用 next 函数都将得到一个包含 done 属性和 下一项的值 value 属性，所以上边的 somthing 就是一个 Iterator（迭代器）。再看下面这个例子：
~~~js
for (var v of something) {
  console.log( v );
  // 不要死循环！
  if (v > 500) {
  break;
  }
}
// 1 9 33 105 321 969
~~~
在《你不知道的JavaScript-下》第三章迭代器，迭代器循环中有提到：你可以通过为迭代
器提供一个 Symbol.iterator 方法简单返回这个迭代器本身使它成为 iterable。

根据 《你不知道的JavaScript-下》第七章元编程对于 Symbol.iterator 的介绍： Symbol.iterator 是JavaScript内置的符号，也称为公开符号，Symbol.iterator 表示任意对象上的一个专门位置（属性）,语言机制自动在这个位置上寻
找一个方法，这个方法构造一个迭代器来消耗这个对象的值。很多的对象定义有这个符号的默认值(String，Array，TypedArray，Map 和 Set 都内置可迭代对象)。
也可以通过定义 Symbol.iterator 属性为任意对象值定义自己的迭代器逻辑，即使
这会覆盖默认的迭代器。这里的元编程特性在于我们定义了一个行为特性，供 JavaScript
其他部分（也就是运算符和循环结构）在处理定义的对象时使用。
> 符号相关：把符号当成是对象的属性/键值，会以一种特殊的方式存储，使得属性不出现在这个对象的一般枚举中（除非使用 Object.getOwnPropertySymbols(obj)）。

再结合《你不知道的JavaScript-下》第二章2.9 for ... of 循环的内容：在底层，for..of 循环向 iterable 请求一个迭代器，然后反复调用这个迭代器把它产生的值赋给循环迭代变量。(for..of 循环首先会向被访问对象请求一个迭代器对象，然后通过调用迭代器对象的
next() 方法来遍历所有返回值。)

最终，我们得出：
* 根据第一点： 包含 [Symbol.iterator] 函数并返回迭代器的对象是 iterable。
* 根据第一、二、三点：for ... of 在底层上是会调用了 iterable 的 Symbol.iterator 函数，拿到一个迭代器，然后反复调用 next 函数并且把值（value）赋给循环迭代的变量。所以，我们上边例子里边输出的 1 9 33 105 321 969 都是迭代器返回的值。

---
## 异步迭代器

所谓的异步迭代器就是它的 next 函数返回 {value, done} 的 Promise。

~~~js
const something = {
  [Symbol.asyncIterator]: () => {
    const arr = [1, 2, 3, 4, 5]
    return {
      next: () => Promise.resolve({
        done: arr.length === 0, 
        value: arr.unshift()
      })
    }
  }
}
~~~
上边主要有两点，一个是符号 Symbol.asyncIterator, 一个是 next 返回一个 Promise

~~~js
(async function (){
  for await (const item of something) {
    console.log(item)
  }
})()
~~~

在使用上需要主要的是，await 关键字只能在 async 函数中使用。



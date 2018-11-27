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
### 对于迭代器的延伸：
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

ES6 在我们熟悉的 for 和 for ... in 的基础上新增了 for ... of循环，
接下来我用ES6的 for ... of 来具体的说明 Iterator:



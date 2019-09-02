# 用 JS 实现一个无限累加的函数 add

```js
add(1); // 1
add(1)(2);  // 3
add(1)(2)(3)； // 6
add(1)(2)(3)(4)； // 10 

// 以此类推
```

实现：

```js
function add (a) {
  function sum (b) {
    a = a + b
    return sum
  }

  sum.toString = function () {
    return a
  }

  return sum
}
```

我们知道打印函数时会自动调用`toString()`方法，函数`add(a)`返回一个闭包`sum(a)`，函数`sum()`中累加计算`a=a+b`，只需要重写`sum.toString()`方法返回变量`a`就可以了。

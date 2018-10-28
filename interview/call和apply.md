# call 和 apply 的区别

~~~js
getValue.call(a, 'yck', '24')
getValue.apply(a, ['yck', '24'])
~~~

call 接收一个参数的列表

apply 接收一个参数的数组

* call 的模拟实现
基本思路就是给指定的对象添加一个 fn，然后执行完成之后将 fn 删除
~~~js
Function.prototype.myCall = function (context) {
  var context = context || window
  // 给 context 添加一个属性
  // getValue.call(a, 'yck', '24') => a.fn = getValue
  context.fn = this
  // 将 context 后面的参数取出来
  var args = [...arguments].slice(1)
  // getValue.call(a, 'yck', '24') => a.fn('yck', '24')
  var result = context.fn(...args)
  // 删除 fn
  delete context.fn
  return result
}
~~~
* apply 的模拟
~~~js
Function.prototype.myApply = function (context) {
  var context = context || window
  context.fn = this

  var result
  // 需要判断是否存储第二个参数
  // 如果存在，就将第二个参数展开
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }

  delete context.fn
  return result
}
~~~

* bind 的模拟
~~~js
Function.prototype.bind2 = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var fNOP = function () {};

    var fbound = function () {
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
    }

    fNOP.prototype = this.prototype;
    fbound.prototype = new fNOP();

    return fbound;

}

~~~


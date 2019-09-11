# 关于generator生成器

我们都知道一个普通给的函数，一旦开始运行就会一直运行知道结束。

ES6 新增了一种函数，在运行的过程中可以暂停和恢复运行，和普通函数的运行方式不一样。这类函数我们称之为生成器函数。

# 如何顶一个生成器函数？

```js
function *example () {
  ...
}
```
在函数名成之前添加一个`*`即可以顶一个生成器函数。另外还有以下几种种写法：

```js
function*example () {
  ...
}
function * example () {
  ...
}
function* example () {
  ...
}
```

### 如何使用生成器

生成器函数的使用方式是生成一个迭代器，然后调用迭代器的`next`方法来获取值。

```js
// 普通函数
function normal () {}
var normalResult = normal() // undefined

function *generator () {}
var it = generator() // 产生一个迭代器

it.next() // { value: undefined, done: true }
```

以下是`it`在控制台的输出：

![](./1.png)

我们来验证以下`it`是不是迭代器。我们都知道迭代器都需要一个`[Symbol.iterator]`这个方法来产生可迭代对象，并且有`next`方法来返回`{value: undefined, done: true}`这种对象值。

首先创建一个生成器函数并产生一系列的值：
```js
function *generator () {
  yield 1
  yield 2
  yield 3
  yield 4
}

var it = generator()
it[Symbol.iterator] // ƒ [Symbol.iterator]() { [native code] }
```

然后使用`for...of`循环来消耗这个迭代器：

```js
for (let i of it) {
  console.log(i)
}
// 1
// 2
// 3
// 4
```

我们接下来尝试以下`next()`调用，需要注意的是这个时候你得重新建立一个`迭代器`因为之前的`it`已经被`for ... of`消耗完了，调用`it.next()`只会返回`{value: undefined, done: true}`：

```js
var it = generator()
it.next() // {value: 1, done: false}
it.next() // {value: 2, done: false}
it.next() // {value: 3, done: false}
it.next() // {value: 4, done: false}
it.next() // {value: undefined, done: true} 全被的值都被消耗
```

通过以上的这些我们发现，`it`也即是生成器返回的是一个迭代器。并且这个迭代器的`[Symbol.iterator]`返回的可迭代对象是它本身。

```js
it[Symbol.iterator]() === it
```

下边是我们通过原型链的方式查找到的`next`方法和`Symbol.iterator`方法：

![](./2.jpg)

# yield

```js
function *generator () {
  var x = 0
  x++
  console.log(x)
  yield '暂停'
  x++
  console.log(x)
  x = (yield `第二次站厅`) || 10
  console.log(x)
  console.log('运行完毕')
}

var it = generator()
it.next()
// 1
// {value: '暂停', done: false}
it.next()
// 2
// {value: '第二次暂停', done: false}
it.next()
// 10
// {value: undefined, done: true}
// 运行完毕
```

我们来看下上边的代码发生了什么？

1. 当我们第一次运行`it.next()`的时候，控制台输出了`x`累加之后的数值1，并输出`{value: '暂停', done: false}`，也就是说第一个`next()`让代码运行到了`yield`，并且将`yield`后面的值，作为`next`结果对象的`value`值返回。

2. 当我们第二次运行`it.next()`的时候，控制台输出`x`再次累加之后的数值2，并将`yield`后面的值，作为`next`结果对象的`value`值返回。

3. 当我们第三次运行`it.next()`的时候，控制台直接输出`x`值为10，并输出`{value: undefined, done: true}`和`运行完毕`表示函数已经运行完成。

我们看下第三次输出的`x`值为10的现象。`x = (yield '第二次暂停') || 10`，从得到的结果来来看，必定是 `(yield '第二次暂停')` 这部分满不足条件，所以x被赋值为10。这是为什么？

让我们按照下面的一种方式重新运行一次

```js
var it = generator()

it.next()
// 1
// {value: '暂停', done: false}
it.next()
// 2
// {value: '第二次暂停', done: false}
it.next(233)
// 233
// {value: undefined, done: true}
// 运行完毕
```

我们在第三次的时候将233作为参数传入`next`，然后输出的`x`值变成了233。也就是说传入的233变成了`x`的值。

那么如何来解释这两次运行的结果。

以下的这些是我从mdn上边摘录下来的关于`yield`关键字内容：

1. yield 关键字用来暂停和恢复一个生成器函数，yield关键字后面的表达式的值返回给生成器的调用者。它可以被认为是一个基于生成器的版本的return关键字。
2. yield关键字实际返回一个IteratorResult对象，它有两个属性，value和done。value属性是对yield表达式求值的结果，而done是false，表示生成器函数尚未完全完成。
3. 一旦遇到 yield 表达式，生成器的代码将被暂停运行，直到生成器的 next() 方法被调用。
   
     - yield，导致生成器再次暂停并返回生成器的新值。 下一次调用next()时，在yield之后紧接着的语句继续执行。
     - throw用于从生成器中抛出异常。这让生成器完全停止执行，并在调用者中继续执行，正如通常情况下抛出异常一样。
     - 到达生成器函数的结尾；在这种情况下，生成器的执行结束，并且IteratorResult给调用者返回undefined并且done为true。
     - 到达return 语句。在这种情况下，生成器的执行结束，并将IteratorResult返回给调用者，其值是由return语句指定的，并且done 为true。
  
4. 如果将参数传递给生成器的next()方法，则该值将成为生成器当前yield操作返回的值。

针对上边的说明，我们可以得到下边的解释：

对应到我们上边的案例，也就是`yield`返回`IteratorResult对象`给了调用者`it`，然后通过`it.next()`返回这些值。给next()方法传递了参数，则该值将成为生成器当前yield操作返回的值。也就是我们看到为什么传递了233，之后 `x` 被赋值为 233，也就是如果我们不传参数，`x = (yield '第二次暂停') || 10` yield的返回值会为`undefined`，所以`x`被赋值 10。

另外我们从上边的案例也不难发下`it.next()`与`yield`的对应关系。一个`next()`对应一个`yield`的返回结果。如果调用`next()`之后没有对应一个`yield`来返回对结果，且没有return 来返回值的情况下，则会默认返回`{value: undefined, done: true}`。

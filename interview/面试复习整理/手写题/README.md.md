# JavaScript手写题

## promise

- 首先Promise是一个类
- 执行 `new Promise((resolve, reject) => {})`，传入的是一个函数，这个函数有两个参数`resolve, reject`，且`resolve, reject`都是函数

依据这个我们用class声明一个Promise类

```js
class MyPromise {
  // fn: 实例化传入的函数
  constructor (fn) {
    // 成功
    let resolve = () => {}
    // 失败
    let reject = () => {}
    // 初始化执行
    fn(resolve, reject)
  }
}
```

- Promise有三个状态(state)：pending（初始状态） fullfiled（成功状态） rejected（失败状态）
- pending只可以转换为 fullfiled 或者 rejected 中的一种状态
- fullfiled 不能转换为其他状态
- rejected 不能转换为其他状态
- 由 pending 转换为 fullfiled 需要存储一个成功（resolve(value)）的返回值 value
- 由 pending 转换为 rejected需要存储一个失败（reject(reason)）的返回值 reason
- 如果传入参数 fn 的逻辑报错，需要直接 reject(reason)

接着完善上边的class

```js
class MyPromise {
  // fn: 实例化传入的函数
  constructor (fn) {
    // 初始状态
    this.state = 'pending'
    // 成功返回值
    this.value = undefined
    // 失败返回原因
    this.reason = undefined
    // 成功
    // 接收成功的返回值 value
    let resolve = (value) => {
      if (this.state === 'pending') {
        // resolve 调用后 state 变成 fullfiled
        this.state = 'fullfiled'
        // 存储成功返回值
        this.value = value
      }
    }
    // 失败
    let reject = (reason) => {
      if (this.state === 'pending') {
        // reject 调用后 state 变成 rejected
        this.state = 'rejected'
        // 存储失败的原因
        this.reason = reason
      }
    }
    // fn执行出错，直接执行reject
    try {
      // 初始化执行 fn
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
}
```

- Promise通过then方法取到成功或者失败的返回值
- then方法接收两个参数，且为函数（onFullfiled，onRejected）
- state 为fullfiled 执行 onFullfiled，将成功的值作为参数
- state reject 执行 onRejected，将失败的值作为参数

```js
class MyPromise {
  // ...
  then (onFullfiled, onRejected) {
    // 状态为fulfilled，执行onFulfilled，传入成功的
    if (this.state === 'fullfiled') {
      onFullfiled(this.value)
    }

    // 状态为rejected，执行onRejected，传入失败的原因
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
  }
}
```

解决异步的问题：

此时，我们的一个处理逻辑在then中判断状态来执行onFullfiled和onRejected，前提是状态已经变成fullfiled或者rejected，也就是在then之前已经调用了resolve或者reject；但是，异步情况下，比如当resolve在setTimeout中调用，此时then在resolve之前就调用了，状态还是pending。所以，针对这种情况，需要在resolve或者reject中调用onFullfiled或者onRejected才是正确的逻辑。

- 在then中判断状态为pending的时候，把onFullfiled或者onRejected存储起来，在resolve或者reject中调用
- 需要注意Promise实例调用多个then的情况，在存储onFullfiled或者onRejected应用数组来存储它们。比如：

```js
let p = new MyPromise()
p.then()
p.then()
```

```js
class MyPromise {
  // fn: 实例化传入的函数
  constructor (fn) {
    // 初始状态
    this.state = 'pending'
    // 成功返回值
    this.value = undefined
    // 失败返回原因
    this.reason = undefined
    // 成功回调存放数组
    this.onFullfiledCallbacks = []
    // 失败回调存放数组
    this.onRejectedCallbacks = []
    // 成功
    // 接收成功的返回值 value
    let resolve = (value) => {
      if (this.state === 'pending') {
        // resolve 调用后 state 变成 fullfiled
        this.state = 'fullfiled'
        // 存储成功返回值
        this.value = value
        // 处理异步的情况
        // 一旦调用resolve，执行成功的回调
        this.onFullfiledCallbacks.forEach(callback => callback())
      }
    }
    // 失败
    let reject = (reason) => {
      if (this.state === 'pending') {
        // reject 调用后 state 变成 rejected
        this.state = 'rejected'
        // 存储失败的原因
        this.reason = reason
        // 处理异步的情况
        // 一旦调用reject，执行失败的回调
        this.onRejectedCallbacks.forEach(callback => callback())
      }
    }
    // fn执行出错，直接执行reject
    try {
      // 初始化执行 fn
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then (onFullfiled, onRejected) {
    // 状态为fulfilled，执行onFulfilled，传入成功的
    if (this.state === 'fullfiled') {
      onFullfiled(this.value)
    }

    // 状态为rejected，执行onRejected，传入失败的原因
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }

    // 状态为pending，异步的处理情况
    if (this.state === 'pending') {
      this.onFullfiledCallbacks.push(() => {
        onFullfiled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}
```

解决链式调用：

Promise的一个特性是支持链式调用`new Promise().then().then()`，也有称之为`thenable`，用来解决回调地狱问题

那么如何达到链式调用呢？

只要then方法每次都返回一个新的Promise实例(promise2)就可以接着链式调用了

我们这里需要确定的是promise2的值

- 首先确定then回调函数的返回值是不是一个Promise实例
- 如果是，将这个Promise实例的结果作为promise2成功（resolve）的value
- 如果不是，直接把返回结果作为promise2成功（resolve）的value

```js
class MyPromise {
  // ...
  then (onFullfiled, onRejected) {
    let promise2 = new MyPromise((resolve, reject) => {
      // 状态为fulfilled，执行onFulfilled，传入成功的
      if (this.state === 'fullfiled') {
        let result = onFullfiled(this.value)
        // resolvePromise函数，处理自己回到返回的Promise实例(result)和默认的promise2的关系
        resolvePromise(promise2, result, resolve, reject)
      }

      // 状态为rejected，执行onRejected，传入失败的原因
      if (this.state === 'rejected') {
        let result = onRejected(this.reason)
        resolvePromise(promise2, result, resolve, reject)
      }

      // 状态为pending，异步的处理情况
      if (this.state === 'pending') {
        this.onFullfiledCallbacks.push(() => {
          let result = onFullfiled(this.value)
          resolvePromise(promise2, result, resolve, reject)
        })
        this.onRejectedCallbacks.push(() => {
         let result = onRejected(this.reason)
         resolvePromise(promise2, result, resolve, reject)
        })
      }
    })
    return promise2
  }
}
```

resolvePromise判断返回值

- 首先判断返回的result是promise的前提下是不是和promise2相等，如果让一个promise等待自己，那么会陷入死循环

```js
function resolvePromise (promise, result, resolve, reject) {
  // 循环引用报错
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  }

  if (result) {
    if (typeof result === 'object' || typeof result === 'function' ) {
      try {
        if (result.then && typeof result.then === 'function') {
          result.then(res => {
            // 防止有可能还是Promise实例，继续resolve
            resolvePromise(promise, res, resolve, reject)
          }, error => {
            reject(error)
          })
        } else {
          // 不包含then
          resolve(result)
        }
      } catch (error) {
        reject(error)
      }
    } else {
      // 普通值
      resolve(result)
    }
  }
}
```

好的接下来测试一下我们Promise：

```js
let p = new MyPromise((resolve, reject) => {
  resolve(1234)
})
let p2 = p.then((res) => {
  return p2
})
```

如果一切正常，按照resolvePromise的逻辑上述代码应该报错，循环引用 `Chaining cycle detected for promise #<Promise>`，但是实际情况并没有。通过，debugger发现onFullfiled返回的p2为undefined，因为then函数里边都是同步代码，onFullfiled执行的时候，then函数还没返回promise，p2没有值，所以我们还需要给onFullfiled和onRejected添加异步延迟执行。

添加异步延迟：

```js
  then (onFullfiled, onRejected) {
    let promise2 = new Promise((resolve, reject) => {
      // 状态为fulfilled，执行onFulfilled，传入成功的
      if (this.state === 'fullfiled') {
        // 利用setTimeout添加异步延迟
        setTimeout(() => {
          try {
            let result = onFullfiled(this.value)
            // resolvePromise函数，处理自己回到返回的Promise实例(result)和默认的promise2的关系
            resolvePromise(promise2, result, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      // 状态为rejected，执行onRejected，传入失败的原因
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let result = onRejected(this.reason)
            resolvePromise(promise2, result, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0);
      }

      // 状态为pending，异步的处理情况
      if (this.state === 'pending') {
        this.onFullfiledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let result = onFullfiled(this.value)
              resolvePromise(promise2, result, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0);
        })
        this.onRejectedCallbacks.push(() => {
         setTimeout(() => {
           try {
              let result = onRejected(this.reason)
              resolvePromise(promise2, result, resolve, reject)
           } catch (error) {
             reject(error)
           }
         }, 0);
        })
      }
    })
    return promise2
  }
```

添加其他的方法：

- resolve, reject, all, race全部是 Promise 类的静态方法
- all接收promise实例的数组，返回所有的promise实例的结果组成的数组
- race接收promise实例的数组，返回优先完成的promise实例的结果
- catch实际就是then的语法糖
- finally接收一个回调函数，无论成功与否都会执行，另外在finally之后还可以用then接收finally之前then的返回值，需要实现透传值
- 额外实现一个比较常用retry方法，自定义失败之后重新调用或者重新执行期望函数的次数和每次调用的延迟

```js
class MyPromise {
  // resolve方法
  static resolve (value) {
    return new MyPromise(resolve => resolve(value))
  }
  // reject方法
  static reject (error) {
    return new MyPromise((resolve, reject) => reject(error))
  }
  // all方法
  static all (promiseArr) {
    return new Promise((resolve, reject) => {
      try {
        let result = []
        for (let i; i < promiseArr.length; i++) {
          fn.then(data => {
            result[i] = data
            // 每个Promise或者结果之后判断一次存储结果的数组是否已经全部完成
            if (result.length === promiseArr.length) {
              resolve(result)
            }
          }, error => reject(error))
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  // race 方法
  static race (promiseArr) {
    return new Promise((resolve, reject) => {
      for (let fn of promiseArr) {
        // 哪个先获取结果直接resolve当前promise
        // fn.then(data => resolve(data), error => reject(error))
        fn.then(resolve, reject)
      }
    })
  }
  // cache 实例方法，then的语法糖
  catch (onRejected) {
    return this.then(() => {}, onRejected)
  }
  // finally 实例方法
  finally (callback) {
    this.then((value) => {
      // 透传值
      MyPromise.resolve(callback).then(value => value)
    }, error => {
      MyPromise.resolve(callback).then(error => {
        throw error
      })
    })
  }
  // retry 实例方法
  retry (fn, times=3, delay=100) {
    let timer = null
    if (typeof fn === 'object' && fn.then && fn.then === 'function') {
      return new MyPromise((resolve, reject) => {
        const retry = () => {
          fn.then(resolve).catch(error => {
            // 重试次数用完
            if (times === 0) {
              timer = null
              reject(error)
            } else {
              times--
              timer = setTimeout(() => {
                retry()
              }, delay)
            }
          })
        }
      })
    } else {
      throw new Error('fn must be a #<Promise>')
    }
  }
}
```

测试promise是否符合PromiseA+规范：

在promise文件中加入下边代码：

```js
// 目前是通过他测试 他会测试一个对象
// 语法糖
Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}
module.exports = Promise;
//npm install promises-aplus-tests 用来测试自己的promise 符不符合promisesA+规范
```

全局安装插件，并运行测试，然后就能在控制台看到输出的信息

```js
npm i promises-aplus-tests -g

promises-aplus-tests [文件路径名]
```

## 防抖和节流

防抖：

n秒内多次满足触发某个动作的条件，将重新计算，当前满足条件时间与下一个满足条件时间大于n，以当前满足条件触发动作。比如实时搜索，通常会取在1秒或者其他的某个时间段内的最终输入结果，来触发搜索请求。

```js
function debounce (fn, delay = 50, immediate) {
  let timer = null

  return function (...rest) {
    if (immediate) {
      fn.apply(this, ...rest)
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, rest)
    }, delay)
  }
}
```

节流：

每隔n秒触发一次（即秒内只触发一次），起到稀释执行频率的作用。

```js
function throttle (fn, delay) {
  let isPending = false

  return function (...rest) {
    if (!isPending) {
      isPending = true
      setTimeout(() => {
        fn.apply(this, rest)
        isPending = false
      }, delay)
    }
  }
}
```

装饰器版本：

```js
function _debounce (fn, delay = 50, immediate) {
  // ...debounce 逻辑
}

function defounce (delay = 50, immediate) {
  return function handleDescriptor(target, prop, descriptor) {
    const callback = descriptor.value
    const fn = _debounce(callback, delay, immediate)

    if (typeof callback !== 'function') {
      throw new SyntaxError('Only functions can be debounced');
    }

    return {
      ...descriptor,
      value () {
        fn()
      }
    }
  }
}

function _throttle (fn, delay) {
  // ... throttle 逻辑
}

function throttle (delay) {
  return function handleDescriptor(target, prop, descriptor) {
    const callback = descriptor.value
    const fn = _throttle(callback, delay, immediate)

    if (typeof callback !== 'function') {
      throw new SyntaxError('Only functions can be throttle');
    }

    return {
      ...descriptor,
      value () {
        fn()
      }
    }
  }
}
```

## 浅拷贝与深拷贝

通过以下例子来说明什么是浅拷贝：

普通的赋值复制：

```js
const arr1 = [1, [2, 3], 4, 5]
const arr2 = arr1

console.log(arr1 === arr2) // true
```

因为数组是引用类型数据，赋值赋值的仅仅是它的引用或者说“指针”，可以说是共享引用

浅拷贝：

```js
const arr1 = [1, [2, 3], 4, 5]
const arr2 = Object.assign([], arr1)

console.log(arr1 === arr2) // false
```

从结果可以看出浅拷贝解决了共享引用的问题，但是却无法解决数组内部子元素的共享引用问题：

```js
console.log(arr1[1] === arr2[1]) // true
```

所以，浅拷贝只能解决引用类型数据的第一层共享引用，无法解决第二层或者下边层中引用类型数据的共享引用问题。

除了上述提的Object.assign，还有ES6的拓展运算符`...`，数组的方法：slice和concat。

深拷贝：

深拷贝解决了浅拷贝无法解决下层引用类型数据共享引用的问题，源对象和拷贝对象完全是不同的两个对象。

我们先用JavaScript提供的API来实现深拷贝，并对比一下几种方法的差异

- JSON.Stringify 和 JSON.parse

```js
let a = {name: 'a', info: { age: 12 }};
let b = {name: undefined, info: { age: 12 } };
let c = {name: 'c', info: { age: 12 }, a: a}
let copyA = JSON.parse(JSON.stringify(a));
console.log(copyA, copyA === a) // {name: "a", info: {…}}false
console.log(copyA.info === a.info) false

let copyB = JSON.parse(JSON.stringify(b));
console.log(copyB, copyB === b) // {info: {…}}false

a.c = c
let copyC = JSON.parse(JSON.stringify(c));
console.log(copyC)

// VM9517:9 Uncaught TypeError:Converting circular structure to JSON
//     --> starting at object with constructor 'Object'
//     |     property 'a' -> object with constructor 'Object'
//     --- property 'c' closes the circle
```

通过对a和copyA比较确定了JSON.Stringify 和 JSON.parse能够进行深拷贝，但是通过b和copyB，c和copyC比较，发现下边两个问题：

- 无法复制值为undefined的属性。比如：b.name就无法复制。其实除了undefined，Map, Set, RegExp, Date, ArrayBuffer 和其他内置类型在进行序列化时会丢失
- 无法对循环引用的数据进行复制。所以，复制c的时候JSON直接报错。

- MessageChannel

~~~js
function deepClone (obj) {
  return new Promise(resolve => {
    const {port1, port2} =  new MessageChannel()
    port2.onmessage = event => resolve(event.data)
    port1.postMessage(obj)
  })
}

let a = {name: 'a', info: { age: 12 }};
deepClone(a).then(copy => {
  console.log(copy, copy === a) // {name: "a", info: {…}} false
})
~~~

此方法解决了上述JSON方法不能解决的问题，但是此方法是异步的，使用的时候要注意。

- History Api

~~~js
function deepClone(obj) {
  const oldState = history.state
  history.replaceState(obj, document.title)
  const copy = history.state
  history.replaceState(oldState, document.title)
  return copy
}
let a = {name: 'a', info: { age: 12 }};
let copyA = deepClone(a)
console.log(copyA, copyA === a) // {name: "a", info: {…}} false
~~~

此方法也能解决JSON方法的问题，并且还是同步方法。就是有的浏览器会限制调用的频率，比如 safari 每 30 秒只允许调用 100 次。

- Notification Api
  
~~~js
function deepClone(obj) {
  return new Notification('', {data: obj, slient: true}).data
}

let a = {name: 'a', info: { age: 12 }};
let copyA = deepClone(a)
console.log(copyA, copyA === a) // {name: "a", info: {…}} false
~~~

同样是优点和缺点并存，优点就是可以解决循环对象问题，也支持许多内置类型的克隆，并且是同步的。缺点就是这个需要api的使用需要向用户请求权限，但是用在这里克隆数据的时候，不经用户授权也可以使用。在http协议的情况下会提示你再https的场景下使用。

- 自定义实现深拷贝

  需要注意的问题：
  - 循环引用
  - 拷贝Symbol为键数据

首先我们创建一个deepClone的函数，定义一个新值并且返回：

```js
function deepClone (source) {
  let result

  return result
}
```

区分基础类型数据和引用类型数据处理：

```js
function deepClone (source) {
  let result
  // 判断是不是引用类型数据
  const isObject = source !== null && typeof source === 'object'

  if (isObject) {
    result = Array.isArray(source) ? [] : {}
    for (let key in source) {
      result[key] = deepClone(source[key])
    }
  } else {
    result = source
  }

  return result
}
```

测试一下：

```js
let a = {name: 'a', info: { age: 12 }, age: undefined};
let copyA = deepClone(a)
console.log(copyA, copyA === a) // {name: "a", info: {…}, age: undefined} false
console.log(copyA.info === a.info) // false
```

大概满足了深拷贝的基本功能，接下解决循环引用。大概思路就是将已经拷贝的对象存起来，下次遇到一样的就不继续拷贝了，直接取出来返回。我这里用的是 WeakMap，你也可以用其他数据结构，比如数组。

下边是改造后的函数

```js
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
function deepClone (source, hash = new WeakMap()) {
  // 获取数据类型
  if (!isObject(source)) return source
  // 取出已经拷贝过的数据
  if (hash.get(source)) return hash.get(source)

  let result = Array.isArray(source) ? [] : {}
  // 将拷贝的result存起来
  hash.set(source, result)
  for (let key in source) {
    if (isObject(source[key])) {
      result[key] = deepClone(source[key], hash)
    } else {
      result[key] = source[key]
    }
  }

  return result
}
```

测试一下：

```js
let b = {name: 'name_b'}
let c = {name: 'name_c'}
b.c = c
c.b = b

let copyB = deepClone(b)
console.log(copyB === b) // false
console.log(copyB.c === b.c) // false
console.log(copyB.c.b.c.b.c === b.c) //false
```

顺利解决循环引用，接下来解决Symbol键拷贝的问题。

我们上述使用的for ... in遍历对象实际上无法遍历出以Symbol作为键名的键，需要用到以下两个方法中的任意一个，我这里直接使用`Reflect.ownKeys`：

```js
// 方法一：
Object.getOwnPropertySymbols(…)

// 方法二：
Reflect.ownKeys(…)
```

下边是改造后的函数

```js
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
function deepClone (source, hash = new WeakMap()) {
  // 获取数据类型
  if (!isObject(source)) return source
  // 取出已经拷贝过的数据
  if (hash.get(source)) return hash.get(source)

  let result = Array.isArray(source) ? [] : {}
  // 将拷贝的result存起来
  hash.set(source, result)
  Reflect.ownKeys(source).forEach(key => {
    if (isObject(source[key])) {
      result[key] = deepClone(source[key], hash)
    } else {
      result[key] = source[key]
    }
  })

  return result
}
```

测试一下：

```js
const obj = {}
const symbolA = Symbol('A')
const symbolB = Symbol('B')
obj[symbolA] = 'symbolA'
obj[symbolB] = 'symbolB'

const copy = deepClone(obj)
console.log(copy) // {Symbol(A): "symbolA", Symbol(B): "symbolB"}
```

## 去重

- Set

```js
Array.prototype.distinct = (arr) => {
  return Array.from([...(new Set(arr))])
}
```

- indexOf + filter

```js
Array.prototype.distinct = (arr) => {
  arr.filter((item, i, source) => {
    let index = source.indexOf(item)
    // 当前索引与indexOf索引不一样说明存在相同
    return index === i
  })
}
```

```js
Array.prototype.distinct = (arr) => {
  arr.filter((item, i, source) => {
    let result = []
    // 从当前位置之后开始找
    let index = source.indexOf(item, i + 1)
    if (index === -1) {
      result.push(item)
    }

    return result
  })
}
```

- 利用对象属性不会重复

```js
Array.prototype.distinct = function () {
  let arr = this
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i]] = arr[i]
  }

  return Object.values(obj)
}
```

- for循环

```js
Array.prototype.distinct = function () {
  let arr = this

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1)
        len = len -1
        j = j -1
      }
    }
  }

  return arr
}
```

## set交集，并集，差集

```js
let set1 = new Set([1,2,3])
let set2 = new Set([4,3,2])

let intersect = new Set([...set1].filter(value => set2.has(value)))
let union = new Set([...set1, ...set2])
let difference = new Set([...set1].filter(value => !set2.has(value)))
console.log(intersect)	// Set {2, 3}
console.log(union)		// Set {1, 2, 3, 4}
console.log(difference)	// Set {1}
```

## instance of

instance of 的原理是会遍历左边对象的原型链，如果能够确定右边对象的prototype位于左边对象的原型链上，则返回 true

对象的属性访问器__proto__指向其原型，所以可以通过`left.__proto__ === right.prototype`来判断right.prototype是否是左边原型链上的原型之一

```js
function instanceOf (left, right) {
  let proto = left.__proto__
  let prototype = right.prototype

  while (true) {
    if (proto === null) return false
    if (proto === prototype) return true
    proto = proto.__proto__
  }
}
```

## call、apply、bind

三者区别：

- 除第一个参数外，call接收一个参数列表，apply接收一个参数数组

- bind返回的是一个函数

call 模拟实现思路：大概的思路就是给call函数传入的上下文添加一个函数，然后通过上下文对象隐士调用这个函数，达到改变this的绑定

```js
Function.prototype.myCall = function (context) {
  // 不传context的情况下默认未 window
  context = context || window
  let args = [...arguments].slice(1)
  context.fn = this
  let result = context.fn(...args)
  // 删除 fn 属性
  Reflect.deleteProperty(context, 'fn')

  return result
}
```

apply 模式实现思路和 call的一样。

```js
Function.prototype.myApply = function (context) {
  // 不传context的情况下默认未 window
  context = context || window
  let result
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }

   // 删除 fn 属性
  Reflect.deleteProperty(context, 'fn')

  return result
}
```

bind的模拟需要注意几点：

1. 改变this的指向
2. 可以返回函数
3. 返回的函数还可以传入参数
4. bind返回的函数作为构造函数

我们先基于前三点来实现一个可用的bind函数：

```js
Function.prototype.myBind = function (context) {
  context = context || window
  let args = Array.prototype.slice.call(arguments, 1)
  let self = this

  function fnBound () {
    // 3. 接收返回参数传入的参数，并在调用的时候和bind传入参数合并
    let bindArgs = Array.prototype.slice.call(arguments)
    // 1. apply改变this指向
    self.apply(
      context,
      args.concat(bindArgs)
    )
  }

  // 2. 返回函数
  return fnBound
}
```
   
我们看下上述第四点，bind返回函数作为构造函数，在实例化的时候会发生什么？

```js
const context = {
  name: 'context'
}

function source(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(this.habit);
    console.log(name);
    console.log(age);
}

let Bound = source.bind(context, 'bound')
let bound = new Bound(18)
// undefined
// shopping
// Jack
// 20

bound.habit // shopping
console.log(bound.__proto__ === source.prototype) // true
console.log(bound instanceof source) // true
```
- 提供的上下文（context）将会被忽略，所以 `this.value` 返回undefined
- 实例的构造函数是source，所以 instanceof 返回的结果为true，通过 __proto__属性访问器也能访问到原型为 source.prototype

对比我们实现的myBind函数，发现实例bound的构造函数为fnBound函数，原型为 fnBound.prototype，所以想要达到bind的效果，需要让fnBound继承source。

```js
Function.prototype.myBind = function (context) {
  context = context || window
  let args = Array.prototype.slice.call(arguments, 1)
  let self = this

  function fnBound () {
    // 3. 接收返回参数传入的参数，并在调用的时候和bind传入参数合并
    let bindArgs = Array.prototype.slice.call(arguments)
    // 1. apply改变this指向
    self.apply(
      // 忽略传入的context，绑定正确的this，在new的时候会指向实例
      this instanceof fnBound ? this : context,
      args.concat(bindArgs)
    )
  }
  // 使fnBound继承（Function.prototype），然后实例可以访问到fnBound.prototype原型
  fnBound.prototype = Object.create(this.prototype)
  // 2. 返回函数
  return fnBound
}
```

但是，我们模拟实现bind的出发点是浏览器不支持bind，Object.create()和bind都是ES5的方法，所以这里不能用Object.create

下边是改进后的代码：

```js
Function.prototype.myBind = function (context) {
  context = context || window
  var args = Array.prototype.slice.call(arguments, 1)
  var self = this
  
  function fnPrototype () {}

  function fnBound () {
    // 3. 接收返回参数传入的参数，并在调用的时候和bind传入参数合并
    var bindArgs = Array.prototype.slice.call(arguments)
    // 1. apply改变this指向
    self.apply(
      this instanceof fnBound ? this : context,
      args.concat(bindArgs)
    )
  }

  // 原型链继承
  fnPrototype.prototype = this.prototype
  // 使fnBound继承（Function.prototype）
  fnBound.prototype = new fnPrototype()
  // 2. 返回函数
  return fnBound
}
```

## new

new操作符操作对象的时候会发生以下几件事情，具体的可以查看MDN

1. 创建一个空白对象（obj）
2. 空白对象继承构造函数的原型（prototype）
3. 将步骤1创建的对象作为执行该构造函数的上下文对象
4. 如果该构造函数有返回的对象，则用返回的对象，没有则返回步骤1创建的对象

```js
function create () {
  var obj = new Object()
  var constructorFn = Array.prototype.shift.call(arguments)
  obj.__proto__ = constructorFn.prototype

  var result = constructorFn.apply(
    obj,
    Array.prototype.slice.call(arguments)
  )
  
  return result instanceof Object ? result : obj
}
```

## 写一个通用的事件监听器

```js
// event(事件)工具集，来源：github.com/markyun
markyun.Event = {
  // 视能力分别使用dom0||dom2||IE方式 来绑定事件
  // 参数： 操作的元素,事件名称 ,事件处理程序
  addEvent : function(element, type, handler) {
    if (element.addEventListener) {
      //事件类型、需要执行的函数、是否捕捉
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, function() {
          handler.call(element);
      });
    } else {
      element['on' + type] = handler;
    }
  },
  // 移除事件
  removeEvent : function(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.datachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  },
  // 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
  stopPropagation : function(ev) {
    if (ev.stopPropagation) {
      ev.stopPropagation();
    } else {
      ev.cancelBubble = true;
    }
  },
  // 取消事件的默认行为
  preventDefault : function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
  // 获取事件目标
  getTarget : function(event) {
    return event.target || event.srcElement;
  }
}
```
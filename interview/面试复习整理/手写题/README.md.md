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

## 深拷贝

## 去重

## instance of

## call、apply、bind

三者区别：

- 除第一个参数外，call接收一个参数列表，apply接收一个参数数组

- bind返回的是一个函数

## new

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
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

## 防抖和节流

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
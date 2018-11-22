function MyPromise (executor) {
    var self = this
    /**
     * state 可能的值 'pending' 'fullfilled' 'rejected'
     */
    self.state = 'pending' 
    /**
     * Promise 处于 'fullfilled' 状态需要返回的终值
     */
    self.value = null
    /**
     * Promise 处于 'rejected' 状态需要返回的据因
     */
    self.reason = null
    /**
     * 当 Promise 处于 pending 状态，这个时候调用 then 或者其他的方法，
     * 无法触发 resolve 或者 reject ，因此需要将这些回调先存起来，
     * 在 resolve 或者 reject 之后在处理些回调
     */
    self.onFullfilledCbs = []
    self.onRejectedCbs = []
  /**
   * resolve 执行条件是 state === 'pending'，执行后会将状态变成 'fullfilled'
   * @param {*} value Promise 处于 'fullfilled' 状态需要返回的终值
   */
  function resolve (value) {
    if (self.state === 'pending') {
      //...
      self.value = value
      self.state = 'fullfilled'
      console.log(self.onFullfilledCbs.length)
      for (var i = 0; i < self.onFullfilledCbs.length; i++) {
        // 执行回调列表清单
        self.onFullfilledCbs[i](value)
      }
    }
  }

  /**
   * reject 执行条件是 state === 'rejected'，执行后会将状态变成 'fullfilled'
   * @param {*} reason Promise 处于 'rejected' 状态需要返回的据因
   */
  function reject (reason) {
    if (self.state === 'pending') {
      // ...
      self.reason = reason
      self.state = 'rejected'
      for (var i = 0; i < self.onRejectedCbs.length; i++) {
        // 执行回调列表清单
        self.onRejectedCbs[i](reason)
      }
    }
  }

  try {
    // executor(resolve, reject)
  } catch (error) {
    console.log(error)
  }
  executor(resolve, reject)
}

  /**
   * then 方法可以接受一个或者两个参数，根绝标准，如果接受的参数不是函数我们需要忽略它
   * then 会返回一个 Promise 对象
   * then 会根据上一个 Promise 的状态执行 onResolved 或者 onRejected
   */
MyPromise.prototype.then = function (onResolved, onRejected) {
  onResolved = typeof onResolved === 'function' ? onResolved : function (value) {return value}
  onRejected = typeof onRejected === 'function' ? onRejected : function (reason) {return reason}
  
  return new MyPromise((resolve, reject) => {
    if (this.state === 'fullfilled') {
      /**
       * @param {*} 我们都知道 then 传入的onResolved函数接收上一个 Promise resolve 的值
       * 并且还需要将返回的值 resolve
       * 此外还需要 reject 错误
       */
      try {
        let value = onResolved(this.value)
        resolve(value)
      } catch (error) {
        reject(error)
      }
    }
    
    if (this.state === 'rejected') {
        /**
       * @param {*} 我们都知道 then 传入的onRejected函数接收上一个 Promise reject 的局因 
       */
      try {
        onRejected(this.reason)
      } catch (error) {
        reject(error)
      }
    }

    /**
     * 当 Promise 的状态还是 pending 的时候，我们没法去执行 onResolved 或者 reRejected 函数，
     * 所以需要将他们先存起来 onFullfilledCbs onRejectedCbs
     */
    if (this.state === 'pending') {
      this.onFullfilledCbs.push(onResolved)
      console.log(this.onFullfilledCbs)
      this.onRejectedCbs.push(onRejected)
    }
  })
}

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}



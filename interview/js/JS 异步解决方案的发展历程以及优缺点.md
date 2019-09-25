# JS 异步解决方案的发展历程以及优缺点

1. 回调函数

```js
ajax('XXX1', () => {
    // callback 函数体
    ajax('XXX2', () => {
        // callback 函数体
        ajax('XXX3', () => {
            // callback 函数体
        })
    })
})
```
**优点：**

解决了耗时同步的问题

**缺点：**

错误无法通过try catch 捕获，无法return。嵌套过多会导致错误很难处理，缺少顺序性，回调地狱导致调试困难

2. Promise

```js
ajax('XXX1')
  .then(res => {
      // 操作逻辑
      return ajax('XXX2')
  }).then(res => {
      // 操作逻辑
      return ajax('XXX3')
  }).then(res => {
      // 操作逻辑
  })
```

**优点：**

解决了回调地狱的问题

**缺点：**

无法取消Promise，错误需要通过回调函数捕获

3. generator

```js
function *fetch() {
    yield ajax('XXX1', () => {})
    yield ajax('XXX2', () => {})
    yield ajax('XXX3', () => {})
}
let it = fetch()
let result1 = it.next()
let result2 = it.next()
let result3 = it.next()
```

**优点：**

流程可控制，配合co函数使用效果更好

4. async/await

```js
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch('XXX1')
  await fetch('XXX2')
  await fetch('XXX3')
}
```

**优点：**

异步的终极解决方案，解决了回调地狱问题，代码清晰，不需要像promise写一堆then链。

**缺点：**

await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。

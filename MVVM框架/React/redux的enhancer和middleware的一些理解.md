# createStore函数

通过文档能够知道createStore函数接受三个参数：

```js
const store = createStore(
  reducer,
  [preloadedState],
  [enhancer]
)
```

第二，第三参数都是可选参数。

下边粘贴一些比较重要的createStore函数中的源码和一些注解：

```js
export default function createStore(reducer, preloadedState, enhancer) {
  // ....

  // 当第二个参数是函数且不存在第三个参数，说明第二个参数实际上传入的是enhancer
  // 所以在创建store的时候可以这样写：const store = createStore(reducer, enhancer)
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    // 当存在enhancer且为函数时，将创建store的过程全部转移给enhancer
    // 比如 const store = createStore(reducer, applyMiddleware(...))，实际上等价于 const store = applyMiddleware(...)(createStore)(reducer, preloadedState)
    return enhancer(createStore)(reducer, preloadedState)
  }

  // ...

  // 初始化一次state
  dispatch({ type: ActionTypes.INIT })

  // 返回store对象
  // 通过这个返回结果，可以猜测上边的代码：return enhancer(createStore)(reducer, preloadedState)，必然也是返回一个类似或者一样的对象
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

# enhancer

上边提到createStore的第三个参数是一个enhancer。

那么，什么是enhancer？简单的理解即为增强器，对返回的store对象的某些方法的增强。

比如applyMiddleware函数就是一个enhancer，用来增强store的dispatch方法。

redux文档在配置store那一节中有提到创建enhancer的例子，这里，我把例子的代码粘贴出来

```js
const monitorReducerEnhancer = createStore => (
  reducer,
  initialState,
  enhancer
) => {
  const monitoredReducer = (state, action) => {
    const start = performance.now()
    const newState = reducer(state, action)
    const end = performance.now()
    const diff = round(end - start)

    console.log('reducer process time:', diff)

    return newState
  }

  return createStore(monitoredReducer, initialState, enhancer)
}
```
忽略函数主体，大概就是这样：

```js
const monitorReducerEnhancer = createStore => (
  reducer,
  initialState,
  enhancer
) => {
  // ....函数主体

  // 返回一个store
  return createStore(monitoredReducer, initialState, enhancer)
}
```

回过头再看看上边的提到的 `return enhancer(createStore)(reducer, preloadedState)`，就能明白函数结构为什么是这样的。

同时我们顺便看下applyMiddleware函数的源码，函数结构应该也是一样的：

```js
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    // 返回store
    return {
      ...store,
      dispatch
    }
  }
}
```

# middleware中间件

redux借助中间件能够实现打印日志，完成异步请求等功能。例如，`redux-thunk`。

这里我们通过阅读和研究一下applyMiddleware的源码来理解一下中间件是如何增强dispatch这个方法的。

上边已经贴出了完整的applyMiddleware函数源码，这里只截取重要的部分：

```js
export default function applyMiddleware(...middlewares) {
  // ...省略
  const middlewareAPI = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args)
  }
  const chain = middlewares.map(middleware => middleware(middlewareAPI))
  dispatch = compose(...chain)(store.dispatch)

  // 返回store
  return {
    ...store,
    // 返回增强后的dispatch方法
    dispatch
  }
}
```

我们从`store.dispatch`方法的用法上来猜测，因为dispatch必定接受一个`action`，推测dispatch的一个函数结构应该是：

```js
store.dispatch = (action) => {}
```

所以 `dispatch = compose(...chain)(store.dispatch) = (actions) => { ... }`

接着我们查看一下compose函数的源码，源码比较短，我直接全部贴出来：

```js
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

接下里，我们从单个middleware和多个middleware来分析compose返回的内容。

* 单个middleware

假设存在中间件fnc1：

```js
// 关于中间件的函数格式请自行阅读redux的文档
const fnc1 = store => next => action => {
  console.log(store.getState())
  next(action)
  console.log(store.getState())
}
```

```js
// applyMiddleware.js
// ...
const chain = middlewares.map(middleware => middleware(middlewareAPI))
```

`chain` 的值应该是`[next => action => { ... }]`，形参 `next` 对应的实参应该是 `store.dispatch`， 所以`dispatch = fnc1(store.dispatch)`

* 多个middleware

假设有fnc1，fnc2，fnc3三个中间件。

同上，`chain` 的值是 `[next => action => { ... }， next => action => { ... }，next => action => { ... }]`

```js
// compose.js
return funcs.reduce((a, b) => (...args) => a(b(...args)))
```
由上述的compose函数逻辑可得：

```js
dispatch = fnc1(fnc2(fnc3(store.dispatch))) = action => {}
```

即是是把func2运行之后返回的函数 action => {函数体}，作为func1的参数，然后在 函数体 中进行消费（调用），
func3运行之后返回的函数 action => {函数体}，作为func2的参数，然后在 函数体 中进行消费（调用）

如果以上的中间件的顺序是这样的：

```js
const fnc1 = store => next => action => {
  console.log('fnc1')
  next(action)
}
const fnc2 = store => next => action => {
  console.log('fnc2')
  next(action)
}
const fnc3 = store => next => action => {
  console.log('fnc3')
  next(action)
}
applyMiddleware(func1, func2, func3)
```

正常情况下，且每个中间件都有调用next()，输出结果为：fnc1, fnc2, fnc3

需要注意，如果在fnc3中，不执行 `next(action)`，也就是不执行 `store.dispatch(action)` 那么会导致redux的流程中断。

为了防止中间件瞎捣乱，在中间件正常的情况请执行 next(action)


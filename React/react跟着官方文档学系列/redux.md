# redux 三大原则

* 单一数据源

* state 只读

* 使用纯函数进行修改

先来看下 redux 暴露出来的方法

~~~js
export {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
  __DO_NOT_USE__ActionTypes
}
~~~

* createStore



# action 

描述事件的普通对象。约定 action 内必须使一个字
符串类型的 type 字段来表示将要执⾏的动作。 多数情况下， type 会被定
义成字符串常量。使用action时，应该尽量减少在 action 中传递的数据。

demo

~~~js
{
  type: TOGGLE_TODO,
  index: 5
}
~~~
# action 创建函数

返回 action 的函数
~~~js
function addTodo(text) {
  return {
   type: ADD_TODO,
   text
  }
}
~~~

使用 action 创建函数主要是为了方便调用，例如：

~~~js
function addTodoWithDispatch(text) {
const action = {
  type: ADD_TODO,
    text
  }
  dispatch(action)
}
~~~

~~~js
dispatch(addTodoWithDispatch(text))
~~~

# reducer

接受 state 和 action 作为参数，并且返回一个新的 state 的纯函数。

~~~js
function todoApp(state = initialState, action) {
switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return Object.assign({}, state, {
    visibilityFilter: action.filter
    })
  default:
    return state
}
~~~

使用时需要注意两点：
1. 不要修改 state。使用Object.assign() 进行创建 state 的时候第一参数必须为 {}，或者也可以使用ES7 对象展开运算符{...state, newState}。

2. 在 default 的情况下需要返回旧的 state。

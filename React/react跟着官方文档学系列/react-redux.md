# 个人理解

react-redux 主要用于连接 react 和 redux ，所谓的连接就是如何将 redux 中的 store 传递到 react 组件，react 组件如何调用 redux 的方法等 redux 与 react 之间的交互问题，提供了一种解决的方法。

# react-redux 暴露出来的四个方法

~~~js
export { Provider, createProvider, connectAdvanced, connect }
~~~

* Provider 
本身是一个组件，用于包裹最外层的 react 组件，并需要将 store 作为 props 传递给 Provider，其内部使用 getChildContext api 将 store 直接挂载到 context 上，以便子组件调用。另外，store 和子组件是必须的并且子组件只能是一个

基本使用

~~~jsx
const App = () => {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  )
};
~~~

* connect 
是一个普通函数，接收mapStateToProps，mapDispatchToProps，mergeProps和options，返回一个高阶组件（普通函数），这个高阶组件接收一个组件，并且在高阶组件内部做了一些列的处理，比如 props 的复制返回一个新的组件。

记一下这几个参数的用法，具体的代码看目前只是大概看了一下，没细看

* mapStateToProps

功能是将 state 中的数据取出来，绑定到组件的 props 上

~~~jsx
const mapStateToProps = (state, ownProps) => {
  // state 是 {userList: [{id: 0, name: '王二'}]}
  // ownProps 是组件传入自身的 props
  return {
    user: state.userList.find(item => item.id === ownProps.userId) 
  }
}
~~~

* mapDispatchToProps 

功能是将 action 作为 props 绑定到组件上

~~~jsx
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    increase: (...args) => dispatch(actions.increase(...args)),
    decrease: (...args) => dispatch(actions.decrease(...args))
  }
}
~~~

由于Redux 本身提供了 bindActionCreators 函数，来将 action 包装成直接可被调用的函数，所以取 action 的写法也可以是如下写法：

~~~jsx
import {bindActionCreators} from 'redux';

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    increase: action.increase,
    decrease: action.decrease
  });
}
~~~

* 其他的两个参数好像不常用，以后用到再看文档 [react-redux文档](https://github.com/reduxjs/react-redux/blob/master/docs/api.md#api)

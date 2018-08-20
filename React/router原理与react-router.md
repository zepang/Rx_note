# router原理

### 3个要素

* 历史
* 跳转
* 事件

### 路由分类
* 页面路由（浏览器自带路由）
~~~js
window.location.href = // http:
// js只在浏览器中可以看到，无法用js操作
~~~
* Hash Router
~~~js
window.location.href = '#test'

window.onhashchange = () => { console.log(window.location.hash) }
~~~
* H5 Router
~~~js
history.pushState('test', 'title', '#test')
history.pushState('test', 'title', '/user/index')

history.replaceState('test', null, '/index/test)

// 仅在后退的时候有用
window.onpopstate = (e) => { console.log(e.state) }
~~~

# react-router

~~~js
<BrowserRouter>|<HashRouter> 路由方式

<Route> 路由规则

<Switch> 路由选项，仅仅匹配第一个路由

<Link>|<NavLink> 跳转导航

<Redirect> 自动跳转
~~~

~~~js
class A extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return <div>Component A</div>
  }
}
class B extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return <div>Component B</div>
  }
class Wrapper extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return <div>{this.props.children}</div>
  }
}
~~~

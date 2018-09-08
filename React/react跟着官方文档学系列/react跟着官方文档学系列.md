# 简介
> 更新于 Fri, Sep 07, 2018  2:34:06 PM
目录外边是之前是我根据别人的文章或者问答记的笔记，可以说更多的是别人的经验和理解。我感觉一方面别人的理解可能有误，另一方面，官方文档也在不断更新，我感觉最快的途径和保障知识点的最新和可用性，就是跟着官方文档学习，并且形成自己的理解。所以，内容和章节路线都是和官方文档一样的。目前 react 版本 v16.4.1

# 元素渲染

首先我们需要在 HTML 文件中添加一个 div，作为渲染的根节点
~~~html
<div id="root"></div> 
~~~
将 react 元素和根节点传给 ReactDOM.render 方法，渲染到页面上
~~~jsx
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
~~~

> 需要更新，再次调用 ReactDom.render 方法就好了。

# 组件 &props

* 组件在 

文档上有句话： 组件从概念上看就像是函数，它可以接收任意的输入值（称之为“props”），并返回一个需要在页面上展示的React元素。

看下最简单的一个组件（函数组件）： 

~~~jsx
function Welcome(props) {
  return <h1>{prop.title}</h1>
}
~~~

也可以用 es6 class 创建组件：

~~~jsx
class Welcom extends React.Component {
  render() {
    return <h1>{this.props.title}</h1>
  }
}
~~~

react 的元素有两中，一种是 html 原本的 dom 元素，还有一种是用户自定义的组件。当 react 元素为用户自定义的组件时候，这个时候，它会将jsx 的属性作为一个对象传递给该组件，这个对象称之为 'props'。

~~~jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
~~~

props的只读性。无论是使用函数或是类来声明一个组件，它决不能修改它自己的props。

# State 和生命周期

* 使用类实现的组件就允许我们使用其它特性，例如局部状态、生命周期钩子

* 在类组件中的构造器中可以初始化一个 state 容器，用于存储数据，这样的话就可以将与外界无关的数据直接隔离在组件内部

* 如何正确的使用组件状态

  * 不直接更新状态
  ~~~jsx
  // Wrong
  this.state.comment = 'Hello';

  // Correct
  this.setState({comment: 'Hello'});
  ~~~

  * 利用 this.setState 来更新状态可能是异步的

  因为React 可以将多个setState() 调用合并成一个调用来提高性能。 

  要修复这个无法及时更新的问题，需要用到 this.setState 的第二种形式，直接给它传递一个函数

  ~~~jsx
  this.setState((prevState, props) => ({
    counter: prevState.counter + props.increment
  }));
  ~~~

  虽然，上边的代码能够直接更新，但是如果代码写成这样：
  ~~~jsx
  this.setState((prevState, props) => ({
    counter: prevState.counter + props.increment
  }));
  console.log(this.state.counter) 你会发现还是直接的 counter 没有变化
  ~~~

  要想取得这个更新的 counter，一个是在生命周期函数 componentDidUpdate 中拿到，另一个写法是在 this.setState 的第二个参数 callback 中可以取得：
  ~~~jsx
  this.setState((prevState, props) => ({
    counter: prevState.counter + props.increment
  }), () => {
     console.log(this.state.counter) // 更新后的counter
  });
  ~~~
  * 数据自上而下，也就是说数组只影响下边的组件

  文档上没说，这一节还是需要特别来说生命周期

  ~~~jsx
  class ExampleComponent extends React.Component {
    // 用于初始化 state
    constructor() {}
    // 用于替换 `componentWillReceiveProps` ，该函数会在初始化和 `update` 时被调用
    // 因为该函数是静态函数，所以取不到 `this`
    // 如果需要对比 `prevProps` 需要单独在 `state` 中维护
    static getDerivedStateFromProps(nextProps, prevState) {}
    // 判断是否需要更新组件，多用于组件性能优化
    shouldComponentUpdate(nextProps, nextState) {}
    // 组件挂载后调用
    // 可以在该函数中进行请求或者订阅
    componentDidMount() {}
    // 用于获得最新的 DOM 数据
    getSnapshotBeforeUpdate() {}
    // 组件即将销毁
    // 可以在此处移除订阅，定时器等等
    componentWillUnmount() {}
    // 组件销毁后调用
    componentDidUnMount() {}
    // 组件更新后调用
    componentDidUpdate() {}
    // 渲染组件函数
    render() {}
    // 以下函数不建议使用
    UNSAFE_componentWillMount() {}
    UNSAFE_componentWillUpdate(nextProps, nextState) {}
    UNSAFE_componentWillReceiveProps(nextProps) {}
  }
  ~~~

# 事件处理

* react 的事件写法和 dom 元素的绑定类似
* 事件对象 e 是一个合成事件不需要但是浏览器兼容性
* 类的方法默认是不会绑定 this 的。如果你忘记绑定 this.handleClick 并把它传入 onClick, 当你调用这个函数的时候 this 的值会是 undefined。所以建议在构造器中利用bind正确的绑定this。

~~~jsx
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
    _handleClick = this.handleClick.bind(this)
  }

  return (
    <a href="#" onClick={this._handleClick}>
      Click me
    </a>
  );
}
~~~

* 向事件处理程序传递参数

~~~jsx
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
~~~

# 添加运算

React 中的条件渲染和 JavaScript 中的一致，使用 JavaScript 操作符 if 或条件运算符来创建表示当前状态的元素，然后让 React 根据它们来更新 UI。

# 列表运算

* 需要注意的每个 item 需要指定唯一的key

~~~jsx
function ListItem(props) {
  // 对啦！这里不需要指定key:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 又对啦！key应该在数组的上下文中被指定
    <ListItem key={number.toString()}
              value={number} />

  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
~~~

# 表单

* 受控组件： 其值由React控制的输入表单元素称为“受控组件”。
* 非受控组件： 利用 refs 从 dom 中取得表单值
* textarea 和 select 的值都将通过绑定 value 得到
* 多个输入的解决办法： 当你有处理多个受控的input元素时，你可以通过给每个元素添加一个name属性，来让处理函数根据 event.target.name的值来选择做什么。

# 状态提升

在使用react的时候，经常遇到好几个组件共享状态数据的情况，我们最好将这部分共享的数据提升到最近的父组件中进行管理。

# 组合

* 推荐使用组件组合而不是继承
* 建议这些组件使用 children 属性将子元素直接传递到输出

~~~jsx
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
}
~~~

# 设计模式

设计模式是一个抽象的概念，简单来说就是可以复用的写代码的方式，或者说是写代码的一些套路。这些套路都是无数次的实践总结而来的。

- [单例模式](#单例模式)
- [工厂模式](#工厂模式)
- [发布订阅模式](#发布订阅模式)
- [装饰模式](#装饰模式)
- [代理模式](#代理模式)
- [外观模式](#外观模式)

## 单例模式

保证一个类只有一个实例。一般先判断是否存在实例，存在则返回，不存在则创建。

它的作用有：

- 模块间的通信
- 保证类对象的唯一性
- 防止变量污染

应用案例：

比如全局的消息通知类组件，会使用唯一的实例。

```js
import Alert from './index'
import Vue from 'vue'

let alertInstance 

const defaultOptions = {
  duration: 2000
}

const getAlertInstance= () => {
  // 存在则使用之前的实例，不存在则创建新实例
  alertInstance = alertInstance || createAlertInstance()
  return alertInstance
}

const createAlertInstance = (options) => {
  options = options || defaultOptions
  const instance = new Vue({
    render: h => {
      return h(Alert, {
        props: options
      })
    }
  })
  const component = instance.$mount()
  document.body.appendChild(component.$el)
  return instance.$children[0]
}

const alertFunc = (options) => {
  const instance = getAlertInstance()
  instance.add(options)
}

export default alertFunc
```

## 工厂模式

工厂模式是用来创建对象的一种设计模式。

它的作用是隐藏创建实例或者对象的细节内容（具体逻辑）。将创建实例或者对象的逻辑封装在一个函数中，然后调用该函数来创建对象，该函数就可以认为是一个工厂。

应用案例：

比如`React.createElement`就是一个工厂函数：

```js
React.createElement(
  type,
  [props],
  [...children]
)
```

下边是其源码：

```js

```

## 发布订阅模式

发布订阅模式表示一种一对多的依赖关系，当被依赖的对象发生变化时，会通知所有依赖它的对象。

应用案例：

发布订阅模式通常会维护一个订阅清单，根据订阅消息的类型来通知订阅清单上的订阅者。

```js
class Subject {
  constructor() {
    // 订阅清单
    this.subs = {}
  }

  addSub(key, fn) {
    const subArr = this.subs[key]
    if (!subArr) {
      this.subs[key] = []
    }
    this.subs[key].push(fn)
  }

  trigger(key, message) {
    const subArr = this.subs[key]
    if (!subArr || subArr.length === 0) {
      return false
    }
    for(let i = 0, len = subArr.length; i < len; i++) {
      const fn = subArr[i]
      fn(message)
    }
  }

  unSub(key, fn) {
    const subArr = this.subs[key]
    if (!subArr) {
      return false
    }
    if (!fn) {
      this.subs[key] = []
    } else {
      for (let i = 0, len = subArr.length; i < len; i++) {
        const _fn = subArr[i]
        if (_fn === fn) {
          subArr.splice(i, 1)
        }
      }
    }
  }
}

// 测试
// 订阅
let subA = new Subject()
let A = (message) => {
  console.log('订阅者收到信息: ' + message)
}
subA.addSub('A', A)

// 发布
subA.trigger('A', '订阅消息已经更新')   // A收到信息: --> 订阅消息已经更新
```

此外Vue的响应式原理也有用到该模式，当响应式对象的属性被更新，Dep实例会通知依赖它Watcher实例进行视图更新：

```js
class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    // 订阅清单
    this.subs = []
  }

  // 添加订阅者
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// 订阅者的类，用于创建订阅者

class Watcher {

}
```

## 装饰模式

不需要改变对象已有的接口，给对象添加功能。比如给手机添加抗摔功能，不需要去加强手机本身，只需要套个壳就可以。

应用案例：

利用ES7实现的装饰器

```js
function readonly(target, key, descriptor) {
  descriptor.writable = false
  return descriptor
}

class Test {
  @readonly
  name = 'yck'
}

let t = new Test()

t.yck = '111' // 不可修改
```

React的高阶组件应用：

```js
import { connect } from 'react-redux'
class MyComponent extends React.Component {
    // ...
}
export default connect(mapStateToProps)(MyComponent)
```

## 代理模式

代理是为了控制对对象的直接访问，不让外部直接访问到对象。比如现实生活中的代购。

应用案例：

事件代理

```html
<ul id="list">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>
<script>
  let ul = document.querySelector('#list')
  ul.addEventListener('click', (event) => {
      console.log(event.target);
  })
</script>
```

## 外观模式

对外提供统一接口，隐藏内部实现细节，方便调用。

应用案例：

利用外观模式设计兼容不同浏览器的事件绑定的方法

```js
function on(type, fn){
  // 对于支持dom2级事件处理程序
  if(document.addEventListener){
      dom.addEventListener(type,fn,false);
  }else if(dom.attachEvent){
  // 对于IE9一下的ie浏览器
      dom.attachEvent('on'+type,fn);
  }else {
      dom['on'+ type] = fn;
  }
}
```


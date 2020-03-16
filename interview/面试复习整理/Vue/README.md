# Vue

建议查看https://ustbhuangyi.github.io/vue-analysis/[https://ustbhuangyi.github.io/vue-analysis/]

也可以看看

## vue 生命周期

每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己的代码的机会。

![](./生命周期.png)

以上是来自官网的介绍和示意图，下边我们结合源码看一下每个生命周期的一些细节

```js
// 源码2.6 Vue.prototype._init

Vue.prototype._init = function (options) {
  // ...
  initLifecycle(vm);
  initEvents(vm);
  initRender(vm);
  // 1. beforeCreate
  callHook(vm, 'beforeCreate');
  initInjections(vm); 
  initState(vm);
  initProvide(vm); 
  callHook(vm, 'created');
  // ...
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}

// initState
function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

```

1. beforeCreate： 是Vue实例化调用的一个生命周期钩子，我们可以看到在这之后才会调用 `initInjections` `initState` `initState`，然后initState里边初始化 props, methods, data, computed, watch。所以，beforeCreate 这个生命周期调用的时候是无法访问到以上的数据的。
2. created：create调用的时候能够访问到上述beforeCreate无法访问的数据，然而dom的挂在和建立响应式数据监听和更新在其后面，所以此阶段更新数据无法触发update钩子函数，无法完成与DOM的交互

```js
function mountComponent (
  vm,
  el,
  hydrating
) {
  // 在这之前确保将.vue文件template转换成render函数
  if (!vm.$options.render) {
    // ...
  }

  callHook(vm, 'beforeMount');
  // ...

  // 生成vnode
  if (config.performance && mark) {
    var vnode = vm._render();
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // 建立监听
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;

  if (vm.$vnode == null) {
    // 确定dom挂在完毕
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
}
```

3. beforeMounted：发生在挂载之前，在这之前template模板已导入渲染函数编译。虚拟dom是在beforeMounted和mounted生命周期之间建立的。在此时也可以对数据进行更改，不会触发updated

4. mounted：DOM挂载完毕，数据完成双向绑定，可以访问到Dom节点，使用$ref属性对Dom进行操作。

5. beforeUpdate发生在更新之前，也就是响应式数据发生更新，虚拟dom重新渲染之前被触发，你可以在当前阶段进行更改数据，不会造成重渲染。

6. updated发生在更新完成之后，当前阶段组件Dom已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新。

7. beforeDestroy发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这时进行善后收尾工作，比如清除计时器。

8. destroyed发生在实例销毁之后，这个时候只剩下了dom空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁。

生命周期的另类写法：

```html
<child
  @hook:beforeCreate="handleChildBeforeCreate"
  @hook:created="handleChildCreated"
  @hook:mounted="handleChildMounted"
  @hook:生命周期钩子
 />
```

因为，callHook 函数的最后有这样一段代码:
```js
if (vm._hasHookEvent) {
  vm.$emit('hook:' + hook)
}
```

## nextTick

nextTick是Vue实现的一个函数，其作用是让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM

下边是2.6版本的实现：

```js
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}
```

从代码中可以看出，优先使用microtask。

2.4版本之前也是优先microtask，但是microtask的优先级过高，比如冒泡事件中，更新数据优先级比冒泡事件快，可能会导致数据更新不正确，所以之后，在这类情况下，会使用macrotask。

但是在2.6版本之后对这个情况进行了修复，所以看不到特殊情况下使用macrotask的判断：

```js
function add$1 (
  name,
  handler,
  capture,
  passive
) {
  // async edge case #6566: inner click event triggers patch, event handler
  // attached to outer element during patch, and triggered again. This
  // happens because browsers fire microtask ticks between event propagation.
  // the solution is simple: we save the timestamp when a handler is attached,
  // and the handler would only fire if the event passed to it was fired
  // AFTER it was attached.
  if (useMicrotaskFix) {
    var attachedTimestamp = currentFlushTimestamp;
    var original = handler;
    handler = original._wrapper = function (e) {
      if (
        // no bubbling, should always fire.
        // this is just a safety net in case event.timeStamp is unreliable in
        // certain weird environments...
        e.target === e.currentTarget ||
        // event is fired after handler attachment
        e.timeStamp >= attachedTimestamp ||
        // bail for environments that have buggy event.timeStamp implementations
        // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
        // #9681 QtWebEngine event.timeStamp is negative value
        e.timeStamp <= 0 ||
        // #9448 bail if event is fired in another document in a multi-page
        // electron/nw.js app, since event.timeStamp will be using a different
        // starting reference
        e.target.ownerDocument !== document
      ) {
        return original.apply(this, arguments)
      }
    };
  }
  // ....
}
```

## vue 响应式原理



## vue 虚拟DOM diff

## vue-loader的实现原理

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

> 基于2x版本

核心的api是`Object.defineProperty()`这个就不多说了

响应式原理需要注意的几点：

- 响应式对象
- 依赖收集
- 派发更新

为了更好的说明，我这里结合大概的过程和源码来说明：

**初始化数据与响应式对象**：

Vue初始化实例的时候会调用其定义的`_init`函数，`_init`会调用`initState`函数初始化 props, mehtods, data, compute, watch这些数据

```js
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
```

这里着重关注 `initData`

```js
function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}
```

- 校验data的key是否可用
- 将data上的属性都代理到vm上
- 观察data对象

```js
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}
```

- 通过观察对象的`__ob__`属性判断是否为已观察的对象
- 是则直接返回对象的`__ob__`属性，否则创建一个Observer的实例

```js
function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

// ...

function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}
```

- 给观察对象添加`__ob__`属性，值为当前的Observer实例。
- 观察对象若为数组，使用 `observeArray` 进行观察，反之用 `walk`

```js
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};
```

`observeArray` 就是对数组的每个元素创建观察实例，最终还是调用walk

这里我们直接看walk的逻辑：

```js
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};
```

- walk内部调用 defineReactive$$1 在对象上定义响应式的属性。注意这里的逻辑比较重要，仔细阅读下边源码：

```js
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}
```

为什么说这段比较重要呢？

`defineReactive$$1`函数内部使用`Object.defineProperty`自定义对象对象存取属性描述符。在get内触发依赖收集的逻辑，在set内定义触发派发更新。目前这个阶段是Vue实例初始化数据的阶段，get 和 set 内部的逻辑都不会触发，在之后对data属性的读写都将触发get和set的逻辑，以此来完成响应式的操作。

所以，`Object.defineProperty`是完成Vue响应式原理的核心API。因为`Object.defineProperty`的兼容性也导致Vue不兼容IE8以及其以下浏览器。

**依赖收集：**

接下来我们分析一下get内部是如何完成依赖收集？

Vue定义了两个类来帮助依赖收集和派发更新：Watcher 和 Dep

那么Watcher和Dep有什么作用呢？

在Vue实例初始化的时候，`_init`内部的逻辑大概是这样的：

```js
Vue.prototype._init = function (options) {
    // ...
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    // ..

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}
```

完成数据的初始化（包括上边提到的响应式对象处理），一些生命周期钩子函数调用等操作之后会进行挂载实例，$mount其重要逻辑就是调用mountComponent，下边是mountComponent的源码（省略部分代码）：

```js
function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  // ...
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}
```

在挂载的时候会初始化一个Wathcer的实例，并把`updateComponent`函数当成参数传入，使其成为实例的`getter`属性，并会在实例的原型方法`get`中进行调用。（注意：`updateComponent`调用将会调用`_render`函数重新进行渲染组件，实际上`_render`函数会读取之前定义的被观察对象的响应式属性，从而触发依赖收集，所以，调用Wathcer实例原型方法`get`，则会进行依赖收集）。以下是Wathcer的源码：

```js
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
      warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};
```

我们可以看到Watcher实例初始化的时候就会调用`get`方法。其中有两点需要注意：

1. `pushTarget(this)`：将当前Watcher实例赋值给全局类Dep的target属性。

```js
function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}
```

这一步需要在依赖收集之前触发，不然无法进行依赖收集。

```js
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();
  // ...
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      // 满足条件
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    // ...
  });
}
```

2. `value = this.getter.call(vm, vm)`：触发依赖收集

每次读取（get）属性都将初始化一个Dep实例，并调用`dep.depend`，将当前dep实例存到当前Watcher实例newDeps中，并将当前Watcher实例存到Dep实例的subs属性中。这样就完成了一次依赖收集和订阅。所谓的依赖收集收集的就是指本次读取或者触发了属性的依赖，也就是Watcher实例收集器Dep实例；订阅就是观察者（Watcher实例）订阅了Dep的实例，并且每个Dep实例都创建了一个subs订阅清单来存储订阅者，一旦更新，就会通知（dep.notify）这些观察者（Watcher实例）。

```js
Dep.prototype.depend = function depend () {
  if (Dep.target) {
    // 实际上调用Watcher实例的原型方法addDep
    Dep.target.addDep(this);
  }
};

Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      // 并将当前Watcher实例存到Dep实例的subs属性中
      dep.addSub(this);
    }
  }
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};
```

为什么需要将Dep实例存到Watcher实例的newDeps中？

初始化Watcher实例的时候，创建了newDeps和deps来分别表示本次新加入的Dep实例数组，
上一次该Watcher实例加入的Dep实例数组。

我们在之前的get方法中可以看到，当我们触发完依赖收集的时候，会调用`popTarget();this.cleanupDeps();`去还弹出当前targetStack栈中的Watcher实例，并清空deps，将新的newDeps赋值给deps。

```js
function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};
```

**派发更新**：

Watcher实例作为观察者，知道如何需要去更新什么内容比如更新视图，执行回调什么的。

一旦我们对之前响应式对象的属性进行写入操作，根据之前的set逻辑，会调用dep.notify()来派发更新。

```js
Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (!config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};
```

notify实际上是就是调用订阅清单中的Wathcer实例的update方法，然后调用实例的run方法进行更新（queueWatcher最终也是调用run方法进行更新）。

```js
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};
```

- run函数内部首先会调用get方法，这里我们回到上边说的挂载Vue实例的逻辑，get实际上会调用updateComponent方法，进而触发_render函数，进行重新渲染，更新视图。

- run之后会调用传入的回调函数cb，这里通常是Vue的$watch方法传入的回调，此时，因为之前的挂载创建的Watcher实例传入的回调是空的函数。

```js
Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}
```

![](./响应式数据.png)

总结：vue的响应式原理应该包含两部分，一部分是Object.defineProperty重写对象属性读写描述符，是对象成为响应式对象，能够触发依赖收集和派发更新。另一个观察订阅模式的使用，使用Dep和Watcher类帮助进行依赖收集，进行派发更新。

## $set

如果未在初始化的时候定义，通过后端动态添加的对象，Vue是不触发对象属性的get和set的。所以，Vue提供了$set方法来重写对象的get和set属性描述符，让其成为响应式对象，并手动调用一次更新。

```js
function set (target, key, val) {
  if (isUndef(target) || isPrimitive(target)
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}
```

## Vue变动数组响应式

Vue目前对以下两种数组的处理是无法触发响应式的：

- 直接利用索引添加一个数组元素：`vm.list[vm.list.length] = element`
- 直接修改数组的长度：`vm.list.length = newLength`

针对第一种情况建议使用$set方法处理，第二种建议使用数组的方法splice

Vue对数组类型的数据会重写push','pop','shift','unshift','splice','sort','reverse'方法，并对其'push', 'unshift', 'splice'这个三个添加新的元素做了响应式处理。

```js
var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});
```
创建一个arrayMethods继承Array，将数组的方法都代理到arrayMethods对象，然后在数组类型数据调用上述方法的时候，先调用原来的数组方法，之后调用notify进行通知更新。

那么为什么调用数组类型数据的方法会触发代理的逻辑，因为在Observer对数组类型数据进行观察的时候，进行了特殊处理，替换了当前的数据的原型链为arrayMethods，数组调用的时候自然访问的是arrayMethods上的方法了。
```js
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}
```

## vue 虚拟DOM diff

查看本目录下，vue源码-虚拟DOM的diff过程

## vue-loader的实现原理

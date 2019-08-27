# Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()

* Object.prototype.toString.call()

每一个继承`Object`的对象都有`toString`方法，通常这些对象都会重写该方法，通过`Object.prototype.toString.call()`可以访问到未被重新的`toString`方法。
返回的结果为`[object, type]`, `type`为对象的类型。

```js
const an = ['Hello','An'];
an.toString(); // "Hello,An"
Object.prototype.toString.call(an); // "[object Array]"
```

这种方法所有的基本类型都可以进行判断，即使是`null`和`undefined`：

```js
Object.prototype.toString.call('An') // "[object String]"
Object.prototype.toString.call(1) // "[object Number]"
Object.prototype.toString.call(Symbol(1)) // "[object Symbol]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(function(){}) // "[object Function]"
Object.prototype.toString.call({name: 'An'}) // "[object Object]"
```

所以，`Object.prototype.toString.call()` 常用于判断浏览器内置对象类型。

* instanceof 

`instanceof` 的语法为 `object instanceof constructor`，用来检测`constructor.prototype`是否存在于参数`object`的原型链上

使用`instanceof`判断一个对象是不是数组，`instanceof`会判断这个对象的原型链上是否有`Array`的原型，返回`true`或者`false`

```js
[] instanceof Array // true
```

但 `instanceof` 只能用来判断对象类型，原始类型不可以。并且所有对象类型 `instanceof Object` 都是 true。

```js
[]  instanceof Object; // true
```

* Array.isArray()

用于确定传递的值是否是一个 `Array`

```js
// 下面的函数调用都返回 true
Array.isArray([]);
Array.isArray([1]);
Array.isArray(new Array());
// 鲜为人知的事实：其实 Array.prototype 也是一个数组。
Array.isArray(Array.prototype); 

// 下面的函数调用都返回 false
Array.isArray();
Array.isArray({});
Array.isArray(null);
Array.isArray(undefined);
Array.isArray(17);
Array.isArray('Array');
Array.isArray(true);
Array.isArray(false);
Array.isArray({ __proto__: Array.prototype });
```

**当检测Array实例时, Array.isArray 优于 instanceof,因为Array.isArray能检测iframes**

```js
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length-1].Array;
var arr = new xArray(1,2,3); // [1,2,3]

// Correctly checking for Array
Array.isArray(arr);  // true
// Considered harmful, because doesn't work though iframes
arr instanceof Array; // false
```

假如不存在 Array.isArray()，则在其他代码之前运行下面的代码将创建该方法。

```js
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
```
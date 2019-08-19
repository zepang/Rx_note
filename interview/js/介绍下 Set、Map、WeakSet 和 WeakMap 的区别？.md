## 介绍下 Set、Map、WeakSet 和 WeakMap 的区别？

Set 和 Map 主要的应用场景在于 数据重组 和 数据存储

Set 是一种叫做 集合 的数据结构，Map 是一种叫做 字典 的数据结构

### 1. 集合（Set）

ES6 新增的一种新的数据结构，类似于数组，但成员是唯一，且无序的，没有重复的值。

Set 本身是一种构造函数，用来生成Set数据结构。

```js
new Set([iterable])
```

举个例子：

```js
const s = new Set()
[1,2,3,4,3,2,1].forEach(x => s.add(x))

for (let i of s) {
  console.log(i)
}
// 数组去重
let arr = [1,2,32,1,1]
[...new Set(arr)] // [1,2,3]
```

Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。

向Set加入值的时候，不会发生类型转换，所有`5`和`'5'`是两个不同的值。Set内部判断两个值是否不同，使用的算法佳作"Same-value-zero equality"，它类似于精确相等的运算符（===），主要的区别是 NaN 等于自身，而精确相等认为 NaN 不等于自身。

```js
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}

let set1 = new Set()
set1.add(5)
set1.add('5')
console.log([...set1])	// [5, "5"]
```

- Set实例属性
  + constructor：构造函数
  + size：元素数量

```js
let set = new Set([1,2,3,2,1])

set.constructor
// ƒ Set() { [native code] }

set.size
// 3
```

- Set 实例方法
  + 操作方法
    * add(value)：新增，相当于array里的push
    * delete(value)：存在及删除集合中的value
    * has(value)：判断集合中是否存在value
    * clear()：清空集合
    ---
    ```js
    let set = new Set()
    set.add(1).add(2).add(1)

    set.has(1)	// true
    set.has(3)	// false
    set.delete(1)	
    set.has(1)	// false
    ```
    `Array.from()`方法可以将Set结构转换为数组

    ```js
    const items = new Set([1,2,3,2,1])
    const array = Array.from(items)
    console.log(array)	// [1, 2, 3]
    // 或
    const arr = [...items]
    console.log(arr)	// [1, 2, 3]
    ```
  + 遍历方法
    * keys()：返回一个包含集合中所有键的迭代器
    * values()：返回一个包含集合中所有值的迭代器
    * entrie()：返回一个包含Set对象中所有元素的键值对迭代器
    * forEach(callbackFn, thisArg)：用于对集合成员执行callbackFn操作，如果提供了thisArg参数，回调中的this会是这个参数(如果callbackFn是箭头函数就没法用thisArg绑定this了)，没有返回值。
    ```js
    let set = new Set([1,2,3,2,1])
    console.log(set.keys())	// SetIterator {1, 2, 3}
    console.log(set.values())	// SetIterator {1, 2, 3}
    console.log(set.entries())	// SetIterator {1, 2, 3}
    for (let item of set.keys()) {
      console.log(item);
    }	// 1	2	 3
    for (let item of set.entries()) {
      console.log(item);
    }	// [1, 1]	[2, 2]	[3, 3]
    console.log([...set])	// [1, 2, 3]
    ```
    Set 可默认遍历，默认遍历迭代器生成函数是values()方法
    ```js
    Set.prototype[Symbol.iterator] === Set.prototype.values // true
    ```
    所以，Set可以使用map,filter方法
    ```js
    let set = new Set([1, 2, 3])
    set = new Set([...set].map(item => item * 2))
    console.log([...set])	// [2, 4, 6]

    set = new Set([...set].filter(item => (item >= 4)))
    console.log([...set])	//[4, 6]
    ```
    因此，Set很容易实现交集（Intersect），并集（Union），差集（Difference）
    ```js
    let set1 = new Set([1,2,3])
    let set2 = new Set([4,3,2])

    let intersect = new Set([...set1].filter(value => set2.has(value)))
    let union = new Set([...set1, ...set2])
    let difference = new Set([...set1].filter(value => !set2.has(value)))
    console.log(intersect)	// Set {2, 3}
    console.log(union)		// Set {1, 2, 3, 4}
    console.log(difference)	// Set {1}
    ```
### 2. WeakSet

WeakSet 对象允许你将弱引用对象存储在一个集合中

WeakSet 与 Set 的区别

* WeakSet 只能存储对象引用，不能存放值，而Set对象都可以
* WeakSet 对象中存储的对象值都是被弱引用的，即垃圾回收机制不考虑WeakSet对该对象的引用，如果没有被其他的遍历或者属性引用这个对象值，
则这个对象会被垃圾回收掉（不考虑该对象还存在于 WeakSet 中）。所以，WeakSet对象里有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数可能不一致，遍历结束后，有的成员可能取不到了（被垃圾回收了），WeakSet对象是无法被遍历的（ES6规定WeakSet不可遍历），也没有办法拿到它包含的所有元素。

属性：

* constructor：构造函数，任何一个具有iterable接口的对象，都可以作参数
  ```js
  const arr = [[1,2], [3,4]]
  const weakset = new WeakSet(arr)
  console.log(weakset)
  ```
方法：

* add(value)：在WeakSet对象中添加一个元素value
* has(value)：判断WeakSet对象中是否包含value
* delete(value)：删除元素value

  ```js
  var ws = new WeakSet()
  var obj = {}
  var foo = {}

  ws.add(window)
  ws.add(obj)

  ws.has(window)	// true
  ws.has(foo)	// false

  ws.delete(window)	// true
  ws.has(window)	// false
  ```

### 3. 字典

集合 与 字典的区别：

* 共同点： 集合、字典可以存储不重复的值
* 不同点：集合是以`[value, value]`的形式存储，字典是以`[key, value]`的形式存储

任何具有Iterator接口，并且每个成员都是一个双元素的数组的数据结构都可以当作`Map`构造函数的参数

```js
const set = new Set([
  ['foo', 1],
  ['bar', 2]
])

const m1 = new Map(set)
m1.get('foo') // 1

const m2 = new Map([['baz', 3]])
const m3 = new Map(m2)
m3.get('baz') // 3
```
如果读取一个未知的键，则返回`undefined`

```js
new Map().get('asfddfsafdsfa')
// undefined
```

注意，只有对同一个对象的引用，Map结构才将其视为同一个键

```js
const map = new Map()

map.set(['a'], 555)
map.get(['a']) // undefined
```

由上可知，Map的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个不一样的键。这就解决了同名属性碰撞（clash）的 问题，我们拓展别人库的时候，如果使用对象作为键名，就不用担心 自己的属性与原作者的属性同名。

如果Map的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map将其视为一个键，比如`0` 和 `-0`。虽然`Null`不严格相等，但是Map将其视为同一个键。
```js
let map = new Map()

map.set(0, 123)
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123);
map.get(NaN) // 123
```

Map的属性以及方法

属性：

* constructor：构造函数
* size：返回字典中所包含的元素个数
```js
const map = new Map([
  ['name', 'An'],
  ['des', 'Js']
])
map.size // 2
```
操作方法：

* set(key, value)：向字典内添加新元素
* get(key)：通过键查找特定的数值并返回
* has(key)：判断字典中是否存在键key
* delete(key)：通过键key从字典中以哦出对应的数据
* clear()：将这个字典中所有元素删除
  
遍历方法：

* keys()：将字典所有键名以迭代器的形式返回
* values()：将字典中所有数值以迭代器形式返回
* entries()：返回所有成员的迭代器
* forEach()：遍历字典所有成员

```js
const map = new Map([
  ['name', 'An'],
  ['des', 'Js']
])

console.log(map.entries()) //MapIterator {"name" => "An", "des" => "Js"}
console.log(map.keys()) // MapIterator {"name", "des"}
```

Map结构的默认遍历器接口(`Symbol.iterator`属性)，就是`entries`方法

```js
map[Symbol.iterator] === map.entries
```

Map结构转为数组结构，比较快速的方法是使用拓展运算符（...)

```js
const reporter = {
  report: function (key, value) {
    console.log("Key: %s, Value: %s", key, value)
  }
}

let map = new Map([
  ['name', 'An'],
  ['des', 'Js']
])
map.forEach(function (value, key, map) {
  this.report(key, value)
}, reporter)
```

**与其他数据结构的相互转换**

1. Map 转 Array 
  ```js
  const map = new Map([[1, 1], [2, 2], [3, 3]])
  console.log([...map])	// [[1, 1], [2, 2], [3, 3]]
  ```
2. Array 转 Map
  ```js
  const map = new Map([[1, 1], [2, 2], [3, 3]])
  console.log(map)	// Map {1 => 1, 2 => 2, 3 => 3}
  ```
3. Map 转 Object

  ```js
  function mapToObj (map) {
    let obj = Object.crate(null)
    for (let [key, value] of map) {
      obj[key] = value
    }
    return obj
  }
  const map = new Map().set('name', 'An').set('des', 'JS')
  mapToObj(map)  // {name: "An", des: "JS"}
  ```
  因为 Object 的键名都为字符串，而Map 的键名为对象，所以转换的时候会把非字符串键名转换为字符串键名。

4. Object 转 Map

  ```js
  function objToMap (obj) {
    let map = new Map()
    for (let key of Object.keys(obj)) {
      map.set(key, obj[key])
    }
    return map
  }

  objToMap({'name': 'An', 'des': 'JS'}) // Map {"name" => "An", "des" => "JS"}
  ```

5. Map 转 JSON

  ```js
  function mapToJson (map) {
    return JSON.stringify([...map])
  }
  let map = new Map().set('name', 'An').set('des', 'JS')
  mapToJson(map)	// [["name","An"],["des","JS"]]
  ```
6. JSON 转 Map

  ```js
  function jsonToStrMap (jsonStr) {
    return objToMap(JSON.parse(jsonStr))
  }
  jsonToStrMap('{"name": "An", "des": "JS"}') // Map {"name" => "An", "des" => "JS"}
  ```

## 4. WeakMap

WeakMap 对象是一组键值对的集合，其中键是弱引用对象，而值是可以任意。

注意，WeakMao弱引用的只是键名，而不是键值。键值依然是正常引用。

WeakMap 中，每个键对自己所引用对象的引用都是弱引用，在没有其他引用和该键引用同一对象，这个对象将会被垃圾回收（相应的key则变成无效的），所以，WeakMap 的 key 是不可枚举的。

属性：

* constructor：构造函数

方法：

* has(key)：判断是否有key关联对象
* get(key)：返回key关联对象（没有则返回undefined）
* set(key)：设置一组key关联对象
* delete(key)：以除key的关联对象

```js
let myElement = document.getElementById('logo');
let myWeakmap = new WeakMap();

myWeakmap.set(myElement, {timesClicked: 0});

myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
}, false);
```

## 5. 总结

* Set
  - 成员唯一，无序且不重复
  - `[value,value]`, 键值与键名一致，或者说只有键值，没有键名
  - 可以遍历，方法有：add,delete,has

* WeakSet
  - 成员都是对象
  - 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不同意造成内存泄漏
  - 不能遍历，方法有add,delete,has

* Map 
  - 本质上键值对的集合，类似集合
  - 可以遍历，方法很多可以跟各种数据格式转换

* WeakMap
  - 只接受对象作为键名（null除外），不接受其他类型的值作为键名
  - 键名是弱引用，键值可以是任意，键名所指的对象可以被垃圾回收，此时键名是无效的。
  - 不能遍历，方法有：get,set,delete,has



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


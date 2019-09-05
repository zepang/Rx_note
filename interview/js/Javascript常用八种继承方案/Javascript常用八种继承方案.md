# Javascript常用八种继承方案

### 1. 原型链继承

构造函数、原型和实例之间的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个原型对象的指针。

继承的本质就是**复制，即重写原型对象，代之以一个新类型的实例**

```js
function SuperType () {
  this.property = true
}

SuperType.prototype.getSuperValue = function () {
  return this.property()
}

function SubType () {
  this.subProperty = false
}

// 这里是关键，创建SuperType实例，并将该实例赋值给SubType.prototype

SubType.prototype = new SuperType()

SubType.prototype.getSubValue = function () {
  return this.subProperty
}

let instance = new SubType()
console.log(instance.getSubValue()) // true
```

![](./1.png)

原型链方案存在的缺点：

1. `constructor`的指向问题

```js
console.log(SubType.prototype.constructor === SuperType) // true
console.log(instance.constructor === SuperType) //true
```

所以，通常我们使用原型链继承的方案都需要手动的更改正确的constructor的指向

```js
SubType.prototype = new SuperType()
SubType.prototype.constructor = SubType
```

2. 实列之间共享原型上的引用类型数值

```js
function SuperType () {
  this.colors = ['red','blue', 'green']
}
function SubType () {}

SubType.prototype = new SuperType()
SubType.prototype.constructor = SubType

let instance1 = new SubType()
instance1.colors.push('black')
console.log(instance1.colors)// ["red", "blue", "green", "black"]

let instance2 = new SubType()
console.log(instance2) // ["red", "blue", "green", "black"]
console.log(SubType.prototype.colors) // ["red", "blue", "green", "black"]
```

### 2. 借用构造函数继承

使用父类的构造函数来增强子类实例，等同于赋值父类的实列给子类（不使用原型）

```js
function SuperType () {
  this.colors = ['red', 'blue', 'green']
}
function SubType () {
  // 继承SuperType
  SuperType.call(this)
}

let instance1 = new SubType()
instance1.colors.push('black') 
console.log(instance1.colors) //  ["red", "green", "blue", "black"]

let instance2 = new SubType()
instance1.colors.push('yellow') 
console.log(instance2.colors) //  ["red", "green", "blue", "yellow"]
```

核心代码是`SuperType.call(this)`，创建子类实例时调用`SuperType`构造函数，于是`SubType`的每个实例都会将SuperType的属性赋值一份

缺点：

1. 只能继承父类的属性和方法，不能继承原型属性和方法

```js
// 原型方法
function SuperType (){
    this.color=["red","green","blue"];
    this.superInnerMethods = function () {
      console.log('super inner methods')
    }
}
function SubType (){
    //继承自SuperType
    SuperType.call(this);
    this.subInnerMethods = function () {
      console.log('sub inner methods')
    }
}
SuperType.prototype.superMethods = function () {
  console.log('superType methods')
}
//父类方法
SuperType.superStaticMethods = function () {
  console.log('superType static methods')
}
// 子类原型方法
SubType.prototype.subTypeMethods = function () {
  console.log('subType methods')
}
// 子类方法
SubType.subTypeStaticMethods = function () {
  console.log('subType static methods')
}

let instance = new SubType()
instance
```
![](./2.png)

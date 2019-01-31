# Decorator

Decorators make it possible to annotate and modify calsses an properties at design time.

# Detail Design

A decorator is:
* an expression
* that evaluates to function 
* that takes target, name, and decorator descriptor as arguments
* and optionally returns a decorator descriptor to install on the target object.
  
There are two ways to use decorators:
1. Decorate the class itself
2. Decorate the properties of the class
# Decorate the class itself
```js
function isTestable (value) {
  return function (target) {
    target.isTestable = value
  }
}

@isTestable(true)
class MyClass {}

console.log(MyClass.isTestable) // true
```

# Decorate the properties of the class

```js
function readonly (target, name, descriptor) {
  descriptor.writable = false
  return descriptor
}

class Person {
  @readonly
  name () {
    console.log('abc')
  }
}
let person = new Person()
console.log(person.name) // 'abc'
person.name = function () {
 console.log('edf')
}
console.log(person.name) // 'abc'
```

# Reference
[https://github.com/jayphelps/core-decorators](https://github.com/jayphelps/core-decorators)
[https://aotu.io/notes/2016/10/24/decorator/index.html](https://aotu.io/notes/2016/10/24/decorator/index.html)
[https://github.com/wycats/javascript-decorators](https://github.com/wycats/javascript-decorators)

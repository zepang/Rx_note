# TypeScrit in 5 minutes

Let' get started by building a simple web application with TypeScritp.

### Install TypeScript

```
npm install -g typescript
```

### Building TypeScript file
Type the following code in `greeter.ts`

```ts
function greeter(person) {
  return 'Hello, ' + person
}
let user = 'Jane User'

document.body.innerHTML = greeter(user)
```

# Compiling your code 

```
tsc greeter.ts
```

The result will be a file `greeterjs` which contains the same javascript code that you fed in.

Now, we can start taking advantage of some of the new tools TypeScript offers.Add a `:string` type annotation to the `person` function argument as shown here.
```ts
function greeter(person: string) {
  return 'Hello, ' + person
}
let user = 'Jane User'

document.body.innerHTML = greeter(user)
```
Type annotations in TypeScript are lightweight ways to record the intended contact of the function or variable.In this case, we intend the greeter function to be called witht a single string parameter.We can try changing the call greeter to pass an array instead:
```ts
function greeter(person: string) {
  return 'Hello, ' + person
}
let user = [1, 2, 3]

document.body.innerHTML = greeter(user)
```
Re-compoling, we can see the error:
```
greeter.ts:6:35 - error TS2345: Argument of type 'number[]' is not assignable to parameter of type
'string'.
```
TypeScript is waring that you code will likely not run as expected.

# Interfaces

Here we use an interface that describes objects that have a firstName and lastName field.In the TypeScript, two types are compatible if their internal structure is compatible.This allow us to implement an interface just by having the shape the interface requires.without an explickit `implements` clause.

```ts
interface Person {
  firstName: string,
  lastName: string
}

function greeter (person: Person) {
  return 'Hello, ' + person.firstName + person.lastName
}

let user = { firstName: 'Jane', lastName: 'User' }
document.body.innerHTML = greeter(user)
```

# Classes 
Notice that classes and interfaces play well together, letting the programmer decide on the right level of abstraction.

Also of note, the use of `public` on arguments to the constructor is a shorhand that allows us to automatically create properties with that name.
```ts
class Student {
  fullName: string
  constructor(public firstName: string, public middleInitial: string, public lastName: string) {
    this.fullName = firstName + ' ' + middleInitial + ' ' + lastName
  }
}

interface Person {
  firstName: string,
  lastName: string
}
function greeter (person: Person) {
  return 'Hello, ' + person.firstName + ' ' + person.lastName
}
let user = new Student('Jane', 'M', 'User')
document.body.innerHTML = greeter(user)
```
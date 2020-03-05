# CONSTRUCTORS
A `constructor function` helps with producing object that are similar in some way. <br/>
It is a normal function but it is named, set up and invoked differenlty. They correspong to classes in other languages. <br/>

A instance consists of tow parts:
 1. data set up - is instance specific and stored in the own properties
 2. behavior - shared by all the instances

A constructor is a functin that is invoked via the `new` operator. <br>
By convention, the names of constructors start with uppercase.

```
function Person(name) {
    this.name = name
}

Person.prototype.describe = function() {
    return 'Person named: ' + this.name
}

var jane = new Person('Jane');
console.log(jane.describe()) // Person named: Jane
```
The `new` operator performs the following steps:
 - the behavior is set up: a new object is created whose prototype is *Person.prototype*
 - the data is set up: *Person* receives that object as the implicit parameter *this* nad adds instance properties.

`jane` is an instance of the constructor `Person` <br/>
```
console.log(jane instanceof Person) // true
```

The term `prototype` can be used ambigously:
1. The prototype relationship
```
var proto = {}
var obj = Object.create(proto)
console.log(Object.getPrototypeOf(obj) === proto) // true
```
2. The value of property prototype
Each constructor has a *prototype* that refers to an object. That object becomes the prototype to all instances.

## Data is prototype properties

**Avoid prototype properties with initial values for instance properties** <br/>
**Don't share default values**
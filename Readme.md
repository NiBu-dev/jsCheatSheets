# Statements vs Expressions

Statements do things, performs an action. (if, else, loops)
Expressions produce values => calling functions an expression btw

# Primitive Values Vs Objects

 - primitive values are *booleans*, *numbers*, *strings*, *null* and *undefined*
 - all other values are *objects*

There are 2 operators to categorize values: *typeof* is for primitive values, *instanceof* is used for objects

# Primitives

 - compared by values
 - always immutable - properties can't be changed, added or removed

 # Objects

 All non-primitive values are objects

 The most common of them are:

  - plain objects => created by object literals
  - arrays => created by array literals
  - regular expressions => created by regular expressions literals

## Object properties:

 - compare by reference
 - muttable by default => cab freely change, add and remove properties

# Binary logical operators

Binary logical operators are short-circuited => first operand determines the result

&& if the first operand is falsy => return it, otherwise return the second operand
 - 0 && 'Foo' // returns 0
 - 'foo' && null // returns null
 - 'foo' && 'bar' // returns bar

|| if the first operand is truthy => return it, otherwise return the second operand
 - 'foo' || undefined // returns foo
 - 0 || 'foo' // returns foo
 - 'foo' || 'bar' // returns foo

# Special Numbers
 - NaN
 - infinity


# Function declarations are hoisted
```
function foo() {
    
    bar()
    function bar() {
        console.log('memem')
    }
    
}

foo() // logs 'memem'
```
but
```
function foo() {
    
    bar()
    var bar = function() {
        console.log('memem')
    }
    
}
foo() // TypeError: bar is not a function
```

# Variables are hoisted
Each variable declaration is hoisted; the declaration is moved to the top of the function, but assignments stays as put
```
function foo () {
    console.log(tmp) // undefined

    if (false) {
        var tmp = 3 // only declaration is hoisted to the top var tmp; the assignment stays here, hence it is logged as undefined
    }
}

foo() 
```
it is executed as 
```
function foo () {
    var tmp; // hoisted declaration
    console.log(tmp) 

    if (false) {
        tmp = 3; // asignment stays as put
    }
}

foo()
```

# Closure
A closure is a function plus the connection to the variables of its surrounding scopes.
The function starting in line (1) leaves the context in which it was created, but stays connected to the live version of start;
```
function createIncrementor (start) {
    return function () { // (1)
        start++;
        return start
    }
}

var inc = createIncrementor(5)
console.log(inc()) // 6
console.log(inc()) // 7
console.log(inc()) // 8
```
Thus the createIncrementor function returns a closure

# Objects and Constructors

## Single Objects

 Objects can be created via *object literals*

 ```
 var jane = {
    name: 'Jane',
    describe: function() {
        return 'welcome ' + this.name
    }
```
### Extracting methods

Upon extracting a method from object, it loses its connection with that object. <br/>
The function is not a method anymore. So from previos example will return a Typerror in strict mode, without strict => undefined
```
var funct = jane.describe;
console.log(funct()) //TypeError: Cannot read property 'name' of undefined
```
The solution is to use the method ```bind()``` that all functions have.
```
var funct = jane.describe.bind(jane);
console.log(funct())    // welcome jane
```

### Functions Inside a method

Every function has its own variable `this`. <br/>
This is an inconvinient if you nest a function inside a method, because you can't access the method's `this` from the function.
For example: 
```
var jane = {
    name: 'jane',
    friends: ['mike', 'tarzan'],
    logHitToFriends: function() {
        this.friends.forEach(function (friend) {
            // `this` is undefined here
            console.log(this.name + ' says hi to ' + friend);
        })
    }
}

jane.logHitToFriends() // undefined says hi to mike \n undefined says hi to tarzan
```
Ways for fix => store `this` in a different var or pass `this` as a second arg to `forEach`

### Constructors: Factories for Objects

Functions play another role in Js: they become *constructors* - factories for objects - if invoked via the `new` operator. <br/>
Constructors are rough analog to classes in other languages. By convention, the name of constructors start with capital letters.

```
// set up distance data
function Point(x, y) {
    this.x = x;
    this.y = y;
}

// methods
Point.prototype.dist = function () {
    return Math.sqrt(this.x*this.x + this.y*this.y)
}
```
Constructor has 2 parts: 1st the function `Point` sets up the instance data, 2nd the property `Point.prototype` contains an object with the methods.
First part is unique to every instance, while the second part is shared among instances.
```
var p1 = new Point(3, 5)
var p2 = new Point(6, 10)
console.log(p1.x) // 3
console.log(p2.x) // 6
console.log(p1.dist()) // 5.830951894845301
console.log(p2.dist()) // 11.661903789690601
```
Also costructors can be seen as implemetations of custom types.

# Arrays
Arrays are sequence of elements that can be accessed via integer indices starting from 0
Note: Arrays are objects, thus can have object properties.

# Regular expressions 

Js has built in support for regex. They are delimited by slashes:
```
/[A-Za-z0-9]+/
```

# Invoking methods on Number literals
With methods invocations, it is important to distinguish between the floating point dot and the method invocation dot.
Thus you can't write `1.toString();` you must use one of the following alternatives:
```
1..toString()
1 .toString()
(1).toString()
1.0.toString()
```

# Javascript's Type System

Javascript 6 value types are:
 - undefined, null
 - boolean, string, number
 - Object

undefined - means no value => uninitialized vars, missing parameters, missing properties <br/>
null - means no object => used as a nonvalue wher an object is expected

 ## Coercion
Coercion means implicit type conversion. Most operands *coerce*:
 ```
 console.log('4' * 5) // 20
 ```
 Javascript's built-in conversion mechanism supports only the types: *boolean*, *number*, *string* and *object*.

### Functions for converting primitives

Boolean() - converts a value to a boolean; <br/>
The following values are converted to false, they are called falsy values:
 - undefined, null
 - false
 - 0, NaN,
 - ''
All other values are considered truthy.

Number() - converts value to a number:
 - undefined becomes NaN
 - null becomes 0
 - false becomes 0, true becomes 1
 - string are parsed, if no number => NaN
 - objects are converted to primitives, which are then converted to number

String() - converts value to string
 - objects are converted to primitives, which are then converted to string

Object() - convert objects to themselves, undefined and null to empy objects, and primitives to wrapped primitives;

# Operators
 Plus operator for object:
```
console.log([1,3,4] + [1,2]) // '1,3,41,2'
```

### Strict Equality
```
console.log(NaN === NaN) // false => pitfall
console.log(undefined === undefined) // true
console.log(null === null) // true
console.log(+0 === -0) // true
console.log(+1 === -1) // false
```

### The plus (+) operator
The plus operator examines its operands. If one of them is string,then the other is converted to string and both are concatenated:
```
console.log('foo' + 3); // foo3
console.log(3 + 4 + 5 +'foo'); // 12foo
console.log([1,2,3,4] + 'bar') // 1,2,3,4bar
```
If no operand is string then the operands are converted to numbers then added:
```
console.log(3 + 3); // 6
console.log(3 + true); // 4
```
The order in which you evaluate matters:
```
console.log('foo' + 1 + 2) // foo12
console.log(('foo' + 1) + 2) // foo12
console.log('foo' + (1 + 2)) // foo3
```

### The comma operator
`<<left>> , <<right>>` <br/>
The comma operator evaluates both operands and returns the result of `right`
```
var x = 0;
var y = (x++, 10);

console.log(x) // 1
console.log(y) // 10
```

### The void operator 
`void <<expr>>` - it evaluates expr and returns undefined

```
console.log(void 0) // undefined
console.log(void (1)) // undefined
console.log(void 4 + 7) // NaN, same as (void 4) + 7
console.log(void (4 + 7)) // undefined
```

### Typeof operator
Checking wheteher a variable exists:
```
var foo;
console.log(typeof foo === 'undefined') // true
console.log(typeof unDeclaredVar === 'undefined') // true
console.log(foo === undefined) // true
console.log(unDeclaredVar === undefined) //ReferenceError: unDeclaredVar is not defined
```




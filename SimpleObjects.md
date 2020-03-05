# OBJECTS AND INHERITANCE

Layers of OOP in Javascript:
 - **Layer1**: Object orientation with single objects
 - **Layer2**: prototype chains of objects
 - **Layer3**: constructors as factories for instances, similare to classes in other languages
 - **Layer4**: subclassing, creating new constructors by inheriting form existing ones

# Layer1: Single Objects
All Objects in JS are maps(dictionares). A (key, value) entry in an object is called property. <br/>
The *key* is always a string, the *value* can be any Js value. *Methods* are properties whose values are functions.

There are three types of properties:
 1. properties (or named data properties) - normal objects (mappings) from keys to values
 2. accessors (or named accessor properties) - special methods whose invocations look like readin or writing proerties. Normal properties are storage locations for property values; accessor allows to compute the values of properties.
 3. internal properties - they are not directly accesible from js, but there might be indirect ways of accessing them.

## Object literals
Allows to directly create *plain objects* (direct instances of *Object*).
E.g.
```
var jane = {
    name: "jane",
    describe: function() {
        return 'person named ' + this.name // 1
    }, // 2
};
```
1. `this` in methods refer to the current object
2. Js allows trailing comma.

## Dot operator (.): Accessing properties via fixed keys
```
console.log(jane.name); // Jane
console.log(jane.describe); // [Function: describe]
```

**Calling methods** <br/>
the dot operator is also used to call methods:
```
console.log(jane.describe()); // person named jane
```

**Seting properties** <br/>
```
jane.name = "john";
console.log(jane.describe()); // person named jane
```

**Deleting properties**
The `delete` operator removes a property (key value pair), returns false for own properties that cannot be deleted.
```
delete jane.name;
console.log(jane.name); // undefined
```

### Bracked Operator ([]): Accessing properties via computed keys
```
The bracked identifier coerces its interior to string.
Object.keys(jane).forEach(keyName => {
    console.log(jane[keyName])
});
// jane
// [Function: describe]
```

## Converting any value to an Object
`Object()`, used as a function provides this service. <br/>
```
no params | {}
undefined | {}
null | {}
bool | new Boolean(bool)
number | new Number(number)
string | new String(string)
object | object(unchaged, nothing to convert)
```

# this as an implicit parameter of functions and methods
When calling a function, `this` is always an implicit parameter:
```
function returnThis () {
    console.log(this) // global object
};
returnThis();
```
when using strict, `this` is undefined.
```
function returnThis () {
    'use strict'
    console.log(this) // undefined
};
returnThis();
```
***Methods*** <br/>
`this` refers to the object on which the methods has been invoked
```
var obj = { data: 'bar',  method: function () {console.log('foo ' + this.data)}};
obj.method() // foo bar
```

## Calling functions whilte setting this: call(), apply() and bind()
Functions are also objects. Thus, each function has methods of its own. <br/>
Following examples refer to object jane:
```
var jane = {
    name: 'jane',
    sayHelloTo: function (otherName) {
        'use strict'
        console.log(this.name + 'says hello to ' + otherName)
    }
};
```

**Function.prototype.call(thisValue, arg1, ..., argN)** <br/>
The first parameter is the value that `this` will have inside the invoked function; the remaining parameters are handed over as <br/>
arguments to the invoked function. The following invokations are equivalent:
```
jane.sayHelloTo('Tarzan'); //jane says hello to Tarzan
jane.sayHelloTo.call(jane, 'Tarzan'); // jane says hello to Tarzan

var func = jane.sayHelloTo;
func.call(jane, 'Tarzan') // jane says hello to Tarzan
```
if `this` is not passed, the method loses the connection with `jane` object resulting with error in strict mode, undefined in sloppy mode:
```
jane.sayHelloTo.call(null, 'Tarzan'); // TypeError: Cannot read property 'name' of null

var func = jane.sayHelloTo;
func.call(null, 'Tarzan') // TypeError: Cannot read property 'name' of null
```

**Function.prototype.apply(thisValue, argArray)** <br/>
The first parameter is the value that `this` will have inside the invoked function; <br/>
The second parameter is an array that provides the arguments for the invocation. <br/>
The following three invocations are equivalent:
```
jane.sayHelloTo('Tarzan'); // jane says hello to Tarzan
jane.sayHelloTo.apply(jane, ['Tarzan']); // jane says hello to Tarzan

var func = jane.sayHelloTo;
func.apply(jane, ['Tarzan']); // jane says hello to Tarzan
```
if `this` is not passed, the method loses the connection with `jane` object resulting with error in strict mode, undefined in sloppy mode. <br/>
The same as in case of  `call()`.


**Function.prototype.bind(thisValue, arg1?..., argN?)** <br/>
This method performs *partial function application* - meaning it creates a new function that calls the receiver of `bind()` in the following manner: <br/>
the value of `this` is `thisValue` and the arguments start with `arg1` until `argN`, followed by arguments of the new function. <br/>
In other words, the new function appends its arguments to `arg1, ..., argN` when it calls the original function.
```
function func() {
    console.log('this: ', this); // this:  [String: 'abc']
    console.log('arguments: ' + Array.prototype.slice.call(arguments)); // arguments: 1,2,3
}

var bound = func.bind('abc', 1, 2)
bound(3)
```
`slice` is used to convert arguments to an array.
The following invocations are equivalent:
```
jane.sayHelloTo('Tarzan') //jane says hello to Tarzan

var func1 = jane.sayHelloTo.bind(jane); 
func1('Tarzan'); // jane says hello to Tarzan

var func2 = jane.sayHelloTo.bind(jane, 'Tarzan');
func2(); // jane says hello to Tarzan
```
if `this` is not passed, the method loses the connection with `jane` object resulting with error in strict mode, undefined in sloppy mode. <br/>
The same as in case of  `call()` and `apply`.

**Pitfall**: Losing `this` when extracting a method <br/>
If a method is extracted from object, it becomes a true function again. Its connection with the object is lost, and it usually does not work <br/>
proper anymore: 
```
var counter = {
    count: 0,
    inc: function () {
        this.count++;
    }
};

var func = counter.inc;
func();
console.log(counter.count) // 0
```
*How to properly extract a method* <br/>
```
var func = counter.inc.bind(counter);
func();
console.log(counter.count) // 1
```

**Callbacks and extracted methods** <br/>
In Js there are many functions and methods that accept callbacks. E.g. `setTimeout()` and event handlers.<br/>
If `counter.inc` is passed as a callback, it is also invoked as function, resulting in the same problem -> disconnected with object.
```
function callIt(callback) {
    callback();
};

callIt(counter.inc);
console.log(counter.count); // 0
```
As before, things ca be fixed with `bind()`:
```
callIt(counter.inc.bind(counter));
console.log(counter.count); // 1
```
Each call to `bind()` creates a new function. That has consequences when callbacks are registered, unregistered. <br/>
Thus the value should be registered somewhere, from where it could be used for unregistering to.<br/>

**Pitfall**: Functions inside methods shadow `this` <br/>
```
var obj = {
    name: 'jane',
    friends: ['Tarzan', 'Cheeta'],
    loop: function () {
        this.friends.forEach(
            function(friend) {
                console.log(this.name + ' knows ' + friend )
            }
        )
    }
}

obj.loop() // undefined knows Tarzan \n undefined knows Cheeta
```
`this` has the value undefined because each function has its own `this`

*Workaround 1: self = this*
```
loop: function () {
    var self = this;
        this.friends.forEach(
            function(friend) {
                console.log(self.name + ' knows ' + friend )
            }
        )
    }

obj.loop() // jane knows Tarzan \n jane knows Cheeta
```

*Workaround 2: bind()* 
```
loop: function () {
        this.friends.forEach(
            function(friend) {
                console.log(this.name + ' knows ' + friend )
            }.bind(this)
        )
    }
obj.loop() // jane knows Tarzan \n jane knows Cheeta
```

*Workaround 3: a thisValue for forEach()* <br/>
`forEach()` can be provided with a second param after the callback that becomes the `this` of the callback:
```
loop: function () {
        this.friends.forEach(
            function(friend) {
                console.log(this.name + ' knows ' + friend )
            }, this
        )
    }
obj.loop() // jane knows Tarzan \n jane knows Cheeta
```


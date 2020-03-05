# LAYER 2: THE PROTOTYPE RELATIONSHIP BETWEEN OBJECTS

The prototype relationship between two objects is about inheritance: every object can have another object as its prootype. <br/>
Then the former object inherits all of its prototype's properties. An object specifies its prototype via internal property `[[Prototype]]`. <br/>
The chain of object connected by the `[[Prototype]]` property is called **prototype chain**. <br/>
Pseudocode:
```
var proto = {
    describe: function () {
        return 'name: ' + this.name;
    }
};

var obj = {
    [[Prototype]]: proto,
    name: obj
};
```
The object *obj* inherits the property *describe* from *proto*. It also has a so-called `own` property, *name*.

## Inheritance
*obj* inherits the property *describe*, it can be accesed as if the object itself had that property:
```
console.log(obj.describe); // Function
```
Whenever a prop is accessed via *obj*, Js starts the search for it in that object and continues to its prototype, the prototype's prototype and so on. <br/>
The prototype chain behaves as if it were a single object. The illusion is maintained when a method is called: the value of `this` is always the object <br/>
 where the search for the method began, not where the method was found. This allows themethod to access all of the props of the prototype chain.
```
console.log(obj.describe()) // name
```
Inside describe `this` is *obj*, which allow the method to access *obj.name*.

## Overriding
In a prototype chain, a property in an object *overrides* a property with the same key in a "later" object: the former property is found first.
```
obj.describe = function () {return 'overriden'};
console.log(obj.describe()) // overriden
```

## Sharing Data between objects via prototype
Prototypes are great for sharing data between object: several objects get the same prototype,  which holds all shared properties.
```
var jane = {
    name: 'Jane',
    describe: function() {
        return 'Person named ' + this.name;
    }
}

var tarzan = {
    name: 'Tarzan',
    describe: function() {
        return 'Person named ' + this.name;
    }
}
```
Bot objects are persons. Their *name* property is different, but *describe* is the same, tha could be shared. <br/>
So there can be created a common prototype called *PersonProto* having *describe* method in it:
```
var PersonProto = {
    describe: function() {
        return 'Person named ' + this.name;
    }
}

var jane = {
    [[Prototype]]: PersonProto,
    name: 'Jane',
    
}

var tarzan = {
    [[Prototype]]: PersonProto,
    name: 'Tarzan',
}
```
This is a common pattern: the data resides in the first object of a prototype chain,  while methods reside in later objects of prototype chain.

## Getting and setting the prototype

**Creating a new ibject with a given prototype**
```
Object.create(proto, propDescObj?);
```
This invocation creates an object whose prototype is *proto*. Optionally, properties can be added via descriptors. <br/>
In the following example, object *jane* gets the prototype *PersonProto* and a mutableproperty *name* whose value is `jane`:
```
var PersonProto = {
    describe: function() {
        return 'Person named ' + this.name;
    }
};

var jane = Object.create(PersonProto, {
    name: {value: 'Jane', writable: true}
});

console.log(jane.describe());
```
But frequently just an empty object is created and then properties are added manually, because descriptors are verbose:
```
var jane = Object.create(PersonProto);
jane.name = 'Jane';

console.log(jane.describe()); // Person named Jane
```

**Reading the prototype of an object**
This method call: 
```
console.log(Object.getPrototypeOf(obj))
```
returns the prototype of *obj*:
```
console.log(Object.getPrototypeOf(jane) === PersonProto) // true
```

**Checking whether one object is a prototype of another one**
Syntax:
```
Object.prototype.isPrototypeOf(obj)
```
checks whether the receiver of the method is a direct or indirect prototype of obj:
```
var A = {}
var B = Object.create(A)
var C = Object.create(B)

console.log(A.isPrototypeOf(C)) // true
console.log(C.isPrototypeOf(A)) // false
```

**Finding the object where a property is defined** <br/>
The following function iterates over the property chain of an object *obj*. <br/>
It returns the first object that has an own property with the *key* *PropKey*, or null if there is no object.
```
function getDefiningObject(obj, propkey) {
    obj = Object(obj) // make sure it's an object
    while ((obj) && !{}.hasOwnProperty.call(obj, propkey)) {
        obj = Object.getPrototypeOf(obj)
        // obj is null if the end of chain is reached
    }
    return obj;
}
```

## The spcecial property __proto__
Some js engines have a special property for getting and setting the prototype of an object: `__proto__`. <br/>
It brings access to `[[Prototype]]` directly:
```
var obj = {};
console.log(obj.__proto__ === Object.prototype); // true
console.log(obj.__proto__) // {}

obj.__proto__ = Array.prototype;
console.log(Object.getPrototypeOf(obj) === Array.prototype) // true
console.log(obj.__proto__) // []
```
 - `__proto__` is pronounced "dunder proto"
 - `__proto__` is not a part of ES5 standard
 - `__proto__` is a part of ES6


## Setting and deleting affects only own properties
only getting a property considers the complete prototype chain of an object. <br/>
Setting and deleting ignores inheritance and affects only own properties.

**Setting a property** <br/>
Setting a property creates an own property, even if there is an inherited property with that key:
```
var proto = {foo: 'a'};
var obj = Object.create(proto);

console.log(obj.foo); // a
console.log(obj.hasOwnProperty('foo')); // false
console.log(obj) // {}


obj.foo = 'b';
console.log(obj.foo); // b
console.log(obj.hasOwnProperty('foo')); // true
console.log(obj) // {foo: 'b'}
```

**Deleting an inherited property** <br/>
Only won properties can be deleted.
```
var proto = {foo: 'a'};
var obj = Object.create(proto);

delete obj.foo;
console.log(obj.foo) // a
```

**Changing properties anywhere in the prototype chain** <br/>
For changing an inherited property, the object which owns this property has to be found and then perform the change on that object:
```
var proto = {foo: 'a'};
var obj = Object.create(proto);

delete obj.foo;
console.log(obj.foo) // a

delete getDefiningObject(obj, 'foo').foo;
console.log(obj.foo) // undefined
```

## Iteration and detection of properties
Operations for iterating over and detecing properties are influenced by:
 - inheritance
 - enumerability

*Enumerability* (enumerable properties vs nonenumerable properties) - is an *attribute*, a flag that can be true or false.

### Listing own property keys
You can get all own properties, or only enumerabl ones:
 - `Object.getOwnPropertyNames(obj)` - returns the keys of all own properties of `obj`
 - `Object.keys()` - returns the keys of all enumerable own properties of `obj`

### Listing all property keys
For listing own  and inherited properties:

*Option1* - iterates over all enumerable properties of *object*
```
for (<<variable>> in <<object>>)
    <<statement>>
```
*Option2* - implement a function thad iterates over all properties:
```
function getAllPropertyNames(obj) {
    var result = []
    while (obj) {
        // add the own property names tof obj to result
        result = result.concat(Object.getOwnPropertyNames(obj));
        obj = Object.getPrototypeOf(obj)
    }
    return result;
}
```

## Checking whether a property exists
`propKey in obj` - returns *true* if *obj* has a property whose key if *propkey*. <br/>
Inherited properties are included in this check. <br/>
`Object.prototype.hasOwnProperty(propKey)` - returns *true* if the receiver has an own preoperty whose key is *propKey*
```
var  proto = Object.defineProperties({}, {
    protoEnumTrue: {value: 1, enumerable: true},
    protoEnumFalse: {value: 2, enumerable: false}
});

var  obj = Object.defineProperties(proto, {
    objEnumTrue: {value: 1, enumerable: true},
    objEnumFalse: {value: 2, enumerable: false}
});
```
**The effects of enumerability** <br/>
Enumerability affects the `for - in loop` and `Object.keys()`. <br/>
The `for - in loop` iterates over the keys of all enumerable properties, including inherited ones, <br/>
Combine with `hasOwnProperty()` for iterating over own properties
`Object.keys()` returns keys of all own (noninherited) enumerable properties 

## Accessors (Getters and setters)


**Defining Accessors via Object Literal**
```
var obj = {
    get foo () {
        return 'getter'
    },
    set foo (value) {
        console.log('setter: ' + value);
    }
}

console.log(obj.foo = 'bla'); //setter: bla
console.log(obj.foo); // getter
```
**Defining accessors via property descriptors**
```
var obj = Object.create(
    Object.prototype, {
        foo: {
            get: function() {
                return 'getter'
            },
            set: function(value) {
                console.log('setter: ' + value)
            }
        }
    }
)
```
Getters and setters are inherited from prototypes;

# Property attributes and property descriptors
 - *Property attributes* - atomic building blocks of properties. All of property's state, data and metatada is stored here.
 - *Property descriptors* - is a data structure for working programatically with attributes

## Property attributes
The following attributes are specific to *normal properties*:
 - `[[Value]]` - holds the property's value, its data
 - `[[Writable]]` - holds a bool indicating if the val of a prop can be changed

The following attributes are specific to *accessors*:
 - `[[Get]]` - holds the getter functin that is called when a property is read
 - `[[Set]]` - holds the setter function that is called when a property is set to a value. the func receive the val as a param.

All properties have the following attributes:
 - `[[Enumerable]]` - boolean which makes the prop hidden from some operations
 - `[[Configurable]]` - boolean,if false => the property can't be deleted

## Property descriptors
Object that encodes attributes of a property:
```
{
    value: 123,
    writable: false,
    enumerable: true,
    configurable: false
}
```
via *accessor* the descriptor looks like:
```
{
    get: function() { return 123},
    enumerable: true,
    configurable: false
}
```

## Getting and Defining properties via descriptors
Property descriptors are used for 2 kind of operations:
 - getting a property: all attributes of a prop are returned as a descriptor
 - defining a property: depends whether a property already exists

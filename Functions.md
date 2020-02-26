# FUNCTIONS

## Three Roles of functions

 - nonmethod function (normal function)
 - constructor (invoked via new operator)
 - method (function stored in a method property of an object)

## Function expressions
E.g.
```
var add = function (x, y) { return x + y };
console.log(add(2, 3)) // 5
```
The function above is also called *anonymous function expression*

### Named function epxressions
Named function expressions allow a function to refer to itself, which is used for self-recursion. <br/>
The name of a named function expression is only accessible inside the function expression.
```
var fac = function me(n) {
    if (n > 0) {
        return n * me(n - 1)
    } else {
        return 1;
    }
};

console.log(fac(3)) // 6
console.log(me(3)) // ReferenceError: me is not defined
```

### Function declarations
```
function add(x, y) {
    return x + y;
}
```

## Hoisting
**Hoisting** means moving to the beginning of a scope. Function declarations are hoisted completely,
variable declaration only partially.
```
foo();
function foo () { // this function is hoisted

}
```

var declarations are hoisted too, but only the declarations, not assignments made with them. <br/>
Therefore, using a var declaration and a function expression similarly to previous example, would result in an error:
```
foo(); // TypeError: undefined is not a function
var foo = function () {} 
```
only the var declaration is hoisted. The code is executed as follows:
```
var foo;
foo(); // TypeError: undefined is not a function
foo = function () {}
```

### func.bind(thisValue, arg1,...argN)
This performs partial function application - a new functino is created that calls funct wth `this` set to `thisValue`, <br/>
and the following args: arg1...argN, and then the actual arguments of the new function. In the following example `this` is not needed and set to null;
```
function add (x, y) {
    return x + y;
}
var plus1 = add.bind(null, 1)
console.log(plus1(10)) // 11
```
The example above is equivalent to: 
```
function plus1 (y) {
    return add(1, y)
}
```

## Handling Missing or extra parameters

Using `arguments` special variable - exist only inside functions. It is an array like object, but not an array which holds all of the parameters. <br/>
It has *length* property, but not array methods (slice(), forEach()). <br/>
In non-strict mode, `arguments` stay up-to-date:
```
function sloppyFunct(param) {
    param = 'changed'
    return arguments[0]
}

console.log(sloppyFunct('val')) // changed
```
This works in both ways:
```
function sloppyFunct(param) {
    arguments[0] = 'changed'
    return param
}

console.log(sloppyFunct('val')) // changed
```
But this kind of updating is not done in **strict mode**; Strict mode forbids assigning to the variable arguments. 

## Checking if a param is missing
 - check if it is undefined
 - check if it is boolean true
 - check the length of **arguments**

## Simulating pass by reference
```
function incRef (numberRef) {
    numberRef[0]++
};

var n = [7];
incRef(n)
console.log(n[0]) // 8
```

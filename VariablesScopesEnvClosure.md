# VARIABLES: SCOPES, ENVIRONMENTS AND CLOSURES

## Scope of a variable

The scope of a variable are the locations where it is accesible. <br/>
E.g.
```
function foo() {
    var x;
}
```
Here the direct scope of x is the function foo(); <br/>
If scoper are nested within the direct scope of a variable, then the variable is accesible in all of those scopes. <br/>
```
function foo(arg) {
    function bar () {
        console.log('arg: ' + arg);
    }
    bar();
}

console.log(foo('Hello')) // arg: Hello
```
The direct scope of arg is foo(), but it is also accessible in the nested scope bar(). <br/>
With regard to nesting, foo() is the outer scope, and bar() is the inner scope.

*Shadowing* <br/>
If a scope declares a vaibale that has the same name as one in the sorrounding scope, access to <br/>
the outer variable is blocked in the inner scope, and all scopes nested inside it. Changes to the <br/>
inner variable do not affect the outer variable, which is accesible again after the inner scope is left:
```
var x = "global"

function f() {
    var x = "local"
    console.log(x); // local
}

f();
console.log(x) // global
```

## Variable are function-scoped
Only functions introduce new scope; blocks are ignored when it comes to scoping.

## Variable declarations are hoisted
JS moves the variable declarations to the beginning of their scopes.
```
function f() {
    console.log(bar); // undefined
    var bar = 'bar';
    console.log(bar); // bar
}
```
Each function declaration is also hoisted. <br/>

***Pitfall*** <br/>
Assigning to an undeclared variable makes it global.
```
function sloppyFunc(0) {x = 123};
sloppyFunc();
console.log(x); // 123
```
Strict mode forbids this throwing a ReferenceError;

## Introducing new scopes via an IIFE (immediately invoked function expression)
Tipically a new scope is introduced to restrict the lifetime of a variable. <br/>
If you want to introduce a new scope in the if then block, there can be defined an IIFE. <br/>
This is a workaround, a simulation of block scoping.
```
function f() {
    if (condition) {
        (function() { // open block
            var tmp = ...;
            ...
        }()); // close block
    }
}
```
Notes about IIFE
 - it is immediately invoked
 - it must be an expression, hence the paranthesis
 - the trailing semicolon is required

Another variation of IFFE is using prefix operators: logical not, void
```
!function () {

}();

void function () {

}()
```

## The Global Object
The ECMAScript specification uses the internal data structure `environment` to store variables. <br/>
The global object can be used to create, read and chagne global variables:
```
var foo = 'foo';
console.log(this.foo); // foo
```

Browsers global object is *window* as part of DOM, nodejs contains a node js spceific variable. <br/>


# ENVIRONMENTS
The data structure that provides storage space for varibales is called an `environment`. It maps variable names to values. <br/>
Environments live on even after you leave their scope. Therefore, they are stored on heap, not on stack. <br/>
```
function myFunction(myParam) { 
    var myVar = 123;
    return myFloat;
}

var myFloat = 1.3;
// Step1
myFunction('abc'); // Step2
```

1. *myFunction* and *myfLoat* have been stored in the global environment (#0).
2. For the execution of *myFunction*('abc')*, a new environmnet is created (#1) that holds the parameter and the local variable. <br/>
It refers to its outer environment via outer, which is initialized from MyFunction.[[Scope]]. Thanks to the outer env, *myFunction* can acces *myFloat*.


# Closures: Functions stay connected to their birth scopes
If a function leaves the scope in which it was created, it stays connected to the variable of that scope (and of sorrounding scopes).
```
function createInc(startValue) {
    return function (step) {
        startValue += step;
        return startValue
    };
}

var inc = createInc(5);
console.log(inc(1)); // 6
console.log(inc(3)) // 9
console.log(inc(2)) // 11
```
A closure is an example of an environment surviving affter execution left its scope: <br/>
1. The declaration and evaluation of *createInc* takes place. After this an entry of *createInc* has been added to the global env(#0) and point to the function object.
2. This step occurs during the execution of the function call *createInc(5)*. A fresh env(#1) is created and pushed onto the stack. Its outer env is the global. The env holds the paramater *startValue*.
3. This step happens after the ssignment to *inc*. After the program has returned from *createInc*, the execution context pointing to its environmnet was removed from the stack, but the environment still exists on the heap, because `inc.[[Scope]]` refert to it. *inc* is a closure (function plus birth env).
4. This steps takes place during the execution of `inc(1)`. A new env(#1) has been created and the execution context pointing to it has been pushed on the stack. Its outer env is the `[[Scope]]` of *inc*. The outer env gives *inc* access to *startValue*.
5. This step happens after the execution of `inc(1)`. No reference points to *inc*'s envanymore. It is threfore not needed and can be removed from heap.


**Pitfall**: Inadvertently sharing an env
```
function f() {
    var result = [];
    for (var i = 0; i<3; i++) {
        var func = function () {
            return i;
        }
        result.push(func)
    }
    return result;
}

console.log(f()[0]()); // 3
console.log(f()[1]()); // 3
console.log(f()[2]()); // 3
```
f returns an array with 3 functions in it. All of these functions can still access the env of *f* and thus *i*. <br/>
However, after the loop is finished, i has the value 3 in that env, therefore all functions return 3.

A solution to this problem is to create another env which stores value of i. :
```
function f() {
    var result = [];
    for (var i = 0; i<3; i++) {
        (function () {
            var pos = i;
            var func = function () {
                return pos;
            }
            result.push(func)
        }())
    }
    return result;
}

console.log(f()[0]()); // 0
console.log(f()[1]()); // 1
console.log(f()[2]()); // 2
``` 

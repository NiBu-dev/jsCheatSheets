Javascript questions:

## 1. Explain event delegation.

Event delegation makes use of two often overlooked features of JavaScript events: **event bubbling** and the **target element**. When an event is triggered on an element, for example a mouse click on a button, the same event is also triggered on all of that element’s ancestors. This process is known as *event bubbling*; the event bubbles up from the originating element to the top of the DOM tree. The *target element* of any event is the originating element, the button in our example, and is stored in a property of the event object. Using event delegation it’s possible to add an event handler to an element, wait for an event to bubble up from a child element and easily determine from which element the event originated.

The benefits of JavaScript event delegation are:
- There are less event handlers to setup and reside in memory. This is the big one; better performance and less crashing.
- There’s no need to re-attach handlers after a DOM update. If your page content is generated dynamically, via Ajax for example, you don’t need to add and remove event handlers as elements are loaded or unloaded.

The potential problems may be less clear, but once you are aware of them they’re easily avoided:
- There’s a risk your event management code could become a performance bottleneck, so keep it as lean as possible.
- Not all events bubble. The blur, focus, load and unload events don’t bubble like other events. The blur and focus events can actually be accessed using the capturing phase (in browsers other than IE) instead of the bubbling phase but that’s a story for another day.
- You need caution when managing some mouse events. If your code is handling the mousemove event you are in serious risk of creating a performance bottleneck because the mousemove event is triggered so often. The mouseout event has a quirky behaviour that is difficult to manage with event delegation.
<hr>

## 2. Explain how this works in JavaScript.
`This` is a property of an execution context (global, function or eval) that, in non–strict mode, is always a reference to an object and in strict mode can be any value. <br/>
In most cases, the value of `this` is determined by how a function is called (runtime binding). It can't be set by assignment during execution, and it may be different each time the function is called. ES5 introduced the bind() method to set the value of a function's this regardless of how it's called, and ES2015 introduced arrow functions which don't provide their own `this` binding (it retains the `this` value of the enclosing lexical context).

### Global context
In the global execution context (outside of any function), `this` refers to the global object whether in strict mode or not.

```
// In web browsers, the window object is also the global object:
console.log(this === window); // true

a = 37;
console.log(window.a); // 37

this.b = "MDN";
console.log(window.b)  // "MDN"
console.log(b)         // "MDN"
```

### Function context
Inside a function, the value of `this` depends on how the function is called.

**Simple call**<br>
Since the following code is not in strict mode, and because the value of this is not set by the call, this will default to the global object, which is window in a browser. 
```
function f1() {
  return this;
}

// In a browser:
f1() === window; // true 

// In Node:
f1() === global; // true
```
In strict mode, however, if the value of this is not set when entering an execution context, it remains as undefined, as shown in the following example:
```
function f2() {
  'use strict'; // see strict mode
  return this;
}

f2() === undefined; // true
```
To set the value of this to a particular value when calling a function, use call(), or apply() as in the following examples.
```
// An object can be passed as the first argument to call or apply and this will be bound to it.
var obj = {a: 'Custom'};

// This property is set on the global object
var a = 'Global';

function whatsThis() {
  return this.a;  // The value of this is dependent on how the function is called
}

whatsThis();          // 'Global'
whatsThis.call(obj);  // 'Custom'
whatsThis.apply(obj); // 'Custom'
```
```
function add(c, d) {
  return this.a + this.b + c + d;
}

var o = {a: 1, b: 3};

// The first parameter is the object to use as
// 'this', subsequent parameters are passed as 
// arguments in the function call
add.call(o, 5, 7); // 16

// The first parameter is the object to use as
// 'this', the second is an array whose
// members are used as the arguments in the function call
add.apply(o, [10, 20]); // 34
```
**The Bind method**<br>
ECMAScript 5 introduced Function.prototype.bind(). Calling f.bind(someObject) creates a new function with the same body and scope as f, but where this occurs in the original function, in the new function it is permanently bound to the first argument of bind, regardless of how the function is being used.
```
function f() {
  return this.a;
}

var g = f.bind({a: 'azerty'});
console.log(g()); // azerty

var h = g.bind({a: 'yoo'}); // bind only works once!
console.log(h()); // azerty

var o = {a: 37, f: f, g: g, h: h};
console.log(o.a, o.f(), o.g(), o.h()); // 37,37, azerty, azerty
```

**Arrow functions**<br>
In arrow functions, `this` retains the value of the enclosing lexical context's this. In global code, it will be set to the global object:
```
var globalObject = this;
var foo = (() => this);
console.log(foo() === globalObject); // true
```
Note: if `this` arg is passed to *call*, *bind*, or *apply* on invocation of an arrow function it will be ignored. You can still prepend arguments to the call, but the first argument (thisArg) should be set to null.
```
/ Call as a method of an object
var obj = {func: foo};
console.log(obj.func() === globalObject); // true

// Attempt to set this using call
console.log(foo.call(obj) === globalObject); // true

// Attempt to set this using bind
foo = foo.bind(obj);
console.log(foo() === globalObject); // true
```
No matter what, foo's `this` is set to what it was when it was created (in the example above, the global object). The same applies to arrow functions created inside other functions: their `this` remains that of the enclosing lexical context.
```
// Create obj with a method bar that returns a function that
// returns its this. The returned function is created as 
// an arrow function, so its this is permanently bound to the
// this of its enclosing function. The value of bar can be set
// in the call, which in turn sets the value of the 
// returned function.
var obj = {
  bar: function() {
    var x = (() => this);
    return x;
  }
};

// Call bar as a method of obj, setting its this to obj
// Assign a reference to the returned function to fn
var fn = obj.bar();

// Call fn without setting this, would normally default
// to the global object or undefined in strict mode
console.log(fn() === obj); // true

// But caution if you reference the method of obj without calling it
var fn2 = obj.bar;
// Calling the arrow function's this from inside the bar method()
// will now return window, because it follows the this from fn2.
console.log(fn2()() == window); // true
```
In the above, the function (call it anonymous function A) assigned to obj.bar returns another function (call it anonymous function B) that is created as an arrow function. As a result, function B's  `this` is permanently set to the this of obj.bar (function A) when called. When the returned function (function B) is called, its `this` will always be what it was set to initially. In the above code example, function B's `this` is set to function A's `this` which is obj, so it remains set to *obj* even when called in a manner that would normally set its this to undefined or the global object (or any other method as in the previous example in the global execution context).

**As an object method**<br>
When a function is called as a method of an object, its `this` is set to the object the method is called on.

In the following example, when o.f() is invoked, inside the function `this` is bound to the o object.
```
var o = {
  prop: 37,
  f: function() {
    return this.prop;
  }
};

console.log(o.f()); // 37
```
Note that `this` behavior is not at all affected by how or where the function was defined. In the previous example, we defined the function inline as the f member during the definition of o. However, we could have just as easily defined the function first and later attached it to o.f. Doing so results in the same behavior:
```
var o = {prop: 37};

function independent() {
  return this.prop;
}

o.f = independent;

console.log(o.f()); // 37
```
This demonstrates that it matters only that the function was invoked from the f member of o.

Similarly, the `this` binding is only affected by the most immediate member reference. In the following example, when we invoke the function, we call it as a method g of the object o.b. This time during execution, `this` inside the function will refer to o.b. The fact that the object is itself a member of o has no consequence; the **most immediate reference is all that matters**.
```
o.b = {g: independent, prop: 42};
console.log(o.b.g()); // 42
```
**this on the object's prototype chain**<br>
The same notion holds true for methods defined somewhere on the object's prototype chain. If the method is on an object's prototype chain, `this` refers to the object the method was called on, as if the method were on the object.
```
var o = {f: function() { return this.a + this.b; }};
var p = Object.create(o);
console.log(p.f()); // 12

p.a = 1;
p.b = 4;

console.log(p.f()); // 5
```
In this example, the object assigned to the variable p doesn't have its own f property, it inherits it from its prototype. But it doesn't matter that the lookup for f eventually finds a member with that name on o; the lookup began as a reference to p.f, so this inside the function takes the value of the object referred to as p. That is, since f is called as a method of p, its this refers to p. This is an interesting feature of JavaScript's prototype inheritance.

**this with a getter or setter**<br>
Again, the same notion holds true when a function is invoked from a getter or a setter. A function used as getter or setter has its this bound to the object from which the property is being set or gotten.
```
function sum() {
  return this.a + this.b + this.c;
}

var o = {
  a: 1,
  b: 2,
  c: 3,
  get average() {
    return (this.a + this.b + this.c) / 3;
  }
};

Object.defineProperty(o, 'sum', {
    get: sum, enumerable: true, configurable: true});

console.log(o.average, o.sum); // 2, 6
```

**As a constructor**<br>
When a function is used as a constructor (with the new keyword), its `this` is bound to the new object being constructed.

While the default for a constructor is to return the object referenced by this, it can instead return some other object (if the return value isn't an object, then the this object is returned).

```
/*
 * Constructors work like this:
 *
 * function MyConstructor(){
 *   // Actual function body code goes here.  
 *   // Create properties on |this| as
 *   // desired by assigning to them.  E.g.,
 *   this.fum = "nom";
 *   // et cetera...
 *
 *   // If the function has a return statement that
 *   // returns an object, that object will be the
 *   // result of the |new| expression.  Otherwise,
 *   // the result of the expression is the object
 *   // currently bound to |this|
 *   // (i.e., the common case most usually seen).
 * }
 */

function C() {
    this.a = 37;
}

var o = new C();
console.log(o.a); // 37


function C2() {
    this.a = 37;
    return { a: 38 };
}

o = new C2();
console.log(o.a); // 38
```
In the last example (C2), because an object was returned during construction, the new object that `this` was bound to simply gets discarded. (This essentially makes the statement "this.a = 37;" dead code. It's not exactly dead because it gets executed, but it can be eliminated with no outside effects.)

**As a DOM event handler**<br>
When a function is used as an event handler, its `this` is set to the element on which the listener is placed (some browsers do not follow this convention for listeners added dynamically with methods other than addEventListener()).
```
// When called as a listener, turns the related element blue
function bluify(e) {
  // Always true
  console.log(this === e.currentTarget);
  // true when currentTarget and target are the same object
  console.log(this === e.target);
  this.style.backgroundColor = '#A5D9F3';
}

// Get a list of every element in the document
var elements = document.getElementsByTagName('*');

// Add bluify as a click listener so when the
// element is clicked on, it turns blue
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', bluify, false);
}

```
<hr>
3. Can you give an example of one of the ways that working with `this` has changed in ES6?

Using arrow functions with `this`. Where `this` retains the value of the enclosing lexical context's this.
<hr>
4. Explain how prototypal inheritance works.

The core idea of Prototypal Inheritance is that an object can point to another object and inherit all its properties. The main purpose is to allow multiple instances of an object to share common properties, hence, the Singleton Pattern.<br>
JavaScript only has one construct: objects. Each object has a private property which holds a link to another object called its prototype. That prototype object has a prototype of its own, and so on until an object is reached with null as its prototype. By definition, null has no prototype, and acts as the final link in this prototype chain.

Nearly all objects in JavaScript are instances of Object which sits on the top of a prototype chain.
<hr>

5. What's the difference between a variable that is: null, undefined or undeclared?
`undefined` is a variable that has been declared but no value exists and is a type of itself ‘undefined’. <br>
`null` is a value of a variable and is a type of object.<br>
`undeclared` variables is a variable that has been declared without ‘var’ keyword.
<hr>

6. How would you go about checking for any of these states (undefined, null, equal)? <br>
typeof for `undefined` and === for null
<hr>

7. What is a closure, and how/why would you use one? <br>
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
<hr>

8. What language constructions do you use for iterating over object properties and array items?
Object.keys(), for in loop
<hr>

9. Can you describe the main difference between the Array.forEach() loop and Array.map() methods and why you would pick one versus the other? <br>
forEach() — executes a provided function once for each array element. <br>
The forEach() method doesn’t actually return anything (undefined). It simply calls a provided function on each element in your array. This callback is allowed to mutate the calling array.

map() — creates a new array with the results of calling a provided function on every element in the calling array.<br>
The map() method will also call a provided function on every element in the array. The difference is that map() utilizes return values and actually returns a new Array of the same size.
<hr>

10. What's a typical use case for anonymous functions? <br>
callbacks and IIFE
<hr>

11. What's the difference between host objects and native objects? <br>
`Host Objects` are objects supplied by a certain environment. They are not always the same because each environment differs and contains host objects that accommodates execution of ECMAScript. Example, browser environment supplies objects such as window. While a node.js/server environment supplies objects such as NodeList.<br>
e.g. window, document, location, history, XMLHttpRequest, setTimeout, getElementsByTagName, querySelectorAll, ...

`Native Objects` or Built-in Objects are standard built-in objects provided by Javascript. Native objects is sometimes referred to as ‘Global Objects’ since they are objects Javascript has provided natively available for use. <br>
e.g. Object (constructor), Date, Math, parseInt, eval, string methods like indexOf and replace, array methods, ...
<hr>

12. Explain the difference between: function Person(){}, var person = Person(), and var person = new Person()? <br>
1) function declaration, 2) function expression 3) function constructor
<hr>

13. Explain the differences on the usage of foo between function foo() {} and var foo = function() {} <br>
function foo() {} - function declaration - is hoisted entirely. Can be called before declaration <br>
var foo = function() {} - is not hoisted entirely, only the foo. Can not be called before declaration;
<hr>

14. Can you explain what Function.call and Function.apply do? What's the notable difference between the two? <br>
Call and apply are very similar: both invoke the function they are called on, and take a ‘this’ argument as their first argument.

The difference between call() and apply() is that call() passes all arguments after the first one on to the invoked function, while apply() takes an array as its second argument and passes the members of that array as arguments.
<hr>

15. Explain Function.prototype.bind. <br>
It returns a new function which is bound to this arg pass as param. Following args are passed to the invoked function.

<hr>

16. What's the difference between feature detection, feature inference, and using the UA string? <br>
These 3 are just practices of determining if a certain web technology feature exists in a user’s browser or environment. <br>
`Feature detection` is just a way of determining if a feature exists in certain browsers. <br>
`Feature Inference` is when you have determined a feature exists and assumed the next web technology feature you are implementing unto your app exists as well. Its usually bad practice to assume, so its better to explicitly specify features you want to detect and plan a fallback action. <br>
`UA String` or User Agent String is a string text of data that each browsers send and can be access via navigator.userAgent. These “string text of data” contains information of the browser environment you are targeting.
<hr>

17. Explain "hoisting". <br>
Hoisting is when the declaration is moved to the top of the scope, but assignments stays as put. This is valid for function declarations and for variables declared with var keyword.
<hr>

18. Describe event bubbling. <br>
Event Bubbling is the event starts from the deepest element or target element to its parents, then all its ancestors which are on the way to bottom to top.
If you want to stop the event bubbling, this can be achieved by the use of the event.stopPropagation() method.
<hr>

19. Describe event capturing.<br>
Event Capturing is the event that starts from top element to target element.
<hr>

20. What's the difference between an "attribute" and a "property"?<br>
In an object they are the same. In DOM property is an element that behaves like a js object. <br>
Attributes are in the HTML itself, rather than in the DOM. They are very similar to properties, but not quite as good. <br>
<hr>

21. What are the pros and cons of extending built-in JavaScript objects?
22. What is the difference between == and ===? <br>
The identity (===) operator behaves identically to the equality (==) operator except no type conversion is done, and the types must be the same to be considered equal.
<hr>

23. Explain the same-origin policy with regards to JavaScript. <br/>
The same origin policy states that a web browser permits script contained in one page (or frame) to access data in another page (or frame) only if both the pages have the same origin. It is a critical security mechanism for isolating potentially malicious documents. Two pages have the same origin if the protocol, port (if one is specified), and host are the same for both pages.<br>
<hr>

24. Why is it called a Ternary operator, what does the word "Ternary" indicate? <br>
Ternary comes from three, for which the ternary operator has  3 parts: condition, expresionIfTrue, expressionIfFalse.
So a ternary operand accepts three parameters.
<hr>

25. What is strict mode? What are some of the advantages/disadvantages of using it?<br>
Strict mode is a special is a way to opt in to a restricted variant of JavaScript, <br>
Strict mode makes several changes to normal JavaScript semantics: <br>
 - Eliminates some JavaScript silent errors by changing them to throw errors.
 - Fixes mistakes that make it difficult for JavaScript engines to perform optimizations: strict mode code can sometimes be made to run faster than identical code that's not strict mode.
 - Prohibits some syntax likely to be defined in future versions of ECMAScript.
<hr>

26. What are some of the advantages/disadvantages of writing JavaScript code in a language that compiles to JavaScript? <br>
Example: CoffeeScript. Pros/Cons: Syntactic sugar, readable code, and use of good patterns vs debugging and compilation issues. Read this answer for details.
<hr>

27. What tools and techniques do you use debugging JavaScript code? <br>
Web/Browser console using console.log. Firebug, Developer Tools, break points. &debugger statement;
<hr>

28. Explain the difference between mutable and immutable objects. <br>
Mutable objects are those whose state is allowed to change over time. An immutable value is the exact opposite — after it has been created, it can never change. 
<hr>

29. What is an example of an immutable object in JavaScript? <br>
Primitives like Strings and Numbers are inherently immutable in javascript.
<hr>

30. What are the pros and cons of immutability? <br>
You might think that this would yield terrible performance, and in some ways you’d be right. Whenever you add something to an immutable object, we need to create a new instance by copying the existing values and add the new value to it. This will certainly be both more memory intensive and more computationally challenging than mutating a single object.

Because immutable objects never change, they can be implemented using a strategy called “structural sharing”, which yields much less memory overhead than you might expect. There will still be an overhead compared to built-in arrays and objects, but it’ll be constant, and can typically be dwarfed by other benefits enabled by immutability. In practice, the use of immutable data will in many cases increase the overall performance of your app, even if certain operations in isolation become more expensive. <br>
Mutation tracking.
<hr>

31. How can you achieve immutability in your own code? <br>
By setting property attributes => writable: false
<hr>

32. Explain the difference between synchronous and asynchronous functions.
Sync functions are executed as put in sequential/procedural order. <br>
Async: Execution moves to next step before first is finished.
<hr>

33. What is event loop?<br>
JavaScript has a concurrency model based on an event loop, which is responsible for executing the code, collecting and processing events, and executing queued sub-tasks. <br>

34. What is the difference between call stack and task queue?
Call stack is for functions => window object,
task queue is for messages
35. What are the differences between variables created using let, var or const?
36. What are the differences between ES6 class and ES5 function constructors?
37. Can you offer a use case for the new arrow => function syntax? How does this new syntax differ from other functions?
38. What advantage is there for using the arrow syntax for a method in a constructor?
39. What is the definition of a higher-order function?
40. Can you give an example for destructuring an object or an array?
41. Can you give an example of generating a string with ES6 Template Literals?
42. Can you give an example of a curry function and why this syntax offers an advantage?
43. What are the benefits of using spread syntax and how is it different from rest syntax?
44. How can you share code between files?
45. Why you might want to create static class members?
46. What is the difference between while and do-while loops in JavaScript?


<details closed>
<summary>Want to ruin the surprise?</summary>
<br>
Well, you asked for it!
</details>
<hr>
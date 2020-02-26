# NUMBERS
Javascript has a single type of numbers -> it treats all of them as floating points.
However the dots are not displayed if there are no digits after decimal point.

## Number literals

```
> 35 // integer
35
> 3.141 // floating point
3.141
> 0xFF // hexadecimal
255
```

### Exponent
Is an abbreviation for multiply with 10 to the power of Xn

```
> 5e2
500
```

## Converting to Number

Values are converted to numbers as follows:
```
undefined | NaN
null | 0
boolean | false => 0, true => 1
number | same as input
string | parse the number in the string ignoring leading and trailing spaces, empty string is converted to 0, string with characters to NaN
```

### Methods to convert to a Number

```
Number(value) | invoked as function
+value
```

## Special number values
Javascript has several special number values:
 - two error values: `NaN` and `Infinity`
 - two values for zero: `+0` and `-0`

### parseFloat(str)
Converts `str` to string, trims leading white spaces, and then parses longest prefix that is a floating point.
```
console.log(parseFloat('asdf123asdfa')) // NaN
console.log(parseFloat('123.0912.asdf')) // 123.0912
console.log(parseFloat(undefined)) // NaN

console.log(parseFloat('')) // NaN
console.log(Number('')) // 0
```
Care should be taken when using `parseFloat()` because it coerces the arg to string where it is converted then to a number. <br/>
This might result in `NaN`, where the just Number() conversion would had resulted with a valid number.

### NaN
NaN is abbreviation for not a number.
```
> typeof NaN
number
```

It is produced by errors as follows:
 - a number could not be parsed:
 ```
    > Number('xyz')
    NaN
    > Number(undefined')
    NaN
 ```
 - An operation failed:
 ```
    > Math.sqrt(-1)
    NaN
 ```
 - One of operands is Nan
 ```
    > NaN + 3
    NaN
 ```

**Pitfall** checking whether a value is NaN:
Nan is the only value that is not equal to itself.

`isNaN()` function should be used; it converts to string first => then evaluates to number
So this should not be true, but it is because of using Number() which returns NaN:
```
> isNaN('asd')
true
```

### Infinity
Is an error value indicating one of two problems: a number can't be represented because its magnitude is to large, <br/>
or a division by zero has happened.
`Infinity` results when:
 - a number magnitude is too large
 ```
    console.log(Math.pow(2, 1023)) // 8.98846567431158e+307
    console.log(Math.pow(2, 1024)) // Infinity
 ```
 - division by zero
 ```
    console.log(3/0) // Infinity
 ```
 - computing with Infinity
 ```
    console.log(Infinity + Infinity) // Infinity
    console.log(Infinity * Infinity) // Infinity
    console.log(Infinity - Infinity) // NaN
    console.log(Infinity / Infinity) // Nan
 ```

Checking for `Infinity`:
```
var x = Infinity;
console.log(x === Infinity); // true
console.log(Infinity === Infinity); // true
console.log(isFinite(Infinity)) // false
console.log(isFinite(NaN)) // false
console.log(isFinite(null)) // true
```

## Internal representation of numbers

A number is stored as a double precision: 64bits:
The 64 bits are distributed between a number's sign, exponent and fraction:
1 bit | used for positive or negative sign (bit 0)
11 bits | used for exponent (bit 65 - 52)
52 bits | used for value (bit 51 - 0)

the exponent is in the range of: -1023 < e  < 1024

## Handling rounding Erros
Js numbers are usually entered as decimal floating points, but they are internally represented <br/>
as binary floating point numbers. This leads to imprecision. <br/>
So using decimal system, all fraction are a mantissa `m` divided by a power of 10. <br>
The denominator is 10 only for decimal. <br/>
Due to rounding error, there shouldn't compared integers directly.

## Integers in Javascript
Ranges of integers are safe integers: -2^53 < i < 2^53
```
console.log(Number.MAX_SAFE_INTEGER) //9007199254740991
console.log(Number.MIN_SAFE_INTEGER)  // -9007199254740991
```

## Converting to integer
All numbers are floating points in js. Integers are floating-points without a fraction.
Ways to convert to integer:
```
Math.floor(), Math.ceil() Math.round() - best choice
ToInteger()
binary bitwise operators
parseInt() - good for parsing strings but not for converting numbers to integers
```

`Math.round()` - converts to the closest integer
```
console.log(Math.round(3.48)) // 3
```
`ToInteger()` - removes the fraction of a floating-point
`bitwise operators` - converts operator to a 32-bit integer one of their operands (|, >>, <<)_
```
console.log(1.0126345 | 0) // 1
console.log(3.99 | 0) // 3
```
`parseInt(str, radix?)` - parses the string str (nonstrings are coerced) as an integer. <br/>
It ignores leading whitespaces and considers as many consecutive digits as it can find.

`radix` - it determines the base of the number to be parsed. It is 10 by default.
Range of radix is between 2 and 36 (10 numbers + 26 alphabet characters) inclusive.
```
console.log(parseInt(0xFA)) // 250
console.log(parseInt(0xA, 16)) // 10
console.log(parseInt('B', 16)) // 11

console.log(parseInt('', 36)) // NaN
console.log(parseInt('          21', 10)) // 21

console.log(parseInt('21.55', 10)) // 21

console.log(parseInt(1000000000000000000000.5, 10)) // 1 because it's coerced to String() first resulting in '1e+21' from where 1 is parsed only.
```
`parseInt()` shouldn't be used to convert numbers to integer because of coercion to string and result may not be always correct.

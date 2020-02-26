# STRINGS

Strings are immutable sequences of characters. Each character is a 16bit UTF-16 code unit. <br/>
That means that a single unicode character is represented by either one or two js characters.

## Converting to string
```
undefined | 'undefined'
null | 'null'
boolean | false => 'false', true => 'true'
number | e.g. '1.234'
string | same as input
object | convert to primitive, and then convert primitive to string
```

### Manually convert to String
```
String(value) | invoked as function
'' + value | 
value.toString() | does not work for undefined and null
```

**Pitfall** - conversion is not invertible

## Comparing Strings

There are 2 ways of comparing strings:

1)using comparing operators <,>, ===, <=, >= <br/>

but they have the following drawbacks:
 - they're case sensitive - (the ascii code number is actually compared)
 ```
    console.log('B' > 'A') // true
    console.log('B' > 'a') // false
    console.log('a' > 'A') // true
```

The algorithm to compare two strings is simple:

 - Compare the first character of both strings.
 - If the first character from the first string is greater (or less) than the other string’s, then the first string is greater (or less) than the second. We’re done.
 - Otherwise, if both strings’ first characters are the same, compare the second characters the same way.
 - Repeat until the end of either string.
 - If both strings end at the same length, then they are equal. Otherwise, the longer string is greater.

 ```
console.log('ab' > 'ABananananan') // true
 ```
- they don't handle umlauts and accents well

2) `String.prototype.localeCompare(otherString)` - less than zero means that the receiver is smaller than the argument.
```
console.log('B'.localeCompare('A')) // 1
console.log('B'.localeCompare('a')) // 1
console.log('a'.localeCompare('A')) // -1
```

## Concatenating strings

- The Plus operator
- Joining an aray of string fragments

## The function String

Can be invoked in 2 ways: 
- as a normal function `String('some val')`: converts value to a primitive string
- as a constructor `new String(str)` - creates a new instance of String

## String constructor method

`String.fromCharCode(code1, code2)` - produces a string whose characters correspond to assci table codes:
```
console.log(String.fromCharCode(97,98,99)) // 'abc'
```
The inverse of String.fromCharCode() is String.prototype.charCodeAt()

## String prototype methods

### Extract substrings

`charAt()`:
```
console.log('abc'.charAt(0)) // 'a'
console.log('abc'[0]) // 'a'
```

`String.prototype.slice(start, end?)` - returns a substring at positino start up to and excluding position end. <br/>
Both of the params can be negative, and the length is added to them.
```
console.log('nick'.slice(2)) // 'ck'
console.log('nick'.slice(1,3)) // 'ic'
console.log('nick'.slice(-2)) // 'ck'
```
`String.prototype.substring(start, end?)` - should be avoided in favor of slice which can handle negative args

`String.prototype.split(separator?, limit?)` - extracts substrings of the receiver that are delimited by a separator and returns them in array. <br/>

### Transform

`String.prototype.trim()` - removes  all the whitespace from the begining to the end of the string

`String.prototype.concat(str1?, str2?)` - returns a concatenation fo the receive and str1, str2

`String.prototype.toLowerCase()` - creates string with all original characters converted to lowercase

`String.prototype.toLocaleLoweCase()` - same as toLowerCase but respects rules of locale

`String.prototype.toUpperCase()` - creates string with all original characters converted to uppercase


### Search and Compare

`String.prototype.indexOf(searchString, position?)` - searches for searchString/regex at the position (default 0). <br/>
It returns -1 if nothing has been found.

`String.prototype.lastIndexOf(searchString, position)` -  searches for searchString/regex at the position (default is end) backward <br/>
It returns -1 if nothing has been found.



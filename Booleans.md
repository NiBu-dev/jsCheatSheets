# Booleans

The primitive boolean type comprises the values true and false.

Values are converted to booleans as follows:
```
Boolean(undefined) // false
Boolean(null) // false
Boolean(a boolean) // boolean
Boolean(a number) // 0, NaN => false, other numbers => true
Boolean(a string) // '' => false, other strings => true
Boolean(an object) // true always
Boolean(undefined) // false
```

Three ways to convert to a boolean:
```
Boolean(value) | invoked as function, not as a constructor
value ? true : false
!!value | one `!` converts to a negated boolean; use twice for nonnegated conversion
```

## The function Boolean

`Boolean(value)` - as a normal function it converts value to a primitive boolean
`new Boolean(bool)` - as a constructor it creates a new instance of Boolean
var obj = {
    foo: 1,
    bar: [1,2,3]
}

Object.freeze(obj)

obj.foo = 2;
obj.bar.push('mememe')

console.log(obj)
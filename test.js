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

console.log(f()[0]());
console.log(f()[1]());
console.log(f()[2]());
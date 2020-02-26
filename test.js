var jane = {
    name: 'jane',
    sayHelloTo: function (otherName) {
        // 'use strict'
        console.log(this.name + ' says hello to ' + otherName)
    }
};

var obj = {
    name: 'jane',
    friends: ['Tarzan', 'Cheeta'],
    loop: function () {
        this.friends.forEach(
            function(friend) {
                console.log(this.name + ' knows ' + friend )
            }, this
        )
    }
}

obj.loop() // jane knows Tarzan \n jane knows Cheeta
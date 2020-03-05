class Memem {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayHay() {
        return `I am ${this.name} and I am ${this.age} year old`
    }
}

const someMeme = new Memem('Igor', 19);
console.log(someMeme)
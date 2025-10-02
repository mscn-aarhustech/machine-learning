class MyClass {
    constructor(myField) {
        this.myField = myField;
    }
    
    myMethod() {
        return this.myField;
    }

    serialize() {
        let obj = {};
        for (let prop in this) {
            if (this.hasOwnProperty(prop)) {
                obj[prop] = this[prop] instanceof Function ? this[prop].toString() : this[prop];
            }
        }
        return JSON.stringify(obj);
    }

    static deserialize(genome) {
        let obj = JSON.parse(genome);
        let instance = new MyClass(obj.myField);
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop) && obj[prop].toString().startsWith('function')) {
                instance[prop] = new Function('return ' + obj[prop])();
            }
        }
        return instance;
    }
}

// let myInstance = new MyClass('foo');

// console.log("myInstance");
// console.log(myInstance);

// let genome = myInstance.serialize();

// console.log("genome");
// console.log(genome);

// let myDecodedInstance = MyClass.deserialize(genome);

// console.log("myDecodedInstance");
// console.log(myDecodedInstance);



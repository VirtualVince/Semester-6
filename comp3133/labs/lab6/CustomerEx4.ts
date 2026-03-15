// Exercise 4 - Modules

export class CustomerEx4 {
    private firstName: string;
    private lastName: string;
    private _age: number;

    constructor(firstName: string, lastName: string, age: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this._age = age;
    }

    greeter() {
        console.log(`Hello, ${this.firstName} ${this.lastName}!`);
    }

    GetAge() {
        console.log(`Customer age: ${this._age}`);
    }
}

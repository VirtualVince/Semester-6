// Exercise 2 - Types, Classes and Objects

class CustomerEx2 {
    firstName: string;
    lastName: string;

    greeter() {
        console.log(`Hello, ${this.firstName} ${this.lastName}!`);
    }
}

let customer = new CustomerEx2();
customer.firstName = "John";
customer.lastName = "Doe";

customer.greeter();

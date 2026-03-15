// Exercise 3 - Access Modifiers and Constructors

class CustomerEx3 {
    private firstName: string;
    private lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    greeter() {
        console.log(`Hello, ${this.firstName} ${this.lastName}!`);
    }
}

let customer = new CustomerEx3("John", "Doe");

customer.greeter();

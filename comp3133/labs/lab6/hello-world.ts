// Exercise 1 - TypeScript First Start

let greeter = (first: string, last: string): string => {
    return `Hello, ${first} ${last}!`;
};

let firstName: string = "John";
let lastName: string = "Doe";

console.log(greeter(firstName, lastName));

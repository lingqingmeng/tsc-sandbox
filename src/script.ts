// 定义一个简单的接口
interface Person {
  name: string;
  age: number;
}
 
// 使用接口来定义一个函数，该函数接受一个符合Person接口的对象
function greetPerson(person: Person) {
  console.log(`Hello, my name is ${person.name} and I am ${person.age} years old.`);
}
 
// 创建一个符合Person接口的对象
const person: Person = {
  name: "Alice",
  age: 30
};

const dev: Person = {
  name: "Bob",
  age: 32
}
 
// 调用函数并传入该对象
greetPerson(person);
greetPerson(dev);

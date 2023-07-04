// let Person = function(){};
// Person.prototype.a = '10';
// Person.prototype.say = function(){
//     console.log('你好，我是函数原型上的方法');
// }
// let person = new Person();
// console.log(person.a);
// person.say();
// console.log(Person.prototype);

// let obj = {};
// console.log(obj);
// console.log(obj.__proto__);

// let arr = [];
// console.log(arr);
// console.log(arr.__proto__);

// let obj1 = {
//     a:50,
//     say(){
//         console.log('obj1上的方法')
//     }
// };
// let obj2 = {b:10};
// obj2.__proto__.c = 5;
//
// obj1.__proto__.say = function(){
//     console.log('obj1的原型上添加了一个say方法');
// }
// obj1.__proto__.a = 100;
// console.log(obj1.a);
// console.log(obj1.hasOwnProperty('a'))
// console.log(obj2.hasOwnProperty('b'))
// console.log(obj2.hasOwnProperty('c'))

//创建一个构造函数
// const Person = function(name,age){
//     this.name = name;
//     this.age = age;
// };
// //创建一个函数实例
// let per = new Person('张三',25);
// console.log(per);

// console.log(Person.prototype === per.__proto__);
// console.log(Person.prototype.constructor === Person);

// let arr = [10, 20, 30];
// let arr = new Array(10,20,30);
// console.log(arr.constructor === Array); // true
// console.log(arr)

// let arr = [10, 20, 30];
// // 1.获取构造函数的参数个数
// console.log(arr.constructor.length);
// // 2.获取构造函数的参数名称
// let args = per.constructor.toString().match(/\(.*\)/).pop().slice(1,-1).split(',');
// console.log(args);

let obj1 = {};
let arr = [];
const Person = function(name,age){
    this.name = name;
    this.age = age;
};
let per = new Person('张三',25);
console.log(Person.prototype === per.__proto__);
console.log(obj1.__proto__ === Object.prototype);
console.log(arr.__proto__ === Array.prototype);
console.log(obj1.__proto__ === arr.__proto__.__proto__);
console.log(Person.prototype.__proto__ === obj1.__proto__);
// console.log(obj1.__proto__);

// console.log(Object.prototype === Person.prototype);
// console.log(Object.prototype)
// console.log(Person.prototype)
// console.log(Array.prototype)
// console.log(Person.prototype.__proto__ === Array.prototype.__proto__)
// console.log(Array.prototype.__proto__ === Object.prototype);
// console.log(Array.prototype.__proto__)
// console.log(Object.prototype)

// console.log(obj1.__proto__);

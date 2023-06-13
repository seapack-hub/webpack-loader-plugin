// class Person {
//     constructor(name) {
//         this.name = name;
//     }
//     setName(name){
//         this.name = name;
//     }
// }
//
// console.log(new Person('jack'));

// let obj = {};
// let bValue = 5
// Object.defineProperty(obj,'a',{
//     //是否可枚举
//     enumerable:true,
//     //是否可删除
//     configurable:true,
//     get(){
//         console.log('访问量a元素')
//         return bValue;
//     },
//     set(value){
//         console.log("更改后a的值为：",value);
//         bValue = value;
//     }
// })
// console.log(obj.a);
// obj.a = 10;
// console.log(obj);
// obj.c = 15;
//
// let prop = Object.getOwnPropertyDescriptor(obj,'c');
// console.log(prop);

// for(let val in obj){
//     console.log(val,obj[val]);
// }
import '../vue2ResponsivePrinciple/index';

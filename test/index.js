import {defineReactive} from "./defineReactive";
let obj = {
    a:5,
    b:10
};
for(let key in obj){
    defineReactive(obj,key)
}
console.log(obj);


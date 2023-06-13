import {defineReactive} from './defineReactive';
import Watcher from "./Watcher";
import {observe} from './observe'
function parsePath(str){
    let argument = str.split(".");
    return (obj)=>{
        for(let i = 0,l=argument.length;i<l;i++){
            obj = obj[argument[i]];
        }
        return obj;
    }
}
let student = {
    name:"张三",
    age:18,
    subject:{
        Chinese:'98',
        English:'80'
    },
    grade:[99,100,85,76,60]
}

let ob = parsePath("subject.Chinese");
let value = ob(student);
console.log(value)
// observe(student);
// new Watcher(student,'subject.Chinese',(value,oldValue)=>{
//     console.log(`更改后的新值为：${value} 原本的值为：${oldValue}`)
// });
// student.subject.Chinese = 100;
// student.subject.Chinese = 200;
// student.grade.push(100);
// student.grade = [101,102];

import {defineReactive} from './defineReactive';
import Watcher from "./Watcher";
import {observe} from './observe'
let student = {
    name:"张三",
    age:18,
    subject:{
        Chinese:'98',
        English:'80',
        num:{
            a:{
                b:{
                    c:5
                }
            }
        }
    },
    grade:[99,100,85,76,60]
}
observe(student)

new Watcher(student,"grade",(value,oldValue)=>{
    console.log('-------',value,oldValue);
});
// student.subject.Chinese = "100";
// console.log(student)
// console.log(student.grade);
student.grade.push(10);


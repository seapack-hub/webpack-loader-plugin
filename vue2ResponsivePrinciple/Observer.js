import { def } from './utils'
import {defineReactive} from "./defineReactive";

import {arrayMethods} from "./array";
import {observe} from "./observe";
import Dep from "./Dep"
export default class Observer{

    //创建构造器
    constructor(value){
        //给每个对象上添加Dep
        this.dep = new Dep();
        //给对象上添加__ob__属性
        //__ob__ 一般都会设置为不可枚举的属性，它本身只是存储Observer类实例的
        // 构造函数中的this不是表示类本身，而是表示类的实例
        def(value,'__ob__',this,false);

        //判断类型是否是数组，如是数组，使用arrayMethods替换数组的原型
        if(Array.isArray(value)){
            Object.setPrototypeOf(value,arrayMethods);
            // 如果数组里面还包含数组 需要递归判断
            this.observeArray(value)
        }else{
            this.walk(value);
        }
    }
    //遍历对象，为每个属性添加监听
    walk(value){
        for(let key in value){
            defineReactive(value,key);
        }
    }
    //遍历数组，为每个数组项添加监控
    observeArray(arr){
        //先获取数组长度，pop,shift等方法调用后会更改数组长度
        for(let i = 0,l=arr.length;i<l;i++){
            //逐项进行observe
            observe(arr[i]);
        }
    }
}

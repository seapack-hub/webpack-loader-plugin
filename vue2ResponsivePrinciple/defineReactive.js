import {observe} from "./observe";
import Dep from "./Dep"

/**
 * 封装Object.defineProperty()
 * @param data 对象
 * @param key 添加的属性
 * @param val 属性值
 */
export function defineReactive(data,key,val){
    //val闭包中的dep
    const dep = new Dep();
    //若没有传入属性值，且对象中含有这个属性的属性值时，直接将其赋值给val
    if(arguments.length == 2){
        val = data[key];
    }
    //子元素要进行observe，至此形成了递归。这个递归不是函数自己调用自己，而是多个函数、类循环调用
    let childOb = observe(val);

    Object.defineProperty(data,key,{
        //可配置，如删除
        configurable:true,
        //可枚举
        enumerable:true,
        get(){
            //数据被访问时收集依赖
            //这里需要用Dep类上的target，全局变量，不是Dep的实例dep
            //Dep类的实例dep，在这里的作用是收集监听元素的Watcher实例
            //Watcher实例存放到公共变量 Dep上
            // console.log(key,"被访问了");
            if(Dep.target){
                dep.depend()
                if(childOb){
                    childOb.dep.depend();
                }
            }
            return val;
        },
        set(value){
            if(val === value){
                return;
            }
            // console.log(`${key}属性被赋值了，新值为：${value}`);
            val = value;
            //当设置了新值，新值也需要调用observe
            childOb = observe(val);

            dep.notify();
        }
    })
}

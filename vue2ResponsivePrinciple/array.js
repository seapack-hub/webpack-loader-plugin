import {def} from './utils'

//获取Array.prototype 原型
const arrayPrototype = Array.prototype;

// 以Array.prototype为原型创建arrayMethods对象，并暴露
export const arrayMethods = Object.create(arrayPrototype);

//要被改写的七个数组方法
const methodsNeedChange = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];

//重写数组方法
methodsNeedChange.forEach(name=>{
    //复制原方法
    let original = arrayPrototype[name];
    //在arrayMethods上添加新方法，并在其中调用原方法保留其功能
    def(arrayMethods,name,function(){
        // console.log(`${name}方法重写了`);
        const result = original.apply(this,arguments);
        //获取Observer类，为监听数据做准备
        const ob = this.__ob__;

        //将类数组对象转变为数组，之后会调用数组的方法，类数组对象上没有
        //获取七个方法的参数
        const args = [...arguments];

        //获取数组新增项 push,unshift,splice 方法都可以向数组中添加新项
        let inserted = [];
        switch (name){
            case "push":
            case "unshift":
                inserted = args;
                break;
            case "splice":
                // splice格式是splice(下标, 数量, 插入的新项)
                inserted = args.slice(2);
                break;
        }
        // console.log(`${name}方法，`,inserted);
        //判断是否有新项插入，调用Observer实例的observeArray对数组每一项进行观测。
        if(inserted){
            ob.observeArray(inserted);
        }
        //数组改变时通知更新
        ob.dep.notify();
        return result;
    },false)
})


import Dep from './Dep'
let uid = 0;
export default class Watcher{
    /**
     * 构造函数
     * @param target 监控的对象
     * @param name  监控的属性
     * @param callback 回调函数
     */
    constructor(target,name,callback) {
        this.id = uid++;
        //将监控对象放入target中
        this.target = target;
        //存储回调函数
        this.callback = callback;
        this.getter = parsePath(name);
        //监控项初始值放入value中
        this.value = this.get();
    }
    update(){
        this.run();
    }

    get(){
        //进入依赖收集阶段，让全局的Dep.target值为Watcher实例
        Dep.target = this;
        // window.target = this;
        //获取对象
        const obj = this.target;

        let value;
        try{
            //访问对象上的元素，会触发监控的get方法，将watcher存入Dep中
            value = this.getter(obj);
        }finally{
            Dep.target = null;
        }
        return value;
    }
    run(){
        this.getAndInvoke(this.callback);
    }
    getAndInvoke(ob){
        //获取新值
        const value = this.get();
        //如果新值不等于旧值，或新值为一个对象
        if(value !== this.value||typeof value == 'object'){
            //存储旧值
            const oldValue = this.value;
            //将新值存储在this.value中
            this.value = value;
            //执行回调函数
            ob.call(this.target,value,oldValue);
        }
    }
}

/**
 * 辅助函数，帮助拿到对象监控的值
 * @param str
 * @returns {function(*): *}
 */
function parsePath(str){
    let argument = str.split(".");
    return (obj)=>{
        for(let i = 0,l=argument.length;i<l;i++){
            obj = obj[argument[i]];
        }
        return obj;
    }
}

import {observe} from "../vue2ResponsivePrinciple/observe";
import Watcher from "../vue2ResponsivePrinciple/Watcher";
import Compile from "./Compile";
export default class Vue{
    constructor(options){
        //把参数options对象存为$options;
        this.$options = options || {};
        //存储数据
        this._data = options.data || undefined;
        //将数据变成响应式的
        observe(this._data);
        // 默认数据变成响应式的,将_data上的数据复制一份到this上。
        this._initData()
        //调用默认的Watcher
        this._initWatch()
        //进行模板编译
        new Compile(options.el,this);
    }
    _initData(){
        let self = this;
        Object.keys(this._data).forEach(key=>{
            Object.defineProperty(self,key,{
                get:()=>{
                    return self._data[key];
                },
                set:(newValue)=>{
                    self._data[key] = newValue;
                }
            })
        })
    }

    _initWatch(){
        let self = this;
        //获取参数里面的watch项
        let watch = this.$options.watch || {};
        //设置watch项里面的监听
        Object.keys(watch).forEach(key=>{
            new Watcher(self,key,watch[key]);
        })
    }
}

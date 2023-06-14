import {observe} from "../vue2ResponsivePrinciple/observe";
import Compile from "./Compile";
export default class Vue{
    constructor(options){
        //把参数options对象存为$options;
        this.$options = options || {};
        //存储数据
        this._data = options.data || undefined;
        //将数据变成响应式的
        observe(this._data);

        //进行模板编译
        new Compile(options.el,this);
    }
}

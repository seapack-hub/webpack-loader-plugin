/**
 * 设置属性值是否可以被枚举
 * @param data 对象
 * @param key 属性
 * @param value 属性值
 * @param enumerable 是否可被枚举
 */
export function def(data,key,value,enumerable){
    Object.defineProperty(data,key,{
        value,
        enumerable,
        configurable:true,
        writable:true
    })
}
/**
 * 辅助函数，帮助拿到对象监控的值
 * @param str
 * @returns {function(*): *}
 */
export function parsePath(str){
    let argument = str.split(".");
    return (obj)=>{
        for(let i = 0,l=argument.length;i<l;i++){
            obj = obj[argument[i]];
        }
        return obj;
    }
}

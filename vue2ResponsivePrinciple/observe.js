import Observer from "./Observer";
/**
 * 存储Observer类的实例
 * @param value 监控的对象
 */
export function observe(value){
    if(typeof value != 'object'){
        return;
    }
    //定义ob
    let ob;
    //__ob__ 属性的作用就是存储Observer类的实例，
    //前后都加__ 主要是不想与其他常见的属性重名
    if(typeof value.__ob__ !== 'undefined'){
        ob = value.__ob__;
    }else{
        ob = new Observer(value);
    }
    return ob;
}

export function defineReactive(data,key,val){

    if(arguments.length == 2){
        val = data[key];
    }

    Object.defineProperty(data,key,{
        //可配置，如删除
        configurable:true,
        //可枚举
        enumerable:true,
        get(){
            console.log(key,"被访问了");
            return val;
        },
        set(value){
            console.log(`${key}属性被赋值了，新值为：${value}`);
            if(val === value){
                return;
            }
            val = value;
        }
    })
}

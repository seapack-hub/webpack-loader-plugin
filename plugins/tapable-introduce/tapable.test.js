const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
} = require("tapable");

//创建一个类
class Lesson{

    //构造器
    constructor() {
        //初始化hooks容器
        this.hooks = {
            // 同步hook(钩子)，任务会依次执行
            // go:new SyncBailHook(['address']),
            // 异步执行
            leave:new AsyncSeriesHook(['name','age']),

            go:new SyncHook()
        }
    }

    //向hooks容器中添加事件
    addEvent(){
        this.hooks.go.tap('seaPack01',(address)=>{
            console.log('seaPack01',address);
            return 111;
        })
        this.hooks.go.tap('seaPack02',(address)=>{
            console.log('seaPack02',address);
        })
        this.hooks.leave.tapAsync('seaPack03',(name,age,cb)=>{
            setTimeout(()=>{
                console.log('seaPack',name,age);
                cb();
            },2000)
        })
    }

    //设置触发事件
    triggerEvent(){
        this.hooks.go.call('seaPack');
        this.hooks.leave.callAsync('海峰',18,function (){
            console.log('end~~~');
        })
    }
}

const lesson = new Lesson();
lesson.addEvent();
lesson.triggerEvent();

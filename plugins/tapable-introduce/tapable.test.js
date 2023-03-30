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
            go:new SyncHook(['adress']),
            // leave:new AsyncSeriesHook()
        }
    }

    //向hooks容器中添加事件
    addEvent(){
        this.hooks.go.tap('class0330',(address)=>{
            console.log('class0330',address);
        })
    }

    //设置触发事件
    triggerEvent(){
        this.hooks.go.call('c330');
    }
}

const lesson = new Lesson();
lesson.addEvent();
lesson.triggerEvent();

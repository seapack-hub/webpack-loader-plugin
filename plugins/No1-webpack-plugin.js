/**
 * 创建一个构造函数
 * @param options
 * @constructor
 */
function No1WebpackPlugin(options){
    this.options = options;
}

// 重写构造函数原型对象上的 apply 方法
No1WebpackPlugin.prototype.apply=function(compiler){
    compiler.hook.emit.tapAsync('emit',()=>{
        console.log(this.options.msg);
    })
}

//将自定义插件导出
module.exports = No1WebpackPlugin;

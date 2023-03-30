const babel = require("@babel/core");
//util是node.js中自带的
const util = require('util');
//引入命名规范
const babelSchema = require('./babel-schema.json');
/*
* babel.transform用来编译代码的方法
* 是一个普通异步方法
* util.promisify将普通异步方法转化成基于promise的异步方法
*/
const transform = util.promisify(babel.transform);
/**
 * babelLoader
 * @param content js文件内容
 * @param map
 * @param meta
 */
module.exports = function(content,map,meta){
    //获取 options 配置并验证配置
    const options = this.getOptions(babelSchema);
    //创建异步
    const callback = this.async();
    console.log(transform)
    //使用label编码
    transform(content,options)
        .then(({code,map})=>callback(null,code,map,meta))
        .catch((e)=>callback(e));
}

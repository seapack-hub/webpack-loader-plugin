// 自定义loader
// 接收内容，返回

//获取loader加载器的options配置参数
//引入插件
const schema = require("./schema.json")
/**
 * @param content 文件内容
 * @param map SourceMap 相关的
 * @param meta 别的loader传递的数据。
 */
module.exports = function (content, map, meta) {
    //获取option配置
    const options = this.getOptions(schema);
    console.log('222',options);
    return content;
}
module.exports.pitch = function () {
    console.log('pitch 222');
}

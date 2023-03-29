// 自定义loader
// 接收内容，返回
/**
 * @param content 文件内容
 * @param map SourceMap 相关的
 * @param meta 别的loader传递的数据。
 */
module.exports = function (content, map, meta) {
    console.log('111')
    // return content;
    //等价于
    this.callback(null,content,map,meta);
}
module.exports.pitch = function () {
    console.log('pitch 111');
}

const fs = require('fs');
const util = require('util');
const path = require('path');
const webpack = require('webpack');
const { RawSource } = webpack.sources;

// 将fs。readFile方法变成基于promise风格的异步方法
const readFile = util.promisify(fs.readFile);
class PluginCompilation{
    apply(compiler){
        compiler.hooks.thisCompilation.tap('Plugin2',(compilation)=>{
            console.log(compilation);
            //添加资源
            compilation.hooks.additionalAssets.tapAsync('Plugin2',async (cb)=>{
                // const content = "hello plugin2";
                //
                // // 往要输出资源中，添加一个a.txt
                // compilation.assets['a.txt'] = {
                //     //文件大小
                //     size(){
                //         return content.length
                //     },
                //     //文件内容
                //     source(){
                //         return content;
                //     }
                // }
                //
                // const data = await readFile(path.resolve(__dirname,'b.text'));
                //
                // compilation.emitAsset('b.txt',new RawSource(data));
                //
                // cb();
            })

        })
    }
}

module.exports = PluginCompilation;

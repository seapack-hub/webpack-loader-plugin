const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const No1WebpackPlugin = require('./plugins/No1-webpack-plugin');
// const PluginCompiler = require('./plugins/plugin1');
// const PluginCompilation = require('./plugins/plugin2');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        // 端口号
        port: 8088,
        // 静态资源文件夹
        static: './public'
    },
    // module: {
    //     rules:[
    //         {
    //             test:/\.js$/,
    //             use:[
    //                 // 'no1-loader',
    //                 // {
    //                 //     loader:'no2-loader',
    //                 //     options:{
    //                 //         name:'jack',
    //                 //         age:18
    //                 //     }
    //                 // },
    //                 // 'no3-loader',
    //                 // {
    //                 //     loader: 'babelLoader',
    //                 //     options: {
    //                 //         presets: [
    //                 //             '@babel/preset-env'
    //                 //         ]
    //                 //     }
    //                 // }
    //             ]
    //         }
    //     ],
    // },
    // resolveLoader: {
    //     modules: [
    //         'node_modules',
    //         path.resolve(__dirname,'loaders')
    //     ]
    // },
    plugins: [
        //测试v-model指令
       // new HtmlWebpackPlugin({
       //     template:'./public/index.html'
       // })
         new HtmlWebpackPlugin({
             template:'./vue2mustache/mustacheTest/index.html'
         })
    ],
    mode:'development'
}

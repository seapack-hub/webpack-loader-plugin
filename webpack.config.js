const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const No1WebpackPlugin = require('./plugins/No1-webpack-plugin');
const PluginCompiler = require('./plugins/plugin1');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules:[
            {
                test:/\.js$/,
                use:[
                    'no1-loader',
                    {
                        loader:'no2-loader',
                        options:{
                            name:'jack',
                            age:18
                        }
                    },
                    'no3-loader',
                    {
                        loader: 'babelLoader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ]
                        }
                    }
                ]
            }
        ],
    },
    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(__dirname,'loaders')
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'custom-plugin'
        }),
        new CleanWebpackPlugin(),
        new PluginCompiler()
    ],
    mode:'development'
}

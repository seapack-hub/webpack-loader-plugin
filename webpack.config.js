const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const No1WebpackPlugin = require('./plugins/No1-webpack-plugin');

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
                    {loader:'./loaders/no1-loader.js'}
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'custom-plugin'
        }),
        new CleanWebpackPlugin()
    ],
    mode:'development'
}

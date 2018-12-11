var webpack = require('webpack');
var path = require('path');
var package = require("../package.json");

module.exports = {
    //页面入口文件配置
    entry: {
        index: path.join(__dirname, "../src/index"),
    },
    output: {
        // 生成的打包文件名
        path: path.join(__dirname, "../dist/"),
        filename: 'index.js',
        library: 'my-router-history',
        libraryTarget: 'umd',
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'], // note if using webpack 1 you'd also need a '' in the array as well
    },
    module: {
        //加载器配置
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [path.join(__dirname, '../src'), path.join(__dirname, '../test')],
        }, {
            test: /\.ts(x?)$/,
            include: [path.join(__dirname, '../src'), path.join(__dirname, '../test')],
            use: [{
                loader: 'babel-loader',
            }, {
                loader: 'ts-loader',
            }]
        }]
    },
    //插件项
    plugins: [
        new webpack.DefinePlugin({
            PLUGIN_VERSION: '"v' + package.version + '"'
        }),
    ],
    devtool: 'source-map'
};

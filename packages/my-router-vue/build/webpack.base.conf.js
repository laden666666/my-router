'use strict'
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var vueLoaderConfig = require('./vue-loader.conf')
var _package = require('../package.json')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

//构建外部依赖
var externals = {}
var dev = [
    'my-router',
]
for(var index in dev) {
    var item = dev[index]
    externals[item] = {
        commonjs: item,
        commonjs2: item,
    }
};

module.exports = {
    entry: {
        core: './src/core/index.ts',
    },
    externals: externals,
    output: {
        // 生成的打包文件名
        path: path.join(__dirname, "../dist/"),
        filename: 'index.js',
        library: 'my-router-vue',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.js', '.vue', '.ts', '.tsx', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'my-router': path.join(__dirname, '../../my-router/'),
        },
        symlinks: true,
    },
    devtool: '#source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.ts(x?)$/,
                include: path.join(__dirname, '../src'),
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                }, {
                    loader: 'ts-loader',
                }]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ].concat(utils.styleLoaders({ sourceMap: true }))
    },
    plugins: [
        new webpack.DefinePlugin({
            PLUGIN_VERSION: '"v' + _package.version + '"'
        }),
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        // extract css into its own file
        new ExtractTextPlugin(utils.assetsPath('my-router-vue.css')),
    ]
}

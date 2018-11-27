'use strict'
var path = require('path')
var utils = require('./utils')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')
var baseWebpackConfig = require('./webpack.dev.conf')
var merge = require('webpack-merge')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = merge(baseWebpackConfig, {
    plugins: [
        // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     },
        //     sourceMap: true
        // }),
        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            uglifyJS:{
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
    ]
})

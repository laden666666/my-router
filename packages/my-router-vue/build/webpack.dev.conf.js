'use strict'
var utils = require('./utils')
var path = require('path')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var baseWebpackConfig = require('./webpack.base.conf')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}


module.exports = merge(baseWebpackConfig, {})

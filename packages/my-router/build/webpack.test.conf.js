var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')

var webpackConfig = merge(baseConfig, {
    devtool: '#inline-source-map',
})

delete webpackConfig.entry
delete webpackConfig.externals


module.exports = webpackConfig

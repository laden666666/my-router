const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = merge(baseWebpackConfig, {
    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                warnings: false
              }
            },
            sourceMap: true,
            parallel: true
        }),
    ],
})





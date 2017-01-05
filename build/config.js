var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackConfig = require('./webpack.config.js');

function getConfig(systemName,name){
    var config = Object.assign({}, webpackConfig, {
        entry: {
            index:[
                './build/dev-client',
                `./src/vue/system/${systemName}/js/index.js`
            ]
        },
        output: {
            path: path.resolve(__dirname,'../dist',systemName),//path.resolve(__dirname, `../dist/${systemName}/js/`),
            publicPath: '/',
            filename: name+'.js',//'[name].[hash].js',
            // chunkFilename: name+'.js'//'[id].[chunkhash].js'
        },
        plugins: [
            // 添加三个插件
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new HtmlWebpackPlugin({
                filename: `src/vue/system/${systemName}/index.html`,
                template: path.resolve(__dirname, `../src/vue/system/${systemName}/index.html`),
                inject: true
            })
        ]
    });
    var devClient = './build/dev-client';
    Object.keys(config.entry).forEach(function (name, i) {
        var extras = [devClient]
        config.entry[name] = extras.concat(config.entry[name])
    })
    return config;
}

module.exports = {
    getConfig
};
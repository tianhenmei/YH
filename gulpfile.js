var gulp = require('gulp');
var fs = require("fs");
var path = require("path");
var browserify = require("browserify");
var express = require("express");
// 编译es6->es5
var babel = require('gulp-babel');
// 将es6编译后的es5打包（require浏览器不识别）
var source = require('vinyl-source-stream');
var through2 = require('through2');
var vueify = require('vueify');
var rename = require('gulp-rename');
// 暂未找到browserify编译打包.vue 文件，修改使用webpack方式
var webpack = require('webpack');
var getConfig = require('./build/config.js').getConfig;
// 连接服务器
var connect = require('gulp-connect');
var proxy = require('proxy');
var webpackDev = require('webpack-dev-middleware');
var webpackHot = require('webpack-hot-middleware');
// 生成编译后文件
var mkdirp = require('mkdirp');
var MemoryFileSystem = require('memory-fs');
// 其他
// chalk : 给打印添加色彩
var chalk = require('chalk');

// 创建一个express实例
var app = express();

var src = './src',
    dist = './dist';

/********************************************************************
 * compile: 将es6 打包成 es5
 * ****************************************************/
gulp.task('compile:es6',function(){
    return gulp.src(src+'/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest(dist));
});
/********************************************************************
 * compile: 将es6 打包成 es5 后能在浏览器上直接调用
 * ****************************************************/
gulp.task('compile:browser',['compile:es6'],function(){
    return gulp.src(dist+'/**/*.js')
        .pipe(through2.obj(function(file, enc, next) {
            var folder = file.path.split(/\//g),
                filename = folder[folder.length - 1],
                filePath = folder.slice(0,folder.length-1).join('/'),
                bundlePath = file.path.replace(/(\.js)?$/, '.bundle.js');

            console.log('bundle: '+bundlePath);
            browserify(file.path)
                // .transform(reactify)
                .bundle(function(err, res) {
                    err && console.log(err.stack);
                    file.contents = res;
                    next(null, file);
                })
                .pipe(source(filename))
                .pipe(rename({
                    extname:'.js',//'.bundle.js'
                }))
                .pipe(gulp.dest(filePath));
    }));
});

gulp.task('compile',['compile:es6','compile:browser']);



//获取任务参数 
var params = {}, argv = process.argv
params[argv[2]] = (argv.length > 2) && argv.slice(3).reduce(function(res, p) {
    var segs = p.slice(2).split(':')
    if(segs.length < 2) {
        return console.log(chalk.red('[用法错误]') + ` 参数${p}必须用:分隔`)
    }
    res[segs[0]] = segs[1]
    return res
}, {}) || {}
/********************************************************************
 * dev: 将es6 打包成 es5，同时将vue文件打包成js使用浏览器访问
 * ****************************************************/
gulp.task('dev:client',function(){
    
});
gulp.task('dev:server',function(){
    var systemName = params.dev.sys
    if(!systemName) return

    var serverConfig = getConfig(systemName,'index');
    // 调用webpack并把配置传递过去
    var compiler = webpack(serverConfig)
    // 使用 webpack-dev-middleware 中间件
    var devMiddleware = webpackDev(compiler, {
        publicPath: serverConfig.output.publicPath,
        stats: {
            colors: true,
            chunks: false
        }
    })
    // 使用 webpack-hot-middleware 中间件
    var hotMiddleware = webpackHot(compiler)
    var mfs = new MemoryFileSystem()
    let fileDir = path.join(serverConfig.output.path)
    !fs.existsSync(fileDir) && mkdirp(fileDir, function(err) {
        if (err) console.error(err)
    })
    // webpack插件，监听html文件改变事件
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
            // 发布事件
            hotMiddleware.publish({ action: 'reload' })
            cb()
        })
    })
    compiler.outputFileSystem = mfs
    compiler.watch({}, function(err, stats) {
        if(err) {
            return console.log(chalk.red(err.message))
        }
        let filePath = path.join(serverConfig.output.path,serverConfig.output.filename)
        let reader = mfs.createReadStream(filePath)
        reader.pipe(fs.createWriteStream(filePath))
    })
    // 注册中间件
    app.use(devMiddleware)
    app.use(hotMiddleware)
    // 监听 8090端口，开启服务器
    app.listen(8090, function (err) {
        if (err) {
            console.log(err)
            return
        }
        console.log('Listening at http://localhost:8090')
    })
});

gulp.task('dev',['dev:client', 'dev:server']);

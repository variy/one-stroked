var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
var CONFIG = require('./config.js');

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config.js');

if(CONFIG.debug){
    var compiler = webpack(webpackConfig);
    /*为什么这里的路径要配成 ./public 呢*/
    app.use(express.static(path.resolve(__dirname, CONFIG.srcPath)));
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        // hot: true,
        noInfo: false,
        inline: true,
        stats: {
            cached: false,
            colors: true
        }
    }));
    
    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }));
}else{
    app.use(express.static(CONFIG.destPath));
}



app.listen(port, function(){
    console.log('server listen on ' + port);
})
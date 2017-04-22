var path = require('path');
var webpack =require('webpack');
var CONFIG = require('./config.js');
var DEBUG = CONFIG.debug;
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var webpackConfig = {
    entry: {
        'index': path.join(CONFIG.srcPath, 'pages/index/app.js')
    },
    output: {
        path: CONFIG.destPath,
        publicPath: DEBUG ? ('http://localhost:' + CONFIG.port + '/') : './',
        filename: DEBUG ?"[name].js" : './pagejs/[name].[chunkhash:8].min.js'

    },
    devtool: DEBUG? 'source-map': '',
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader",
                // publicPath:  DEBUG ? ('http://localhost:' + PORT + '/') : './'`
            })

            // ["style-loader", "css-loader"]


        }]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),

        new HtmlwebpackPlugin({
            template: path.resolve(CONFIG.srcPath, 'template.ejs'),
            filename: 'index.html',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        })

    ]
}

if(DEBUG){
    for(var attr in webpackConfig.entry){
        if( ! Array.isArray(webpackConfig.entry[attr])){
            webpackConfig.entry[attr] = Array.of(webpackConfig.entry[attr]);
        }
        webpackConfig.entry[attr].push('webpack-hot-middleware/client?reload=true')
    }

    webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin())
}

module.exports = webpackConfig;
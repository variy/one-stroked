var path = require('path');
var CONFIG = require('./config.js');
var DEBUG = CONFIG.debug;
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
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
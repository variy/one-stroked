/*  
    @debug：是否是调试环境，默认'0'非。  '1'是
*/
var path = require('path');
var defaultOpts = {
    debug: '1'
};

var paramObj = {};
var argvs = process.argv.slice(2);

for(var i=0; i< argvs.length; i++){
    if(argvs[i].slice(0,2) !== '--')continue;
    var arr = argvs[i].slice(2).split('=');
    paramObj[arr[0]] = arr[1];
}

console.log('obj>>***>' + JSON.stringify(paramObj));
for(var attr in defaultOpts){
    if(!(attr in paramObj)){
        paramObj[attr] = defaultOpts[attr];
    }
}

module.exports = {
    debug: paramObj.debug === '1',
    port: 3000,
    srcPath:  path.join(__dirname, './src'),
    destPath: path.join(__dirname, './docs/')
};


module.exports = function(fileArr, cb){

    var files = (function(fileArr) {
        var files = [];
        fileArr.forEach(function(obj) {
            for (var attr in obj) {
                files.push(obj[attr]);
            }
        });
        return files;
    })(fileArr);

    var queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);

    queue.on("progress", function(e){
        var width = 320, height = 640;
        var iLoaded =  Math.ceil(e.loaded*100);
        var loadingBg = new createjs.Shape();
        loadingBg.graphics.beginFill("#000").drawRect(0, 0, width, height);

        var loadingText = new createjs.Text(iLoaded+'%', "26px Arial", "#fff");
        loadingText.x = width/2;
        loadingText.y = 120;
        loadingText.textStyle = 'center'; 
        var stage = new createjs.Stage("testcanvas");

        stage.addChild(loadingBg, loadingText);
        stage.update();
    });
    queue.on("error", function(){
        alert('err')
    });

    queue.on("complete", _.bind(cb, window, queue));

    queue.loadManifest(files);
};
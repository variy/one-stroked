
var imgObj = {
    bg: '../img/bg.jpg',
    home: '../img/home.png',
    btns: '../img/control-btn.png',
    pt: '../img/point.png',
    number: '../img/number.png'
};

var audioObj = {
    star1: '../audio/star1.ogg',
    star2: '../audio/star2.ogg',
    star3: '../audio/star3.ogg',
    main: '../audio/sm_main_music.ogg',
    start: '../audio/start_game.ogg',
    click: '../audio/click.ogg',
    fail: '../audio/fail.ogg',
    win: '../audio/win.ogg'
}
var files = (function getFiles() {
    var files = [];
    for (var attr in imgObj) {
        files.push(imgObj[attr]);
    }
    for (var attr in audioObj) {
        files.push(audioObj[attr]);
    }
    return files;
})();

module.exports = function(cb){
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

    queue.on("complete", cb);


    queue.loadManifest(files);
};
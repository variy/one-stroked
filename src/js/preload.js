
var imgObj = {
    bg: 'img/bg.jpg',
    home: 'img/home.png',
    btns: 'img/control-btn.png',
    pt: 'img/point.png',
    number: 'img/number.png'
};

var audioObj = {
    star1: 'audio/star1.ogg',
    star2: 'audio/star2.ogg',
    star3: 'audio/star3.ogg',
    main: 'audio/sm_main_music.ogg',
    start: 'audio/start_game.ogg',
    click: 'audio/click.ogg',
    fail: 'audio/fail.ogg',
    win: 'audio/win.ogg'
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

var queue = new createjs.LoadQueue();
queue.installPlugin(createjs.Sound);

var self = this;
queue.on("progress", function(){
    var self = this;
    var iLoaded =  Math.ceil(e.loaded*100);
    this.loadingBg = new createjs.Shape();
    this.loadingBg.graphics.beginFill("#000").drawRect(0, 0,self.canvas.width, self.canvas.height);

    this.loadingText = new createjs.Text(iLoaded+'%', "26px Arial", "#fff");
    this.loadingText.x = this.canvas.width/2;
    this.loadingText.y = 120;
    this.loadingText.textStyle = 'center'; 

    this.stage.addChild(self.loadingBg,self.loadingText);
    this.stage.update();
});
queue.on("error", function(){
    alert('err')
});

queue.on("complete", _.bind());


queue.loadManifest(files);

module.exports = {};
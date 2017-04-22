var preloadFn = require('../../js/preload');

var ImgObj = {
    bg: '../img/bg.jpg',
    home: '../img/home.png',
    btns: '../img/control-btn.png',
    pt: '../img/point.png',
    number: '../img/number.png'
};

var AudioObj = {
    star1: '../audio/star1.ogg',
    star2: '../audio/star2.ogg',
    star3: '../audio/star3.ogg',
    main: '../audio/sm_main_music.ogg',
    start: '../audio/start_game.ogg',
    click: '../audio/click.ogg',
    fail: '../audio/fail.ogg',
    win: '../audio/win.ogg'
}
var canvas = document.getElementById("testcanvas");
var stage = new createjs.Stage("testcanvas");

var Game = function(){
    this.stage = new createjs.Stage("testcanvas");
    this.drawEnterPage();
}

Game.prototype.soundPlay = function(tune){
    var instance = createjs.Sound.play(tune, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 1);
    if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) {
        return;
    }
}

Game.prototype.drawEnterPage = function(){
    var self = this;
    this.stage.autoClear = true;
    this.stage.removeAllChildren();

    this.soundPlay(AudioObj.main);
    this.bg = new createjs.Bitmap(ImgObj.bg);
    this.playLink = new createjs.Bitmap(ImgObj.home);
    this.playLink.x = 120;
    this.playLink.y =80;
    this.stage.addChild(this.bg,this.playLink);
    this.stage.update();

    this.playLink.addEventListener('click',function(){
        self.stage.removeAllChildren();
        self.stage.update();
        // self.gotoPlay(0);
        debugger;
    })
}

preloadFn([ImgObj, AudioObj], function(queue){
    for(var attr in ImgObj){
        ImgObj[attr] = queue.getResult(ImgObj[attr]);
    }
    new Game(0);
});
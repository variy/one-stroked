var preloadFn = require('../../js/preload');

var ImgObj = {
    bg: '../img/bg.jpg',
    home: '../img/home.png',
    btns: '../img/control-btn.png',
    pt: '../img/point.png',
    num: '../img/number.png'
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
        self.timerCount(60);
    })
}


Game.prototype.timerCount = function(n) {

    // 倒计时的时间只会有两位数
    // ?? sprite能不能控制framerate
    var self = this;
    var ten = Math.floor(n/10),
        sec = n - ten*10;

    var tenData = {
        framerate: 0.1,
        'images': [ImgObj.num],
        'frames': {
            width: 28,
            height: 38
        },
        'animations': {
            'countDown': {
                'frames': [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
            }
        }
    };
    var secData = {
        framerate: 1,
        'images': [ImgObj.num],
        'frames': {
            width: 28,
            height: 38
        },
        'animations': {
            'countDown': {
                'frames': [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
            }
        }
    };
        debugger;

    var tenSpSheet = new createjs.SpriteSheet(tenData);
    var tenNumSp = new createjs.Sprite(tenSpSheet, 'countDown');
    tenNumSp.y = 20;
    tenNumSp.x = 120;
    tenNumSp.gotoAndStop(ten);
    if (tenNumSp.currentFrame == 0) {

    }
    var secSpSheet = new createjs.SpriteSheet(secData);
    var secNumSp = new createjs.Sprite(secSpSheet, 'countDown');
    secNumSp.x = 148;
    secNumSp.y = 20;
    secNumSp.gotoAndStop(sec);
    
    this.stage.addChild(tenNumSp, secNumSp);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", self.stage);
    this.stage.update();


    // this.clearTimeIcons = function() {
    //     var self = this;
    //     for (var i = 0; i < this.iconsArr.length; i++) {
    //         this.stage.removeChild(self.iconsArr[i]);
    //     }
    //     this.iconsArr = [];
    // }
}

preloadFn([ImgObj, AudioObj], function(queue){
    for(var attr in ImgObj){
        ImgObj[attr] = queue.getResult(ImgObj[attr]);
    }
    new Game(0);
});
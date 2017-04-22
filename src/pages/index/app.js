var preloadFn = require('../../js/preload');
var mapData = require('../../js/data-level');

var ImgObj = {
    bg: '../img/bg.jpg',
    home: '../img/home.png',
    btns: '../img/control-btn.png',
    pt: '../img/point.png',
    num: '../img/number.png'
};

var AudioObj = {
    // star1: '../audio/star1.ogg',
    // star2: '../audio/star2.ogg',
    // star3: '../audio/star3.ogg',
    // main: '../audio/sm_main_music.ogg',
    // start: '../audio/start_game.ogg',
    // click: '../audio/click.ogg',
    // fail: '../audio/fail.ogg',
    // win: '../audio/win.ogg'
}
var canvas = document.getElementById("testcanvas");
var stage = new createjs.Stage("testcanvas");

var Game = function(i){
    this.stage = new createjs.Stage("testcanvas");
    this.pass = {
        'point': [],
        'line': [],
        'time': -1
    };
    var data = mapData[i];
    for(var attr in data){
        this.pass[attr] = data[attr];
    }
    this.utility();

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

    // this.soundPlay(AudioObj.main);
    this.bg = new createjs.Bitmap(ImgObj.bg);
    this.playLink = new createjs.Bitmap(ImgObj.home);
    this.playLink.x = 120;
    this.playLink.y =80;
    this.stage.addChild(this.bg,this.playLink);
    this.stage.update();

    // this.playLink.addEventListener('click',function(){
        self.stage.removeAllChildren();
        self.stage.update();
    this.startTimetamp = +new Date;

        // self.gotoPlay(0);
        self.renderSite();
        self.renderPass();
        self.timerCount(60);
        self.fnDrawLine();


    // })
}
Game.prototype.renderPass = function() {
    var self = this;
    this.ptHalfWidth = 24;
    this.ptHalfHeight = 21;

    this.ptSpriteArr = [];
    this.lineCoords = [];
    this.staticLine = new createjs.Shape();
    this.drawingLine = new createjs.Shape();  //画出来的线,画线的位置和点的位置是有偏移的
    this.drawedLine = new createjs.Shape();     //将来过去绘制成功的线

    var pointSpSheet = new createjs.SpriteSheet({
        'images': [ImgObj.pt], 
        'frames': {width: 48, height: 42},
        'framerate': 1
    });

    this.ptCollection = [];
    this.pointIcon = new createjs.Sprite(pointSpSheet);
    this.pointIcon.gotoAndStop(1);

    this.pass.line.forEach(function(){

    });


    // 画线
    this.stage.addChild(self.staticLine,self.drawingLine,self.drawedLine);
    _.each(this.pass.line,function(line){
        
        var fromCoord = self.transToCoord(line[0]),
            toCoord = self.transToCoord(line[1]);
        this.lineCoords.push([ [fromCoord[0]+24,fromCoord[1]+21],[toCoord[0]+24,toCoord[1]+21] ]);
        this.staticLine.graphics.setStrokeStyle(10, 'round', 'round')
            .beginStroke('rgba(255,255,255,0.5)')
            .moveTo(fromCoord[0]+24,fromCoord[1]+21)
            .lineTo(toCoord[0]+24,toCoord[1]+21);
    },this);

    this.emptyLineCoords = this.lineCoords;
    // 画点
    this.ptCoords = [];  //所有点坐标数组
    // _.each(this.pass.point,function(Pts, i){
    //     this.ptCoords.push();
    // },this);

    for(var i=0, len= this.pass.point.length; i < len; i++){
        var item = this.pass.point[i];
        for(var j=0, inLen = item.length; j< inLen; j++){
            this.ptCoords.push({
                coord: item[j],
                sign: i+ ''+ j
            })
        }
    }

    _.each(this.ptCoords,function(obj, i){
        var ptIcon = this.pointIcon.clone();
        ptIcon.x = obj.coord[0];
        ptIcon.y = obj.coord[1];
        this.ptSpriteArr.push(ptIcon);
        self.ptCollection.push({
            sign: obj.sign,
            x: obj.coord[0],
            y: obj.coord[1],
            cx: obj.coord[0] + self.ptHalfWidth,
            cy: obj.coord[1] + self.ptHalfHeight,
            sprite: ptIcon
        });
        this.stage.addChild(ptIcon);
    },this);

    this.stage.update();
    
};
Game.prototype.renderSite = function(n) {

    var self = this;
    
    var bg = new createjs.Bitmap(ImgObj.bg);
    var timeTxt = new createjs.Text("时间：", "26px Arial", "#fff"); 
    timeTxt.x = 40;
    timeTxt.y = 24;

    var iPassedIcon =  new createjs.Text("关卡：", "26px Arial", "#fff");
    iPassedIcon.x = 520;
    iPassedIcon.y = 20;
    iPassedIcon.textStyle = 'center'; 

    this.stage.addChild(bg, timeTxt, iPassedIcon);
    // this.stage.update();
}
Game.prototype.timerCount = function(n) {
    // 倒计时的时间只会有两位数
    // ?? sprite能不能控制framerate
    var self = this;
    var ten = Math.floor(n/10),
        sec = n - ten*10;
    var numArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var tenData = {
        framerate: 0.1,
        'images': [ImgObj.num],
        paused: true,
        'frames': {
            width: 28,
            height: 38
        },
        'animations': {
            'countDown': {
                'frames': [9,8,7,6,5,4,3,2,1,0].slice(10-ten)
            }
        }
    };
    var secData = {
        framerate: 1,
        'images': [ImgObj.num],
        paused: true,

        'frames': {
            width: 28,
            height: 38
        },
        'animations': {
            'countDown': {
                'frames': [9,8,7,6,5,4,3,2,1,0]
            }
        }
    };

    var tenSpSheet = new createjs.SpriteSheet(tenData);
    var tenNumSp = this.tenNumSp = new createjs.Sprite(tenSpSheet, 'countDown');
    tenNumSp.y = 20;
    tenNumSp.x = 120;
    tenNumSp.gotoAndStop(ten);

    var secSpSheet = new createjs.SpriteSheet(secData);
    var secNumSp = this.secNumSp = new createjs.Sprite(secSpSheet, 'countDown');
    secNumSp.x = 148;
    secNumSp.y = 20;
    secNumSp.gotoAndStop(sec);
    
    this.stage.addChild(tenNumSp, secNumSp);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
        createjs.Ticker.addEventListener("tick", this.stage);

    tenNumSp.gotoAndPlay('countDown');
    secNumSp.gotoAndPlay('countDown');
    this.stage.update();
}

Game.prototype.utility = function() {
    var self = this;
    this.transToCoord = function(num) {
        var str = num + '';
        str = str.length == 1 ? '0' + str : str;
        var arr = str.split('');
        var coord = self.pass.point[parseInt(arr[0])][parseInt(arr[1])];
        return coord;
    };

    this.getLinePts = function(ptCoord) {
        var targetPtCoords = [];
        for (var i = 0, len = this.emptyLineCoords.length; i < len; i++) {
            for (var j = 0, inLen = this.emptyLineCoords[i][j].length; j < inLen; j++) {
                if (ptCoordEql(ptCoord, this.emptyLineCoords[i][j])) {
                    targetPtCoords.push(this.emptyLineCoords[i][inLen - 1 - j]);
                }
            }
        };

        return targetPtCoords;
    }
}

Game.prototype.fnDrawLine = function() {
    createjs.Touch.enable(stage);
    this.stage.enableMouseOver(10);
    var self = this;
    
    // debugger
    // this.ptCenterCoords = _.map(this.ptCoords,function(coord){
    //     return [coord[0].coord+24,coord[1].coord+21];
    // },this);
    // this.emptyPtCoords = this.ptCenterCoords;
    var self = this;
    var drawingLine, bx, by;
    _.each(this.ptSpriteArr,function(pt){
        pt.on('mousedown',function(evt){    //为什么这里要用function包  
        // debugger;

            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            self.emptyPtArr = _.reject(self.ptCollection, function(item){
                return item.x === pt.x && item.y === pt.y
            });

            self.startPt = _.find(self.ptCollection, function(item){
                return item.x === pt.x && item.y === pt.y
            });
            drawingLine = new createjs.Shape();  //画出来的线,画线的位置和点的位置是有偏移的
            bx = this.x + 24;
            by = this.y + 21;

            self.stage.addChild(drawingLine)
            // self.handleDown(e);
        });

        pt.on('pressmove', function(evt){
            // console.log(self.stage.mouseX,self.stage.mouseY)

            var x = evt.stageX + this.offset.x;
            var y = evt.stageY + this.offset.y;
            // indicate that the stage should be updated on the next tick:
            // update = true;
            // debugger
            drawingLine.graphics.clear().setStrokeStyle(12, 'round', 'round')
                    .beginStroke('rgba(0,255,0,1)')
                    .moveTo(bx,  by)
                    .lineTo(evt.stageX, evt.stageY);
            var padding = 11 + self.ptHalfWidth;
            var coord = [self.stage.mouseX,self.stage.mouseY ];
            // console.log(JSON.stringify(self.ptCenterCoords))
            var target = _.find(self.emptyPtArr, function(d) {
                return Math.sqrt((Math.pow((coord[0] - d.cx), 2) + Math.pow((coord[1] - d.cy), 2))) < padding;
            }, this);

            if(target){

                console.log(self.startPt.sign ,target.sign)
            }
            
        });

        pt.on("stagemouseup", function (evt) {
            drawingLine.graphics.clear()
        });




    },this);

    
    this.handleDown = function(e){
        _.each(this.ptSpriteArr,function(pt){
            pt.removeEventListener('mousedown',self.handleDown);    
        },this);

        e.target.gotoAndStop(0);
        var downX = e.target.x,downY = e.target.y;
        
        this.emptyPtCoords = _.reject(this.emptyPtCoords, function(coord){ return (coord[0]==downX+24)&&(coord[1]==downY+21) });
        // console.log([downX+24,downY+21])
        // console.log(JSON.stringify(this.emptyPtCoords))
        this.downX = downX+24; this.downY = downY+21;
        self.stage.addEventListener('stagemousemove',self.handleMove);
        self.stage.addEventListener('stagemouseup',self.handleUp);
    };

    this.handleMove = function(e){
        if (!e.primary) { return; } //？
        // console.log(this)
        self.meetPt();
        // self.stage.addChild(self.drawingLine);
        self.stage.update();
    };

    this.handleUp = function(event){
        if (!event.primary) { return; }
        self.stage.removeEventListener("stagemousemove",self.handleMove);
        // self.lose();
        alert('你输了！')
    };

    this.reDrawPt = function(coord,isStartPt){
        /*console.log(coord)
        var thePtSprite = _.find(this.ptSpriteArr,function(sprite){
            return (sprite.x==coord[0]) && (sprite.y==coord[1]);
        });
        console.log(thePtSprite);
        thePtSprite.gotoAndStop(0);
        if(isStartPt){
            this.pointIcon.gotoAndStop(0);  
        }else{
            
        }*/


    };

    this.meetPt = function(){
        var curPt = self.DoMeetPt(),    //当前绘图遇到的点的位置
            targetPts = self.getLinePts([self.downX,self.downY]); //当前绘图的目标点的位置的数组  
        if( !curPt){
            self.notMetDrawing();
            
        }else{
            var thePtCoord = _.find(targetPts,function(pt){
                return ptCoordEql(pt,curPt);
            });
            if(!thePtCoord){
                self.rejectMeet();
                console.log('reject')
            }else{
                self.getOne(thePtCoord);
            }
        };
    };

    this.notMetDrawing = function(){
        self.prevCoord = [self.stage.mouseX,self.stage.mouseY];
        self.drawingLine.graphics.clear().setStrokeStyle(12, 'round', 'round')
                .beginStroke('rgba(0,255,0,1)')
                .moveTo(self.downX,self.downY)
                .lineTo(self.stage.mouseX,self.stage.mouseY);
    };

    this.getOne = function(toPtCoord){
        var tLineCoord = [[this.downX,this.downY],toPtCoord];
        console.log(JSON.stringify(this.emptyLineCoords));
        var cur_index =-1;
        for (var i = 0,len=this.emptyLineCoords.length; i < len; i++) {
            var arr = this.emptyLineCoords[i];
            if( ( arr[0].eql(tLineCoord[0]) && arr[1].eql(tLineCoord[1]) ) || ( arr[1].eql(tLineCoord[0]) && arr[0].eql(tLineCoord[1]) ) ){
                cur_index = i;
            }
        };

        this.emptyLineCoords.splice(cur_index,1);
        if(this.emptyLineCoords.length == 0){
            // self.win();
            alert('你赢了！')
        }
        // console.log(JSON.stringify(tLineCoord))
        console.log(JSON.stringify(this.emptyLineCoords));
        console.log(this.emptyLineCoords.length)

        self.drawedLine.graphics.setStrokeStyle(12, 'round', 'round')
            .beginStroke('rgba(0,255,0,1)')
            .moveTo(self.downX,self.downY)
            .lineTo(toPtCoord[0],toPtCoord[1]);
    
        // self.reDrawPt( [toPtCoord[0]-24,toPtCoord[1]-21] );
        self.stage.update();
        self.downX = toPtCoord[0];
        self.downY = toPtCoord[1];

    };

    this.rejectMeet = function(){

    };
}
var tick =function(e){
    if(+new Date -game.startTimetamp  > 60*1000){
        game.tenNumSp.stop();
        game.secNumSp.stop();
        game.stage.removeChild(game.tenNumSp, game.secNumSp);
    }

    game.secNumSp.play()
    // console.log(game.secNumSp.currentFrame)
    // game.stage.update(event);
}

window.game;
preloadFn([ImgObj, AudioObj], function(queue){
    for(var attr in ImgObj){
        ImgObj[attr] = queue.getResult(ImgObj[attr]);
    }
    game = new Game(0);
});
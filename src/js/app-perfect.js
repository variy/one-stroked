	

	function ptCoordEql(arr1,arr2){
		if( (arr1.length==arr2.length) && (arr1[0]==arr2[0]) && (arr1[1]==arr2[1]) ){
			return true;
		}
		return false;
	};

	Array.prototype.eql = function(arr){
		if(this.length != arr.length)return false;
		for (var i = 0; i < arr.length; i++) {
			if(arr[i] !== this[i])return false;
		};
		return true;
	}

	//control 
	function Game(){
		this.canvas = document.getElementById("testcanvas");
		this.stage = new createjs.Stage("testcanvas");
		this.iPassed = 0;
			
		this.pass = {
			'point' : [],
			'line' :[],
			'time':-1
		};
	}
	Game.prototype.init = function(data){
		for(var attr in data){
			this.pass[attr] = data[attr];
		}

		this.preLoad();
		this.utility();
		// this.handleLoad = function(){
		// 	this.renderSite();	//画场景
		// 	this.renderPass();	//画每一关的坐标图
		// 	this.timerCount();	//倒计时开始
		// 	this.fnDrawLine();
		// };
	};

	Game.prototype.preLoad = function(){
		this.aImg = {
			bg:'img/bg.jpg',
			home:'img/home.png',
			btns:'img/control-btn.png',
			pt:'img/point.png',
			number:'img/number.png'
		};

		this.aAudio = {
			star1: 'audio/star1.ogg',
			star2: 'audio/star2.ogg',
			star3: 'audio/star3.ogg',
			main: 'audio/sm_main_music.ogg',
			start: 'audio/start_game.ogg',
			click: 'audio/click.ogg',
			fail: 'audio/fail.ogg',
			win: 'audio/win.ogg'
		}

		var self = this;
		function getFiles(){
			var files = [];
			for( var attr in self.aImg ){
				files.push(self.aImg[attr]);
			}
			for( var attr in self.aAudio){
				files.push(self.aAudio[attr]);
			}
			return files;
		}

		this.files = getFiles();

		this.queue = new createjs.LoadQueue();
		this.queue.installPlugin(createjs.Sound);

		var self = this;
		this.queue.on("complete", self.handleLoad,self);
		this.queue.on("progress", self.handleProgress,self);
		this.queue.on("error", self.handleLoadErroe,self);

		this.queue.loadManifest(self.files);
	};

	Game.prototype.handleProgress = function(e){
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
	};

	Game.prototype.handleLoad = function(){
		// debugger;
		// _.delay(this.readyGo,1000,);
		var self = this;
		this.oImg = {};
		this.oImg.bg = this.queue.getResult(self.aImg.bg);
		this.oImg.pt =  this.queue.getResult(self.aImg.pt);
		this.oImg.num = this.queue.getResult(self.aImg.number);
		this.oImg.home = this.queue.getResult(self.aImg.home);

		this.readyGo();
		
	};

	Game.prototype.readyGo = function(){
		var self = this;
		this.stage.autoClear = true;
		this.stage.removeAllChildren();

		this.soundPlay(self.aAudio.main);
		this.bg = new createjs.Bitmap(self.oImg.bg);
		this.playLink = new createjs.Bitmap(self.oImg.home);
		this.playLink.x = 120;
		this.playLink.y =80;
		this.stage.addChild(self.bg,self.playLink);
		this.stage.update();

		this.playLink.addEventListener('click',function(){
			self.stage.removeAllChildren();
			self.stage.update();
			self.gotoPlay(0);
		})
	};

	Game.prototype.gotoPlay = function(iLevel){
		this.renderSite(iLevel);	//画场景
		this.renderPass(iLevel);	//画每一关的坐标图
		this.timerCount(iLevel);	//倒计时开始
		this.fnDrawLine();
	};

	Game.prototype.soundPlay = function(tune){
		var instance = createjs.Sound.play(tune, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 1);
		if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) {
			return;
		}
	}

	Game.prototype.handleLoadErroe = function(){
		alert('error')
	}

	Game.prototype.renderSite = function(){
		var self = this;
		
		this.bg = new createjs.Bitmap(self.oImg.bg);
		this.timeTxt = new createjs.Text("时间：", "26px Arial", "#fff"); 
		this.timeTxt.x = 40;
		this.timeTxt.y = 20;

		this.iPassedIcon =  new createjs.Text("关卡：", "26px Arial", "#fff");
		this.iPassedIcon.x = 520;
		this.iPassedIcon.y = 20;
		this.iPassedIcon.textStyle = 'center'; 

		this.stage.addChild(self.bg, self.timeTxt, self.iPassedIcon);
		this.stage.update();
	};

	Game.prototype.renderPass = function(){
		var self = this;
		this.ptSpriteArr = [];
		this.lineCoords = [];
		this.staticLine = new createjs.Shape();
		this.drawingLine = new createjs.Shape();  //画出来的线,画线的位置和点的位置是有偏移的
		this.drawedLine = new createjs.Shape();		//将来过去绘制成功的线
		this.pointSpSheet = new createjs.SpriteSheet({
			'images': [self.oImg.pt], 
			'frames': {width: 48, height: 42},
			'framerate': 1
		});
		this.pointIcon = new createjs.Sprite(self.pointSpSheet);
		this.pointIcon.gotoAndStop(1);
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
		_.each(this.pass.point,function(Pts){
			this.ptCoords = this.ptCoords.concat(Pts);
		},this);

		_.each(this.ptCoords,function(coord){
			var ptIcon = this.pointIcon.clone();
			ptIcon.x = coord[0];
			ptIcon.y = coord[1];
			this.ptSpriteArr.push(ptIcon);
			this.stage.addChild(ptIcon);
		},this);

		this.stage.update();
	};

	Game.prototype.utility = function(){
		var self = this;
		this.transToCoord = function(num){
			var str = num+'';
			str = str.length==1?'0'+str:str;
			var arr = str.split('');
			var coord = self.pass.point[parseInt(arr[0])][parseInt(arr[1])];
			return coord;
		};
		
		this.getLinePts = function(ptCoord){
			var targetPtCoords = [];
			for (var i=0,len=this.emptyLineCoords.length; i<len ; i++) {
				for( var j=0,inLen=this.emptyLineCoords[i][j].length; j<inLen; j++){
					if( ptCoordEql(ptCoord,this.emptyLineCoords[i][j]) ){
						targetPtCoords.push( this.emptyLineCoords[i][inLen-1-j] );		 
					}
				}
			};

			return targetPtCoords;
		}
	}
	

	Game.prototype.timerCount = function(iLevel){
		// 倒计时的时间只会有两位数
		// ?? sprite能不能控制framerate
		var self = this;
		var avaTime = 20+'';
		var ten = parseInt(avaTime.split('')[0]),
			sec = parseInt(avaTime.split('')[1]);

		this.tenData = {
			framerate: 0.1,
			'images': [self.oImg.num], 
			'frames': {width: 28, height: 38},
			'animations': {
				'countDown':{
					'frames':[9,8,7,6,5,4,3,2,1,0]
				}
			}
		};
		this.secData = {
			framerate: 1,
			'images': [self.oImg.num], 
			'frames': {width: 28, height: 38},
			'animations': {
				'countDown':{
					'frames':[9,8,7,6,5,4,3,2,1,0]
				}
			}
		};	

		this.tenSpSheet = new createjs.SpriteSheet(self.tenData);
		this.tenNumSp = new createjs.Sprite(self.tenSpSheet,'countDown');
		this.tenNumSp.y = 20;
		this.tenNumSp.x = 120;
		this.tenNumSp.gotoAndStop(ten);
		if(this.tenNumSp.currentFrame==0){
			
		}
		this.secSpSheet = new createjs.SpriteSheet(self.secData);
		this.secNumSp = new createjs.Sprite(self.secSpSheet,'countDown');
		this.secNumSp.x = 148;
		this.secNumSp.y = 20;
		this.stage.addChild(self.tenNumSp,self.secNumSp);
			
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.addEventListener("tick", self.stage);
		this.stage.update();
		

		this.clearTimeIcons = function(){
			var self = this;
			for(var i=0; i< this.iconsArr.length;i++){
				this.stage.removeChild(self.iconsArr[i]);
			}
			this.iconsArr = [];
		}
	}

	Game.prototype.fnDrawLine = function(){
		
		
		
		this.ptCenterCoords = _.map(this.ptCoords,function(coord){
			return [coord[0]+24,coord[1]+21];
		},this);
		this.emptyPtCoords = this.ptCenterCoords;
		var self = this;

		_.each(this.ptSpriteArr,function(pt){
			pt.addEventListener('mousedown',function(e){	//为什么这里要用function包	
				self.handleDown(e);
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

		this.DoMeetPt = function(coord){
			var coord = [self.stage.mouseX,self.stage.mouseY ];
			var padding = 8;
			var target = _.find(this.ptCenterCoords,function(d){
				return  Math.sqrt( (Math.pow((coord[0]-d[0]),2 ) + Math.pow((coord[1]-d[1]),2)) )< padding;
			},this);
			return target;
		}

		this.meetPt = function(){
			var curPt = self.DoMeetPt(),	//当前绘图遇到的点的位置
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


	var game = new Game;
	game.init(data_level[0]);
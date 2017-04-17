(function(){
	var maxWidth=640,maxHeight=960;
    var currWidth=window.innerWidth;
    var currHeight=window.innerHeight;
    var scale=Math.min(currWidth/maxWidth,currHeight/maxHeight); //固定比率 变尺寸
    scale = Math.round(scale*100)/100;
    /*$("#grid").css({
        "-webkit-transform":"scale("+scale+","+scale+")",
        "-moz-transform":"scale("+scale+","+scale+")",
        "transform":"scale("+scale+","+scale+")"
    });*/
	document.querySelector("#grid").style.webkitTransform = "scale("+scale+","+scale+")";
})();
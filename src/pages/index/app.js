var canvas = document.getElementById("testcanvas");
var stage = new createjs.Stage("testcanvas");

require('../../js/preload')(function(){
    alert(1)
});
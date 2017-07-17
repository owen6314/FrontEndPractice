var BGCanvas;
var BGContext;
var ballCanvas;
var ballContext;
window.smove = {};
smove.startGame = function()
{
	smove.init();
}
smove.init = function()
{
	BGCanvas = document.getElementById("background");
	BGContext = BGCanvas.getContext("2d");
	BGContext.fillStyle = "#00fe00";
	BGContext.fillRect(100,100,100,100);
}

smove.startGame();
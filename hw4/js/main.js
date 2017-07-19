var BGCanvas;
var BGContext;
var mapCanvas;
var mapContext;
var contentCanvas;
var contentContext;
//绘制地图时用到的x与y坐标的数组
var xArray = [0,90,180];
var yArray = [0,50,100];
//白色小球的球心所在位置的数组
window.smove = {};
smove.startGame = function()
{
	smove.init();
}
smove.init = function()
{
	BGCanvas = document.getElementById("background");
	BGContext = BGCanvas.getContext("2d");
	//绘制背景
	//背景的宽度与高度
	var BGWid, BGHei;
	BGWid = BGCanvas.width;
	BGHei = BGCanvas.height;
	var bg = BGContext.createLinearGradient(0,0,BGWid,BGHei);
	bg.addColorStop(0,"#0000ff");
	bg.addColorStop(1,"#303030");
	BGContext.fillStyle = bg;
	BGContext.rect(0,0,BGWid,BGHei);
	BGContext.fill();
	/*
	//绘制矩形游戏区域
	var disWid, disHeight, disX,disY,disR;
	disX = 0.25 * BGWid;
	disY = 0.25 * BGHei;
	disWid = 0.25 * BGWid;
	disHeight = disWid;
	disR = 0.25 * disWid;
	BGContext.strokeStyle = "#ffffff"
	BGContext.roundRect(disX,disY,disWid,disHeight,disR).stroke();*/

	//绘制圆角矩形游戏区域
	mapCanvas = document.getElementById("map");
	mapContext = mapCanvas.getContext("2d");
	var disWid, disHeight, disX,disY,disR;
	disWid = 270;
	disHeight = 150;
	disX = 0;
	disY = disX;
	disR = 25;
	mapContext.strokeStyle = "#ffffff";
	mapContext.lineWidth = 1;
	mapContext.roundRect(disX,disY,disWid,disHeight,disR).stroke();
	for(let i = 0; i < 2; i++)
	{
		mapContext.moveTo(0,yArray[i + 1]);
		mapContext.lineTo(disWid, yArray[i + 1]);
		mapContext.lineWidth = 1;
		mapContext.strokeStyle = "#FFFFFF";
		mapContext.stroke();
	}
	for(let i = 0; i < 2; i++)
	{
		mapContext.moveTo(xArray[i + 1], 0);
		mapContext.lineTo(xArray[i + 1], disHeight);
		mapContext.lineWidth = 1;
		mapContext.strokeStyle = "#FFFFFF";
		mapContext.stroke();
	}
	//一条直线
	/*
	BGContext.moveTo(0,0);
	BGContext.lineTo(100,100);
	BGContext.lineWidth = 2;
	BGContext.strokeStyle = "#F5270B"
	BGContext.stroke();*/

}

smove.startGame();
var BGCanvas;
var BGContext;
var mapCanvas;
var mapContext;
var disWidth, disHeight, disX,disY,disR;
//球心所在位置的数组
var centerArray_x = [];
var centerArray_y = [];
var diffframetime,lastframetime;
var whiteBall;
var keysDown = {};

window.smove = {};
smove.startGame = function()
{
	smove.init();
	smove.loop();
}
smove.init = function()
{
	//背景和游戏区域的canvas
	BGCanvas = document.getElementById("outer");
	BGContext = BGCanvas.getContext("2d");
	mapCanvas = document.getElementById("inner");
	mapContext = mapCanvas.getContext("2d");
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

	//分数、历史最高分数

	//星星
	//以下为mapCanvas绘制
	//绘制圆角矩形游戏区域
	disWidth = mapCanvas.width;
	disHeight = mapCanvas.height;
	disX = 0;
	disY = disX;
	disR = 40;
	drawMap();
	//球心和方块中心所在数组
	centerArray_x.push(disWidth / 6);
	centerArray_x.push(disWidth / 2);
	centerArray_x.push(disWidth * 5 / 6);
	centerArray_y.push(disHeight / 6);
	centerArray_y.push(disHeight / 2);
	centerArray_y.push(disHeight * 5 / 6);
	//绘制白色小球，小球初始位置在中间格
	whiteBall = new whiteBallObject();
	whiteBall.init();
	whiteBall.drawWhiteBall();
}
smove.loop = function()
{
	requestAnimationFrame(smove.loop);
	var now = Date.now();    //1970 00:00:00 到现在的毫秒数
	diffframetime = now - lastframetime;
	lastframetime = now;
	mapContext.clearRect(0,0,disWidth,disHeight);
	drawMap();
	whiteBall.updateWhiteBall();
	whiteBall.drawWhiteBall();
}


//各种物体类
//小球的row和column都是按照0，1，2进行编排的
var whiteBallObject = function()
{
	this.r = 40;
	this.row = 0;
	this.column = 0;
	//球心坐标
	this.x;
	this.y;
	this.speed; //白球的运动速度
}
whiteBallObject.prototype.init = function()
{
	this.row = 1;
	this.column = 1;
	this.x = centerArray_x[this.column];
	this.y = centerArray_y[this.row];
	this.speed = 100;
}
whiteBallObject.prototype.drawWhiteBall = function()
{
	drawCircle(mapContext,this.x,this.y,this.r);
}
whiteBallObject.prototype.updateWhiteBall = function()
{
	if (37 in keysDown) 
	{ //←
        if(this.column !== 0)
        {
        	if(this.x > centerArray_x[this.column - 1])
        	{
        		this.x -= this.speed;
        		if(this.x <= centerArray_x[this.column - 1])
        		{
        			this.x = centerArray_x[this.column - 1];
        			this.column--;
        			delete keysDown[37];
        		}
        	}
        }
    }
	if (38 in keysDown) 
	{ //↑
		if(this.row !== 0)
		{
			if(this.y > centerArray_y[this.row - 1])
        	{
        		this.y -= this.speed;
        		if(this.y <= centerArray_y[this.row - 1])
        		{
        			this.y = centerArray_y[this.row - 1];
        			this.row--;
        			delete keysDown[38];
        		}
        	}
        }
    }
    if (39 in keysDown) 
    {//→
        if(this.column !== 2)
		{
			if(this.x < centerArray_x[this.column + 1])
        	{
        		this.x += this.speed;
        		if(this.x >= centerArray_x[this.column + 1])
        		{
        			this.x = centerArray_x[this.column + 1];
        			this.column++;
        			delete keysDown[39];
        		}
        	}
        }
    }
    
    if (40 in keysDown) 
    { //↓
       	if(this.row !== 2)
		{
			if(this.y < centerArray_y[this.row + 1])
        	{
        		this.y += this.speed;
        		if(this.y >= centerArray_y[this.row + 1])
        		{
        			this.y = centerArray_y[this.row + 1];
        			this.row++;
        			delete keysDown[40];
        		}
        	}
        }
    }
}

//键盘输入
addEventListener("keydown", function (e) 
{
	delete keysDown[37];
	delete keysDown[38];
	delete keysDown[39];
	delete keysDown[40];
    keysDown[e.keyCode] = true;
}, false);


smove.startGame();
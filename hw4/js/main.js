var BGCanvas;
var BGContext;
var mapCanvas;
var mapContext;
//九宫格的相关参数
var disWidth, disHeight, disX, disY, disR;

//格子中心所在位置的数组
var centerArray_x = [];
var centerArray_y = [];
var diffframetime,lastframetime;
var whiteBall,star;
var score; 
//记录按键操作
var keysDown = {};
var bgMusic,getStarSound,nextLevelSound;

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
	//播放与加载音乐
	smove.loadSounds();
	//绘制背景
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
	score = 0;
	BGContext.font="5px Times New Roman";
	BGContext.fillStyle = "white";
	BGContext.fillText("BEST:",20,130);
	BGContext.font = "20px Microsoft YaHei";
	BGContext.fillText(score, 20,20);
	//背景中星星

	//mapCanvas绘制
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
	//绘制奖励的星星
	star = new starObject();
	star.init();
	star.drawStar();
}
smove.loadSounds = function()
{
	bgMusic = new Audio();
	bgMusic.src = 'sound/bg.mp3';
	bgMusic.play();
	getStarSound = new Audio();
	getStarSound.src = 'sound/get.wav';
	getStarSound.load();
	nextLevelSound = new Audio();
	nextLevelSound.src = 'sound/next.wav';
	nextLevelSound.load();
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
	if(whiteBall.column === star.column && whiteBall.row === star.row)
	{
		smove.getStar();
	}
	star.rotate();
	star.drawStar();
}
smove.getStar = function()
{
	score++;
	if(score % 10 !== 0)
	{
		getStarSound.currentTime = 0;
		getStarSound.play();
	}
	else
	{
		nextLevelSound.currentTime = 0;
		nextLevelSound.play();
	}
	star.reborn();
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
	this.isNormal; //按键表现是否正常
	this.color;
}
whiteBallObject.prototype.init = function()
{
	this.row = 1;
	this.column = 1;
	this.x = centerArray_x[this.column];
	this.y = centerArray_y[this.row];
	this.speed = 100;
	this.isNormal = true;
	this.color = "white";
}
whiteBallObject.prototype.drawWhiteBall = function()
{
	drawCircle(mapContext,this.x,this.y,this.r,this.color);
}
whiteBallObject.prototype.updateWhiteBall = function()
{
	if(this.isNormal)
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
	//反向操作的情况
	else
	{
		if (39 in keysDown) 
		{ //→
	        if(this.column !== 0)
	        {
	        	if(this.x > centerArray_x[this.column - 1])
	        	{
	        		this.x -= this.speed;
	        		if(this.x <= centerArray_x[this.column - 1])
	        		{
	        			this.x = centerArray_x[this.column - 1];
	        			this.column--;
	        			delete keysDown[39];
	        		}
	        	}
	        }
	    }
		if (40 in keysDown) 
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
	        			delete keysDown[40];
	        		}
	        	}
	        }
	    }
	    if (37 in keysDown) //←
	    {
	        if(this.column !== 2)
			{
				if(this.x < centerArray_x[this.column + 1])
	        	{
	        		this.x += this.speed;
	        		if(this.x >= centerArray_x[this.column + 1])
	        		{
	        			this.x = centerArray_x[this.column + 1];
	        			this.column++;
	        			delete keysDown[37];
	        		}
	        	}
	        }
	    }
	    
	    if (38 in keysDown) 
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
	        			delete keysDown[38];
	        		}
	        	}
	        }
	    }
	}
}

//星星类
var starObject = function()
{
	this.column = 0;
	this.row = 0;
	this.color;
	this.rot = 0;
}
starObject.prototype.init = function()
{
	this.column = 0;
	this.row = 0;
	if(score % 10 !== 9)
		this.color = "yellow";
	else
		this.color = "pink";
	this.rot = 0;
}
starObject.prototype.rotate = function()
{
	this.rot = (this.rot + 1) % 72;
}
starObject.prototype.reborn = function()
{
	let tcolumn = Math.floor(Math.random() * 3);
	let trow = Math.floor(Math.random() * 3);
	while(tcolumn === this.column && trow === this.row)
	{
		tcolumn = Math.floor(Math.random() * 3);
		trow = Math.floor(Math.random() * 3);
	}
	this.column = tcolumn;
	this.row = trow;
	if(score % 10 !== 9)
		this.color = "yellow";
	else
		this.color = "pink";
	this.rot = 0;
}
starObject.prototype.drawStar = function()
{
	drawFilledStar(mapContext,centerArray_y[this.column],centerArray_x[this.row],10,20,this.rot,this.color);
}
//黑色球类型
var blackBallObject = function()
{
	this.num;
	this.x = [];
	this.y = [];
	this.r = 50;
	this.speed = [];
	this.type = []; //黑球的运动方向：1：左->右 2:右->左 3:上->下 4:下->上
	this.row = [];
	this.column = [];
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
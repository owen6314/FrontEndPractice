var BGCanvas,BGContext;
var mapCanvas,mapContext;
//背景
var BGGraident;
//背景与九宫格的相关参数
var BGWidth, BGHeight;
var mapWidth, mapHeight;
var disWidth, disHeight, disX, disY, disR;

//格子中心所在位置的数组(相对mapCanvas而言)
var centerArray_x = [];
var centerArray_y = [];
var diffframetime,lastframetime;
var whiteBall,star,blackBalls;
var score,bestScore = 0; 
var level = 1;
//记录按键操作
var keysDown = {};
var bgMusic,getStarSound,nextLevelSound;
//计时器,用于产生黑球
var timeRecorder;

//是否暂停
var isStopped;
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
	//绘制背景与地图
	BGWidth = BGCanvas.width;
	BGHeight = BGCanvas.height;
	mapWidth = mapCanvas.width;
	mapHeight = mapCanvas.height;
	BGContext.clearRect(0,0,BGWidth,BGHeight);
	mapContext.clearRect(0,0,mapWidth,mapHeight);
	//BGGradient = BGContext.createLinearGradient(0,0,BGWidth,BGHeight);
	//BGGradient.addColorStop(0,"#0000ff");
	//BGGradient.addColorStop(1,"#303030");
	BGContext.fillStyle = "red";
	BGContext.rect(0,0,BGWidth,BGHeight);
	BGContext.fill();
	//背景中星星

	//以下为使用mapContext
	mapContext.fillStyle = "black";
	mapContext.rect(0,0,mapWidth, mapHeight);
	mapContext.fill();
	//绘制地图
	disWidth = mapCanvas.width / 2;
	disHeight = mapCanvas.height / 2;
	disX = disWidth / 2;
	disY = disHeight / 2;
	disR = 40;
	drawMap();
	//球心和方块中心所在数组
	centerArray_x.push(disWidth / 6 + disX);
	centerArray_x.push(disWidth / 2 + disX);
	centerArray_x.push(disWidth * 5 / 6 + disX);
	centerArray_y.push(disHeight / 6 + disY);
	centerArray_y.push(disHeight / 2 + disY);
	centerArray_y.push(disHeight * 5 / 6 + disY);
	//分数、历史最高分数(用mapCanvas绘制)
	score = 0;
	if(document.cookie.length > 0)
	{
		console.info(">0");
		let n = document.cookie.indexOf("=");
		bestScore = unescape(document.cookie.substring(n + 1));
	}
	drawScore();

	//isStopped用于暂停的处理（目前还有问题）
	isStopped = false;
	//绘制白色小球，小球初始位置在中间格
	whiteBall = new whiteBallObject();
	whiteBall.init();
	whiteBall.drawWhiteBall();
	//绘制星星
	star = new starObject();
	star.init();
	star.drawStar();
	//绘制黑球
	blackBalls = new blackBallObject();
	blackBalls.init();

	//计时器,levelup的时候要重新计时
	timeRecorder = Date.now();
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
	if(!isStopped)
	{
		requestAnimationFrame(smove.loop);
		var now = Date.now();    //1970 00:00:00 到现在的毫秒数
		diffframetime = now - lastframetime;
		lastframetime = now;
		//重新绘制地图
		mapContext.clearRect(0,0,mapWidth,mapHeight);
		drawMap();
		drawScore();
		whiteBall.updateWhiteBall();
		whiteBall.drawWhiteBall();
		if(whiteBall.column === star.column && whiteBall.row === star.row)
		{
			smove.getStar();
		}
		star.rotate();
		star.drawStar();
		//循环中更新黑球
		smove.generateBlackBall();
		blackBalls.updateBlackBall();
		blackBalls.drawBlackBall();
		if(smove.isCaught())
		{
			smove.gameOver();
		}
		if(score > 0 && score % 20 === 0)
		{
			smove.levelUp();
		}
	}
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
smove.generateBlackBall = function()
{
	switch(level)
	{
		case 1:
			if(Date.now() - timeRecorder >= 3000)
			{
				timeRecorder = Date.now();
				blackBalls.born();
			}
			break;
		case 2:
			if(Date.now() - timeRecorder >= 1500)
			{
				timeRecorder = Date.now();
				blackBalls.born();
			}
			break;
	}
}
//判定白球与黑球是否相撞
smove.isCaught = function()
{
	for(let i = 0; i < blackBalls.num; i++)
	{
		if(blackBalls.isAlive[i])
		{
			if(Math.abs(blackBalls.x[i] - whiteBall.x) <= blackBalls.r + whiteBall.r && blackBalls.y[i] === whiteBall.y || Math.abs(blackBalls.y[i] - whiteBall.y) <= blackBalls.r + whiteBall.r && blackBalls.x[i] === whiteBall.x)
				return true;
		}
	}
	return false;
}
smove.levelUp = function()
{
	if(level === 1)
	{
		timeRecorder = Date.now();
		level++;
	}
}
//在gameOver函数中更改cookie
smove.gameOver = function()
{
	console.info("!");
	var oldScore = bestScore;
	if(oldScore < score)
	{
		oldScore = score;
	}
	console.info(oldScore);
	document.cookie = "best=" + escape(oldScore);
	console.info(document.cookie);
	bgMusic.src = "";
	isStopped = true;
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
	this.num = 10;
	this.x = [];
	this.y = [];
	this.r = 50;
	this.speed = [];
	this.type = []; //黑球的运动方向：1：左->右 2:右->左 3:上->下 4:下->上
	this.row = [];
	this.column = [];
	this.isAlive = []; //是否存在于界面，只有存在于界面中的黑球才会被绘制
	this.color = "red";
}
blackBallObject.prototype.init = function()
{
	for(let i = 0; i < this.num; i++)
	{
		this.isAlive[i] = false;
	}
}
blackBallObject.prototype.born = function()
{
	if(level === 1 || level === 2)
	{
		for(let i = 0; i < this.num; i++)
		{
			if(!this.isAlive[i])
			{
				this.isAlive[i] = true;
				this.speed[i] = 4;
				this.type[i] = Math.floor(Math.random() * 4) + 1;
				this.column[i] = Math.floor(Math.random() * 3);
				this.row[i] = Math.floor(Math.random() * 3);
				switch(this.type[i])
				{
					case 1:
						this.x[i] = 0;
						this.y[i] = centerArray_y[this.row[i]];
						break;
					case 2:
						this.x[i] = mapWidth;
						this.y[i] = centerArray_y[this.row[i]];
						break;
					case 3:
						this.x[i] = centerArray_x[this.column[i]];
						this.y[i] = 0;
						break;
					case 4:
						this.x[i] = centerArray_x[this.column[i]];
						this.y[i] = mapHeight;
						break;
				}
				break;
			}
		}
	}

}
//更新位置，将离开屏幕区域的黑球设定为死亡
blackBallObject.prototype.updateBlackBall = function()
{
	for(let i = 0; i < this.num; i++)
	{
		if(this.isAlive[i])
		{
			switch(this.type[i])
			{
				case 1:
					this.x[i] += this.speed[i];
					break;
				case 2:
					this.x[i] -= this.speed[i];
					break;
				case 3:
					this.y[i] += this.speed[i];
					break;
				case 4:
					this.y[i] -= this.speed[i];
					break		
			}
			//黑球离开屏幕范围
			if(this.x[i] < 0 || this.x[i] > mapWidth || this.y[i] < 0 || this.y[i] > mapHeight)
			{
				this.isAlive[i] = false;
			}
		}
	}
}
blackBallObject.prototype.drawBlackBall = function()
{
	for(let i = 0; i < this.num; i++)
	{
		if(this.isAlive[i])
		{
			drawCircle(mapContext,this.x[i],this.y[i],this.r,this.color);
		}
	}
}

//键盘输入，空格的keyCode是32，
addEventListener("keydown", function (e) 
{
	delete keysDown[37];
	delete keysDown[38];
	delete keysDown[39];
	delete keysDown[40];
	if(e.keyCode === 13 && isStopped === true)
	{
		smove.startGame();
	}
    keysDown[e.keyCode] = true;
}, false);

smove.startGame();
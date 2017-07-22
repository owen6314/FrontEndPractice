var BGCanvas,BGContext;
var BGWidth, BGHeight;
var BGGraident;
var BGImage;
//背景与游戏画布参数
var mapCanvas,mapContext;
var mapWidth, mapHeight;
var oldmapWidth; //判断浏览器大小是否发生改变
//九宫格相关参数
var disWidth, disHeight, disX, disY, disR;
//格子中心所在位置的数组(相对mapCanvas而言)
var centerArray_x = [];
var centerArray_y = [];
//物体与分数
var whiteBall,star,blackBalls;
var whiteBallPart; //游戏结束时的白球碎片
var score,bestScore = 0; 
var level;
//记录按键操作
var keysDown = {};
//音乐
var bgMusic,getStarSound,nextLevelSound,loseSound;
//计时器,用于产生黑球
var timeRecorder;
var isStarted = false;
var isStopped = false;
var isPaused = false;
var isCongratulating;
//每个格的大小
var gridSize;
//九宫格到一维数组的映射：row = n / 3 column = n % 3
var isPlusOne = [];
//开始界面动画速度
var speedX,speedY;
//移动端支持
var isMobile;
var touchStartX, touchStartY;
//移动端防止touchmove多次
var ableToMove;
window.smove = {};

smove.prepare = function()
{
	//背景和游戏区域的canvas
	BGCanvas = document.getElementById("outer");
	BGContext = BGCanvas.getContext("2d");
	//播放与加载音乐
	smove.loadSounds();
	drawBackground();
	mapCanvas = document.getElementById("inner");
	mapContext = mapCanvas.getContext("2d");
	//mapWidth和mapHeight是内部正方形画布的大小，所有的游戏内容都在这里
	mapWidth = jQuery(window).get(0).innerWidth;
	mapHeight = jQuery(window).get(0).innerHeight;
	mapWidth = mapWidth > mapHeight ? mapHeight : mapWidth;
	mapHeight = mapWidth;
	oldmapWidth = mapWidth;
	mapCanvas.width = mapWidth;
	mapCanvas.height = mapHeight;
	drawMap();
	//分数、历史最高分数(用mapCanvas绘制)
	score = 0;
	level = 0;
	if(document.cookie.length > 0)
	{
		let n = document.cookie.indexOf("=");
		bestScore = unescape(document.cookie.substring(n + 1));
	}
	drawScore();
	drawTips();
	//绘制白色小球，开始游戏后会移动到中间格
	whiteBall = new whiteBallObject();
	whiteBall.init();
	whiteBall.drawWhiteBall();
	
	star = new starObject();
	star.init();
	star.drawStar();
	smove.prepareLoop();
}
smove.prepareLoop = function()
{
	if(!isStarted)
	{
		requestAnimationFrame(smove.prepareLoop);
		//局部渲染
		mapContext.clearRect(whiteBall.x - whiteBall.r - 1,whiteBall.y - whiteBall.r - 1,2 *whiteBall.r + 2,2 *whiteBall.r + 2);
		drawScore();
		whiteBall.preUpdateWhiteBall();
		whiteBall.drawWhiteBall();
	}
}
smove.startGame = function()
{
	isStarted = true;
	smove.preAnimation();
	smove.gameInit();
	smove.gameLoop();
}
//白球从当前位置移动到九宫格中心
smove.preAnimation = function()
{
	var distanceX;
	var distanceY;
	distanceX = Math.abs(whiteBall.x - centerArray_x[1]);
	distanceY = Math.abs(whiteBall.y - centerArray_y[1]);
	speedX = distanceX / 20;
	speedY = distanceY / 20;
	var timer = setInterval(function(){
	if(whiteBall.x > centerArray_x[1])
	{
		whiteBall.x -= speedX;
		if(whiteBall.x <= centerArray_x[1])
			whiteBall.x = centerArray_x[1];
	}
	else if(whiteBall.x < centerArray_x[1])
	{
		whiteBall.x += speedX;
		if(whiteBall.x >= centerArray_x[1])
			whiteBall.x = centerArray_x[1];
	}
	if(whiteBall.y > centerArray_y[1])
	{
		whiteBall.y -= speedY;
		if(whiteBall.y <= centerArray_y[1])
			whiteBall.y = centerArray_y[1];
	}
	else if(whiteBall.y < centerArray_y[1])
	{
		whiteBall.y += speedY;
		if(whiteBall.y >= centerArray_y[1])
			whiteBall.y = centerArray_y[1];
	}
	mapContext.clearRect(0,0,mapWidth,mapHeight);
	drawMap();
	drawScore();
	whiteBall.drawWhiteBall();
	star.rotate();
	star.drawStar();
	if(Math.abs(whiteBall.x - centerArray_x[1]) <= 1 && Math.abs(whiteBall.y - centerArray_y[1]) <= 1)
	{
		clearInterval(timer);
		smove.gameInit();
	}
	},25);
}

smove.gameInit = function()
{
	drawBackground();
	score = 0;
	level = 0;
	if(document.cookie.length > 0)
	{
		let n = document.cookie.indexOf("=");
		bestScore = unescape(document.cookie.substring(n + 1));
	}
	drawScore();
	//isStopped用于判断游戏结束
	isStopped = false;
	isPaused = false;
	isCongratulating = false;
	for(let i = 0; i < 9; i++)
	{
		isPlusOne[i] = false;
	}
	//重新设置白球
	whiteBall.row = 1;
	whiteBall.column = 1;
	whiteBall.speed = gridSize;
	whiteBall.x = centerArray_x[whiteBall.column];
	whiteBall.y = centerArray_y[whiteBall.row];
	whiteBall.drawWhiteBall();
	//重新设置星星
	star.init();
	star.drawStar();
	//绘制黑球
	blackBalls = new blackBallObject();
	blackBalls.init();
	whiteBallPart = new whiteBallPartObject();
	//计时器,levelup的时候要重新计时
	timeRecorder = Date.now();
	smove.gameLoop();
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
	loseSound = new Audio();
	loseSound.src = 'sound/scream.mp3';
	loseSound.load();

}
smove.gameLoop = function()
{
	if(!isStopped && !isPaused)
	{
		requestAnimationFrame(smove.gameLoop);
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
		drawTips();
		for(let i = 0; i < 9; i++)
		{
			if(isPlusOne[i])
			{
				drawPlusOne(i);
			}
		}
		if(isCongratulating)
		{
			drawCongratulating();
		}
		if(smove.isCaught())
		{
			smove.gameOver();
		}
		if(score === 0 && level === 0 || score === 10 && level === 1 || score === 20 && level === 2||score === 30 && level === 3||score === 40 && level === 4 || score === 50 && level === 5)
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
	var starPosNum = star.row * 3 + star.column;
	isPlusOne[starPosNum] = true;
	//最后一个参数作为函数参数
	star.reborn();
	var timer = setTimeout(function(i){isPlusOne[i] = false;},250,starPosNum);
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
		case 3:
			if(Date.now() - timeRecorder >= 1500)
			{
				timeRecorder = Date.now();
				blackBalls.born();
			}
			break;
		case 4:
			if(Date.now() - timeRecorder >= 750)
			{
				timeRecorder = Date.now();
				blackBalls.born();
			}
			break;
		case 5:
			if(Date.now() - timeRecorder >= 750)
			{
				timeRecorder = Date.now();
				blackBalls.born();
			}
			break;
		case 6:
			if(Date.now() - timeRecorder >= 1000)
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
			if(blackBalls.type[i] >= 1 && blackBalls.type[i] <= 4)
			{
				if(Math.abs(blackBalls.x[i] - whiteBall.x) <= blackBalls.r + whiteBall.r && blackBalls.y[i] === whiteBall.y || Math.abs(blackBalls.y[i] - whiteBall.y) <= blackBalls.r + whiteBall.r && blackBalls.x[i] === whiteBall.x)
					return true;
			}
			else
			{
				let squareX = (blackBalls.x[i] - whiteBall.x) * (blackBalls.x[i] - whiteBall.x);
				let squareY = (blackBalls.y[i] - whiteBall.y) * (blackBalls.y[i] - whiteBall.y);
				let squareR = (blackBalls.r + whiteBall.r) * (blackBalls.r + whiteBall.r);
				if(squareR > squareX + squareY)
					return true;
			}
		}
	}
	return false;
}
smove.levelUp = function()
{
	if(level <= 6)
	{
		timeRecorder = Date.now();
		level++;
	}
	if(level !== 1)
	{
		isCongratulating = true;
		var timer = setTimeout("isCongratulating=false",1000);
	}

	//过关动画,改变背景颜色
	var tempGradient; //不同关卡使用不同渐变
	switch(level)
	{
		case 1:
			tempGradient = BGContext.createLinearGradient(0,0,BGWidth,BGHeight);
			tempGradient.addColorStop(0,"red");
			tempGradient.addColorStop(1,"orange");
			break;
		case 2:
			tempGradient = BGContext.createLinearGradient(0,0,BGWidth,BGHeight);
			tempGradient.addColorStop(0,"orange");
			tempGradient.addColorStop(1,"rgb(128,128,0)");
			break;
		case 3:
			tempGradient = BGContext.createLinearGradient(0,0,BGWidth,BGHeight);
			tempGradient.addColorStop(0,"yellow");
			tempGradient.addColorStop(1,"green");
			break;
		case 4:
			tempGradient = BGContext.createLinearGradient(0,0,BGWidth,BGHeight);
			tempGradient.addColorStop(0,"green");
			tempGradient.addColorStop(1,"rgb(0,127,255)");
			break;
		case 5:
			tempGradient = BGContext.createLinearGradient(0,0,BGWidth,BGHeight);
			tempGradient.addColorStop(0,"rgb(0,127,255)");
			tempGradient.addColorStop(1,"blue");
			break;
		case 6:
			tempGradient = BGContext.createLinearGradient(0,0,BGWidth,BGHeight);
			tempGradient.addColorStop(0,"blue");
			tempGradient.addColorStop(1,"purple");
			break;
	}
	let widthOnce = BGWidth / 50;
	let counter = 0;
	BGContext.fillStyle = tempGradient;
	var bgChangeTimer = setInterval(function(){
	//局部渲染
	BGContext.clearRect(counter * widthOnce, 0, widthOnce, BGHeight);
	BGContext.fillRect(counter * widthOnce - 10, 0, widthOnce + 10, BGHeight);
	counter++;
	if(counter === 50)
	{
		clearInterval(bgChangeTimer);
	}
	},30);
	
}

//在gameOver函数中更改cookie
smove.gameOver = function()
{	
	bgMusic.src = "";
	loseSound.play();
	isStopped = true;
	mapContext.clearRect(0,0,mapWidth,mapHeight);
	drawMap();
	drawScore();
	whiteBall.drawWhiteBall();
	star.drawStar();
	blackBalls.drawBlackBall();
	drawTips();
	//最高分数的处理
	var oldScore = bestScore;
	if(oldScore < score)
	{
		oldScore = score;
	}
	if(score > bestScore)
	{
		bestScore = score;
	}
	document.cookie = "best=" + escape(oldScore);
	whiteBallPart.born();
	smove.gameOverLoop();
}
smove.gameOverLoop = function()
{
	if(isStopped)
	{
		requestAnimationFrame(smove.gameOverLoop);
		mapContext.clearRect(0,0,mapWidth,mapHeight);
		drawMap();
		drawScore();
		drawTips();
		whiteBallPart.updateWhiteBallPart();
		whiteBallPart.drawWhiteBallPart();
		star.rotate();
		star.drawStar();
		blackBalls.updateBlackBall();
		blackBalls.drawBlackBall();
	}
}
//各种物体类
//小球的row和column都是按照0，1，2进行编排的
var whiteBallObject = function()
{
	this.r;
	this.row;
	this.column;
	//球心坐标
	this.x;
	this.y;
	this.speed; //白球的运动速度
	this.isNormal; //按键表现是否正常
	this.isDead;
	this.status; //1,2,3,4分别代表在下，右，上，左环绕
	this.color;
}
whiteBallObject.prototype.init = function()
{
	this.row = -1;
	this.column = 1;
	this.status = 1;
	this.x = centerArray_x[this.column];
	this.y = disY + disHeight + gridSize / 2;
	this.r = gridSize / 4;
	this.speed = 5;
	this.isNormal = true;
	this.color = "white";
}

whiteBallObject.prototype.drawWhiteBall = function()
{
	drawCircle(mapContext,this.x,this.y,this.r,this.color);
}
whiteBallObject.prototype.preUpdateWhiteBall = function()
{
	switch(this.status)
	{
		case 1:
			this.x += this.speed;
			if(this.x >= disX + disWidth + gridSize / 2)
			{
				this.x = disX + disWidth + gridSize / 2;
				this.status = 2;
			}
			break;
		case 2:
			this.y -= this.speed;
			if(this.y <= disY - gridSize / 2)
			{
				this.y = disY - gridSize / 2;
				this.status = 3;
			}
			break;
		case 3:
			this.x -= this.speed;
			if(this.x <= disX - gridSize / 2)
			{
				this.x = disX - gridSize / 2;
				this.status = 4;
			}
			break;
		case 4:
			this.y += this.speed;
			if(this.y >= disY + disHeight + gridSize / 2)
			{
				this.y = disY + disHeight + gridSize / 2;
				this.status = 1;
			}
			break;
	}
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
	drawFilledStar(mapContext,centerArray_y[this.column],centerArray_x[this.row],gridSize / 16,gridSize / 8,this.rot,this.color);
}
//黑色球类型
var blackBallObject = function()
{
	this.num = 15;
	this.x = [];
	this.y = [];
	this.r;
	this.speed = [];
	this.type = []; //黑球的运动方向：1：左->右 2:右->左 3:上->下 4:下->上 5:左下-> 6左上-> 7右下-> 8右上->
	this.row = [];
	this.column = [];
	this.isAlive = []; //是否存在于界面，只有存在于界面中的黑球才会被绘制
	this.color = "#303030";
}
blackBallObject.prototype.init = function()
{
	this.r = gridSize / 3;
	for(let i = 0; i < this.num; i++)
	{
		this.isAlive[i] = false;
		this.speed[i] = gridSize / 25;
	}
}
blackBallObject.prototype.born = function()
{
	if(level === 1 || level === 2 || level === 4)
	{
		for(let i = 0; i < this.num; i++)
		{
			if(!this.isAlive[i])
			{
				this.isAlive[i] = true;
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
	else if(level === 3)
	{
		let num = 0;
		for(let i = 0; i < this.num; i++)
		{
			if(!this.isAlive[i])
			{
				this.isAlive[i] = true;
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
				num++;
				if(num === 2)
					break;
			}
		}
	}

	else if(level === 5)
	{
		for(let i = 0; i < this.num; i++)
		{
			if(!this.isAlive[i])
			{
				this.isAlive[i] = true;
				this.type[i] = Math.floor(Math.random() * 4) + 5;
				switch(this.type[i])
				{
					case 5:
						this.x[i] = 0;
						this.y[i] = mapHeight;
						break;
					case 6:
						this.x[i] = 0;
						this.y[i] = 0;
						break;
					case 7:
						this.x[i] = mapWidth;
						this.y[i] = mapHeight;
						break;
					case 8:
						this.x[i] = mapWidth;
						this.y[i] = 0;
						break;
				}
			}
			break;
		}
	}
	else if(level === 6)
	{
		let num = 0;
		for(let i = 0; i < this.num; i++)
		{
			if(!this.isAlive[i])
			{
				this.isAlive[i] = true;
				this.type[i] = Math.floor(Math.random() * 8) + 1;
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
					case 5:
						this.x[i] = 0;
						this.y[i] = mapHeight;
						break;
					case 6:
						this.x[i] = 0;
						this.y[i] = 0;
						break;
					case 7:
						this.x[i] = mapWidth;
						this.y[i] = mapHeight;
						break;
					case 8:
						this.x[i] = mapWidth;
						this.y[i] = 0;
						break;
				}
				num++;
				if(num === 2)
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
				case 5:
					this.x[i] += this.speed[i];
					this.y[i] -= this.speed[i];
					break;		
				case 6:
					this.x[i] += this.speed[i];
					this.y[i] += this.speed[i];
					break;		
				case 7:
					this.x[i] -= this.speed[i];
					this.y[i] -= this.speed[i];
					break;		
				case 8:
					this.x[i] -= this.speed[i];
					this.y[i] += this.speed[i];
					break;		
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
//type:0左上，1左下，2右上，3右下
var whiteBallPartObject = function()
{
	this.num = 4;
	this.r;
	this.isAlive = [];
	this.x = [];
	this.y = [];
	this.speed = [];

}
whiteBallPartObject.prototype.born = function()
{
	this.r = whiteBall.r;
	for(let i = 0; i < this.num; i++)
	{
		this.isAlive[i] = true;
		this.x[i] = whiteBall.x;
		this.y[i] = whiteBall.y;
		this.speed[i] = gridSize / (i * 10 + 30);
	}

}
whiteBallPartObject.prototype.updateWhiteBallPart = function()
{
	for(let i = 0; i < this.num; i++)
	{
		if(this.isAlive[i])
		{
			switch(i)
			{
				case 0:
					this.x[i] -= this.speed[i];
					this.y[i] -= this.speed[i];
					break;
				case 1:
					this.x[i] -= this.speed[i];
					this.y[i] += this.speed[i];
					break;
				case 2:
					this.x[i] += this.speed[i];
					this.y[i] -= this.speed[i];
					break;
				case 3:
					this.x[i] += this.speed[i];
					this.y[i] += this.speed[i];
					break;
			}
		}
		//死亡
		if(this.x[i] < 0 || this.x[i] > mapWidth || this.y[i] < 0 || this.y[i] > mapHeight)
		{
			this.isAlive[i] = false;
		}
	}
}
whiteBallPartObject.prototype.drawWhiteBallPart = function()
{
	for(let i = 0; i < this.num; i++)
	{
		if(this.isAlive[i])
		{
			let deg = Math.PI / 180;
			switch(i)
			{
				//type:0左上，1左下，2右上，3右下
				case 0:
					mapContext.sector(this.x[i],this.y[i],this.r, 108 * deg, 216 * deg);
					break;
				case 1:
					mapContext.sector(this.x[i],this.y[i],this.r, 36 * deg, 108 * deg);
					break;
				case 2:
					mapContext.sector(this.x[i],this.y[i],this.r, 216 * deg, 360 * deg);
					break;
				case 3:
					mapContext.sector(this.x[i],this.y[i],this.r, 0, 36 * deg);
					break;
			}
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
	//回车
	if(e.keyCode === 13)
	{
		if(isStarted === false)
		{
			isStarted = true;
			smove.preAnimation();
		}
		else if(isStopped === true)
		{
			smove.gameInit();
		}
	}
	//空格键，用于暂停
	if(e.keyCode === 32)
	{
		if(isPaused === true)
		{
			isPaused = false;
			smove.gameLoop();
		}
		else
		{
			isPaused =true;
			mapContext.clearRect(0,0,mapWidth,mapHeight);
			drawMap();
			drawScore();
			whiteBall.drawWhiteBall();
			star.drawStar();
			blackBalls.drawBlackBall();
			drawTips();
		}
	}
	if(isPaused === false && isStopped === false)
	{
    	keysDown[e.keyCode] = true;
	}
}, false);
//移动端支持，触屏开始
addEventListener("touchstart", function(e)
{
	delete keysDown[37];
	delete keysDown[38];
	delete keysDown[39];
	delete keysDown[40];
	touchStartX = e.touches[0].pageX;
	touchStartY = e.touches[0].pageY;
	if(isStarted === false)
	{
		isStarted = true;
		smove.preAnimation();
	}
	else if(isStopped === true)
	{
		smove.gameInit();
	}

},false);

addEventListener("touchmove", function(e){
	var moveEndX = e.changedTouches[0].pageX;
	var moveEndY = e.changedTouches[0].pageY;
	var X = moveEndX - touchStartX;
	var Y = moveEndY - touchStartY;
	delete keysDown[37];
	delete keysDown[38];
	delete keysDown[39];
	delete keysDown[40];
	if(ableToMove)
	{
		if(Math.abs(X) > Math.abs(Y) && X > 0)//right
		{
			console.info("right");
			keysDown[39] = true;
			ableToMove = false;
			setTimeout(function(){ableToMove = true;},200);
		}
		else if(Math.abs(X) > Math.abs(Y) && X < 0) //left
		{
			keysDown[37] = true;
			ableToMove = false;
			setTimeout(function(){ableToMove = true;},200);
		}
		else if(Math.abs(Y) > Math.abs(X) && Y > 0) //bottom
		{
			keysDown[40] = true;
			ableToMove = false;
			setTimeout(function(){ableToMove = true;},200);
		}
		else if(Math.abs(Y) > Math.abs(X) && Y < 0) //up
		{
			keysDown[38] = true;
			ableToMove = false;
			setTimeout(function(){ableToMove = true;},200);
		}
	}
},false);
//判断是否为移动端，代码参考https://github.com/5Mi/wumi_blog/issues/48
var browser={  
    versions:function(){   
           var u = navigator.userAgent, app = navigator.appVersion;   
           return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 
            };  
         }(),  
         language:(navigator.browserLanguage || navigator.language).toLowerCase()  
}   

if(browser.versions.mobile || browser.versions.ios || browser.versions.android ||   
    browser.versions.iPhone || browser.versions.iPad)	//移动端
{
	isMobile = true;
	//console.log('mobile');
	ableToMove = true;
	smove.prepare();
}
else
{
  	isMobile = false;
  	//console.log('pc');
	smove.prepare();
}
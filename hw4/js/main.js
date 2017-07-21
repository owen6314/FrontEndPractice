var BGCanvas,BGContext;
var mapCanvas,mapContext;
//渐变背景
var BGGraident,BGImage;
//背景与游戏画布参数
var BGWidth, BGHeight;
var mapWidth, mapHeight;
var oldmapWidth; //判断浏览器大小是否发生改变
//九宫格相关参数
var disWidth, disHeight, disX, disY, disR;
//格子中心所在位置的数组(相对mapCanvas而言)
var centerArray_x = [];
var centerArray_y = [];
var diffframetime,lastframetime;
var whiteBall,star,blackBalls;
var score,bestScore = 0; 
var level;
//记录按键操作
var keysDown = {};
//音乐
var bgMusic,getStarSound,nextLevelSound;
//计时器,用于产生黑球
var timeRecorder;

var isStarted = false;
var isStopped;
var isCongratulating
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
	//背景
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
	level = 1;
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
		mapContext.clearRect(0,0,mapWidth,mapHeight);
		drawMap();
		drawScore();
		drawTips();
		whiteBall.preUpdateWhiteBall();
		whiteBall.drawWhiteBall();
		star.rotate();
		star.drawStar();
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
	score = 0;
	level = 1;
	if(document.cookie.length > 0)
	{
		let n = document.cookie.indexOf("=");
		bestScore = unescape(document.cookie.substring(n + 1));
	}
	drawScore();
	//isStopped用于判断游戏结束
	isStopped = false;
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
	//绘制黑球
	blackBalls = new blackBallObject();
	blackBalls.init();
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
}
smove.gameLoop = function()
{
	if(!isStopped)
	{
		requestAnimationFrame(smove.gameLoop);
		var now = Date.now();    //1970 00:00:00 到现在的毫秒数
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
		if(score === 10 && level === 1 || score === 20 && level === 2||score === 30 && level === 3||score === 40 && level === 4)
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
	if(level <= 6)
	{
		timeRecorder = Date.now();
		level++;
	}
	isCongratulating = true;
	var timer = setTimeout("isCongratulating=false",1000);
	//过关动画
}

//在gameOver函数中更改cookie
smove.gameOver = function()
{
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
	
	bgMusic.src = "";
	isStopped = true;
	drawTips();
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
	this.color = "red";
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
    keysDown[e.keyCode] = true;
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
			setTimeout(function(){ableToMove = true;},150);
		}
		else if(Math.abs(X) > Math.abs(Y) && X < 0) //left
		{
			keysDown[37] = true;
			ableToMove = false;
			setTimeout(function(){ableToMove = true;},150);
		}
		else if(Math.abs(Y) > Math.abs(X) && Y > 0) //bottom
		{
			keysDown[40] = true;
			ableToMove = false;
			setTimeout(function(){ableToMove = true;},150);
		}
		else if(Math.abs(Y) > Math.abs(X) && Y < 0) //up
		{
			keysDown[38] = true;
			ableToMove = false;
			setTimeout(function(){ableToMove = true;},150);
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
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };  
         }(),  
         language:(navigator.browserLanguage || navigator.language).toLowerCase()  
}   

if(browser.versions.mobile || browser.versions.ios || browser.versions.android ||   
    browser.versions.iPhone || browser.versions.iPad)	//移动端
{
	//console.log('mobile');
	ableToMove = true;
	smove.prepare();
}
else
{
  	//console.log('pc');
	smove.prepare();
}
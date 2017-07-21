//绘图函数
function drawBackground()
{
	//绘制背景
	BGCanvas.width = jQuery(window).get(0).innerWidth;
	BGCanvas.height = jQuery(window).get(0).innerHeight;
	BGWidth = BGCanvas.width;
	BGHeight = BGCanvas.height;
	/*
	BGImage = new Image();
	BGImage.src = "img/sky.jpg";
	BGContext.drawImage(BGImage,0,0,BGWidth,BGHeight);*/
	BGGradient = BGContext.createLinearGradient(0,0,BGWidth,BGHeight);
	BGGradient.addColorStop(0,"rgb(255,0,0)");
	BGGradient.addColorStop(1 / 6,"rgb(255,165,0)");
	BGGradient.addColorStop(2 / 6,"yellow");
	BGGradient.addColorStop(3 / 6,"green");
	BGGradient.addColorStop(4 / 6,"rgb(0,127,255)");
	BGGradient.addColorStop(5 / 6,"blue");
	BGGradient.addColorStop(1,"purple");
	BGContext.fillStyle = BGGradient;
	BGContext.rect(0,0,BGWidth,BGHeight);
	BGContext.fill();
	//背景中星星
}
//重绘九宫格地图
function drawMap()
{
	//根据屏幕大小调整
	mapWidth = jQuery(window).get(0).innerWidth;
	mapHeight = jQuery(window).get(0).innerHeight;
	mapWidth = mapWidth > mapHeight ? mapHeight : mapWidth;
	mapHeight = mapWidth;
	mapCanvas.width = mapWidth;
	mapCanvas.height = mapHeight;
	disWidth = mapWidth / 2;
	disHeight = mapHeight / 2;
	disX = disWidth / 2;
	disY = disHeight / 2;
	disR = disWidth / 4;

    mapContext.strokeStyle = "#ffffff";
    mapContext.lineWidth = 1;
    mapContext.roundRect(disX,disY,disWidth,disHeight,disR).stroke();
    var xArray = [];
    xArray.push(disWidth / 3 + disX);
    xArray.push(disWidth * 2 / 3 + disX);
    var yArray = [];
    yArray.push(disHeight / 3 + disY);
    yArray.push(disHeight * 2 / 3 + disY);

    //球心和方块中心所在数组
    centerArray_x = [];
    centerArray_y = [];
	centerArray_x.push(disWidth / 6 + disX);
	centerArray_x.push(disWidth / 2 + disX);
	centerArray_x.push(disWidth * 5 / 6 + disX);
	centerArray_y.push(disHeight / 6 + disY);
	centerArray_y.push(disHeight / 2 + disY);
	centerArray_y.push(disHeight * 5 / 6 + disY);

    for(let i = 0; i < 2; i++)
    {
        mapContext.moveTo(xArray[i], disY);
        mapContext.lineTo(xArray[i], disHeight + disY);
        mapContext.lineWidth = 1;
        mapContext.strokeStyle = "#FFFFFF";
        mapContext.stroke();
        mapContext.moveTo(disX, yArray[i]);
        mapContext.lineTo(disWidth + disX, yArray[i]);
        mapContext.lineWidth = 1;
        mapContext.strokeStyle = "#FFFFFF";
        mapContext.stroke();
    }
    //更新格子的大小，用于更新白球和黑球大小
    gridSize = centerArray_x[1] - centerArray_x[0];
    //如果九宫格大小有更新，则更新白球黑球和星星的位置、大小、速度
    if(mapWidth !== oldmapWidth)
    {
    	responsiveUpdate();
    	oldmapWidth = mapWidth;
    }
}
//重绘分数
function drawScore()
{
	let smallFontSize = gridSize / 5;
	let smallFont = smallFontSize + "px " + "Courier New"
	mapContext.font= smallFont;
	mapContext.fillStyle = "white";
	mapContext.fillText("Level:" + level, 4 * disX / 3, 4 * disY / 5);
	mapContext.fillText("Best:" + bestScore, 7 * disX / 3 , 4 * disY / 5);
	let largeFontSize = gridSize / 2;
	let largeFont = largeFontSize + "px " + "Microsoft YaHei";
	mapContext.font = largeFont;
	mapContext.fillText(score,mapWidth / 2,disY / 2);

}
//过关提示
function drawCongratulating()
{
	let fontSize = gridSize / 2;
	let font = fontSize + "px " + "Courier New";
	mapContext.font = font;
	mapContext.fillStyle = "white";
	mapContext.fillText("Level Up!",mapWidth / 3, 5 *mapHeight / 6);
}
//获得星星之后的特效
function drawPlusOne(i)
{
	let row = Math.floor(i / 3);
	let column = i % 3;
	let fontSize = gridSize / 4;
	let font = fontSize + "px " + "Courier New";
	mapContext.font = font;
	mapContext.fillStyle = "blue";
	mapContext.fillText("+1",whiteBall.x - gridSize/6,whiteBall.y);
}


//为canvas绘图引入画圆角矩形的方法
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) 
{
	//if (w &lt; 2 * r) r = w / 2;
	//if (h &lt; 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w, y, x+w, y+h, r);
	this.arcTo(x+w, y+h, x, y+h, r);
	this.arcTo(x, y+h, x, y, r);
	this.arcTo(x, y, x+w, y, r);
	// this.arcTo(x+r, y);
	this.closePath();
	return this;
}
//绘制扇形
CanvasRenderingContext2D.prototype.sector = function(x,y,r,sDeg,eDeg)
{
	this.save();
	this.translate(x,y);
	this.beginPath();
	this.arc(0,0,r,sDeg,eDeg);
	this.save();
	this.rotate(eDeg);
	this.moveTo(r,0);
	this.lineTo(0,0);
	this.restore();
	this.rotate(sDeg);
	this.lineTo(r,0);
	this.closePath();
	this.fill();
	this.restore();
	return this;
}
//绘制星星，参数中需要有context画笔
function drawFilledStar(cxt, x, y, r, R,rot,color)
{
    cxt.beginPath();
    for(var i = 0; i < 5; i ++)
    {
        cxt.lineTo( Math.cos( (18 + i*72 - rot)/180 * Math.PI) * R + x,-Math.sin( (18 + i*72 - rot)/180 * Math.PI) * R + y);
        cxt.lineTo( Math.cos( (54 + i*72 - rot)/180 * Math.PI) * r + x,-Math.sin( (54 + i*72 - rot)/180 * Math.PI) * r + y);
    }
    cxt.closePath();
    cxt.lineWidth = 3;
    cxt.fillStyle = color;
    cxt.strokeStyle = color;
    cxt.lineJoin = "round";
    cxt.fill();
    cxt.stroke();
}
//提示文字
function drawTips()
{
	if(isMobile === false)
	{
		if(isStarted === false)
		{
			let smallFontSize = gridSize / 5;
			let smallFont = smallFontSize + "px " + "Courier New"
			mapContext.font= smallFont;
			mapContext.fillStyle = "white";
			mapContext.fillText("按回车键开始游戏", disX + gridSize / 2, disY + disHeight + gridSize);
		}
		else if(isStopped === true)
		{
			let smallFontSize = gridSize / 5;
			let smallFont = smallFontSize + "px " + "Courier New"
			mapContext.font= smallFont;
			mapContext.fillStyle = "white";
			mapContext.fillText("按回车键重新开始游戏", disX + gridSize / 2, disY + disHeight + gridSize);
		}
		else if(isPaused === false)
		{
			let smallFontSize = gridSize / 5;
			let smallFont = smallFontSize + "px " + "Courier New"
			mapContext.font= smallFont;
			mapContext.fillStyle = "white";
			mapContext.fillText("按空格键暂停游戏", disX + gridSize / 2, disY + disHeight + gridSize);
		}
		else if(isPaused === true)
		{
			let smallFontSize = gridSize / 5;
			let smallFont = smallFontSize + "px " + "Courier New"
			mapContext.font= smallFont;
			mapContext.fillStyle = "white";
			mapContext.fillText("按空格键继续游戏", disX + gridSize / 2, disY + disHeight + gridSize);
		}
	}
}
//绘制实心圆
function drawCircle(cxt,x, y, r,color)
{
    cxt.beginPath();
    cxt.fillStyle = color;
    var circle = {
        x : x, 
        y : y,    
        r : r      
    };
    cxt.arc(circle.x, circle.y, circle.r, 0,Math.PI * 2, false);    
    cxt.fill();
}
/*
//type:1左上，2左下，3右上，4右下
function drawSector(cxt,x,y,r,color,type)
{
	cxt.beginPath();
	cxt.fillStyle = color;
	var circle = {
		x : x,
		y : y,
		r : r
	}
	switch(type)
	{
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
		case 4:
			break;

	}
	cxt.fill();
}*/
//响应式更新仅在游戏时有效，其他时候无效
function responsiveUpdate()
{
	whiteBall.r = gridSize / 4;
	whiteBall.speed = gridSize;
	whiteBall.x = centerArray_x[whiteBall.column];
	whiteBall.y = centerArray_y[whiteBall.row];

	blackBalls.r = gridSize / 3;
	for(let i = 0; i < blackBalls.num; i++)
	{
		blackBalls.speed[i] = gridSize / 25;
		//TODO 黑球另一个坐标位置的等比例变化
		if(blackBalls.isAlive[i])
		{
			switch(blackBalls.type[i])
			{
				case 1:
					blackBalls.y[i] = centerArray_y[blackBalls.row[i]]; 
					break;
				case 2:
					blackBalls.y[i] = centerArray_y[blackBalls.row[i]]; 
					break;
				case 3:
					blackBalls.x[i] = centerArray_x[blackBalls.column[i]];
					break;
				case 4:
					blackBalls.x[i] = centerArray_x[blackBalls.column[i]];
					break;

			}
		}
	}

}
//绘图函数
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

	mapContext.fillStyle = "black";
	mapContext.rect(0,0,mapWidth, mapHeight);
	mapContext.fill();
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

function drawCongratulating()
{
	let fontSize = gridSize / 5;
	let font = fontSize + "px " + "Courier New";
	mapContext.fillStyle = "white";
	mapContext.fillText("Level Up!",mapWidth / 3, 5 *mapHeight / 6);
}
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
}
//重绘分数
function drawScore()
{
	mapContext.font="30px Courier New";
	mapContext.fillStyle = "white";
	mapContext.fillText("BEST:" + bestScore,mapWidth / 2,disY / 2 + 50);
	mapContext.font = "60px Microsoft YaHei";
	mapContext.fillText(score,mapWidth / 2,disY / 2);
}
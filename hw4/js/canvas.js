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
function drawCircle(ctx, x, y, r)
{
    //开始一个新的绘制路径
    ctx.beginPath();
    ctx.fillStyle = "white";
    var circle = {
        x : x,    //圆心的x轴坐标值
        y : y,    //圆心的y轴坐标值
        r : r      //圆的半径
    };
    ctx.arc(circle.x, circle.y, circle.r, 0,Math.PI * 2, false);    
    ctx.fill();
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
    mapContext.strokeStyle = "#ffffff";
    mapContext.lineWidth = 1;
    mapContext.roundRect(disX,disY,disWidth,disHeight,disR).stroke();
    var xArray = [];
    xArray.push(disWidth / 3);
    xArray.push(disWidth * 2 / 3);
    var yArray = [];
    yArray.push(disHeight / 3);
    yArray.push(disHeight * 2 / 3);
    for(let i = 0; i < 2; i++)
    {
        mapContext.moveTo(xArray[i], 0);
        mapContext.lineTo(xArray[i], disHeight);
        mapContext.lineWidth = 1;
        mapContext.strokeStyle = "#FFFFFF";
        mapContext.stroke();
        mapContext.moveTo(0, yArray[i]);
        mapContext.lineTo(disWidth, yArray[i]);
        mapContext.lineWidth = 1;
        mapContext.strokeStyle = "#FFFFFF";
        mapContext.stroke();
    }
}
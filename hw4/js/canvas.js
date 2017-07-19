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
//绘制星星，参数中需要有context画笔
function drawStar(cxt, x, y, r, R, rot)
{
    cxt.beginPath();
    for(var i = 0; i < 5; i ++){
        cxt.lineTo( Math.cos( (18 + i*72 - rot)/180 * Math.PI) * R + x,
                    -Math.sin( (18 + i*72 - rot)/180 * Math.PI) * R + y)
        cxt.lineTo( Math.cos( (54 + i*72 - rot)/180 * Math.PI) * r + x,
                    -Math.sin( (54 + i*72 - rot)/180 * Math.PI) * r + y)
    }
    cxt.closePath();
    cxt.lineWidth = 3;
    cxt.fillStyle = "#fb3";
    cxt.strokeStyle = "#fb5";
    cxt.lineJoin = "round";

    cxt.fill();
    cxt.stroke();
}
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
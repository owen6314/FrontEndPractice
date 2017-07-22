//白球碎片类型
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
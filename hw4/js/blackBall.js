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
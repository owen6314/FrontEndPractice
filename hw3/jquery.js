"use strict";

//Array.from的支持
//if(!Array.from)
//{
	Array.from = (function(args){

		if(args.length==="undefined")
		{
			return null;
		}
		else
		{
			var list = [];
			console.info(args[1]);
			for(let i = 0; i < args.length; i++)
			{
				list.push(args[i]);
			}
			return list;
		}
	})
//}


//构造函数
var jQuery = function(selector)
{
	return new jQuery.fn.init(selector);
}
jQuery.fn = jQuery.prototype = 
{
	init:function(selector)
	{
		if(selector === null)
			return null;
		this.elem = document.querySelectorAll(selector);
		return this;
	}
}
jQuery.fn.init.prototype = jQuery.fn;
/*
//注意处理元素无法找到的异常情况,此时elem长度为0
var jQuery = function(selector)
{
	this.elem = document.querySelectorAll(selector);
	return this;

	//all elements
	if(selector === "*")
	{
		this.elem = document.all();
		return this.elem;
	}
	//简单选择器(不含空格)
	if(/\s/.test(selector) == false)
	{
		var selectorName;
		switch(selector.charAt(0))
		{
			case "#":
				selectorName = selector.replace(/^\#/,"");
				this.elem = document.getElementById(selectorName);
				return this.elem;
				break;
			//按class查询，需要遍历dom tree
			case ".":
				selectorName = selector.replace(/^\./,"");
				break;
			default:
				this.elem = document.getElementsByTagName(selector);
				return this.elem;
				break;
		}
	}
}*/

jQuery.prototype.elem = [];


//following methods should include the case where there is no matched elem
jQuery.prototype.attr = function(name, value)
{
	if(this.elem.length === 0)
		return null;
	if(value !== undefined)
	{
		for(let i = 0; i < this.elem.length; i++)
		{
			this.elem[i].setAttribute(name,value);
		}
		return this;
	}
	else
	{
		return this.elem[0].getAttribute(name);
	}
};
//不能使用if(index),因为0==false
jQuery.prototype.get = function(index)
{
	if(this.elem.length === 0)
		return null;
	if(index !== undefined)
	{
		if(index >= 0 && index < this.elem.length)
			return this.elem[index];
		else
			return undefined;
	}
	else
	{
		return this.elem;
	}
};
jQuery.prototype.prop = function(str)
{
	if(this.elem.length === 0)
		return null;
	if(str == undefined)
		return null;
	var attr = this.elem[0].getAttributeNode(str);
	if(attr === null)
	{
		return false;
	}
	else
	{
		return true;
	}
};

jQuery.prototype.addClass = function(args)
{
	if(this.elem.length === 0)
		return null;
	if(typeof(args) === "string")
	{
		var list = args.split(" ");
		for(let i = 0; i < list.length; i++)
		{
			for(let j = 0; j < this.elem.length; j++)
			{
				//是否存在classList考虑浏览器的兼容性问题
				if(this.elem[j].classList)
				{
					this.elem[j].classList.add(list[i]);
				}
				else
				{
					var currentClassList = this.elem[j].className.split(" ");
					if(currentClassList.indexOf(list[i]) === -1)
						this.elem[j].className += ' ' + list[i];
				}
			}
		}
	}
	else if(typeof(args)=== "function")
	{
		for(let i = 0; i < this.elem.length; i++)
		{
			if(this.elem[i].classList)
			{
				var currentClassString = this.elem[i].classList.toString();
				var returnString = args(i, currentClassString);
				//console.info(currentClassString);
				this.elem[i].classList.add(returnString);
			}
			else
			{
				var currentClassString = this.elem[i].className;
				var returnString = args(i, currentClassString);
				var currentClassList = currentClassString.split(" ");
				if(currentClassList.indexOf(returnString) === -1)
					this.elem[i].className += " " + returnString;
			}
		}
	}
	return this;
}
jQuery.prototype.each = function(args)
{
	if(typeof(args) !== "function")
		return null;
	for(let i = 0; i < this.elem.length; i++)
	{
		var a = args.call(this.elem[i]);
		if(a === false)
			break;
	}
	return this;
}

jQuery.prototype.noConflict = function()
{
	if(window.$ === jQuery)
		window.$ = __$;
	return jQuery;
};
/*
//用__$保存原来的windwo.$,以便在noConflict的时候还原
var __$ = window.$;
window.jQuery = jQuery;
//在这里改变window.$
window.$ = jQuery;*/
var m = new Map([[1,2],[2,4]]);
var d =Array.from(m);
console.info(d);

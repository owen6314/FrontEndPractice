"use strict";


var jQuery = function(selector)
{
	return new jQuery.fn.init(selector);
}
jQuery.fn = jQuery.prototype = 
{
	init:function(selector)
	{
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
// todo
jQuery.prototype.addClass = function(args)
{
	if(typeof(args) === "string")
	{
		var list = args.split(" ");
		for(let i = 0; i < list.length; i++)
		{
			for(let j = 0; j < this.elem.length; j++)
			{
				var currentClass = this.elem[j].getAttribute("class");
				//结果中的类名唯一
				if(currentClass.search(list[i]) === -1)
				{
					let newClass = currentClass + ' ' + list[i];
					this.elem[j].setAttribute("class", newClass);
				}
			}
		}
	}
	else if(typeof(args)=== "function")
	{

	}
}


jQuery.prototype.noConflict = function()
{
	if(window.$ === jQuery)
		window.$ = __$;
	return jQuery;
};
//用__$保存原来的windwo.$,以便在noConflict的时候还原
var __$ = window.$;
window.jQuery = jQuery;
//在这里改变window.$
window.$ = jQuery;

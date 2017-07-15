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
jQuery.prototype.noConflict = function()
{
	if(window.$ === jQuery)
		window.$ = _$;
	return jQuery;
};
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
var $ = function(selector)
{
	if(selector == undefined)
		return null;
	var result = new jQuery(selector);
	return result;
	/*
	console.info(selector);
	/*
	var attr = function(attribute)
	{
		console.info(attribute);
	}*/
	//简单选择器，选择器中没有空格
	//if(/\b/.test(selector) === "false")
	//{
		//id selector
		/*
		if(selector.substring(0,1) == "#")
		{
			var elem = document.getElementById(selector.substring(1));
			if(elem == null)
				return elem;
			
		}*/
		//return null;
	//}
}

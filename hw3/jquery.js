"use strict";

//构造函数
var jQuery = function(selector)
{
	return new jQuery.fn.init(selector);
}
jQuery.fn = jQuery.prototype = 
{
	init:function(selector)
	{
		if(typeof(selector) !== "string")
			return null;
		//parse CSS selector
		//假设没有多余空格，id和class均为小写字母开头和数字的组合

		
		//use querySelectorAll
		else
		{
			try{
				//TODO
				this.elem = document.querySelectorAll(selector);
				return this;
			}catch(error){
				console.log(error);
				return null;
			}
		}
	}
};
jQuery.fn.init.prototype = jQuery.fn;
jQuery.prototype.elem = [];
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
	//A: return true/false
	
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
	/*
	//B: return value/undefined
	return this.elem[0][str];*/
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
};
jQuery.prototype.each = function(args)
{
	if(typeof(args) !== "function")
		return null;
	for(let i = 0; i < this.elem.length; i++)
	{
		var a = args.call(this.elem[i], i, this.elem[i]);
		if(a === false)
			break;
	}
	return this;
};

//Array.from的支持,参考https://developer.mozilla.org中提供的Polyfill,有所改动。
//7.16题目更新，增加arrayLike是jQuery类型时的情况
Array.from = (function(){
	return function from(arrayLike){
		if(arrayLike instanceof jQuery)
		{
			var jarray = [];
			for(let i = 0; i < arrayLike.elem.length; i++)
			{
				jarray.push(arrayLike.elem[i]);
			}
			return jarray;
		}
		//下面是对Array.from的实现(7.16题目更新前完成)
		if(arrayLike == null)
		{
			throw new TypeError("Array.from requires an array like object - not null or undefined");
		}
		//先定义判读是否Callable的方法
		var toStr = Object.prototype.toString;
		var isCallable = function(fn){
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		}
		var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
		var T;
		if(typeof(mapFn) !== "undefined")
		{
			if(!isCallable(mapFn))
			{
				throw new TypeError('Array.from:when provided, the second argument must be a function');
			}
			if(arguments.length > 2)
			{
				T = arguments[2];
			}
		}
		var items = Object(arrayLike);
		var len = items.length > 0 ? items.length : 0;
		var A = isCallable(this) ? Object(new this(len)) : new Array(len);
		var kValue;

		for(let k = 0; k < len ;k++)
		{
			kValue = items[k];
			if(mapFn)
			{
				A[k] = typeof T === "undefined" ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
			}
			else
			{
				A[k] = kValue;
			}
		}
		A.length = len;
		return A;
	};
}());
jQuery.prototype.noConflict = function(deep)
{
	if(window.$ === jQuery)
		window.$ = __$;
	if ( deep && window.jQuery === jQuery )
		window.jQuery = _jQuery;
	return jQuery;
};

//用__$保存原来的window.$,以便在noConflict的时候还原
var __$ = window.$;
window.jQuery = jQuery;
//在这里改变window.$
window.$ = jQuery;
/*
var m = new Map([[1,2],[2,4]]);
var d =Array.from("kissssss");
console.info(d);*/

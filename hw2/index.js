'use strict';
function count(test) 
{
  var Counter=
  {
    number:0,
    string:0,
    undefined:0,
    boolean:0,
    count:function(src)
    {
      var a;
      for(a in src)
      {
        if(src[a] instanceof Array)
        {
          this.count(src[a]);
        }
        else if(typeof(src[a]) == "number")
        {
          this.number++;
        }
        else if(typeof(src[a]) == "string")
        {
          this.string++;
        }
        else if(typeof(src[a]) == "boolean")
        {
          this.boolean++;
        }
        else if(typeof(src[a]) == "undefined")
        {
          this.undefined++;
        }
      }
    }
  }
  var count_fun = Object.create(Counter);
  count_fun.count(test); 
  return count_fun;
}

function isIPv4(s) 
{
  //a complex way without reg
  if(s.length >= 16)
    return false
  var list;
  list = s.split('.');
  //不能被解析为四部分
  if(list.length != 4)
    return false;
  var a;
  for(a in list)
  {
    //有空串
    if(list[a]=='')
    {
      return false
    }
    var b;
    //有字母
    for(b in list[a])
    {
      if(isNaN(list[a][b]))
      {
        return false;
      }
    }
    //检测是否为合法的，且在0-256之间的数字
    //最高位是0，长度不为1，错误
    if(list[a][0]=='0' && list[a].length!=1)
    {
      return false;
    }
    //整数范围
    var integer = parseInt(list[a],10);
    if(integer < 0 || integer > 255)
    {
      return false;
    }
  }
  return true;
  //a much simpler way(but not right)
  /*
  var str;
  str = s.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  return str != null && str[1] <= 255 && str[2] <= 255 && str[3] <= 255 && str[4] <= 255;*/
}

function map(mapper,input)
{
  var tmp_ans = [];
  var properties = Object.getOwnPropertyNames(input);
  var a;
  for(a in properties)
  {
    var temp;
    temp = mapper(properties[a],input[properties[a]]);
    var b;
    for(b in temp)
    {
      var flag = false;
      var c;
      for(c in tmp_ans)
      {
        //已经存在该属性
        if(tmp_ans[c][0] == temp[b][0])
        {
          //已经是数组
          if(tmp_ans[c][1] instanceof Array)
          {
            tmp_ans[c][1].push(temp[b][1]);
            //console.info("Array");
          }
          else
          {
            var temp_int = tmp_ans[c][1];
            tmp_ans[c][1] = new Array();
            tmp_ans[c][1].push(temp_int);
            tmp_ans[c][1].push(temp[b][1]);
          }
          flag = true;
          break;
        }
      }
      if(flag == false)
      {
        tmp_ans.push(temp[b]);
      }
    }
  }
  var d;
  for(d in tmp_ans)
  {
    if(typeof(tmp_ans[d][1]) == 'number')
    {
      var temp_int = tmp_ans[d][1];
      tmp_ans[d][1] = new Array();
      tmp_ans[d][1].push(temp_int);
    }
  }
  var map_result = new Object();
  var i;
  for(i in tmp_ans)
  {
    map_result[tmp_ans[i][0]] = tmp_ans[i][1]; 
  }
  return map_result;
}

function reduce(reducer, input)
{
  var reduce_result = new Object();
  var reduce_properties = Object.getOwnPropertyNames(input);
  tmp_array = [];
  var i;
  for(i  in reduce_properties)
  {
    var tmp_array = reducer(reduce_properties[i], input[reduce_properties[i]]);
    reduce_result[tmp_array[0]] = tmp_array[1];
  }
  return reduce_result;
}

function stringIterator(s)
{
  var o = new Object();
  o.src = s;
  o.pos = 0;
  o.hasNext = function()
  {
    if(o.pos == o.src.length)
      return false;
    else
      return true;
  }
  o.nextValue = function()
  {
    if(o.pos != o.src.length)
    {
      o.pos++;
      return o.src[this.pos - 1];
    }
    else
    {
      return null;
    }
  }
  o[Symbol.iterator] = function()
  {
    var index = -1;
    return{
      next(){
        index++;
        return {done:index >= o.src.length, value:o.src[index]}
      }
    }
  }
  return o;
}


//follow the instructions in ECMA2015,change a little
function ToPrimitive(o)
{
    //very special case
    if(typeof(o.valueOf) !== "function")
    {
      return o + "";
    }
    if(typeof(o.valueOf()) !== "object")
    {
        return o.valueOf();
    }
    else
    {
      //console.info(o+'');
      //use a trick to replace toString()
      return o + '';
    }
    
}
function equal(o1, o2)
{
  if(typeof(o1) === typeof(o2))
  {
    if(o1 === o2) 
      return true;
    else
      return false;
  }
  
  if(typeof(o1) === "undefined" && o2 === null || typeof(o2) === "undefined" && o1===null)
  {
      return true;
  }
  if(typeof(o1)==="number" && typeof(o2) === "string")
  {

      return equal(o1, Number(o2));
  }

  if(typeof(o1) === "string" && typeof(o2)==="number")
  {
      return equal(Number(o1), o2);
  }

  if(typeof(o1) === "boolean")
  {
      return equal(Number(o1), o2);
  }
  if(typeof(o2) === "boolean")
  {
      return equal(o1, Number(o2));
  }
  //add string type
  if((typeof(o1) ==="boolean" || typeof(o1) ==="number" || typeof(o1) === "symbol" || typeof(o1) ==="string")  && (typeof(o2)==="object" || typeof(o2)==="function"))
  {
      //preferred type is number
      return equal(o1, ToPrimitive(o2));
  }
  if((typeof(o2) ==="boolean" || typeof(o2) ==="number" || typeof(o2) === "symbol" || typeof(o2) === "string") && (typeof(o1)==="object" || typeof(o1)==="function"))
  {

      return equal(ToPrimitive(o1), o2);
  }

  return false;
}

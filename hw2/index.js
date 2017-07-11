/*

You can feel free to modify the exsisting codes.

You should ensure all functions (or classes) will be submitted are in global
scope.

If you have any question, you can ask in our course wechat group.

*/

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

  function isIPv4(s) {
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
      //console.info("match");
      return false
    }
    var b;
    //有字母
    for(b in list[a])
    {
      if(isNaN(list[a][b]))
      {
        //console.info("list[a][b]");
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
    var integer = parseInt(list[a]);
    if(integer < 0 || integer > 255)
    {
      return false;
    }
  }
  return true;
}

function map(mapper, input) {
  // TODO:
  return null;
}

function reduce(reducer, input) {
  // TODO:
  return null;
}

function stringIterator(s) {
  // you can modify funciton to class
  // TODO:
  return null;
}

function equal(o1, o2) {
  // TODO:
  return true;
}

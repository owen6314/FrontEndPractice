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
    return null;
}

  function isIPv4(s) {
    // TODO:
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

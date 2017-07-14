var gl = "1";
var gl2 = 8;

var should_be_true = [
  [1, 1],
  [3, '3'],
  [new Boolean(true), "1"],
  [undefined, undefined],
  [null, undefined],
  [true, "1"],
  [({valueOf:function(){return 8;}}), 8],
  [({toString:x=>"9"}), 9],
  [({}), "[object Object]"],
  [({[Symbol.toPrimitive](hint){if(hint==="default")return 10;else return this;}}), 10],
];

var should_be_false = [
  [2, 3],
  ["2", "3"],
  [true, 3],
  [true, [1, 2]],
  [[], []],
  [NaN, NaN],
  [({valueOf:function(){return new Number(12);}}), 12],
  [1, ({valueOf:1})],
  [({toString:function(){return gl += "0";}}), 100],
  [({toString:function(){return gl2;},valueOf:function(){gl2=9;return new Number(8);}}), "8"],
];

should_be_true.forEach(function([o1, o2], i) {
  assert.strictEqual(equal(o1, o2), true);
});

should_be_false.forEach(function([o1, o2], i) {
  assert.strictEqual(equal(o1, o2), false);
});

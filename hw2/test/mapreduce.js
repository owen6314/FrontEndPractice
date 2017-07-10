var input = {'a': 123, 'ab': 4567, 'abc': 890};

function mapper(k1, v1) {
  return [[k1, v1], [k1 + 'b', v1 + 10], [k1 + 'c', v1 + 20]];
}

var maptmp = map(mapper, input);

assert.deepStrictEqual(maptmp, {
  'a': [123],
  'ab': [133, 4567],
  'ac': [143],
  'abb': [4577],
  'abc': [4587, 890],
  'abcb': [900],
  'abcc': [910]
});

function reducer(k2, v2s) {
  var ans = 0;
  for (var i = 0; i < v2s.length; ++i) {
    ans += v2s[i];
  }
  return [k2 + '_out', ans];
}

const output = reduce(reducer, maptmp);

assert.deepStrictEqual(output, {
  'a_out': 123,
  'ab_out': 4700,
  'ac_out': 143,
  'abb_out': 4577,
  'abc_out': 5477,
  'abcb_out': 900,
  'abcc_out': 910
});

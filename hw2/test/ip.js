var should_be_true = ['166.111.4.100'];

var should_be_false = ['isIPv4=null;'];

should_be_true.forEach(function(s) {
  assert.strictEqual(isIPv4(s), true);
});

should_be_false.forEach(function(s, i) {
  assert.strictEqual(isIPv4(s), false);
});

var should_be_true = [
  [1, 1],
  [3, '3'],
];

var should_be_false = [
  [2, 3],
  [3, 1],
];

should_be_true.forEach(function([o1, o2], i) {
  assert.strictEqual(equal(o1, o2), true);
});

should_be_false.forEach(function([o1, o2], i) {
  assert.strictEqual(equal(o1, o2), false);
});

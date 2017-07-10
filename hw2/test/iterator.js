var test =
    function(testcase) {
  var output = [];
  for (let char of stringIterator(testcase)) {
    output.push(char);
  }
  assert.strictEqual(output.join(','), testcase.split('').join(','));

  output = [];
  var iterator = stringIterator(testcase);
  while (iterator.hasNext()) {
    output.push(iterator.nextValue());
  }
  assert.strictEqual(output.join(','), testcase.split('').join(','));
}

test('我爱前端课！');

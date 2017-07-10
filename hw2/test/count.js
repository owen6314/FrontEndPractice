assert.strictEqual(count([1, [2, false]]).number, 2);
assert.strictEqual(count([[2, [true, 4]], true, [2, false]]).boolean, 3);

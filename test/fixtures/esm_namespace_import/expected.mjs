import * as ns from 'power-assert';
const assert = ns.default;

function add(a, b) {
  assert(!isNaN(a));
  assert.equal(typeof b, 'number');
  assert.ok(!isNaN(b));
  return a + b;
}

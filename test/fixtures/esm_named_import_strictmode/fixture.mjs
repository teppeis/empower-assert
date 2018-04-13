import { default as loose } from 'assert';
const assert = loose.strict;

function add (a, b) {
    assert(!isNaN(a));
    assert.equal(typeof b, 'number');
    assert.ok(!isNaN(b));
    return a + b;
}

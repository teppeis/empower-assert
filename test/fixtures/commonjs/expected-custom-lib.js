'use strict';

var assert = require('custom-lib');

function add(a, b) {
    assert(!isNaN(a));
    assert.equal(typeof b, 'number');
    assert.ok(!isNaN(b));
    return a + b;
}

'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var esprima = require('esprima');
var empowerAssert = require('../');

function testTransform (fixtureName, extraOptions, extraSuffix) {
    it(fixtureName, function () {
        var suffix = extraSuffix ? '-' + extraSuffix : '';
        var fixtureFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'fixture.js');
        var expectedFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'expected' + suffix + '.js');
        var fixtureSource = fs.readFileSync(fixtureFilepath).toString();
        var fixtureAst = esprima.parse(fixtureSource);
        var actualAst = empowerAssert(fixtureAst);
        var expectedSource = fs.readFileSync(expectedFilepath).toString();
        var expectedAst = esprima.parse(expectedSource);
        assert.deepEqual(actualAst, expectedAst);
    });
}

describe('empower-assert', function() {
  testTransform('commonjs');
  testTransform('commonjs_singlevar');
  testTransform('commonjs_powerassert');
  testTransform('assignment');
  testTransform('assignment_singlevar');
  // testTransform('es6module');
  // testTransform('es6module_powerassert');
});

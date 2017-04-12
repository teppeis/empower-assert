'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var acorn = require('acorn');
var espurify = require('espurify');
var empowerAssert = require('../');

function testTransform(fixtureName, extraOptions, extraSuffix) {
  var specName = extraSuffix ? fixtureName + ' ' + extraSuffix : fixtureName;
  it(specName, function() {
    var suffix = extraSuffix ? '-' + extraSuffix : '';
    var fixtureFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'fixture.js');
    var expectedFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'expected' + suffix + '.js');
    var fixtureSource = fs.readFileSync(fixtureFilepath).toString();
    var parserOptions = {
      locations: true,
      ecmaVersion: 6,
      sourceType: 'module'
    };
    var fixtureAst = acorn.parse(fixtureSource, parserOptions);
    var actualAst = espurify(empowerAssert(fixtureAst, extraSuffix));
    var expectedSource = fs.readFileSync(expectedFilepath).toString();
    var expectedAst = espurify(acorn.parse(expectedSource, parserOptions));
    assert.deepEqual(actualAst, expectedAst);
  });
}

describe('empower-assert', function() {
  testTransform('commonjs');
  testTransform('commonjs_singlevar');
  testTransform('commonjs_powerassert');
  testTransform('assignment');
  testTransform('assignment_singlevar');
  testTransform('es6module');
  testTransform('es6module_powerassert');
  testTransform('commonjs', {}, 'custom-lib');
  testTransform('commonjs_singlevar', {}, 'custom-lib');
  testTransform('commonjs_powerassert', {}, 'custom-lib');
  testTransform('assignment', {}, 'custom-lib');
  testTransform('assignment_singlevar', {}, 'custom-lib');
  testTransform('es6module', {}, 'custom-lib');
  testTransform('es6module_powerassert', {}, 'custom-lib');
});

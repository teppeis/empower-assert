'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var acorn = require('acorn');
var espurify = require('espurify');
var empowerAssert = require('../');

function testTransform(fixtureName, extension) {
  it(fixtureName, function() {
    extension = extension || 'js';
    var fixtureFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'fixture.' + extension);
    var expectedFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'expected.' + extension);
    var fixtureSource = fs.readFileSync(fixtureFilepath).toString();
    var parserOptions = {
      locations: true,
      ecmaVersion: 6,
      sourceType: 'module'
    };
    var fixtureAst = acorn.parse(fixtureSource, parserOptions);
    var actualAst = espurify(empowerAssert(fixtureAst));
    var expectedSource = fs.readFileSync(expectedFilepath).toString();
    var expectedAst = espurify(acorn.parse(expectedSource, parserOptions));
    assert.deepEqual(actualAst, expectedAst);
  });
}

describe('empower-assert', function() {
  testTransform('commonjs');
  testTransform('commonjs_singlevar');
  testTransform('commonjs_powerassert');
  testTransform('commonjs_strictmode');
  testTransform('commonjs_singlevar_strictmode');
  testTransform('assignment');
  testTransform('assignment_singlevar');
  testTransform('esm_default_binding', 'mjs');
  testTransform('esm_default_binding_powerassert', 'mjs');
  testTransform('esm_namespace_import', 'mjs');
  testTransform('esm_named_import_strictmode', 'mjs');
});

"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const espurify = require("espurify");
const empowerAssert = require("../");

function testTransform(fixtureName, extension) {
  it(fixtureName, () => {
    extension = extension || "js";
    const fixtureFilepath = path.resolve(
      __dirname,
      "fixtures",
      fixtureName,
      `fixture.${extension}`
    );
    const expectedFilepath = path.resolve(
      __dirname,
      "fixtures",
      fixtureName,
      `expected.${extension}`
    );
    const fixtureSource = fs.readFileSync(fixtureFilepath).toString();
    const parserOptions = {
      locations: true,
      ecmaVersion: 6,
      sourceType: "module",
    };
    const fixtureAst = acorn.parse(fixtureSource, parserOptions);
    const actualAst = espurify(empowerAssert(fixtureAst));
    const expectedSource = fs.readFileSync(expectedFilepath).toString();
    const expectedAst = espurify(acorn.parse(expectedSource, parserOptions));
    assert.deepEqual(actualAst, expectedAst);
  });
}

describe("empower-assert", () => {
  testTransform("commonjs");
  testTransform("commonjs_singlevar");
  testTransform("commonjs_powerassert");
  testTransform("commonjs_strictmode");
  testTransform("commonjs_singlevar_strictmode");
  testTransform("assignment");
  testTransform("assignment_singlevar");
  testTransform("esm_default_binding", "mjs");
  testTransform("esm_default_binding_powerassert", "mjs");
  testTransform("esm_namespace_import", "mjs");
  testTransform("esm_named_import_strictmode", "mjs");
});

'use strict';

var estraverse = require('estraverse');
var Syntax = estraverse.Syntax;

var DEFAULT_LIB = 'power-assert';

/**
 * Change `assert` to `power-assert` destructively.
 *
 * @param {Object} ast
 * @param {string} libName
 * @return {Object}
 */
function empowerAssert(ast, libName) {
  libName = getLibName(libName);

  estraverse.traverse(ast, {
    enter: makeEnter(libName)
  });
  return ast;
}

/**
 * @param {string} libName
 * @return {Function} enter
 */
function makeEnter(libName) {
  /**
   * @param {Object} node
   * @param {Object} parent
   */
  return function enter(node, parent) {
    if (node.type === Syntax.AssignmentExpression) {
      if (node.operator !== '=') {
        return;
      }
      if (!isIdentifier(node.left, 'assert')) {
        return;
      }
      if (!isRequireAssert(node.right)) {
        return;
      }
      changeAssertToLib(node.right.arguments[0], libName);
    }

    if (node.type === Syntax.VariableDeclarator) {
      if (!isIdentifier(node.id, 'assert')) {
        return;
      }
      if (!isRequireAssert(node.init)) {
        return;
      }
      changeAssertToLib(node.init.arguments[0], libName);
    }

    if (node.type === Syntax.ImportDeclaration) {
      var source = node.source;
      if (!source || source.type !== Syntax.Literal || source.value !== 'assert') {
        return;
      }
      var firstSpecifier = node.specifiers[0];
      if (!firstSpecifier || firstSpecifier.type !== Syntax.ImportDefaultSpecifier) {
        return;
      }
      if (!isIdentifier(firstSpecifier.local, 'assert')) {
        return;
      }
      changeAssertToLib(source, libName);
    }
  };
}

/**
 * @param {Object} node A Literal node.
 * @param {string} value
 */
function changeAssertToLib(node, value) {
  var libName = getLibName(value);
  node.value = libName;
}

/**
 * @param {string} libName
 * @return {string} actual lib name
 */
function getLibName(libName) {
  if (typeof libName === 'string' && libName) {
    return libName;
  }
  return DEFAULT_LIB;
}

/**
 * @param {Object} node A CallExpression node.
 * @return {boolean} true if the node is `require('assert')`.
 */
function isRequireAssert(node) {
  if (!node || node.type !== Syntax.CallExpression) {
    return false;
  }
  if (!isIdentifier(node.callee, 'require')) {
    return false;
  }
  var arg = node.arguments[0];
  if (!arg || arg.type !== Syntax.Literal || arg.value !== 'assert') {
    return false;
  }
  return true;
}

/**
 * @param {Object} node
 * @param {string} name
 * @return {boolean}
 */
function isIdentifier(node, name) {
  return node &&
    node.type === Syntax.Identifier &&
    node.name === name;
}

module.exports = empowerAssert;
empowerAssert.enter = makeEnter(DEFAULT_LIB);
empowerAssert.makeEnter = makeEnter;

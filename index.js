'use strict';

var estraverse = require('estraverse');
var traverse = estraverse.traverse;
var Syntax = estraverse.Syntax;

function empowerAssert(ast) {
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (node.type === Syntax.AssignmentExpression) {
        if (node.operator !== '=') {
          return;
        }
        if (!isIdentifier(node.left, 'assert')) {
          return;
        }
        var init = node.right;
        if (!init || init.type !== Syntax.CallExpression) {
          return;
        }
        if (!isIdentifier(init.callee, 'require')) {
          return;
        }
        var arg = init.arguments[0];
        if (!arg || arg.type !== Syntax.Literal || arg.value !== 'assert') {
          return;
        }
        arg.value = 'power-assert';
        arg.raw = "'power-assert'";
        return estraverse.VisitorOption.Skip;
      }

      if (node.type === Syntax.VariableDeclarator) {
        if (!isIdentifier(node.id, 'assert')) {
          return;
        }
        var init = node.init;
        if (!init || init.type !== Syntax.CallExpression) {
          return;
        }
        if (!isIdentifier(init.callee, 'require')) {
          return;
        }
        var arg = init.arguments[0];
        if (!arg || arg.type !== Syntax.Literal || arg.value !== 'assert') {
          return;
        }
        arg.value = 'power-assert';
        arg.raw = "'power-assert'";
        return estraverse.VisitorOption.Skip;
      }
    }
  });

  return ast;
}

function isIdentifier(node, name) {
  return node &&
    node.type === Syntax.Identifier &&
    node.name === name;
}

module.exports = empowerAssert;

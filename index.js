'use strict';

var estraverse = require('estraverse');
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
        if (!isRequireAssert(node.right)) {
          return;
        }
        changeAssertToPowerAssert(node.right);
        return estraverse.VisitorOption.Skip;
      }

      if (node.type === Syntax.VariableDeclarator) {
        if (!isIdentifier(node.id, 'assert')) {
          return;
        }
        if (!isRequireAssert(node.init)) {
          return;
        }
        changeAssertToPowerAssert(node.init);
        return estraverse.VisitorOption.Skip;
      }
    }
  });

  return ast;
}

function changeAssertToPowerAssert(node) {
  var arg = node.arguments[0];
  arg.value = 'power-assert';
  if (arg.raw) {
    arg.raw = "'power-assert'";
  }
}

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

function isIdentifier(node, name) {
  return node &&
    node.type === Syntax.Identifier &&
    node.name === name;
}

module.exports = empowerAssert;

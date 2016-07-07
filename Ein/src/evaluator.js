'use strict'

var parser = require('./grammar.js')
var emitter = require('./emitter.js')
var analyzer = require('./analyzer.js')
var pegjsUtil = require('pegjs-util')
var vm = require('vm')
var _ = require('lodash')
var errors = require('./errors.js')
var ParseError = errors.ParseError
// var UnboundSymbolError = errors.UnboundSymbolError
var TypeMismatchError = errors.TypeMismatchError
// var typeMismatch = errors.typeMismatch

var coreLoaded = false

var evalContext = null
// getContext :: -> Context
const getContext = () => {
  if (!evalContext) {
    evalContext = emitter.getDefaultContext()
  }
  return evalContext
}

// Given text, evaluate and return the result
// evaluate :: String -> Boolean -> ?
const evaluate = (text, compile) => {
  var ast = pegjsUtil.parse(parser, text)
    // var jsonAst = JSON.stringify(ast, null, 2)
  if (ast.ast) {
    if (!coreLoaded) {
      vm.runInThisContext(emitter.emitEinCore() + ';\n', 'repl', {throwErrors: false})
      coreLoaded = true
      vm.runInThisContext(evaluate('(defn inc [x] (+ x 1))', compile), 'repl', {throwErrors: false})
      vm.runInThisContext(evaluate('(defn dec [x] (- x 1))', compile), 'repl', {throwErrors: false})
      vm.runInThisContext(evaluate('(def first head)', compile), 'repl', {throwErrors: false})
      vm.runInThisContext(evaluate('(defn second [v] (head (rest v)))', compile), 'repl', {throwErrors: false})
    }
    var emitStr = emitter.emit(analyzer.analyze(ast.ast), getContext())
      // console.log(emitter.emitEinCore());
    try {
      if (compile) {
        var vals = emitter.emitEinCore() + emitStr.join('\n')
        return vals
      } else {
        // console.log(emitStr);
        vals = emitStr.map(s => vm.runInThisContext(s, 'repl', {throwErrors: false}))
        return _.last(vals)
      }
    } catch (e) {
      // console.log(e);
      if (e.name === 'TypeMismatchError') {
        throw new TypeMismatchError(e.message)
      }
    }
  } else {
    throw new ParseError(ast.error.message, ast.error)
  }
}

var exports = module.exports = {}
exports.evaluate = evaluate

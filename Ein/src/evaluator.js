'use strict';

var parser = require('./grammar.js');
var emitter = require('./emitter.js');
var pegjsUtil = require('pegjs-util');
var vm = require('vm');
var _ = require('lodash');
var util = require('util');
var errors = require('./errors.js');
var core = require('./core.js');
var builtinAdd = core.builtinAdd;
var builtinSub = core.builtinSub;
var builtinMulti = core.builtinMulti;
var builtinDiv = core.builtinDiv;
var ParseError = errors.ParseError;
var UnboundSymbolError = errors.UnboundSymbolError;
var TypeMismatchError = errors.TypeMismatchError;
var typeMismatch = errors.typeMismatch;

//Given text, evaluate and return the result
var evaluate = (text) => {
    var ast = pegjsUtil.parse(parser, text);
    var jsonAst = JSON.stringify(ast, null, 2);
    if(ast.ast){
      var emitStr = emitter.emit(ast.ast, emitter.getDefaultContext());
      try {
        var vals = emitStr.map(s => eval(emitter.emitEinCore() + ";\n" +s));
        return _.last(vals);
      } catch(e) {
        if(e.name === "TypeMismatchError") {
          throw new TypeMismatchError(e.message);
        }
      }
    }else {
      throw new ParseError(ast.error.message, ast.error);
    }
};

var exports = module.exports = {};
exports.evaluate = evaluate;

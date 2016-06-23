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

//TODO: Move out
var fnTypeFn = (val) => {
  return {
    type: "Function",
    data: val
  };
}

//A function to create a new context
var createContext = (parentContext) => {
  return {
    parentContext: parentContext,
    symbolMap: {}
  }
}

//Add a symbol to a context
var addSymbol = (context, symbol, value) => {
  //TODO: Check if there is a conflict?
  context.symbolMap[symbol] = value;
  return context;
}

//Given a symbol and a context
var resolveSymbol = (context, symbol) => {
  var val = context.symbolMap[symbol.data];
  if(val === undefined || val === null){
    throw new UnboundSymbolError("Symbol '" + symbol.data + "' was unable to be resolved in this context");
  }
  return val;
};

//Eval an S-Expression
var evalSExpr = (sExpr, context) => {
  var sExprResult = sExpr.data.map((x) => {
    return interpret(x, context);
  });

  if(sExprResult[0].type !== "Function") {
    throw new TypeMismatchError("First item in a S-Expression is of type '" + sExprResult[0].type + "' instead of " + "Function");
  }
  var fn = sExprResult[0];
  if(fn.type === "Function") {
    return fn.data(_.tail(sExprResult));
  }
}

//Interpret an AST
var interpret = (ast, context) => {
  //If it is an array iterate and call interpret
  if(Array.isArray(ast)){
    return ast.map(obj => interpret(obj, context));
  }

  //Eval based on time
  if(ast.type === "S-Expression"){
    return evalSExpr(ast, context);
  } else if(ast.type === "Symbol"){
    return resolveSymbol(context, ast);
  }
  return ast;
};

//The default context for the language
var getDefaultContext = () => {
  var context = createContext(null);
  addSymbol(context, '+', fnTypeFn(builtinAdd));
  addSymbol(context, '-', fnTypeFn(builtinSub));
  addSymbol(context, '*', fnTypeFn(builtinMulti));
  addSymbol(context, '/', fnTypeFn(builtinDiv));
  return context;
}

//Given text, evaluate and return the result
var evaluate = (text) => {
    var ast = pegjsUtil.parse(parser, text);
    var jsonAst = JSON.stringify(ast, null, 2);
    if(ast.ast){
      //console.log(eval('-1'));
      //console.log("Before Core");
      //console.log(emitter.emitEinCore());
      //vm.runInThisContext(emitter.emitEinCore(), "repl");
      //console.log(emitter.emit(ast.ast, emitter.getDefaultContext()));
      var emitStr = emitter.emit(ast.ast, emitter.getDefaultContext());
      try {
        //console.log("Before main");
        var vals = emitStr.map(s => eval(emitter.emitEinCore() + ";\n" +s) /*vm.runInNewContext(emitter.emitEinCore() + "\n" +s)*/);
        //console.log("vals", vals);
        return _.last(vals);
      } catch(e) {
        //console.log("Error caught!");
        //return;
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

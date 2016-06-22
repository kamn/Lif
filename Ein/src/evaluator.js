'use strict';

var parser = require('./grammar.js');
var pegjsUtil = require('pegjs-util');
var _ = require('lodash');
var util = require('util');
var errors = require('./errors.js');
var ParseError = errors.ParseError;
var UnboundSymbolError = errors.UnboundSymbolError;
var TypeMismatchError = errors.TypeMismatchError;

//TODO: Move out
//A Helper function to create a new Integer type
var numTypeFn = (val) => {
  return {
    type: "Numeric",
    data: val
  }
}

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

//For addition of numeric
var builtinAdd = (list) =>
  numTypeFn(list.reduce((r,x) => {
    if(x.type !== "Numeric") throw new TypeMismatchError("Expected type 'Numeric', found '"+x.data+"' of type '"+x.type+"'.");
    return r + x.data;
  }, 0));

//For subtraction of numeric
var builtinSub = ([f, ...rest]) => {
  var val = 0;

  if(f === undefined) {
    val = 0;
  }else if(rest.length === 0){
    if(f.type !== "Numeric") throw new TypeMismatchError("Expected type 'Numeric', found '"+f.data+"' of type '"+f.type+"'.");
    val = -f.data;
  } else {
    if(f.type !== "Numeric") throw new TypeMismatchError("Expected type 'Numeric', found '"+f.data+"' of type '"+f.type+"'.");
    val = rest.reduce((r,x) => {
      if(x.type !== "Numeric") throw new TypeMismatchError("Expected type 'Numeric', found '"+x.data+"' of type '"+x.type+"'.");
      return r - x.data
    }, f.data);
  }

  return numTypeFn(val);
}

//For multiplication of numeric
var builtinMulti = (list) =>
  numTypeFn(list.reduce((r, x) => {
    if(x.type !== "Numeric") throw new TypeMismatchError("Expected type 'Numeric', found '"+x.data+"' of type '"+x.type+"'.");
    return r * x.data
  }, 1));

//For division of numeric
var builtinDiv = ([f, ...rest]) => {
  var val = 1;
  if(f === undefined) {
    val = 1;
  }else if(rest.length === 0){
    if(f.type !== "Numeric") throw new TypeMismatchError("Expected type 'Numeric', found '"+f.data+"' of type '"+f.type+"'.");
    val = 1 / f.data;
  } else {
    if(f.type !== "Numeric") throw new TypeMismatchError("Expected type 'Numeric', found '"+f.data+"' of type '"+f.type+"'.");

    val = rest.reduce((r,x) => {
      if(x.type !== "Numeric") throw new TypeMismatchError("Expected type 'Numeric', found '"+x.data+"' of type '"+x.type+"'.");
      return r / x.data
    }, f.data);
  }
  return numTypeFn(val);
}
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
  //try {
    var context = getDefaultContext();
    var ast = pegjsUtil.parse(parser, text);
    var jsonAst = JSON.stringify(ast, null, 2);
    if(ast.ast){
      var results = interpret(ast.ast, context);
      if(Array.isArray(results)) return _.last(results).data;
      return results.data;
    }else {
      throw new ParseError(ast.error.message, ast.error);
    }
  //} catch (e) {
  //  throw e;
  //}
};

var exports = module.exports = {};
exports.evaluate = evaluate;

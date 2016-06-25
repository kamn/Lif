var core = require('./core.js');
var builtinAdd = core.builtinAdd;
var builtinSub = core.builtinSub;
var builtinMulti = core.builtinMulti;
var builtinDiv = core.builtinDiv;

var errors = require('./errors.js');
var ParseError = errors.ParseError;
var UnboundSymbolError = errors.UnboundSymbolError;
var TypeMismatchError = errors.TypeMismatchError;
var typeMismatch = errors.typeMismatch;
var _ = require('lodash');

var EIN_CORE_DOT = "ein.core.";
var PLUS_FN_NAME = "__PLUS__";
var SUB_FN_NAME = "__SUB__";
var MULTI_FN_NAME = "__MULTI__";
var DIV_FN_NAME = "__DIV__";
var NL = ";\n\n";

var fnTypeFn = (name) => {
  return {
    type: "Function",
    fnName: name
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
var resolveSymbol = (symbol, context) => {
  var val = context.symbolMap[symbol];
  if(val === undefined || val === null){
    throw new UnboundSymbolError("Symbol '" + symbol + "' was unable to be resolved in this context");
  }
  return val;
};

//The default context for the language
var getDefaultContext = () => {
  var context = createContext(null);
  addSymbol(context, '+', fnTypeFn(EIN_CORE_DOT + PLUS_FN_NAME));
  addSymbol(context, '-', fnTypeFn(EIN_CORE_DOT + SUB_FN_NAME));
  addSymbol(context, '*', fnTypeFn(EIN_CORE_DOT + MULTI_FN_NAME));
  addSymbol(context, '/', fnTypeFn(EIN_CORE_DOT + DIV_FN_NAME))
  return context;
}

var emitEinCore = () => {
  var coreStr = "var ein = {};" + NL;
  coreStr += "ein.core = {};" + NL;
  coreStr += EIN_CORE_DOT + PLUS_FN_NAME+ " = " + builtinAdd.toString() + NL;
  coreStr += EIN_CORE_DOT + SUB_FN_NAME+ " = " + builtinSub.toString() + NL;
  coreStr += EIN_CORE_DOT + MULTI_FN_NAME+ " = " + builtinMulti.toString() + NL;
  coreStr += EIN_CORE_DOT + DIV_FN_NAME+ " = " + builtinDiv.toString() + NL;
  coreStr += EIN_CORE_DOT + "typeMismatch ="+ errors.typeMismatch.toString() + NL;
  coreStr += EIN_CORE_DOT + "isNumber = " + core.isNumber.toString() + NL;
  coreStr += EIN_CORE_DOT + "TypeMismatchError = " + TypeMismatchError.toString() + NL;
  return coreStr;
}

var emit = (ast, context) => {
  //If list iterate over the
  //If it is an array iterate and call interpret
  if(Array.isArray(ast)){
    return ast.map(obj => emit(obj, context));
  }

  //Eval based on time
  if(ast.type === "S-Expression") {
    return emitSExpr(ast, context);
  } else if(ast.type === "Symbol") {
    return emitSymbol(resolveSymbol(ast.data, context));
  } else if (ast.type === "Numeric") {
    return emitNumeric(ast, context);
  } else if (ast.type === "Boolean") {
    return emitBoolean(ast, context);
  } else if (ast.type === "Nil") {
    return emitNil(ast, context);
  } else if(ast.type === "Function") {
    return emitSymbol(ast, context);
  }
  return ast;
}

//SExpressions are often functions
var emitSExpr = (ast, context) => {

  var sExprResult = ast.data.map((x) => {
    return emit(x, context);
  });

  var fn = sExprResult[0];
  return sExprResult[0] + "(" +  emit(_.tail(sExprResult), context).join(", ") + ")";
}

var emitSymbol = (ast, context) => {
  if(ast.type === "Function") {
    return ast.fnName;
  }
}

//Emits a numeric
// AST
var emitNumeric = (ast, context) => ast.data;
var emitBoolean = (ast, context) => ast.data;
var emitNil = (ast, context) => null;

var exports = module.exports = {};
exports.emitEinCore = emitEinCore;
exports.emit = emit;
exports.getDefaultContext = getDefaultContext;

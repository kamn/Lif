var core = require('./core.js')
var builtinAdd = core.builtinAdd
var builtinSub = core.builtinSub
var builtinMulti = core.builtinMulti
var builtinDiv = core.builtinDiv
var builtinEqual = core.builtinEqual

var errors = require('./errors.js')
// var ParseError = errors.ParseError
var UnboundSymbolError = errors.UnboundSymbolError
var TypeMismatchError = errors.TypeMismatchError
// var typeMismatch = errors.typeMismatch
var _ = require('lodash')

var EIN_CORE_DOT = 'ein.core.'
var PLUS_FN_NAME = '__PLUS__'
var SUB_FN_NAME = '__SUB__'
var MULTI_FN_NAME = '__MULTI__'
var DIV_FN_NAME = '__DIV__'
var EQUALS_FN_NAME = '__EQUALS__'
var LESS_THAN_FN_NAME = '__LESSTHAN__'
var NOT_FN = '__NOT__'
var HEAD_FN_NAME = '__HEAD__'
var TAIL_FN_NAME = '__TAIL__'
var CONCAT_FN_NAME = '__CONCAT__'
// var DEF_FN_NAME = '__DEF__'

var NL = ';\n\n'
var EQ = ' = '
// var CORE = 'EinCore'
var CORE_DOT = 'EinCore.'

var fnTypeFn = (name) => {
  return {
    type: 'Function',
    fnName: name
  }
}

var declareTypeFn = (name) => {
  return {
    type: 'VarDeclaration',
    name: name
  }
}

// A function to create a new context
var createContext = (parentContext, name) => {
  return {
    parentContext: parentContext,
    symbolMap: {},
    name: name
  }
}

// Add a symbol to a context
var addSymbol = (context, symbol, value) => {
  // TODO: Check if there is a conflict?
  context.symbolMap[symbol] = value
  return context
}

// Given a symbol and a context
var resolveSymbol = (symbol, context) => {
  var val = context.symbolMap[symbol]
  if ((val === undefined || val === null) && context.parentContext === null) {
    throw new UnboundSymbolError('Symbol \'' + symbol + '\' was unable to be resolved in this context')
  } else if (val === undefined || val === null) {
    return resolveSymbol(symbol, context.parentContext)
  }
  return val
}

// The default context for the language
var getDefaultContext = () => {
  var context = createContext(null, 'ein.core')
  addSymbol(context, '+', fnTypeFn(EIN_CORE_DOT + PLUS_FN_NAME))
  addSymbol(context, '-', fnTypeFn(EIN_CORE_DOT + SUB_FN_NAME))
  addSymbol(context, '*', fnTypeFn(EIN_CORE_DOT + MULTI_FN_NAME))
  addSymbol(context, '/', fnTypeFn(EIN_CORE_DOT + DIV_FN_NAME))
  addSymbol(context, '=', fnTypeFn(EIN_CORE_DOT + EQUALS_FN_NAME))
  addSymbol(context, '<', fnTypeFn(EIN_CORE_DOT + LESS_THAN_FN_NAME))
  addSymbol(context, 'not', fnTypeFn(EIN_CORE_DOT + NOT_FN))
  addSymbol(context, 'head', fnTypeFn(EIN_CORE_DOT + HEAD_FN_NAME))
  addSymbol(context, 'rest', fnTypeFn(EIN_CORE_DOT + TAIL_FN_NAME))
  addSymbol(context, 'concat', fnTypeFn(EIN_CORE_DOT + CONCAT_FN_NAME))
  return context
}

var emitEinCore = () => {
  var coreStr = 'var ein = {};' + NL
  // REPL section
  coreStr += 'ein.repl = {}' + NL
  // Core section
  coreStr += 'ein.core = (function(){\n'
  coreStr += 'var EinCore = {}' + NL
  coreStr += CORE_DOT + PLUS_FN_NAME + EQ + builtinAdd.toString() + NL
  coreStr += CORE_DOT + SUB_FN_NAME + EQ + builtinSub.toString() + NL
  coreStr += CORE_DOT + MULTI_FN_NAME + EQ + builtinMulti.toString() + NL
  coreStr += CORE_DOT + DIV_FN_NAME + EQ + builtinDiv.toString() + NL
  coreStr += CORE_DOT + EQUALS_FN_NAME + EQ + builtinEqual.toString() + NL
  coreStr += CORE_DOT + LESS_THAN_FN_NAME + EQ + core.builtinLessThan.toString() + NL
  coreStr += CORE_DOT + NOT_FN + EQ + core.builtinNot.toString() + NL
  coreStr += CORE_DOT + HEAD_FN_NAME + EQ + core.vectorHead.toString() + NL
  coreStr += CORE_DOT + TAIL_FN_NAME + EQ + core.vectorTail.toString() + NL
  coreStr += CORE_DOT + CONCAT_FN_NAME + EQ + core.vectorConcat.toString() + NL
  coreStr += 'var typeMismatch = ' + errors.typeMismatch.toString() + NL
  coreStr += 'var isNumber = ' + core.isNumber.toString() + NL
  coreStr += 'var TypeMismatchError = ' + TypeMismatchError.toString() + NL
  coreStr += 'return EinCore'
  coreStr += '}());'
  return coreStr
}

var emitVar = (ast, context) => {
  // TODO: Add to the context;
  addSymbol(context, ast.symbol, declareTypeFn(context.name + '.' + ast.symbol))
  return context.name + '.' + ast.symbol + ' = ' + emit(ast.value, context)
}

var emit = (ast, context) => {
  // If list iterate over the
  // If it is an array iterate and call interpret
  if (Array.isArray(ast)) {
    return ast.map(obj => emit(obj, context))
  }

  // Eval based on time
  if (ast.type === 'S-Expression') {
    return emitSExpr(ast, context)
  } else if (ast.type === 'Symbol') {
    var resolvedSym = resolveSymbol(ast.data, context)
    if (resolvedSym.type === 'Function') {
      return emitSymbol(resolvedSym, context)
    } else if (resolvedSym.type === 'VarDeclaration') {
      return resolvedSym.name
      // resolvedSym.name = ast.
    }
  } else if (ast.type === 'Numeric') {
    return emitNumeric(ast, context)
  } else if (ast.type === 'Boolean') {
    return emitBoolean(ast, context)
  } else if (ast.type === 'Nil') {
    return emitNil(ast, context)
  } else if (ast.type === 'Function') {
    return emitSymbol(ast, context)
  } else if (ast.type === 'VarDeclaration') {
    return emitVar(ast, context)
  } else if (ast.type === 'FunctionDeclaration') {
    return emitFn(ast, context)
  } else if (ast.type === 'Vector') {
    return emitVector(ast, context)
  } else if (ast.type === 'IfExpression') {
    return emitIfExpr(ast, context)
  }
  return ast
}

// emitIfExpr :: AST -> Context -> String
var emitIfExpr = (ast, context) => {
  return `(${emit(ast.condition, context)}) ? ${emit(ast.ifBranch, context)} : ${emit(ast.elseBranch, context)}`
}

// emitVector :: AST -> Context -> String
var emitVector = (ast, context) => {
  return `[${ast.data.map(x => emit(x, context)).join(',')}]`
}

// emitFn :: AST -> Context -> String
var emitFn = (ast, context) => {
  var childContext = createContext(context)
  ast.arguments.data.forEach(x => addSymbol(childContext, x.data, declareTypeFn(x.data)))
  return '(' + ast.arguments.data.map(x => x.data).join(', ') + ') => { return ' + emit(ast.value, childContext) + '}'
}

// SExpressions are often functions
// emitSExpr :: AST -> Context -> AST | String
var emitSExpr = (ast, context) => {
  var sExprResult = ast.data.map((x) => {
    return emit(x, context)
  })

  // var fn = sExprResult[0]
  return sExprResult[0] + '(' + emit(_.tail(sExprResult), context).join(', ') + ')'
}

var emitSymbol = (ast, context) => {
  if (ast.type === 'Function') {
    return ast.fnName
  }
}

// Emits a numeric
// AST
var emitNumeric = (ast, context) => ast.data
var emitBoolean = (ast, context) => ast.data
var emitNil = (ast, context) => null

var exports = module.exports = {}
exports.emitEinCore = emitEinCore
exports.emit = emit
exports.getDefaultContext = getDefaultContext

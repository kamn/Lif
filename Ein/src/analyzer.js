var errors = require('./errors.js')
var ArityError = errors.ArityError

// The purpose of this module is to take the raw AST from the PEG
// And then redo the AST so the emitter can ignore logic

const AstTypes = {
  FN: 'Function',
  VAR_DECL: 'VarDeclaration',
  FN_DECL: 'FunctionDeclaration',
  IF_EXPR: 'IfExpression',
  S_EXPR: 'S-Expression',
  VEC: 'Vector',
  SYM: 'Symbol'
}

// analyzeSExpr :: PEGAst -> EinAst
const analyzeSExpr = (ast) => {
  if (ast.data[0] && ast.data[0].type === AstTypes.SYM) {
    var sym = ast.data[0].data
    if (sym === 'def') {
      if (ast.data.length !== 3) {
        throw new ArityError('Invalid number of arguments for def')
      }
      return {
        type: AstTypes.VAR_DECL,
        symbol: ast.data[1].data,
        value: analyze(ast.data[2])
      }
    }

    if (sym === 'if') {
      if (ast.data.length !== 4) {
        throw new ArityError('Invalid number of arguments for if')
      }

      return {
        type: AstTypes.IF_EXPR,
        condition: ast.data[1],
        ifBranch: ast.data[2],
        elseBranch: ast.data[3]
      }
    }

    if (sym === 'fn') {
      if (ast.data.length !== 3) {
        throw new ArityError('Invalid number of arguments for fn')
      }

      if (ast.data[1].type !== AstTypes.VEC) {
        throw new Error('Vector is required for Second argument of fn')
      }
      if (ast.data[2].type !== AstTypes.S_EXPR) {
        throw new Error('S-Expression is required for third argument of fn')
      }
      return {
        type: AstTypes.FN_DECL,
        arguments: ast.data[1],
        symbol: ast.data[0].data,
        value: analyze(ast.data[2])
      }
    }

    if (sym === 'defn') {
      if (ast.data[1].type !== AstTypes.SYM) {
        throw new Error('Symbol is required for second argument of fn')
      }
      if (ast.data[2].type !== AstTypes.VEC) {
        throw new Error('Vector is required for thrid argument of fn')
      }
      if (ast.data[3].type !== AstTypes.S_EXPR) {
        throw new Error('S-Expression is required for third argument of fn')
      }
      return {
        type: AstTypes.VAR_DECL,
        symbol: ast.data[1].data,
        value: analyze({
          type: AstTypes.FN_DECL,
          arguments: ast.data[2],
          symbol: ast.data[1].data,
          value: analyze(ast.data[3])
        })
      }
    }
  }
  return ast
}

// analyze :: PEGAst -> EinAst
const analyze = (ast) => {
  // If list iterate over the
  // If it is an array iterate and call interpret
  if (Array.isArray(ast)) {
    return ast.map(ast => analyze(ast))
  }
  // Eval based on time
  if (ast.type === AstTypes.S_EXPR) {
    return analyzeSExpr(ast)
  }
  return ast
}

var exports = module.exports = {}
exports.analyze = analyze

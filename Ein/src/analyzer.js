// The purpose of this module is to take the raw AST from the PEG
// And then redo the AST so the emitter can ignore logic

const AstTypes = {
  FN: 'Function',
  VAR_DECL: 'VarDeclaration',
  FN_DECL: 'FunctionDeclaration',
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
        throw new Error('Invalid number of arguments for def')
      }
      return {
        type: AstTypes.VAR_DECL,
        symbol: ast.data[1].data,
        value: analyze(ast.data[2])
      }
    }
    if (sym === 'fn') {
      if (ast.data.length !== 3) {
        throw new Error('Invalid number of arguments for fn')
      }

      if (ast.data[1].type !== AstTypes.VEC) {
        throw new Error('Vector is required for Second argument of fn')
      }
      if (ast.data[2].type !== AstTypes.S_EXPR) {
        throw new Error('S-Expression is required for third argument of fn')
      }
      // TODO: Check that second argument is vector
      // TODO: Check that thrid argument is sexpr
      return {
        type: AstTypes.FN_DECL,
        arguments: ast.data[1],
        symbol: ast.data[0].data,
        value: analyze(ast.data[2])
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

// The purpose of this module is to take the raw AST from the PEG
// And then redo the AST so the emitter can ignore logic

const AstTypes = {
  FN: "Function",
  VAR_DECL: "VarDeclaration",
  S_EXPR: "S-Expression",
  SYM: "Symbol",
}

// analyzeSExpr :: PEGAst -> EinAst
const analyzeSExpr = (ast) => {
  if(ast.data[0] && ast.data[0].type === AstTypes.SYM) {
    var sym = ast.data[0].data;
    if(sym === "def") {
      //TODO: Check length
      if(ast.data.length !== 3) {
        throw new Error("Invalid number of arguments for def");
      }
      return {
        type: AstTypes.VAR_DECL,
        symbol: ast.data[1].data,
        value: ast.data[2]
      }
    }
  }
  return ast;
}

// analyze :: PEGAst -> EinAst
const analyze = (ast) => {
  //If list iterate over the
  //If it is an array iterate and call interpret
  if(Array.isArray(ast)){
    return ast.map(ast => analyze(ast));
  }

  //Eval based on time
  if(ast.type === AstTypes.S_EXPR) {
    return analyzeSExpr(ast);
  }
  return ast;
}


var exports = module.exports = {};
exports.analyze = analyze;

var errors = require('./errors.js');
var ParseError = errors.ParseError;
var UnboundSymbolError = errors.UnboundSymbolError;
var TypeMismatchError = errors.TypeMismatchError;
var typeMismatch = errors.typeMismatch;

var isNumber = (n) => {
  return typeof n === "number";
}

//For addition of numeric
var builtinAdd = (...list) =>
  list.reduce((r,x) => {
    if(!isNumber(x)) typeMismatch('Numeric', typeof x, x);
    return r + x;
  }, 0);

//For subtraction of numeric
var builtinSub = (f, ...rest) => {
  var val = 0;

  if(f === undefined) {
    val = 0;
  }else if(rest.length === 0){
    if(!isNumber(f)) typeMismatch('Numeric', typeof f, f);
    val = -f;
  } else {
    if(!isNumber(f)) typeMismatch('Numeric', typeof f, f);
    val = rest.reduce((r,x) => {
      if(!isNumber(x)) typeMismatch('Numeric', typeof x, x);
      return r - x
    }, f);
  }

  return val;
}

//For multiplication of numeric
var builtinMulti = (...list) =>
  list.reduce((r, x) => {
    if(!isNumber(x)) typeMismatch('Numeric', typeof x, x);
    return r * x
  }, 1);

//For division of numeric
var builtinDiv = (f, ...rest) => {
  var val = 1;
  if(f === undefined) {
    val = 1;
  }else if(rest.length === 0){
    if(!isNumber(f)) typeMismatch('Numeric', typeof f, f);
    val = 1 / f;
  } else {
    if(!isNumber(f)) typeMismatch('Numeric', typeof f, f);
    val = rest.reduce((r,x) => {
      if(!isNumber(x)) typeMismatch('Numeric', typeof x, x);
      return r / x
    }, f);
  }
  return val;
}

var builtinEqual = (f, ...args) => {
  return args.reduce((r, x) => {
    return f === x && r;
  }, true);
}

var builtinLessThan = (...args) => {

}

var exports = module.exports = {};
exports.isNumber = isNumber;
exports.builtinAdd = builtinAdd;
exports.builtinSub = builtinSub;
exports.builtinMulti = builtinMulti;
exports.builtinDiv = builtinDiv;
exports.builtinEqual = builtinEqual;

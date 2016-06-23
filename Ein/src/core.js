var errors = require('./errors.js');
var ParseError = errors.ParseError;
var UnboundSymbolError = errors.UnboundSymbolError;
var TypeMismatchError = errors.TypeMismatchError;
var typeMismatch = errors.typeMismatch;

//A Helper function to create a new Integer type
var numTypeFn = (val) => {
  return {
    type: "Numeric",
    data: val
  }
}

//For addition of numeric
var builtinAdd = (list) =>
  numTypeFn(list.reduce((r,x) => {
    if(x.type !== "Numeric") typeMismatch('Numeric', x.type, x.data);
    return r + x.data;
  }, 0));

//For subtraction of numeric
var builtinSub = ([f, ...rest]) => {
  var val = 0;

  if(f === undefined) {
    val = 0;
  }else if(rest.length === 0){
    if(f.type !== "Numeric") typeMismatch('Numeric', f.type, f.data);
    val = -f.data;
  } else {
    if(f.type !== "Numeric") typeMismatch('Numeric', f.type, f.data);
    val = rest.reduce((r,x) => {
      if(x.type !== "Numeric") typeMismatch('Numeric', x.type, x.data);
      return r - x.data
    }, f.data);
  }

  return numTypeFn(val);
}

//For multiplication of numeric
var builtinMulti = (list) =>
  numTypeFn(list.reduce((r, x) => {
    if(x.type !== "Numeric") typeMismatch('Numeric', x.type, x.data);
    return r * x.data
  }, 1));

//For division of numeric
var builtinDiv = ([f, ...rest]) => {
  var val = 1;
  if(f === undefined) {
    val = 1;
  }else if(rest.length === 0){
    if(f.type !== "Numeric") typeMismatch('Numeric', f.type, f.data);
    val = 1 / f.data;
  } else {
    if(f.type !== "Numeric") typeMismatch('Numeric', f.type, f.data);

    val = rest.reduce((r,x) => {
      if(x.type !== "Numeric") typeMismatch('Numeric', x.type, x.data);
      return r / x.data
    }, f.data);
  }
  return numTypeFn(val);
}


var exports = module.exports = {};
exports.builtinAdd = builtinAdd;
exports.builtinSub = builtinSub;
exports.builtinMulti = builtinMulti;
exports.builtinDiv = builtinDiv;

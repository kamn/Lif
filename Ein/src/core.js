var errors = require('./errors.js')
// var UnboundSymbolError = errors.UnboundSymbolError
// var TypeMismatchError = errors.TypeMismatchError
var typeMismatch = errors.typeMismatch

var isNumber = (n) => {
  return typeof n === 'number'
}

// For addition of numeric
var builtinAdd = (...list) =>
  list.reduce((r, x) => {
    if (!isNumber(x)) typeMismatch('Numeric', typeof x, x)
    return r + x
  }, 0)

// For subtraction of numeric
var builtinSub = (f, ...rest) => {
  var val = 0

  if (f === undefined) {
    val = 0
  } else if (rest.length === 0) {
    if (!isNumber(f)) typeMismatch('Numeric', typeof f, f)
    val = -f
  } else {
    if (!isNumber(f)) typeMismatch('Numeric', typeof f, f)
    val = rest.reduce((r, x) => {
      if (!isNumber(x)) typeMismatch('Numeric', typeof x, x)
      return r - x
    }, f)
  }

  return val
}

// For multiplication of numeric
var builtinMulti = (...list) =>
  list.reduce((r, x) => {
    if (!isNumber(x)) typeMismatch('Numeric', typeof x, x)
    return r * x
  }, 1)

// For division of numeric
var builtinDiv = (f, ...rest) => {
  var val = 1
  if (f === undefined) {
    val = 1
  } else if (rest.length === 0) {
    if (!isNumber(f)) typeMismatch('Numeric', typeof f, f)
    val = 1 / f
  } else {
    if (!isNumber(f)) typeMismatch('Numeric', typeof f, f)
    val = rest.reduce((r, x) => {
      if (!isNumber(x)) typeMismatch('Numeric', typeof x, x)
      return r / x
    }, f)
  }
  return val
}

var builtinMod = (a, b) => {
  if (a === null || a === undefined) {

  } else if (b === null || b === undefined) {

  }
  return a % b
}

// builtinNot :: Boolean -> Boolean
var builtinNot = (b) => !b

// builtinAnd :: [Boolean] -> Boolean
var builtinAnd = (...args) => {
  return args.reduce((r, x) => {
    return x && r
  }, true)
}

// builtinOr :: [Boolean] -> Boolean
var builtinOr = (...args) => {
  return args.reduce((r, x) => {
    return x || r
  }, false)
}

// Compare two numbers
var builtinEqual = (f, ...args) => {
  return args.reduce((r, x) => {
    return f === x && r
  }, true)
}

// builtinLessThan ::
var builtinLessThan = (f, ...args) => {
  // NOTE: This is incorrect
  // You must check less than the previsou statement not first
  return args.reduce((r, x) => {
    return f < x && r
  }, true)
}

// vectorHead :: Vector -> First of Vector
var vectorHead = (v) => v[0]

var vectorTail = (v) => {
  var newVec = v.slice()
  newVec.shift()
  return newVec
}

// vectorConcat :: Vector -> Vector ->
var vectorConcat = (v1, v2) => {
  if (v1 === undefined || v1 === null) {
    return []
  }
  if (v2 === undefined || v2 === null) {
    return v1
  }
  return v1.concat(v2)
}

var exports = module.exports = {}
exports.isNumber = isNumber
exports.builtinAdd = builtinAdd
exports.builtinSub = builtinSub
exports.builtinMulti = builtinMulti
exports.builtinDiv = builtinDiv
exports.builtinMod = builtinMod
exports.builtinEqual = builtinEqual
exports.builtinLessThan = builtinLessThan
exports.builtinNot = builtinNot
exports.builtinAnd = builtinAnd
exports.builtinOr = builtinOr
exports.vectorHead = vectorHead
exports.vectorTail = vectorTail
exports.vectorConcat = vectorConcat

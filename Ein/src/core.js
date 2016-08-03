var errors = require('./errors.js')
// var UnboundSymbolError = errors.UnboundSymbolError
// var TypeMismatchError = errors.TypeMismatchError
var typeMismatch = errors.typeMismatch

var isNumber = (n) => {
  return typeof n === 'number'
}

var isBool = (n) => typeof n === 'boolean'

// For addition of numeric
var builtinAdd = (...list) => {
  return list.reduce((r, x) => {
    if (!isNumber(x)) typeMismatch('Numeric', typeof x, x)
    return r + x
  }, 0)
}

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

// For mod of numerics
var builtinMod = (a, b) => {
  if (a === null || a === undefined) {

  } else if (b === null || b === undefined) {

  }
  if (!isNumber(a)) typeMismatch('Numeric', typeof a, a)
  if (!isNumber(b)) typeMismatch('Numeric', typeof b, b)

  return a % b
}

// builtinNot :: Boolean -> Boolean
var builtinNot = (b) => {
  if (!isBool(b)) typeMismatch('Boolean', typeof b, b)
  return !b
}

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

var numericEquals = (a, b) => a === b

var vectorEquals = (a, b) => {
  if (a.length !== b.length) {
    return false
  }

  var result = true
  for (var i = 0; i < a.length; i++) {
    result = result && equals(a[i], b[i])
  }
  return result
}

var equals = (a, b) => {
  // TODO: Check they are the same type
  if (typeof a !== typeof b) {
    return false
  }
  if (typeof a === 'number') {
    return numericEquals(a, b)
  } else if (Array.isArray(a)) {
    return vectorEquals(a, b)
  }

  return a === b
}

// Compare two numbers
var builtinEqual = (f, ...args) => {
  return args.reduce((r, x) => {
    return equals(f, x) && r
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

var builtinCount = (i) => {
  return i.length
}

var builtinGet = (o, indx, notFound) => {
  var result = o[indx]
  notFound = notFound === undefined ? null : notFound
  return result === undefined ? notFound : result
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

var vectorReduce = (fn, v) => {
  return v.reduce((r, x) => {
    return fn(r, x)
  })
}

var print = (s) => console.log(s)

var exports = module.exports = {}
exports.isNumber = isNumber
exports.isBool = isBool
exports.builtinAdd = builtinAdd
exports.builtinSub = builtinSub
exports.builtinMulti = builtinMulti
exports.builtinDiv = builtinDiv
exports.builtinMod = builtinMod
exports.builtinEqual = builtinEqual
exports.equals = equals
exports.numericEquals = numericEquals
exports.vectorEquals = vectorEquals
exports.builtinLessThan = builtinLessThan
exports.builtinNot = builtinNot
exports.builtinAnd = builtinAnd
exports.builtinOr = builtinOr
exports.builtinCount = builtinCount
exports.builtinGet = builtinGet
exports.vectorHead = vectorHead
exports.vectorTail = vectorTail
exports.vectorConcat = vectorConcat
exports.vectorReduce = vectorReduce
exports.print = print

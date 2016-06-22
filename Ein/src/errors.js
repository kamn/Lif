var util = require('util');

//Error for Parsing issues
function ParseError(message, data) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.data = data;
};

util.inherits(ParseError, Error);

//Error for Unbound Symbol
function UnboundSymbolError(message, data) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.data = data;
};

util.inherits(UnboundSymbolError, Error);

//Error for TypeMismatch
function TypeMismatchError(message, data) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.data = data;
};

util.inherits(TypeMismatchError, Error);


var exports = module.exports = {};
exports.ParseError = ParseError;
exports.UnboundSymbolError = UnboundSymbolError;
exports.TypeMismatchError = TypeMismatchError;

var ein = require('../src/evaluator.js');
var eval = ein.evaluate;
var assert = require('chai').assert;
var expect = require('chai').expect;
var errors = require('../src/errors.js');
var ParseError = errors.ParseError;
var UnboundSymbolError = errors.UnboundSymbolError;
var TypeMismatchError = errors.TypeMismatchError;

describe('Parser', () => {
  describe('Numbers', () => {
    it('should parse zero', () => {
      assert.equal(1, eval('1'));
    });

    it('should parse positive numbers', () => {
      assert.equal(1, eval('1'));
    });

    it('should parse negative numbers', () => {
      assert.equal(-1, eval('-1'));
    });

    it('should not parse a number with a symbol after', () => {
      expect(eval.bind(eval,'1a')).to.throw(ParseError);
    });
  });
  it('should not parse an incomplete S-Expression', () => {
    expect(eval.bind(eval,'(')).to.throw(ParseError);
  });

  it('should not parse an incomplete S-Expression', () => {
    expect(eval.bind(eval,'())')).to.throw(ParseError);
  });

  it('should parse multiple symbols', () => {
    expect(eval.bind(eval,'+ -')).to.not.throw();
  });

  it('should parse multiple S-Expression', () => {
    expect(eval.bind(eval,'(+) (+)')).to.not.throw();
  });

  describe('Symbols', () => {
    it('should throw error on unknown symbols', () => {
      expect(eval.bind(eval,'(notreal 1 2)')).to.throw(UnboundSymbolError);
    });
  });
});

describe('Built-in Functions', () => {

  describe('Built-in Addition', () => {

    it('should return zero if called with no arguments', () => {
      assert.equal(0, eval('(+)'));
    });

    it('should return number if called with only one argument', () => {
      assert.equal(10, eval('(+ 10)'));
    });

    it('should correctly add positive numbers', () => {
      assert.equal(42, eval('(+ 7 3 2 8 5 5 10 1 1)'));
    });

    it('should correctly add negative numbers', () => {
      assert.equal(-15, eval('(+ -10 -5)'));
    });

    it('should correctly add with nested numbers', () => {
      assert.equal(42, eval('(+ (+ 7 3) (+ 2 8) (+ 5 5) 10 1 1)'));
    });

    it('should throw error if non numeric is passed', () => {
      expect(eval.bind(eval,'(+ 1 2 +)')).to.throw(TypeMismatchError);
    });
  });

  describe('Built-in Subtraction', () => {
    it('should return zero if called with no arguments', () => {
      assert.equal(0, eval('(-)'));
    });

    it('should return the negative of a number if called with one argument', () => {
      assert.equal(-100, eval('(- 100)'));
    });

    it('should correctly subtract values', () => {
      assert.equal(-10, eval('(- 20 10 10 5 4 1)'));
    });

    it('should correctly subtract negative values', () => {
      assert.equal(30, eval('(- 20 -10)'));
    });

    it('should correctly subtract nested values', () => {
      assert.equal(-10, eval('(- (- 20 10) 10 5 4 1)'));
    });

    it('should throw error if non numeric is passed', () => {
      expect(eval.bind(eval,'(- 1 2 -)')).to.throw(TypeMismatchError);
    });

    it('should throw error if non numeric is passed as only argument', () => {
      expect(eval.bind(eval,'(- -)')).to.throw(TypeMismatchError);
    });

    it('should throw error if non numeric is passed as first argument with second', () => {
      expect(eval.bind(eval,'(- - 2)')).to.throw(TypeMismatchError);
    });
  });

  describe('Built-in Multiplication', () => {
    it('should return one if called with no arguments', () => {
      assert.equal(1, eval('(*)'));
    });

    it('should return only argument if called with one arguments', () => {
      assert.equal(5, eval('(* 5)'));
    });

    it('should correctly multiply', () => {
      assert.equal(125, eval('(* 5 5 5)'));
    });

    it('should throw error if non numeric is passed', () => {
      expect(eval.bind(eval,'(* 1 2 *)')).to.throw(TypeMismatchError);
    });
  });

  describe('Built-in Division', () => {
    it('should return one if called with no arguments', () => {
      assert.equal(1, eval('(/)'));
    });

    it('should return 1/n if called with one argument', () => {
      assert.equal(0.1, eval('(/ 10)'));
    });

    it('should correctly divide', () => {
      assert.equal(10, eval('(/ 100 10)'));
    });

    it('should throw error if non numeric is passed', () => {
      expect(eval.bind(eval,'(/ 1 2 /)')).to.throw(TypeMismatchError);
    });

    it('should throw error if non numeric is passed as only argument', () => {
      expect(eval.bind(eval,'(/ /)')).to.throw(TypeMismatchError);
    });

    it('should throw error if non numeric is passed as first argument', () => {
      expect(eval.bind(eval,'(/ / 1)')).to.throw(TypeMismatchError);
    });
  });
});

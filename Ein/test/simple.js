var ein = require('../src/evaluator.js');
var eval = ein.evaluate;
var assert = require('chai').assert;
var expect = require('chai').expect;
var errors = require('../src/errors.js');
var ParseError = errors.ParseError;
var UnboundSymbolError = errors.UnboundSymbolError;
var TypeMismatchError = errors.TypeMismatchError;

describe('Parser', () => {
  it('should throw error if non numeric is passed', () => {
    expect(eval.bind(eval,'(+ 1 2 +)')).to.throw(TypeMismatchError);
  });
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

  describe('Keywords', () => {
    it('should not error on keywords', () => {
      expect(eval.bind(eval,':a')).to.not.throw();
    });
  });

  describe('Strings', () => {
    it('should not error on strings', () => {
      expect(eval.bind(eval,'"test"')).to.not.throw();
    });

    it('should not error on empty strings', () => {
      expect(eval.bind(eval,'""')).to.not.throw();
    });
  });

  describe('S-Expressions', () => {
    it('should parse empty', () => {
      expect(eval.bind(eval,'90')).to.not.throw();
    });
  });

  describe('Vectors', () => {
    it('should not error on Vectors', () => {
      expect(eval.bind(eval,'[1 2 3]')).to.not.throw();
    });

    it('should not error on empty Vectors', () => {
      expect(eval.bind(eval,'[]')).to.not.throw();
    });
  });

  describe('Sets', () => {
    it('should not error on Sets', () => {
      expect(eval.bind(eval,'#{1 2 3}')).to.not.throw();
    });

    it('should not error on empty Sets', () => {
      expect(eval.bind(eval,'#{}')).to.not.throw();
    });
  });

  describe('Maps', () => {
    it('should not error on Maps', () => {
      expect(eval.bind(eval,'{1:2 3:4}')).to.not.throw();
    });

    it('should not error on empty Maps', () => {
      expect(eval.bind(eval,'{}')).to.not.throw();
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

  describe('Built-in Equals', () => {
    it('should be true with no arguments', () => {
      assert.equal(true, eval('(=)'));
    });

    it('should be true with one argument', () => {
      assert.equal(true, eval('(= 1)'));
    });

    it('should be true with two ones', () => {
      assert.equal(true, eval('(= 1 1)'));
    });

    it('should be false with two difference numbers', () => {
      assert.equal(false, eval('(= 1 2)'));
    });

    it('should be true with sub expressions', () => {
      assert.equal(true, eval('(= (+ 1 1) 2)'));
    });
  });

  describe('Variables', () => {
    it('should be able to declare a simple variable', () => {
      assert.equal(1, eval('(def varA 1)'));
    });

    it('should be able to use thevariable', () => {
      assert.equal(2, eval('(+ varA 1)'));
    });

    it('should be able to declare a complex variable', () => {
      assert.equal(5, eval('(def varB (- (+ 5 5) 5))'));
    });

    it('should be able to give back value', () => {
      assert.equal(5, eval('varB'));
    });

    it('should throw error with too few arguments', () => {
      expect(eval.bind(eval,'(def varB)')).to.throw(Error);
    });

    it('should throw error with too many arguments', () => {
      expect(eval.bind(eval,'(def varB 1 1)')).to.throw(Error);
    });
  });

  describe('Functions', () => {
    it('should not error on valid function', () => {
      expect(eval.bind(eval,'(fn [] (+ 1 1))')).to.not.throw();
    });
    it('should throw error if first argument isn\'t Vector', () => {
      expect(eval.bind(eval,'(fn a (+ 1 1))')).to.throw();
    });
    it('should throw error if second argument isn\'t S-Expression', () => {
      expect(eval.bind(eval,'(fn [] a)')).to.throw();
    });

    it('should be able to assign to variable and use', () => {
      eval('(def testAdd1 (fn [a] (+ 1 a)))');
      assert.equal(6, eval('(testAdd1 5)'));
    });
  });
});

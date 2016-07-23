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
describe('Numeric', () => {
  describe('Addition', () => {

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

  describe('Subtraction', () => {
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

  describe('Multiplication', () => {
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

  describe('Division', () => {
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

  describe('Inc Fn', () => {
    /*it('should be 1 with no arguments', () => {
      assert.equal(1, eval('(inc)'));
    });*/

    it('should increment by one (Positive)', () => {
      assert.equal(2, eval('(inc 1)'));
    });

    it('should increment by one (Negative)', () => {
      assert.equal(-99, eval('(inc -100)'));
    });

    it('should throw an error if a non-Numeric is passed (Vector)', () => {
      expect(eval.bind(eval,'(inc [])')).to.throw(Error);
    });
  });

  describe('Dec Fn', () => {
    it('should decrement by one (Positive)', () => {
      assert.equal(1, eval('(dec 2)'));
    });

    it('should decrement by one (Negative)', () => {
      assert.equal(-101, eval('(dec -100)'));
    });

    it('should throw an error if a non-Numeric is passed (Vector)', () => {
      expect(eval.bind(eval,'(dec [])')).to.throw(Error);
    });
  });

  describe('Mod Fn', () => {
    it('should return 0 if numbers are equal', () => {
      assert.equal(0, eval('(mod 2 2)'));
    });

    it('should return 0 if multiple of second number', () => {
      assert.equal(0, eval('(mod 15 5)'));
    });

    it('should return remainder otherwise', () => {
      assert.equal(3, eval('(mod 9 6)'));
    });

    it('should return throw type mismatch if first argument is not a number', () => {
      expect(eval.bind(eval,'(mod + 2)')).to.throw(TypeMismatchError);
    });

    it('should return throw type mismatch if second argument is not a number', () => {
      expect(eval.bind(eval,'(mod 2 "a")')).to.throw(TypeMismatchError);
    });
  });
})

describe('Booleans', () => {
  describe('Not Fn', () => {
    it('should turn a true false', () => {
      assert.equal(false, eval('(not true)'));
    });

    it('should throw error if not a boolean', () => {
      expect(eval.bind(eval,'(not 1)')).to.throw();
    });
  });

  describe('And', () => {
    it('should be true if called with no arguments', () => {
      assert.equal(true, eval('(and)'));
    })

    it('should be true if only argument is true', () => {
      assert.equal(true, eval('(and true)'))
    })

    it('should be false if only argument is false', () => {
      assert.equal(false, eval('(and false)'))
    })

    it('should be true if all arguments are true', () => {
      assert.equal(true, eval('(and true (= 0 0) (= 1 1))'))
    })

    it('should be false if one arguments is false', () => {
      assert.equal(false, eval('(and true (= 0 0) (= 1 1) false)'))
    })
  });

  describe('Or', () => {
    it('should be false if called with no arguments', () => {
      assert.equal(false, eval('(or)'));
    })

    it('should be true if only argument is true', () => {
      assert.equal(true, eval('(or true)'))
    })

    it('should be false if only argument is false', () => {
      assert.equal(false, eval('(or false)'))
    })

    it('should be true if all arguments are true', () => {
      assert.equal(true, eval('(or true (= 0 0) (= 1 1))'))
    })

    it('should be true if one arguments is true', () => {
      assert.equal(true, eval('(or true (= 1 0) (= 2 1) false)'))
    })
  });
});

describe('Vectors', () => {
  describe('Head Fn', () => {
    it('should be null with empty vector', () => {
      assert.equal(null, eval('(head [])'));
    });

    it('should be first in vector (number)', () => {
      assert.equal(1, eval('(head [1])'));
    });

    it('should be true with two ones (boolean)', () => {
      assert.equal(true, eval('(head [true false])'));
    });
  });

  describe('First Fn', () => {
    it('should be null with empty vector', () => {
      assert.equal(null, eval('(first [])'));
    });

    it('should be first in vector (number)', () => {
      assert.equal(1, eval('(first [1])'));
    });

    it('should be true with two ones (boolean)', () => {
      assert.equal(true, eval('(first [true false])'));
    });
  });

  describe('Second Fn', () => {
    it('should be null with empty vector', () => {
      assert.equal(null, eval('(second [])'));
    });

    it('should be first in vector (number)', () => {
      assert.equal(null, eval('(second [1])'));
    });

    it('should be true with two ones (boolean)', () => {
      assert.equal(false, eval('(second [true false])'));
    });
  });

  describe('Rest Fn', () => {
    it('should be empty vector with empty vector', () => {
      assert.deepEqual([], eval('(rest [])'));
    });

    it('should get rest of Vector but first (Numeric)', () => {
      assert.deepEqual([1], eval('(rest [1 1])'));
    });

    it('should be true with two ones (boolean)', () => {
      assert.deepEqual([false, false], eval('(rest [true false false])'));
    });
  });

  describe('Concat Fn', () => {
    it('should return empty vector if called with no arguments', () => {
      assert.deepEqual([], eval('(concat)'));
    });

    it('should return first vector if called with one arguments', () => {
      assert.deepEqual([1], eval('(concat [1])'));
    });

    it('should return joined vectors', () => {
      assert.deepEqual([1,2,3,4], eval('(concat [1 2] [3 4])'));
    });
  });

  describe('Reduce Fn', () => {
    it('should be able to pass a function to reduce with a vector', () => {
      assert.deepEqual(6, eval('(reduce + [1 2 3])'));
    });

    it('should be able to pass a function to reduce with a vector', () => {
      assert.deepEqual(3, eval('(reduce (fn [r x] (if (< r x) x r)) [1 2 3])'));
    });
  });
});

describe('Built-in Functions', () => {


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

  describe('If', () => {
    it('should be able to us if statement in function', () => {
      eval('(defn ifTest1 [b] (if b 1 -1))');
      assert.equal(1, eval('(ifTest1 true)'));
      assert.equal(-1, eval('(ifTest1 false)'));
    });

    it('should be able to use if statement with fn condition', () => {
      eval('(defn ifTest2 [n] (if (= n 0) 1 -1))');
      assert.equal(-1, eval('(ifTest2 1)'));
      assert.equal(1, eval('(ifTest2 0)'));
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

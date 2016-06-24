var Benchmark = require('benchmark');
var vm = require('vm');
var suite = new Benchmark.Suite;
var ein = require('../src/evaluator.js');
var einEval = ein.evaluate;


const additionPerf = () => {
  var suite = new Benchmark.Suite;
  console.log("Starting Addition Performance Tests")
  suite.add('JS Eval Addition', function() {
    var t = vm.runInThisContext('10 + 10 + 10 + 10 + 10', "repl");
  })
  suite.add('Ein Eval Addition', function() {
    var t = einEval('(+ 10 10 10 10 10)');
  })
  .on('cycle', function(event) {
    console.log("|  " + String(event.target));
  })
  .on('complete', function() {
    console.log("--\n");
  })
  .run({'async': false, 'queued': true});
}

const subtractionPerf = () => {
  var suite = new Benchmark.Suite;
  console.log("Starting Subtraction Performance Tests")
  suite.add('JS Eval Subtraction', function() {
    var t = vm.runInThisContext('10 - 10 - 10 - 10 - 10', "repl");
  })
  suite.add('Ein Eval Subtraction', function() {
    var t = einEval('(- 10 10 10 10 10)');
  })
  .on('cycle', function(event) {
    console.log("|  " + String(event.target));
  })
  .on('complete', function() {
    console.log("--\n");
  })
  .run({'async': false, 'queued': true});
}

const multiplicationPerf = () => {
  var suite = new Benchmark.Suite;
  console.log("Starting Multiplication Performance Tests")
  suite.add('JS Eval Multiplication', function() {
    var t = vm.runInThisContext('10 * 10 * 10 * 10 * 10', "repl");
  })
  suite.add('Ein Eval Multiplication', function() {
    var t = einEval('(* 10 10 10 10 10)');
  })
  .on('cycle', function(event) {
    console.log("|  " + String(event.target));
  })
  .on('complete', function() {
    console.log("--\n");
  })
  .run({'async': false, 'queued': true});
}

const divisionPerf = () => {
  var suite = new Benchmark.Suite;
  console.log("Starting Division Performance Tests")
  suite.add('JS Eval Division', function() {
    var t = vm.runInThisContext('1000 / 10 / 10', "repl");
  })
  suite.add('Ein Eval Division', function() {
    var t = einEval('(/ 1000 10 10)');
  })
  .on('cycle', function(event) {
    console.log("|  " + String(event.target));
  })
  .on('complete', function() {
    console.log("--\n");
  })
  .run({'async': false, 'queued': true});
}

additionPerf();
subtractionPerf();
multiplicationPerf();
divisionPerf();

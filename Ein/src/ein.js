#!/usr/bin/env node
'use strict';

//A thin wrapper for the REPL

var VERSION = '0.0.1';

var evaluator = require('./evaluator.js');
var readline = require('readline');
var colors = require('colors/safe');
var _ = require('lodash');
var fs = require('fs');
var emitter = require('./emitter.js');

//
var getErrorDisplayName = (e) => {
  if(e.name === 'ParseError') return 'PARSE ERROR';
  if(e.name === 'UnboundSymbolError') return 'UNBOUND SYMBOL ERROR';
  if(e.name === 'TypeMismatchError') return 'TYPE MISMATCH ERROR';
  return 'UNKNOWN ERROR';
}

var printError = (file, e) => {
  var startStr = '-- ' + getErrorDisplayName(e) + ' ';
  var endStr = ' ' + file;
  var middleStr = _.repeat('-', 80 - startStr.length - endStr.length);
  console.log(colors.cyan(startStr + middleStr + endStr));
  console.log('');
  console.log(e.message);
  if(e.data){
    console.log('');
    var source = e.data.location.prolog + e.data.location.token + e.data.location.epilog;
    var lines = source.split('\\n');
    var lineStartStr = e.data.line + '|';
    console.log(lineStartStr + lines[(e.data.line - 1)]);
    console.log(colors.red(_.repeat(' ', (lineStartStr.length + e.data.column - 1)) + '^'));
  }
}

//Create a prompt that is called recursivly(because of async nature of prompts)
//NOTE: Unsure about how this affects the callstack
var recursivePrompt = function() {
  rl.question('Ein> ', function(text) {
    if(text === ':q') {
       rl.close();
       return;
    }
    try {
      console.log(evaluator.evaluate(_.trim(text)));
    } catch(e) {
      printError('REPL', e);
    }
    recursivePrompt();
  });
}

var program = require('commander');
program
.version('0.0.2')
.option('-c, --compile <file>', 'Compile the specified file <file>')
.option('-o, --output <file>', 'File to create <file>')
.parse(process.argv);

//For now this is REPL based only
if(process.argv.length === 2) {
  console.log('Ein Repl');
  console.log('Version: ' + VERSION);
  console.log('Enter :q to exit');
  var rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
  });
  recursivePrompt();
} else {
  var file = process.argv[2];
  if(program.compile && !program.output) {
    console.log("Output file not specified");
    return;
  }
  if(program.compile && program.output) {
    file = program.compile
  }
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    } else {
      try {
        var result = evaluator.evaluate(_.trim(data), program.compile)
        if(program.compile) {
          fs.writeFile(program.output, result, function(err) {
              if(err) {
                  return console.log(err);
              }

              console.log(`Ein compiled and saved to ${program.compile}`);
          });
        } else {
          console.log(result);
        }

      } catch(e) {
        printError(process.argv[2], e);
      }
    }
  });
}

'use strict';

var fs = require('fs');
var run = require('./run');
var importJson = __dirname+'/../../../import.json';

if( !fs.existsSync(importJson) ) {
  var example = {
    path : '/home/user/calvin-network-data/data'
  };

  console.log('Error.\nYou need to create a \'import.json\' file in '+
              'the root of this repository.\n\nSample import.json:\n'+
              JSON.stringify(example, '', '  ')+'\n');
  process.exit();
}

importJson = require(importJson);

var timeslice = false;
if( process.argv.length > 2 && process.argv[2] === '--timeslice' ) {
  timeslice = true;
}

run(importJson.path, timeslice);

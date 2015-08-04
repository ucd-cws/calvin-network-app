'use strict';

var run = require('./run');

if( process.argv.length < 4 ) {
  console.error('Invalid params.  Repo path name required.  See README.md');
  process.exit();
}

var dir = process.argv[2];
run(dir);

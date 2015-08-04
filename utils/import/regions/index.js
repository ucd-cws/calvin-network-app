'use strict';

var run = require('./run');

if( process.argv.length < 4 ) {
  console.error('Invalid params.  Repo path and branch name required.  See README.md');
  process.exit();
}

var dir = process.argv[2], branch = process.argv[3];
run(dir, branch);

'use strict';

var run = require('./run');
var path = require('path');
var fs = require('fs');

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

var importJson = path.join(getUserHome(), '.prmconf');

if( !fs.existsSync(importJson) ) {
  var example = {
    data : '/home/user/calvin-network-data/data'
  };

  console.log('Error.\nYou need to create a \'.prmconf\' file in '+
              'your home directory: '+getUserHome()+'.\n\nSample .prmconf:\n'+
              JSON.stringify(example, '', '  ')+'\n');
  process.exit();
}

importJson = JSON.parse(fs.readFileSync(importJson,'utf-8'));

var timeslice = false;
if( process.argv.length > 2 && process.argv[2] === '--timeslice' ) {
  timeslice = true;
}

run(importJson.data, timeslice);

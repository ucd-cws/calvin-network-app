var fs = require('fs');
var path = require('path');

var importJson = path.join(__dirname, '..', 'import.json');
var config;

if( fs.existsSync(importJson) ) {
  config = JSON.parse(fs.readFileSync(importJson, 'utf-8'));
}

module.exports = config;

var fs = require('fs');
var path = require('path');

var importJson = path.join(__dirname, '..', 'import.json');
var config;


function rootConfig() {
  var prmconf = path.join(getUserHome(), '.prmconf');
  if( fs.existsSync(prmconf) ) {
    return eval('('+fs.readFileSync(prmconf, 'utf-8')+')').data;
  }
  return '';
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = {
  init : function(commandLine) {
    config = commandLine;

    if( !config.get('path') ) {
      var rootPath = rootConfig();
      if( fs.existsSync(importJson) ) {
        config.set('path', JSON.parse(fs.readFileSync(importJson, 'utf-8')));
      } else if( rootPath ) {
        config.set('path', rootPath);
      }
    }

    if( !config.get('path') ) {
      console.log('No data path provided!  Please pass with --path flag or set in ~/.prmconf file');
      process.exit(-1);
    }
  },

  get : function() {
    return config;
  }
}

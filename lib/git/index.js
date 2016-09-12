'use strict';

var exec = require('child_process').exec;
var url = require('url');

module.exports = {
    name: 'git',
    info : gitInfo
};

function gitInfo(cwd, callback) {
    var c = 0;
    var resp = {};

    function onResp(key, text) {
        if( typeof key === 'object' ) {
          for( var i in key ) {
            resp[i] = key[i];
          }
        } else {
          resp[key] = text;
        }
        
        c++;
        if( c === 4 ) {
          callback(resp);
        }
    }

    exec('git describe --tags', {cwd: cwd},
      function (error, stdout, stderr) {
        onResp('tag', stdout.replace(/\n/,'').trim());
      }
    );
    exec('git branch | grep \'\\*\'', {cwd: cwd},
      function (error, stdout, stderr) {
        onResp('branch', stdout ? stdout.replace(/\*/,'').trim() : '');
      }
    );
    exec('git log  -1 | sed -n 1p', {cwd: cwd},
      function (error, stdout, stderr) {
        onResp('commit', stdout ? stdout.replace(/commit\s/,'').replace(/\n/g,'') : '');
      }
    );
    exec('git config --get remote.origin.url', {cwd: cwd},
      function (error, stdout, stderr) {
        if( !stdout ) {
          onResp('origin', '');
        } else {
          var urlInfo = url.parse(stdout);
          onResp({
            origin : urlInfo.hostname,
            repository : urlInfo.path.replace(/^\//,'').replace(/.git$/,'')
          });
        }
      }
    );
}

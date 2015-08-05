'use strict';

var watch = require('./watch');
var socket = require('./socket');
var importer = require('../../utils/import/regions/run');
var fs = require('fs');
var path = '', updateTimer = -1;

var running = false, pending = false;

module.exports.prod = function(app) {
  app.get('/rest/isDev', function(req, res){
    res.send({isDev: false});
  });
};

module.exports.init = function(server, app) {
  var importJson = getConfig();
  if( !importJson ) {
    return console.log('Running in dev mode, but not import.json file found in your root directory.'+
      ' Data repo will not be watched');
  }

  app.get('/rest/isDev', function(req, res){
    res.send({isDev: true});
  });

  socket.init(server);

  watch.on('update', onUpdate);

  path = importJson.path;
  watch.start(path);
};

function onUpdate(details) {
  if( running ) {
    pending = true;
    return;
  }

  var importJson = getConfig();
  path = importJson.path;

  if( updateTimer !== -1 ) {
    clearTimeout(updateTimer);
  }

  updateTimer = setTimeout(function(){
    updateTimer = -1;
    _onUpdate(details);
  }, 100);
}


function _onUpdate(details) {
  running = true;
  console.log('Data repo update detected.  Running import. '+path);
  socket.send('network-update-start',{});

  importer(path, function(msg, done){
    if( done ) {
      socket.send('network-update-end',{});
    } else if( msg) {
      socket.send('network-update-msg',{msg: msg});
    }

    running = false;
    if( pending ) {
      pending = false;
      onUpdate({});
    }
  });
}

function getConfig() {
  var importJson = __dirname+'/../../import.json';

  if( !fs.existsSync(importJson) ) {
    return null;
  }

  return JSON.parse(fs.readFileSync(importJson, 'utf-8'));
}

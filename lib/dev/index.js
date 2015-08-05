'use strict';

var watch = require('./watch');
var socket = require('./socket');
var importer = require('../../utils/import/regions/run');
var fs = require('fs');
var path = '', updateTimer = -1;

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
  if( updateTimer !== -1 ) {
    clearTimeout(updateTimer);
  }

  updateTimer = setTimeout(function(){
    updateTimer = -1;
    _onUpdate(details);
  }, 100);
}


function _onUpdate(details) {
  console.log('Data repo update detected.  Running import.');
  socket.send('network-update-start',{});

  importer(path, function(){
    socket.send('network-update-end',{});
  });
}

function getConfig() {
  var importJson = __dirname+'/../../import.json';

  if( !fs.existsSync(importJson) ) {
    return null;
  }

  return require(importJson);
}

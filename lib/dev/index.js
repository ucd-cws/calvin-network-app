'use strict';

var watch = require('./watch');
var socket = require('./socket');
var db = require('../database');
var fs = require('fs');
var config = require('../config').get();

var path = config.get('path'), updateTimer = -1;
var running = false, pending = false;

var isDev = false;
var timeseriesProcessing = false;

module.exports.prod = function(app) {
  app.get('/rest/isDev', function(req, res){
    res.send({isDev: false});
  });
};

module.exports.init = function(server, app) {
  if( !path ) {
    return console.log('Running in dev mode, but not import.json file found in your root directory.'+
      ' Data repo will not be watched');
  }

  isDev = true;

  app.get('/rest/isDev', function(req, res){
    res.send({
      isDev: true,
      timeseriesProcessing : timeseriesProcessing
    });
  });

  socket.init(server, path, onUpdate);

  watch.on('update', onUpdate);
  watch.start(path);
};

module.exports.timeseriesProcessing = function(processing) {
  timeseriesProcessing = processing;
}

module.exports.isDev = function() {
  return isDev;
}

module.exports.getDevSocket = function() {
  return socket;
}

function onUpdate(details) {
  if( running ) {
    pending = true;
    return;
  }

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

  db.loadNetwork(function(){
    socket.send('network-update-end',{});
    // socket.send('network-update-msg',{msg: msg});

    running = false;
    if( pending ) {
      pending = false;
      onUpdate({});
    }
  });
}
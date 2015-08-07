'use strict';

var io = require('socket.io');
var socket;

module.exports.init = function(app, path, force) {
  io = io(app);

  io.on('connection', function (s) {
    console.log('Dev socket connected');
    socket = s;

    socket.emit('network-wired-to', {dir: path});

    socket.on('force-refresh', force);
  });


};

module.exports.send = function(event, details) {
  if( !socket ) {
    return console.log('Attempting to send \''+event+'\' '+JSON.stringify(details)+', but no socket connected');
  }
  socket.emit(event, details);
};

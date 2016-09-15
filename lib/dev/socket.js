'use strict';

var io = require('socket.io');
var sockets = [];

module.exports.init = function(app, path, force) {
  io = io(app);

  io.on('connection', function (socket) {
    sockets.push(socket);

    socket.emit('network-wired-to', {dir: path});
    socket.on('force-refresh', force);

    socket.on('disconnect', function(){
      sockets.splice(sockets.indexOf(socket), 1);
    });
  });


};

module.exports.send = function(event, details) {
  sockets.forEach((socket) => {
    socket.emit(event, details);
  });
};

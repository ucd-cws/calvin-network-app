'use strict';
var events = require('events');
events = new events.EventEmitter();
var watch = require('watch');
var fileMonitor;

module.exports.start = function(dir) {
  if( fileMonitor ){
    return console.log('Attempting to monitor '+dir+' but watch is already active');
  }

  watch.createMonitor(dir, function (monitor) {
    fileMonitor = monitor;

    monitor.on('created', function (f, stat) {
      events.emit('update', {
        event : 'created',
        file : f,
        stat : stat
      });
    });

    monitor.on('changed', function (f, curr, prev) {
      events.emit('update', {
        event : 'changed',
        file : f,
        curr : curr,
        prev : prev
      });
    });

    monitor.on('removed', function (f, stat) {
      events.emit('update', {
        event : 'changed',
        file : f,
        stat : stat
      });
    });

    console.log('Dev file monitor setup for: '+dir);
  });
};

module.exports.on = function(event, callback){
  events.on(event, callback);
};

module.exports.stop = function() {
  if( !fileMonitor ) {
    return;
  }
  fileMonitor.stop(); // Stop watching
  fileMonitor = null;
};

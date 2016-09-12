'use strict';
var events = require('events');
events = new events.EventEmitter();
var watch = require('watch');
var fileMonitor, jsonMonitor;
var sprintf = require('sprintf');

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

    console.log(sprintf('%-40.40s%10s', 'Monitoring Filesystem:', dir));

    var git = require('../git');
    git.info(dir, function(info){
      console.log('Git Info:');
      console.log(sprintf('    %-36.36s%s', 'Branch:', info.branch ));
      console.log(sprintf('    %-36.36s%s', 'Tag:', info.tag));
      console.log(sprintf('    %-36.36s%s', 'Origin:', info.origin));
      console.log(sprintf('    %-36.36s%s', 'Repository:', info.repository));
      console.log(sprintf('    %-36.36s%s', 'Commit:', info.commit));
      console.log('\n================================================================== \n');
    });
  });

  watch.createMonitor(__dirname+'/../../',
    {
      filter : function(file) {
        if( file.match(/.*import\.json$/) ) {
          return true;
        }
        return false;
      }
    },
    function (monitor) {
      jsonMonitor = monitor;
      monitor.on('created', function (f, stat) {
        events.emit('update', {event : 'created', configUpdate: true});
      });
      monitor.on('changed', function (f, curr, prev) {
        events.emit('update', {event : 'changed', configUpdate: true});
      });
      monitor.on('removed', function (f, stat) {
        events.emit('update', {event : 'changed', configUpdate: true});
      });
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

  jsonMonitor.stop();
};

'use strict';
var async = require('async');
var calcAmpLoss = require('./calcAmpLoss');
var db = require('../../lib/database');

module.exports = function(originRegion, terminusRegion, callback) {
  db.getRegionById(originRegion, (err, origin) => {
    if( err ) return callback(err);
    db.getRegionById(terminusRegion, (err, terminus) => {
      if( err ) return callback(err);
      process(origin, terminus, callback);
    });
  });
};

function process(origin, terminus, callback) {
  var incomingLinks = [];
  var outgoingLinks = [];

  var results = {
    __init__ : true
  };

  for( var i = 0; i < origin.properties.hobbes.origins.length; i++ ) {
    var info = origin.properties.hobbes.origins[i];
    if( terminus.properties.hobbes.nodes.indexOf(info.node) > -1 ) {
      incomingLinks.push(info.link);
    }
  }

  for( var i = 0; i < origin.properties.hobbes.terminals.length; i++ ) {
    var info = origin.properties.hobbes.terminals[i];
    if( terminus.properties.hobbes.nodes.indexOf(info.node) > -1 ) {
      outgoingLinks.push(info.link);
    }
  }

  calcLinkInflows(incomingLinks, results, () => {
    calcLinkOutflows(outgoingLinks, results, () => {
      callback(null, {
        data: results,
        incomingLinks : incomingLinks,
        outgoingLinks : outgoingLinks
      });
    });
  });
}

function calcLinkInflows(ids, results, callback) {
  async.eachSeries(ids,
    (id, next) => {
      db.getNodeById(id, (err, link) => {
        db.getExtras(link.properties.prmname, (err, extras) => {
          processLinkInflow(link, extras, results);
          next();
        });
      });
    },
    (err) => {
      callback();
    }
  )
}

function calcLinkOutflows(ids, results, callback) {
  async.eachSeries(ids,
    (id, next) => {
      db.getNodeById(id, (err, link) => {
        db.getExtras(link.properties.prmname, (err, extras) => {
          processLinkOutflow(link, extras, results);
          next();
        });
      });
    },
    (err) => {
      callback();
    }
  )
}

function processLinkInflow(link, extras, results) {
  if( !extras.flow ) return;

  var data = extras.flow;
  if( results.__init__ ) {
    initResults(results, data);
  }

  for( var i = 1; i < data.length; i++ ) {
    results[data[i][0]].linkInflow += data[i][1] || 0;
    if( link.properties.amplitude !== undefined ) {
      results[data[i][0]].amplitudeLoss += calcAmpLoss(link.properties.amplitude, data[i][1] || 0);
    }
  }
}

function processLinkOutflow(link, extras, results) {
  if( !extras.flow ) return;

  var data = extras.flow;
  if( results.__init__ ) {
    initResults(results, data);
  }

  for( var i = 1; i < data.length; i++ ) {
    results[data[i][0]].linkOutflow += data[i][1] || 0;
    if( link.properties.amplitude !== undefined ) {
      results[data[i][0]].amplitudeLoss += calcAmpLoss(link.properties.amplitude, data[i][1] || 0);
    }
  }
}

function appendResults(label, data, results) {
  if( !data ) return;

  if( results.__init__ ) {
    initResults(results, data);
  }

  for( var i = 1; i < data.length; i++ ) {
    results[data[i][0]][label] += data[i][1];
  }
}

function initResults(results, data) {
  for( var i = 1; i < data.length; i++ ) {
    results[data[i][0]] = initResult();
  }
  delete results.__init__;
}

function initResult() {
  return {
    amplitudeLoss : 0,
    linkInflow : 0,
    linkOutflow : 0
  }
}
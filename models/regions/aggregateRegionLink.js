'use strict';
var async = require('async');
var calcAmpLoss = require('./calcAmpLoss');
var db = require('../../lib/database');

module.exports = function(originRegion, terminusRegion, callback) {
  var origin = db.getRegionById(originRegion);
  if( !origin ) origin = db.getNodeById(originRegion);
  if( !origin ) return callback(`Invalid origin id: ${originRegion}`);

  var terminus = db.getRegionById(terminusRegion);
  if( !terminus ) terminus = db.getNodeById(terminusRegion);
  if( !terminus ) return callback(`Invalid terminus id: ${terminusRegion}`);

  if( origin.properties.hobbes.type !== 'region' && terminus.properties.hobbes.type !== 'region' ) {
    return callback(`Either the origin or the terminus needs to be an region`);
  }

  process(origin, terminus, callback);
};

function process(origin, terminus, callback) {
  var incomingLinks = [];
  var outgoingLinks = [];

  var results = {
    __init__ : true
  };

  if( origin.properties.hobbes.type === 'region' && terminus.properties.hobbes.type === 'region' ) {
    createRegionToRegionLinks(origin, terminus, incomingLinks, outgoingLinks);
  } else if( origin.properties.hobbes.type === 'region' && terminus.properties.hobbes.type !== 'region' ) {
    createNodeToRegionLinks(terminus, origin, incomingLinks, outgoingLinks);
  } else if( origin.properties.hobbes.type !== 'region' && terminus.properties.hobbes.type === 'region' ) {
    createNodeToRegionLinks(origin, terminus, outgoingLinks, incomingLinks);
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

function createNodeToRegionLinks(node, region, incomingLinks, outgoingLinks) {
  console.log(region.properties.hobbes);

  for( var i = 0; i < region.properties.hobbes.origins.length; i++ ) {
    var info = region.properties.hobbes.origins[i];
    if( info.node === node.properties.hobbes.id ) {
      incomingLinks.push(info.link);
    }
  }

  for( var i = 0; i < region.properties.hobbes.terminals.length; i++ ) {
    var info = region.properties.hobbes.terminals[i];
    if( info.node === node.properties.hobbes.id) {
      outgoingLinks.push(info.link);
    }
  }
}

function createRegionToRegionLinks(origin, terminus, incomingLinks, outgoingLinks) {
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
}


function calcLinkInflows(ids, results, callback) {
  async.eachSeries(ids,
    (id, next) => {
      var link = db.getNodeById(id);
      db.getExtras(link.properties.hobbes.id, (err, extras) => {
        processLinkInflow(link, extras, results);
        next();
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
      var link = db.getNodeById(id);
      db.getExtras(link.properties.hobbes.id, (err, extras) => {
        processLinkOutflow(link, extras, results);
        next();
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
'use strict';

var utils = require('./utils');
var async = require('async');
var extend = require('extend');
var calcAmpLoss = require('./calcAmpLoss');

var db = require('../../lib/database');

module.exports = function(id, callback) {
  id = id.replace(/,/g, '/');

  db.getRegionById(id, (err, region) => {
    if( err ) return callback(err);

    var results = {
      __init__ : true
    };

    var nodesAndLinks = extend(true, [], region.properties.hobbes.nodes);
    region.properties.hobbes.links.forEach(id => nodesAndLinks.push(id));

    console.log(nodesAndLinks.length);

    async.eachSeries(nodesAndLinks,
      (id, next) => {
        db.getNodeById(id, (err, node) => {
          if( err ) throw err; 

          db.getExtras(node.properties.prmname, (err, extras) => {
            if( err ) throw err; 

            processRegionNode(node, extras, results);
            next();
          });
        });
      },
      (err) => {
        calcLinkInflows(region, results, () => {
          calcLinkOutflows(region, results, () => {
            callback(err, results);
          });
        });
      }
    );
  });
};

function calcLinkInflows(region, results, callback) {
  async.eachSeries(region.properties.hobbes.origins,
    (origin, next) => {
      db.getNodeById(origin.link, (err, node) => {
        db.getExtras(node.properties.prmname, (err, extras) => {
          processRegionLinkInflow(node, extras, results);
          next();
        });
      });
    },
    (err) => {
      callback();
    }
  )
}

function calcLinkOutflows(region, results, callback) {
  async.eachSeries(region.properties.hobbes.terminals,
    (origin, next) => {
      db.getNodeById(origin.link, (err, node) => {
        db.getExtras(node.properties.prmname, (err, extras) => {
          processRegionLinkOutflow(node, extras, results);
          next();
        });
      });
    },
    (err) => {
      callback();
    }
  )
}

function processRegionNode(node, extras, results) {
  processRegionInflow(node, extras, results);
  processRegionSinks(node, extras, results);
  processRegionEvaporation(node, extras, results);
  processRegionAmplitudeLoss(node, extras, results);
}

function processRegionLinkInflow(node, extras, results) {
  if( !extras.flow ) return;

  var data = extras.flow;
  if( results.__init__ ) {
    initResults(results, data);
  }

  for( var i = 1; i < data.length; i++ ) {
    results[data[i][0]].linkInflow += data[i][1] || 0;
  }
}

function processRegionLinkOutflow(node, extras, results) {
  if( !extras.flow ) return;

  var data = extras.flow;
  if( results.__init__ ) {
    initResults(results, data);
  }

  for( var i = 1; i < data.length; i++ ) {
    results[data[i][0]].linkOutflow += data[i][1] || 0;
  }
}

function processRegionInflow(node, extras, results) {
  if( !extras.inflows ) return;

  for( var name in extras.inflows  ) {
    appendResults('localInflow', extras.inflows[name].inflow, results);
  }
}

function processRegionSinks(node, extras, results) {
  if( !extras.sinks ) return;

  for( var i = 0; i < extras.sinks.length; i++ ) {
    for( var name in extras.sinks[i] ) {
      appendResults('sink', extras.sinks[i][name].flow, results);
    }
  }
}

function processRegionEvaporation(node, extras, results) {
  if( !extras.evaporation ) return;

  appendResults('evaporation', extras.evaporation, results);
}

function processRegionAmplitudeLoss(node, extras, results) {
  if( node.properties.amplitude === undefined || !extras.flow ) return;

  var data = extras.flow;
  if( results.__init__ ) {
    initResults(results, data);
  }

  for( var i = 1; i < data.length; i++ ) {
    results[data[i][0]].amplitudeLoss += calcAmpLoss(node.properties.amplitude, data[i][1] || 0);
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
    evaporation : 0,
    amplitudeLoss : 0,
    sink : 0,
    localInflow : 0,
    linkInflow : 0,
    linkOutflow : 0
  }
}
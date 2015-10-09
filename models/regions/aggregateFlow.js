'use strict';
var utils = require('./utils');

var collection = global.setup.database.collection('regions');
var networkCollection = global.setup.database.collection('network');
var extrasCollection = global.setup.database.collection('node-extras');

module.exports = function(origin, terminus, callback) {
  if( typeof terminus === 'string' ) {
    getFlowBetweenRegions(origin, terminus, callback);
  } else {
    getRegionFlow(origin, callback);
  }
};

function getRegionFlow(region, callback) {
  utils.getNodeType(region, function(err, type){
    if( err ) {
      return callback(err);
    }

    if( type !== 'Region' ) {
      return callback('Invalid region name given');
    }

    utils.getNodesInRegion(region, function(err, nodelist){
      utils.sum(nodelist, 'flow', sumFlow, callback);
    });
  });
}

function getFlowBetweenRegions(origin, terminus, callback) {
  validateRegionFlow(origin, terminus, function(err, valid){
    if( err ) {
      return callback(err);
    }

    utils.getNodesInRegion(origin, function(err, originlist){
      utils.getNodesInRegion(terminus, function(err, terminallist){

        runAggregate(originlist, terminallist, function(err, result){
          callback(err, result);
        });
      });
    });
  });
}

function validateRegionFlow(origin, terminus, callback) {
  utils.getNodeType(origin, function(err, origintype){
    if( err ) {
      return callback(err);
    }

    utils.getNodeType(terminus, function(err, terminustype){
      if( err ) {
        return callback(err);
      }

      if( origintype !== 'Region' && terminustype !== 'Region' ) {
        return callback('Invalid origin and terminus.  At least one needs to be a region');
      }

      callback(null, true);
    });
  });
}




function runAggregate(originlist, terminallist, callback) {
  networkCollection.find({
    'properties.origin' : {
      '$in' : originlist
    },
    'properties.terminus' : {
      '$in' : terminallist
    }
  },{'properties.prmname':1}).toArray(function(err, result){
    if( err ) {
      return callback(err);
    }

    var list = [];
    for( var i = 0; i < result.length; i++ ) {
      list.push(result[i].properties.prmname);
    }

    utils.sum(list, 'flow', sumFlow, callback);
  });
}



function sumFlow(sum, item) {
  for( var i = 0; i < item.length; i++ ) {
    if( i === 0 && typeof item[0][1] === 'string' ) {
      continue;
    }

    if( sum[item[i][0]] === undefined ) {
      sum[item[i][0]] = item[i][1] || 0;
    } else {
      sum[item[i][0]] += item[i][1] || 0;
    }
  }
}

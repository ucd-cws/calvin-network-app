'use strict';
var async = require('async');

var collection = global.setup.database.collection('regions');
var networkCollection = global.setup.database.collection('network');
var extrasCollection = global.setup.database.collection('node-extras');


function getNodesInRegion(name, callback) {
  _getNodesInRegion(name, {}, function(err, objectlist){
    if( err ) {
      return callback(err);
    }
    callback(null, Object.keys(objectlist));
  });
}

function _getNodesInRegion(name, list, callback) {
  collection.findOne({name: name}, {nodes: 1, subregions: 1}, function(err, result){
    if( err ) {
      return callback(err);
    }

    if( !result ) {
      list[name] = 1;
      return callback(null, list);
    }

    for( var key in result.nodes ) {
      if( result.nodes[key] === 'Diversion' || result.nodes[key] === 'Return Flow' ) {
        continue;
      }
      list[key] = 1;
    }

    if( result.subregions ) {
      async.eachSeries(
        result.subregions,
        function(region, next) {
          _getNodesInRegion(region, list, next);
        },
        function(err) {
          callback(null, list);
        }
      );
    } else {
      callback(null, list);
    }

  });
}

function getNodeType(prmname, callback) {
  collection.findOne({name: prmname}, {name: 1}, function(err, result){
    if( err ) {
      return callback(err);
    }

    if( result && result.name === prmname) {
      return callback(null, 'Region');
    }

    networkCollection.findOne({'properties.prmname' : prmname}, {'properties.prmname': 1, 'properties.type': 1}, function(err, result){
      if( err ) {
        return callback(err);
      }

      if( result && result.properties && result.properties.prmname === prmname) {
        return callback(null, result.properties.type);
      }

      callback('Unknown Node: '+prmname);
    });
  });
}

function sum(nodelist, attribute, sumFn, callback) {
  var total = {}, projection = {};
  projection[attribute] = 1;

  extrasCollection
    .find({prmname : {'$in' : nodelist}}, projection)
    .toArray(function(err, results){
      if( err ) {
        return callback(err);
      }

      for( var i = 0; i < results.length; i++ ) {
        if( !results[i][attribute] ) {
          continue;
        }
        sumFn(total, results[i][attribute]);
      }

      var result = {
        included : nodelist
      };
      result[attribute] = total;

      callback(null, result);
    });
}


module.exports = {
  getNodesInRegion : getNodesInRegion,
  getNodeType : getNodeType,
  sum : sum
};

'use strict';
var async = require('async');

var collection = global.setup.database.collection('regions');
var networkCollection = global.setup.database.collection('network');
var extrasCollection = global.setup.database.collection('node-extras');


function getNodeLinks(list, callback) {
  var resp = {
      origins :  [],
      terminals : []
  };

  networkCollection.find(
    {'$and': [{'properties.origin': {'$in' : list}}, {'properties.terminus': {'$nin' : list}}]},
    {'properties.prmname': 1, '_id' : 0})
    .toArray(function(err, result){
      if( err ) {
        return callback(err);
      }

      for( var i = 0; i < result.length; i++ ) {
        resp.terminals.push(result[i].properties.prmname);
      }

      networkCollection.find(
        {'$and': [{'properties.terminus': {'$in' : list}}, {'properties.origin': {'$nin' : list}}]},
        {'properties.prmname': 1, '_id' : 0})
        .toArray(function(err, result){
          if( err ) {
            return callback(err);
          }

          for( var i = 0; i < result.length; i++ ) {
            resp.origins.push(result[i].properties.prmname);
          }

          callback(null, resp);
        });
    });
}

function getLinksInRegion(nodelist, callback) {
  networkCollection.find(
    {'$and': [{'properties.origin': {'$in' : nodelist}}, {'properties.terminus': {'$in' : nodelist}}]},
    {'properties.prmname': 1, '_id' : 0, 'properties.amplitude': 1})
    .toArray(function(err, result){
      if( err ) {
        return callback(err);
      }
      callback(null, result);
    });
}

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

function sumAll(nodelist, sumFn, callback) {
  var total = {};

  extrasCollection
    .find({prmname : {'$in' : nodelist}})
    .toArray(function(err, extras){
      if( err ) {
        return callback(err);
      }

      for( var i = 0; i < extras.length; i++ ) {
        sumFn(total, extras[i]);
      }

      var result = {
        nodes : nodelist,
        aggregate : total
      };

      callback(null, result);
    });
}

function sumInto(nodelist, attribute, label, data, sumFn, callback) {
  var projection = {prmname: 1};
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
        sumFn(data, label, results[i][attribute]);
      }

      callback(null);
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
  getNodeLinks : getNodeLinks,
  sum : sum,
  sumAll : sumAll,
  sumInto : sumInto,
  getLinksInRegion : getLinksInRegion
};

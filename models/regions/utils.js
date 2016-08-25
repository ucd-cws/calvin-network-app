'use strict';
var async = require('async');
var db = require('../../lib/database');

function getNodeLinks(list, callback) {
  var networkCollection = db.mongoConnection.collection('network');

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
  var networkCollection = db.mongoConnection.collection('network');

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
  var collection = db.mongoConnection.collection('regions');

  collection.findOne({'properties.id': name}, {'properties.nodes': 1, 'properties.subregions': 1}, function(err, result){
    if( err ) {
      return callback(err);
    }

    if( !result ) {
      list[name] = 1;
      return callback(null, list);
    }

    for( var key in result.properties.nodes ) {
      if( result.properties.nodes[key] === 'Diversion' || result.properties.nodes[key] === 'Return Flow' ) {
        continue;
      }
      list[key] = 1;
    }

    if( result.properties.subregions ) {
      async.eachSeries(
        result.properties.subregions,
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

function getNodeType(id, callback) {
  var collection = db.mongoConnection.collection('regions');
  var networkCollection = db.mongoConnection.collection('network');

  collection.findOne({'properties.id': id}, {'properties.id': 1}, function(err, result){
    if( err ) {
      return callback(err);
    }

    if( result && result.properties.id === id) {
      return callback(null, 'Region');
    }

    networkCollection.findOne({'properties.prmname' : id}, {'properties.prmname': 1, 'properties.type': 1}, function(err, result){
      if( err ) {
        return callback(err);
      }

      if( result && result.properties && result.properties.prmname === id) {
        return callback(null, result.properties.type);
      }

      callback('Unknown Node: '+id);
    });
  });
}

function sumAll(nodelist, sumFn, callback) {
  var extrasCollection = db.mongoConnection.collection('node-extras');
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
  var extrasCollection = db.mongoConnection.collection('node-extras');
  var projection = {prmname: 1};
  var isSingle = false;

  if( typeof attribute === 'string' ) {
    isSingle = true;
    projection[attribute] = 1;
  } else {
    for( var i = 0; i < attribute.length; i++ ) {
      projection[attribute[i]] = 1;
    }
  }


  extrasCollection
    .find({prmname : {'$in' : nodelist}}, projection)
    .toArray(function(err, results){
      if( err ) {
        return callback(err);
      }

      for( var i = 0; i < results.length; i++ ) {
        if( isSingle && !results[i][attribute] ) {
          continue;
        }
        if( isSingle ) {
          sumFn(data, label, results[i][attribute], results[i].prmname);
        } else {
          sumFn(data, label, results[i], results[i].prmname);
        }

      }

      callback(null);
    });
}

function sum(nodelist, attribute, sumFn, callback) {
  var extrasCollection = db.mongoConnection.collection('node-extras');
  var total = {}, projection = {prmname: 1};
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
        sumFn(total, results[i][attribute], results[i].prmname);
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

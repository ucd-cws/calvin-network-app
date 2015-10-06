'use strict';
var async = require('async');

var collection = global.setup.database.collection('regions');
var networkCollection = global.setup.database.collection('network');
var extrasCollection = global.setup.database.collection('node-extras');

module.exports = function() {
    return {
        name: 'regions',
        get : getRegions,
        aggregate : aggregate
    };
};

function getRegions(callback) {
  collection.find({}).toArray(callback);
}

function aggregate(origin, terminus, callback) {
  var t = new Date().getTime();
  // TODO: handle condition where they are both nodes

  getNodeList(origin, {}, function(err, originlist){
    originlist = Object.keys(originlist);

    getNodeList(terminus, {}, function(err, terminallist){
      terminallist = Object.keys(terminallist);

      runAggregate(originlist, terminallist, function(err, result){
        callback(err, result);

      });
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

    var sum = {};
    extrasCollection
      .find({prmname : {'$in' : list}},{flow: 1})
      .toArray(function(err, results){
        if( err ) {
          return callback(err);
        }

        for( var i = 0; i < results.length; i++ ) {
          if( !results[i].flow ) continue;
          sumFlow(sum, results[i].flow);
        }

        callback(null, {
          links : list,
          flows : sum
        });
      });
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


function getNodeList(name, list, callback) {
  collection.findOne({name: name}, {nodes: 1, subregions: 1}, function(err, result){
    if( err ) {
      return callback(err);
    }

    if( !result ) {
      list[name] = 1;
      return callback(null, list);
    }

    for( var key in result.nodes ) {
      if( result.nodes[key] === 'Diversion' || result.nodes[key] === 'Return Flow' ) continue;
      list[key] = 1;
    }

    if( result.subregions ) {
      async.eachSeries(
        result.subregions,
        function(region, next) {
          getNodeList(region, list, next);
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

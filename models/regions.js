'use strict';
var async = require('async');

var collection = global.setup.database.collection('regions');
var networkCollection = global.setup.database.collection('network');
var outputCollection = global.setup.database.collection('outputs');

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
        console.log(new Date().getTime() - t);
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
    outputCollection
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

    if( !sum[item[i][0]] ) {
      sum[item[i][0]] = item[i][1];
    } else {
      sum[item[i][0]] += item[i][1];
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

    for( var i = 0; i < result.nodes.length; i++ ) {
      if( result.nodes[i].indexOf('-') > -1 ) continue;
      list[result.nodes[i]] = 1;
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

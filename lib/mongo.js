/**
 * A custom library to establish a database connection
 */
'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var collection, regionCollection, heatmapCollection;
var heatmap = require('./heatmap');

var extras = {
  collection : 'node-extras',
  properties : ['flow','inflows','bounds','evaporation','sinks','readme','storage']
};

var db = function() {
    return {

        /**
         * Open a connection to the database
         * @param conf - mqe config
         */
        config: function (config, callback) {
            MongoClient.connect(config.db.url, function(err, database) {
              if( err ) {
                return callback(err);
              }
              callback(null, database);
            });
        },

        connectForImport : function(url, callback) {
          MongoClient.connect(url, function(err, database) {
              if( err ) {
                return callback(err);
              }
              db = database;

              collection = db.collection('network');
              regionCollection = db.collection('regions');
              extras.collection = db.collection(extras.collection);
              heatmapCollection = db.collection('heatmap');

              callback();
          });
        },

        updateNetwork : function(nodes, callback) {
          clearNetwork(function(err){
            if( err ) {
              return callback(err);
            }

            async.eachSeries(nodes, function(node, next){
              enforce(node); // make sure basic things are apart of node and not null
              var outputItem = splitOutput(node);

              if( outputItem !== null ) {
                insert(extras.collection, outputItem, function(){
                  insert(collection, node, next);
                });
              } else {
                insert(collection, node, next);
              }

            }, callback);

          });
        },

        updateHeatmap : updateHeatmap,

        updateRegions : function(regions, callback) {
          regionCollection.remove({}, function(err, result){
            if( err ) {
              return callback(err);
            }

            async.eachSeries(regions, function(region, next){
              insert(regionCollection, region, next);
            }, callback);
          });
        }
    };
};


function updateHeatmap(nodes, callback) {
  var data = {};
  var minMax = {};

  console.log('*** UPDATING HEATMAP ***');

  console.log('Processing...');
  for( var i = 0; i < nodes.length; i++ ) {
    heatmap.process(data, minMax, nodes[i]);
  }

  console.log('Updating Heatmap Collection...');
  heatmapCollection.remove({}, function(err,resp){
    if( err ) {
      return callback(err);
    }

    var keys = Object.keys(data);

    var c = 0;
    async.eachSeries(keys, function(date, next) {
      heatmapCollection.insert({date: date, data: data[date]}, next);
      delete data[date];
    }, function(err){
      console.log('Done with heatmap update.');
      minMax.is = 'minMax';
      heatmapCollection.insert(minMax, callback);
    });
  });
}

/*function updateHeatmap(nodes, callback) {
  //var data = {};
  var minMax = {};

  //for( var i = 0; i < nodes.length; i++ ) {
  //  console.log(i);
  //  heatmap.process(data, minMax, nodes[i]);
  //}
  console.log('*** UPDATING HEATMAP ***')
  heatmapCollection.remove({}, function(err,resp){
    if( err ) {
      return callback(err);
    }

    var c = 0;
    async.eachSeries(nodes, function(node, next) {
      console.log(Math.floor((c / nodes.length)*100)+'% '+node.properties.prmname);
      c++;

      heatmap.process(heatmapCollection, minMax, node, next);
    }, function(err){
      console.log('minMax');
      minMax.is = 'minMax';
      heatmapCollection.insert(minMax, callback);
    });
  });
}*/





// make sure there are some basic assumptions about nodes
var enforceProps = ['prmname', 'description', 'type'];
function enforce(node) {
  if( !node.properties ) {
    node.properties = {};
  }

  enforceProps.forEach(function(prop){
    if( !node.properties[prop] ) {
      node.properties[prop] = '';
    }
  });
}

function splitOutput(node) {
  var extraData = {
    prmname : node.properties.prmname
  };
  var extraReference = {};

  extras.properties.forEach(function(prop){
    if( node.properties[prop] !== undefined && node.properties[prop] !== null ) {
      extraData[prop] = node.properties[prop];
      extraReference[prop] = true;
      delete node.properties[prop];
    }
  });

  if( Object.keys(extraReference).length > 0 ) {
    node.properties.extras = extraReference;
    return extraData;
  }

  return null;
}

function clearNetwork(callback) {
  collection.remove({}, function(err, result){
    if( err ) {
      return callback(err);
    }
    extras.collection.remove({}, function(err, result){
      if( err ) {
        return callback(err);
      }
      callback();
    });
  });
}

function insert(collection, item, next) {
  collection.insert(item, {w: 1}, function(err, result){
    if( err ) {
      console.log(err);
    }
    next();
  });
}

module.exports = db();

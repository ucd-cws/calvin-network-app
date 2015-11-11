/**
 * A custom library to establish a database connection
 */
'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var collection, regionCollection, heatmapCollection;


var extras = {
  collection : 'node-extras',
  properties : ['flow','inflows','bounds', 'evaporation', 'sinks','readme']
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

  for( var i = 0; i < nodes.length; i++ ) {
    processNodeHeatmap(data, nodes[i]);
  }

  heatmapCollection.remove({}, function(err,resp){
    if( err ) {
      return callback(err);
    }

    var keys = Object.keys(data);

    async.eachSeries(keys, function(date, next){

      heatmapCollection.insert({
        date: date,
        data: data[date]
      }, next);

    }, function(err){
      callback();
    });
  });
}

function processNodeHeatmap(data, node) {
  if( !node.properties.sinks && !node.properties.inflows ) {
    return;
  }

  if( node.properties.sinks ) {

    for( var i = 0; i < node.properties.sinks.length; i++ ) {
      for( var name in node.properties.sinks[i] ) {
        addHeatmapData(data, node.properties.sinks[i][name].flow, node.geometry.coordinates, -1);
      }
    }

  }

  if( node.properties.inflows ) {
    for( var name in node.properties.inflows ) {
      addHeatmapData(data, node.properties.inflows[name].inflow, node.geometry.coordinates, 1);
    }
  }
}

function addHeatmapData(data, array, coords, factor) {
  if( !array ) {
    return;
  }

  for( var i = 0; i < array.length; i++ ) {
    if( i === 0 && typeof array[i][1] === 'string' ) {
      continue;
    }

    if( !data[array[i][0]] ) {
      data[array[i][0]] = [];
    }
    coords = getCoords(coords);
    data[array[i][0]].push([coords[1], coords[0], array[i][1]*factor]);
  }
}

function getCoords(coords) {
  if( typeof coords[0] === 'number' ) {
    return coords;
  }

  return [(coords[0][0] + coords[1][0])/2, (coords[0][1] + coords[1][1])/2];
}



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

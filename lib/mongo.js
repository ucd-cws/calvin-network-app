/**
 * A custom library to establish a database connection
 */
'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var collection, regionCollection;


var outputs = {
  collection : 'outputs',
  properties : ['flow']
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
              outputs.collection = db.collection(outputs.collection);

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
                insert(outputs.collection, outputItem, function(){
                  insert(collection, node, next);
                });
              } else {
                insert(collection, node, next);
              }

            }, callback);

          });
        },

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
  var output = {};

  output.prmname = node.properties.prmname;

  outputs.properties.forEach(function(prop){
    if( node.properties[prop] !== undefined && node.properties[prop] !== null ) {
      output[prop] = node.properties[prop];
      delete node.properties[prop];
    }
  });

  if( Object.keys(output).length > 1 ) {
    node.properties.hasOutputs = true;
    return output;
  }

  return null;
}

function clearNetwork(callback) {
  collection.remove({}, function(err, result){
    if( err ) {
      return callback(err);
    }
    outputs.collection.remove({}, function(err, result){
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

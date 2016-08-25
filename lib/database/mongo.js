/**
 * A custom library to establish a database connection
 */
'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var collection, regionCollection, timesliceCollection;
var timeslice = require('./timesliceUtils');

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
              timesliceCollection = db.collection('timeslice');

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
              var outputItem = splitExtras(node);

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

        updateTimeslice : updateTimeslice,

        updateRegions : function(regions, callback) {
          regionCollection.remove({}, function(err, result){
            if( err ) {
              return callback(err);
            }

            async.eachSeries(regions, function(region, next){
              insert(regionCollection, region, next);
            }, callback);
          });
        },

        splitExtras : splitExtras
    };
};


function updateTimeslice(nodes, callback) {
  var data = {};
  var minMax = {};

  console.log('*** UPDATING Timeslice ***');

  console.log('Processing...');
  for( var i = 0; i < nodes.length; i++ ) {
    timeslice.process(data, minMax, nodes[i]);
  }

  console.log('Updating timeslice Collection...');
  timesliceCollection.remove({}, function(err,resp){
    if( err ) {
      return callback(err);
    }

    var keys = Object.keys(data);

    var c = 0;
    async.eachSeries(keys, function(date, next) {
      timesliceCollection.insert({date: date, data: data[date]}, next);
      delete data[date];
    }, function(err){
      console.log('Done with timeslice update.');
      minMax.is = 'minMax';
      timesliceCollection.insert(minMax, callback);
    });
  });
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

function splitExtras(node) {
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

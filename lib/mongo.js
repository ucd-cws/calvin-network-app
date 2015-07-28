/**
 * A custom library to establish a database connection
 */
'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var collection, regionCollection;

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

              callback();
          });
        },

        updateNetwork : function(nodes, callback) {
          collection.remove({}, function(err, result){
            if( err ) {
              return callback(err);
            }

            async.eachSeries(nodes, function(node, next){
              insert(collection, node, next);
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

function insert(collection, item, next) {
  collection.insert(item, {w: 1}, function(err, result){
    if( err ) {
      console.log(err);
    }
    next();
  });
}

module.exports = db();

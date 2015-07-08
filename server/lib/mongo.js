var MongoClient = require('mongodb').MongoClient;
var async = require('async');

var connUrl = 'mongodb://localhost:27017/calvin';
var db = null;

var collectionName = 'network';
var regionCollectionName = 'regions';
var collection, regionCollection;

var defaultIgnore = {
  constraints : 0,
  cost : 0,
  inflows : 0,
  el_ar_cap : 0,
  _id : 0
};

var regionIgnore = {
  root : 0,
  _id : 0
}

exports.connect = function(database, config) {
    //MongoClient.connect(connUrl, function(err, database) {
    //    if( err ) return callback(err);
        db = database;

        collection = db.collection(config.db.mainCollection);
        regionCollection = db.collection(config.db.regionCollection);

    //    callback();
    //});
}

exports.getNetwork = function(callback) {
  collection.find({}, defaultIgnore).toArray(callback);
}

exports.getRegions = function(callback) {
  regionCollection.find({}).toArray(callback);
}

exports.getAttribute = function(prmname, attribute, callback) {
  var query = {
    prmname : prmname
  };

  var filter = {
    prmname : 1,
    _id : 0
  };

  filter[attribute] = 1;

  collection.findOne(query, filter, callback);
}

/**
  These are for the import scripts.  They share this module
**/
exports.updateNetwork = function(nodes, callback) {
  collection.remove({}, function(err, result){
    if( err ) return callback(err);

    async.eachSeries(nodes, function(node, next){
      insert(collection, node, next);
    }, callback);
  });
}

exports.updateRegions = function(regions, callback) {
  regionCollection.remove({}, function(err, result){
    if( err ) return callback(err);

    async.eachSeries(regions, function(region, next){
      insert(regionCollection, region, next);
    }, callback);
  });
}

function insert(collection, item, next) {
  collection.insert(item, {w: 1}, function(err, result){
    if( err ) console.log(err);
    next();
  });
}

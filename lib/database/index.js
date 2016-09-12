// var hnf = require('hobbes-network-format');
var hnf = require('../../../hobbes-network-format');
var extend = require('extend');
var mongoUtils = require('./mongo');
var config = require('../../import.json');
var async = require('async');

function Database() {
  this.init = function(config, callback) {
    this.config = config;
    this.dev = config.get('dev');
    this.connect(callback);
  }

  this.loadNetwork = function(callback) {
    process.stdout.write('Reading network from filesystem....     ');
    hnf.crawl(config.path, {reindex:true}, (network) => {
        process.stdout.write('Complete.\n');

        processCaRegion(network);

        // clean out all extra data
        network.nodes.features.forEach((feature) => {
          var extras = mongoUtils.splitExtras(feature);
          feature.extras = extras;
        });

        // now read all csv data that isn't extra
        async.eachSeries(
          network.nodes.features,
          (feature, next) => {
            hnf.expand(feature, function(){
              next();
            });
          },
          (err) => {

            // finally put all extras back in
            network.nodes.features.forEach((feature) => {
              for( var key in feature.extras ) {
                feature.properties[key] = feature.extras[key];
              }
              delete feature.extras;
            });

            this.network = network;
            callback();
          }
        );

    });
  }

  this.connect = function(callback) {
    if( this.dev ) {
      this.loadNetwork(callback);
    } else {
      mongoUtils.config(this.config, (database) => {
        this.mongoConnection = database;
        callback(database);
      });
    }
  }

  this.getNetwork = function(callback) {
    if( this.dev ) {
        var nodes = extend(true, [], this.network.nodes.features);
        nodes.forEach((node) => {
          mongoUtils.splitExtras(node);
        });

        callback(null, nodes);
    } else {
      this.mongoConnection
        .collection('network')
        .find({},{_id:0})
        .toArray(function(err, resp){
          callback(err, resp);
        });
    }
  }

  this.getNode = function(prmname, callback) {
    if( this.dev ) {
      var node;
      for( var i = 0; i < this.network.nodes.features.length; i++ ) {
        if( this.network.nodes.features[i].properties.prmname === prmname ) {
          node = extend(true, {}, this.network.nodes.features[i]);
          break;
        }
      }

      mongoUtils.splitExtras(node);
      callback(null, node);
    } else {
      this.mongoConnection.collection('network').findOne({'properties.prmname': prmname}, callback);
    }
  }

  this.getRegions = function(callback) {
    if( this.dev ) {
      callback(null, this.network.regions.features);
    } else {
      this.mongoConnection.collection('regions').find({}).toArray(callback);
    }
  }

  this.getExtras = function(prmname, callback) {
    if( this.dev ) {
      var node;
      for( var i = 0; i < this.network.nodes.features.length; i++ ) {
        if( this.network.nodes.features[i].properties.prmname === prmname ) {
          node = extend(true, {}, this.network.nodes.features[i]);
          break;
        }
      }

      hnf.expand(node, function(){
        var extras = mongoUtils.splitExtras(node);
        callback(null, extras);
      });
    } else {
      this.mongoConnection
        .collection('node-extras')
        .findOne({prmname: prmname}, {_id: 0}, function(err, resp){
          callback(err, resp);
        });
    }
  }
}

function processCaRegion(network) {
  var regions = network.regions.features;
  var nodes = network.nodes.features;

  var california = {
    properties : {
      id : 'California',
      name : 'California',
      type : 'Region',
      hobbes : {
        id : 'California',
        parents : [],
        nodes : {},
        subregions : []
      }
    }
  };

  regions.forEach(function(r){
    if( r.properties.hobbes.parents.length === 0 ) {
      california.properties.hobbes.subregions.push(r.properties.hobbes.id);
    }
  });

  nodes.forEach(function(n){
    if( n.properties.hobbes.regions.length === 0 ) {
      california.properties.hobbes.nodes[n.properties.hobbes.id] = n.properties.type;
    }
  });

  regions.push(california);
}

module.exports = new Database();
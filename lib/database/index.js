var hnf = require('hobbes-network-format');
var extend = require('extend');
var splitExtras = require('./splitExtras');
var async = require('async');
var timeseries = require('./timeseries');

function Database() {
  this.index = {
    id : {}
  }

  this.init = function(config, callback) {
    this.config = config;
    this.dev = config.get('dev') || config.get('local');
    this.connect(callback);
  }

  this.loadNetwork = function(callback) {
    process.stdout.write('Reading network from filesystem....     ');

    function onlyParse(file) {
      if( file.match(/\.csv$/i) ) return false;
      return true;
    }

    hnf.crawl(this.config.get('path'), {onlyParse: onlyParse}, (network) => {
        process.stdout.write('Complete.\n');

        // add the root california region
        processCaRegion(network);

        network.extras = {};

        // clean out all extra data
        network.nodes.features.forEach((feature) => {
          this.index.id[feature.properties.hobbes.id] = feature;

          var extras = splitExtras(feature);
          network.extras[feature.properties.hobbes.id] = extras;
        });

        network.regions.features.forEach((feature) => {
          this.index.id[feature.properties.hobbes.id] = feature;
        });

        

        // now read all csv data that isn't extra
        async.eachSeries(
          network.nodes.features,
          (feature, next) => {
            // expand each node
            hnf.expand({node: feature}, function(){
              next();
            });
          },
          (err) => {

            this.network = network;
            this.loadTimeSeriesAsync();

            callback();
          }
        );
    });
  }

  this.getTimeSeriesDate = function(date) {
    return timeseries.get(date);
  }

  this.getTimeSeriesMinMax = function() {
    return timeseries.getMinMax();
  }

  this.loadTimeSeriesAsync = function() {
    setTimeout(() => {
      var dev = require('../dev');
    
      if( this.dev ) {
        dev.getDevSocket().send('timeseries-process-start');
        dev.timeseriesProcessing(true);
      }

      timeseries.update(() => {
        if( this.dev ) {
          dev.getDevSocket().send('timeseries-process-end');
          dev.timeseriesProcessing(false);
        }
        console.log('finished processing timeseries data');
      }); 
    }, 2000);

  }

  this.connect = function(callback) {
    this.loadNetwork(callback);
  }

  this.getNetwork = function(callback) {
    callback(null, this.network.nodes.features);
  }

  this.getNodeById = function(id) {
    return this.index.id[id];
  }

  this.getRegions = function(callback) {
    callback(null, this.network.regions.features);
  }

  this.getRegionById = function(id) {
    return this.index.id[id];
  }

  this.getExtras = function(id, callback) {
    var node = {
      properties : this.network.extras[id] || {}
    }

    hnf.expand({node: node}, function(){
      callback(null, node.properties);
    });
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
        nodes : [],
      }
    }
  };

  regions.forEach(function(r){
    if( r.properties.hobbes.regions.length === 0 ) {
      california.properties.hobbes.subregions.push(r.properties.hobbes.id);
    }
  });

  nodes.forEach(function(n){
    if( n.properties.hobbes.regions.length === 0 ) {
      california.properties.hobbes.nodes.push(n.properties.hobbes.id);
    }
  });

  regions.push(california);
}

module.exports = new Database();
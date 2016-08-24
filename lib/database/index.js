var cwn = require('calvin-network-tools');
var mongoUtils = require('../mongo');

function Database() {
  this.init = function(config, callback) {
    this.config = config;
    this.dev = config.get('dev');
    this.connect(callback);
  }

  this.connect = function(callback) {
    if( this.dev ) {
      callback();
    } else {
      mongoUtils.config(this.config, (database) => {
        this.mongoConnection = database;
        callback();
      });
    }
  }

  this.getNetwork = function(callback) {
    if( this.dev ) {
      cwn.crawl({}, function(network){
        this.network = network;

        // create extras attribute, identical to mongo's
        network.nodes.features.forEach((feature) => {
          mongoUtils.splitExtras(feature);
        });

        callback(null, network);
      });
    } else {
      this.mongoConnection
        .get('network')
        .find({},{_id:0})
        .toArray(function(err, resp){
          callback(err, resp);
        });
    }
  }

  this.getExtras = function(prmname, callback) {
    if( this.dev ) {

      cwn.crawl({}, function(network){
        // create extras attribute, identical to mongo's
        network.features.forEach((feature) => {
          mongoUtils.splitExtras(feature);
        });

        callback(null, network);
      });
    } else {
      this.mongoConnection
        .get('node-extras')
        .findOne({prmname: prmname}, {_id: 0}, function(err, resp){
          callback(err, resp);
        });
    }
  }


}

module.exports = new Database();
var process = require('./process');
var hnf = require('hobbes-network-format');
var conf = require('../../config');

var data = {};
var minMax = {};
var loading = false;

function update(callback) {
  var config = conf.get();
  loading = true;

  hnf.crawl(config.get('path'), {parseCsvData: true}, (network) => {
    data = {};
    minMax = {};

    for( var i = 0; i < network.nodes.features.length; i++ ) {
      process(data, minMax, network.nodes.features[i]);
    }

    loading = false;
    if( callback ) callback();
  });
}

function get(date) {
  if( !data[date] ) return null;
  return {
    data : data[date],
    date : date
  }
}

function getMinMax() {
  return minMax;
}

module.exports = {
  update : update,
  get : get,
  getMinMax : getMinMax,
  isLoading : function() {
    return loading
  }
}
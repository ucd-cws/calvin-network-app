var process = require('./process');
var hnf = require('hobbes-network-format');
var path = require('path');
var async = require('async');
var fse = require('fs-extra');
var fs = require('fs');
var conf = require('../../config');

var cacheDir = path.join(__dirname, '..', '..', '..', 'cache');

var data = {
  dates : {},
  minMax : {}
}
var loading = false;

function update(callback) {
  var config = conf.get();
  loading = true;

  prepareCacheDir(() => {
    hnf.crawl(config.get('path'), (network) => {
      onCrawlComplete(network, callback);
    });
  });
}

function onCrawlComplete(network, callback) {
  data.network = network;
  data.dates = {};
  data.minMax = {};
  
  for( var i = 0; i < network.nodes.features.length; i++ ) {
    process(data.dates, data.minMax, network.nodes.features[i]);
    delete network.nodes.features[i]; // memory cleanup
  }

  writeCache(data.dates, () => {
    delete data.network;
    delete data.dates;
    data.data = null;
    data.network = null;

    loading = false;
    if( callback ) callback();
  });
}

function prepareCacheDir(callback) {
  fse.remove(cacheDir, function (err) {
    if (err) throw err;
  
    fse.ensureDir(cacheDir, function (err) {
      if( err ) throw err;
      callback();
    });
  });
}

function writeCache(data, callback) {
  var dates = Object.keys(data);

  async.eachSeries(
    dates,
    (date, next) => {
      
      var dataPath = path.join(cacheDir, `${date}.json`);
      fs.writeFile(
        dataPath,
        JSON.stringify(data[date]),
        (err) => {
          delete data[date];
          next();
        }
      );

    },
    (err) => {
      callback();
    }
  );
}

function get(date) {
  var dataPath = path.join(cacheDir, `${date}.json`);
  if( !fs.existsSync(dataPath) ) return null;
  return {
    data : JSON.parse(fs.readFileSync(dataPath, 'utf-8')),
    date : date
  }
}

function getMinMax() {
  return data.minMax;
}

module.exports = {
  update : update,
  get : get,
  getMinMax : getMinMax,
  isLoading : function() {
    return loading
  }
}
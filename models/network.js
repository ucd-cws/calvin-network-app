'use strict';

var csvStringify = require('csv-stringify');
var async = require('async');
var db = require('../lib/database');


module.exports = function() {
    return {
        name: 'network',
        get : getNetwork,
        getExtras : getExtras,
        getTimeslice : getTimeslice,
        getTimesliceMinMax : getTimesliceMinMax
    };
};

function getNetwork(callback) {
  db.getNetwork(callback);
}

function getExtras(id, callback) {
  db.getExtras(id, callback);
}

function getTimesliceMinMax(callback) {
  callback(null, db.getTimeSeriesMinMax());
}

function getTimeslice(date, callback) {
  var data = db.getTimeSeriesDate(date);

  if( !data ) {
    callback({error: true, message : 'Either timeseries is still loading or date does not exist'});
  } else {
    callback(null, data);
  }
}
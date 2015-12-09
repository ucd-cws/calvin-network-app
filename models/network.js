'use strict';

var csvStringify = require('csv-stringify');
var async = require('async');

var extraCollection = global.setup.database.collection('node-extras');
var timesliceCollection = global.setup.database.collection('timeslice');

module.exports = function() {
    return {
        name: 'network',
        get : getNetwork,
        getExtras : getExtras,
        getTimeslice : getTimeslice,
        getTimesliceMinMax : getTimesliceMinMax,
        dumpLocation : dumpLocation
    };
};

function getNetwork(callback) {
  global.setup.collection.find({},{_id:0}).toArray(callback);
}

function getExtras(prmname, callback) {
  extraCollection.findOne({prmname: prmname}, {_id:0}, callback);
}

function getTimesliceMinMax(callback) {
  timesliceCollection.findOne({is: 'minMax'}, {_id: 0}, callback);
}

function getTimeslice(date, callback) {
  timesliceCollection.findOne({date: date}, {_id: 0}, function(err, resp){
    if( err ) {
      return callback(err);
    } else if( !resp ) {
      return callback('No data for: '+date);
    }
    callback(null, resp);
  });
}


function dumpLocation(callback) {
  global.setup.collection.find({},{geometry: 1, 'properties.repo': 1, 'properties.prmname': 1}).toArray(function(err, nodes){
    if( err ) {
      return callback(err);
    }

    var csv = 'id,path,longitute,latitude\n';

    async.eachSeries(
      nodes,
      function(node, next) {
        if( node.properties.prmname.indexOf('_') > -1 ) {
          return next();
        }

        csvStringify([[
          node.properties.prmname,
          node.properties.repo.dir,
          node.geometry.coordinates[0],
          node.geometry.coordinates[1]
        ]], function(err, output){
          csv += output;
          next();
        });
      },
      function(err) {
        callback(err, csv);
      }
    );

  });

}

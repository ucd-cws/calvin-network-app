'use strict';

var aggregateFlow = require('./aggregateFlow');
var aggregateInflows = require('./aggregateInflows');
var aggregateSinks = require('./aggregateSinks');

var collection = global.setup.database.collection('regions');
var networkCollection = global.setup.database.collection('network');
var extrasCollection = global.setup.database.collection('node-extras');

/*
 *   Currently supported types
 */
var supportedAggregateTypes = ['inflows', 'flow', 'sinks'];

module.exports = function() {
    return {
        name: 'regions',
        get : getRegions,
        aggregate : aggregate
    };
};

function getRegions(callback) {
  collection.find({}).toArray(callback);
}

function aggregate(type, region, terminus, callback) {
  if( supportedAggregateTypes.indexOf(type) === -1 ) {
    return callback('Unsupported aggregate type: '+type+'.  Supported types: '+supportedAggregateTypes.join(', '));
  }

  if( type === 'flow' ) {
    aggregateFlow(region, terminus, callback);
  } else if( type === 'inflows' ) {
    aggregateInflows(region, callback);
  } else if( type === 'sinks' ) {
    aggregateSinks(region, callback);
  } else {
    callback('Badness');
  }
}

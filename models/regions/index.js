'use strict';

var aggregateRegion = require('./aggregateRegion');
var aggregateRegionLink = require('./aggregateRegionLink');

var db = require('../../lib/database');

/*
 *   Currently supported types
 */
var supportedAggregateTypes = ['inflows', 'flow', 'sinks'];

module.exports = function() {
    return {
        name: 'regions',
        get : getRegions,
        aggregateRegion : aggregateRegion,
        aggregateRegionLinks : aggregateRegionLink
    };
};

function getRegions(callback) {
  db.getRegions(callback);
}
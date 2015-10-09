'use strict';

var utils = require('./utils');

var collection = global.setup.database.collection('regions');
var networkCollection = global.setup.database.collection('network');
var extrasCollection = global.setup.database.collection('node-extras');

module.exports = function(region, callback) {
  utils.getNodeType(region, function(err, type){
    if( err ) {
      return callback(err);
    }

    if( type !== 'Region' ) {
      return callback('Invalid region name given');
    }

    utils.getNodesInRegion(region, function(err, nodelist){
      utils.sum(nodelist, 'sinks', sumSinks, callback);
    });
  });
};

function sumSinks(sum, item) {
  var i, type, costs, bounds, bound;

  for( type in item ) {
    costs = item[type].costs;
    bounds = item[type].bounds;

    if( costs ) {
      if( costs.type === 'Constant' ) {
        if( sum.costs === undefined ) {
          sum.costs = {
            type : 'Constant',
            cost : costs.cost
          };
        } else {
          sum.costs.cost += costs.cost;
        }
      }
    }

    if( bounds ) {
      for( i = 0; i < bounds.length; i++ ) {
        bound = bounds[i];

        if( !Array.isArray(bound.bound) ) {
          continue;
        }

        if( sum.bounds === undefined ) {
          sum.bounds = {};
        }
        if( sum.bounds[bound.type] === undefined ) {
          sum.bounds[bound.type] = {};
        }


        for( var j = 0; j < bound.bound.length; j++ ) {
          if( j === 0 && typeof bound.bound[0][1] === 'string' ) {
            continue;
          }

          if( sum.bounds[bound.type][bound.bound[j][0]] === undefined ) {
            sum.bounds[bound.type][bound.bound[j][0]] = bound.bound[j][1] || 0;
          } else {
            sum.bounds[bound.type][bound.bound[j][0]] += bound.bound[j][1] || 0;
          }
        }
      }
    }
  }
}

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
      utils.sum(nodelist, 'inflows', sumInflows, callback);
    });
  });
};

function sumInflows(sum, item) {
  var i, type, inflow;

  for( type in item ) {
    inflow = item[type].inflow;

    for( i = 0; i < inflow.length; i++ ) {
      if( i === 0 && typeof inflow[0][1] === 'string' ) {
        continue;
      }

      if( sum[inflow[i][0]] === undefined ) {
        sum[inflow[i][0]] = inflow[i][1] || 0;
      } else {
        sum[inflow[i][0]] += inflow[i][1] || 0;
      }
    }
  }
}

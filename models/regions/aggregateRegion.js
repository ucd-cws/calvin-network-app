'use strict';

var utils = require('./utils');
var calcAmpLoss = require('./calcAmpLoss');

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
      utils.sumAll(nodelist, sum, function(err, data){
        utils.getLinksInRegion(nodelist, function(err, links) {
          if( err ) {
            return callback(err);
          }

          var list = [];
          var lookup = {};
          for( var i = 0; i < links.length; i++ ) {
            list.push(links[i].properties.prmname);
            lookup[links[i].properties.prmname] = links[i].properties.amplitude;
          }
          data.links = list;

          utils.sumInto(list, 'flow', 'amplitudeLoss', data,
            function(sum, label, item, prmname) {
              sumAmpLoss(sum, label, item, lookup[prmname]);
            },
            function(err){
            getRegionFlow(nodelist, data, callback);
          });
        });
      });
    });
  });
};

function getRegionFlow(nodelist, data, callback) {
  // get all links to these nodes
  utils.getNodeLinks(nodelist, function(err, links){
    if( err ) {
      return callback(err);
    }

    // sum origins
    utils.sumInto(links.origins, 'flow', 'regionLinkInflow', data, sumFlow, function(err){
      if( err ) {
        return callback(err);
      }

      data.origins = links.origins;

      // sum terminals
      utils.sumInto(links.terminals, 'flow', 'regionLinkOutflow', data, sumFlow, function(err){
        if( err ) {
          return callback(err);
        }

        data.terminals = links.terminals;

        callback(null, data);
      });
    });
  });
}

function sum(sum, item) {
  var i, type, inflow;

  for( type in item ) {

    if( item.inflows ) {
      for( var key in item.inflows ) {
        inflow = item.inflows[key].inflow;

        for( i = 0; i < inflow.length; i++ ) {
          if( i === 0 && typeof inflow[0][1] === 'string' ) {
            continue;
          } else if( typeof inflow[i][1] === 'string' ) {
            console.log('BADNESS!! '+inflow[i][0]+' '+inflow[i][1]);
          }

          if( sum[inflow[i][0]] === undefined ) {
            sum[inflow[i][0]] = {};
          }

          if( sum[inflow[i][0]].inflows === undefined ) {
            sum[inflow[i][0]].inflows = inflow[i][1] || 0;
          } else {
            sum[inflow[i][0]].inflows += inflow[i][1] || 0;
          }
        }
      }
    }

    if( item.evaporation ) {
      for( i = 0; i < item.evaporation.length; i++ ) {
        if( i === 0 && typeof item.evaporation[0][1] === 'string' ) {
          continue;
        }

        if( sum[item.evaporation[i][0]] === undefined ) {
          sum[item.evaporation[i][0]] = {};
        }

        if( sum[item.evaporation[i][0]].evaporation === undefined ) {
          sum[item.evaporation[i][0]].evaporation = item.evaporation[i][1] || 0;
        } else {
          sum[item.evaporation[i][0]].evaporation += item.evaporation[i][1] || 0;
        }
      }
    }

    if( item.sinks ) {
      var sinks = item.sinks;
      for( var i = 0; i < sinks.length; i++ ) {
        for( var name in sinks[i] ) {
          var flow = sinks[i][name].flow, f;

          if( !flow ) continue;

          for( var j = 0; j < flow.length; j++ ) {
            if( j === 0 && typeof flow[0][1] === 'string' ) {
              continue;
            }

            f = flow[j][1] || 0;
            if( sum[flow[j][0]] === undefined ) {
              sum[flow[j][0]] = {
                sinks : f
              };
            } else if( sum[flow[j][0]].sinks === undefined ) {
              sum[flow[j][0]].sinks = f;
            } else {
              sum[flow[j][0]].sinks += f;
            }
          }
        }
      }
    }

  }
}


function sumFlow(sum, label, item) {
  var data = sum.aggregate;

  for( var i = 0; i < item.length; i++ ) {
    if( i === 0 && typeof item[0][1] === 'string' ) {
      continue;
    }

    if( !data[item[i][0]] ) {
      data[item[i][0]] = {};
    }

    if( data[item[i][0]][label] === undefined ) {
      data[item[i][0]][label] = item[i][1] || 0;
    } else {
      data[item[i][0]][label] += item[i][1] || 0;
    }
  }
}

function sumAmpLoss(sum, label, item, amplitude) {
  var data = sum.aggregate, flow;

  if( amplitude === undefined || amplitude === null ) {
    amplitude = 0;
  }

  for( var i = 0; i < item.length; i++ ) {
    if( i === 0 && typeof item[0][1] === 'string' ) {
      continue;
    }

    if( !data[item[i][0]] ) {
      data[item[i][0]] = {};
    }

    flow = item[i][1] || 0;

    if( data[item[i][0]][label] === undefined ) {
      data[item[i][0]][label] = calcAmpLoss(amplitude, flow);
    } else {
      data[item[i][0]][label] += calcAmpLoss(amplitude, flow);
    }
  }
}

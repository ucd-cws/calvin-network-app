'use strict';

var md5 = require('md5');
var async = require('async');
var extend = require('extend');

var created = {};
var collection;

function processNodeHeatmap(data, minMax, node) {

  if( node.properties.prmname === 'Desal' || node.properties.prmname.match(/^CN/) ){
    return;
  }

  if( node.properties.sinks ) {
    for( var i = 0; i < node.properties.sinks.length; i++ ) {
      for( var name in node.properties.sinks[i] ) {
        addHeatmapData(data, 'sinks', node.properties.sinks[i][name].flow, minMax, node.geometry.coordinates, node.properties.prmname);;
      }
    }
  }

  if( node.properties.inflows ) {
    for( var name in node.properties.inflows ) {
      addHeatmapData(data, 'inflows', node.properties.inflows[name].inflow, minMax,  node.geometry.coordinates, node.properties.prmname);
    }
  }

  if( node.properties.evaporation ) {
    addHeatmapData(data, 'evaporation', node.properties.evaporation, minMax, node.geometry.coordinates, node.properties.prmname);
  }

  if( node.properties.storage ) {
    addHeatmapData(data, 'storage', node.properties.storage, minMax, node.geometry.coordinates, node.properties.prmname);
  }

  if( node.properties.flow ) {
    addHeatmapData(data, 'flow', node.properties.flow, minMax, node.geometry.coordinates, node.properties.prmname);
  }
}



function addHeatmapData(data, type, array, minMax, coords, prmname) {
  if( !array ) {
    return;
  }
  var row, i;

  for( var i = 0; i < array.length; i++ ) {
    row = array[i];

    if( typeof row[1] === 'string' ) {
      continue;
    }
    if( row[1] === 0 ) {
      continue;
    }

    var entry = getGeojson(coords, prmname, type, row[1]);
    var date = row[0].replace(/-\d\d$/,'');

    // update min / max
    if( !minMax[type] ) {
      minMax[type] = {
        min : row[1],
        max : row[1]
      };
    }
    if ( minMax[type].min > row[1] ) {
      minMax[type].min = row[1];
    }
    if ( minMax[type].max < row[1] ) {
      minMax[type].max = row[1];
    }

    if( !data[date] ) {
      data[date] = [];
    }
    data[date].push(entry);
  }
}

function getGeojson(coords, prmname, type, value) {
  var geo;
  if( typeof coords[0] === 'number' ) {
    geo = {
      geometry : {
        type : 'Point',
        coordinates : coords
      },
      properties : {
        prmname : prmname
      }
    };
    geo.properties[type] = value;
    return JSON.stringify(geo);
  }

  geo = {
    geometry : {
      type : 'LineString',
      coordinates : coords
    },
    properties : {
      prmname : prmname
    }
  };
  geo.properties[type] = value;
  return JSON.stringify(geo);
}

function trim(num) {
  return Number(num.toFixed(4));
}

module.exports = {
  process : processNodeHeatmap
};

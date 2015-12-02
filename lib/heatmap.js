'use strict';

var md5 = require('md5');
var async = require('async');
var extend = require('extend');

var created = {};
var collection;

function processNodeHeatmap(data, minMax, node, callback) {
  //collection = heatmapCollection;

  var processCount = 0;
  var doneCount = 0;

  function done() {
    doneCount++;
    checkDone();
  }

  function checkDone() {
    if( doneCount === processCount ) {
      callback();
    }
  }

  if( node.properties.sinks ) {
    for( var i = 0; i < node.properties.sinks.length; i++ ) {
      for( var name in node.properties.sinks[i] ) {
        addHeatmapData(data, 'sinks', node.properties.sinks[i][name].flow, minMax, node.geometry.coordinates, node.properties.prmname, done);
        processCount++;
      }
    }
  }

  if( node.properties.inflows ) {
    for( var name in node.properties.inflows ) {
      addHeatmapData(data, 'inflows', node.properties.inflows[name].inflow, minMax,  node.geometry.coordinates, node.properties.prmname, done);
      processCount++;
    }
  }

  if( node.properties.evaporation ) {
    addHeatmapData(data, 'evaporation', node.properties.evaporation, minMax, node.geometry.coordinates, node.properties.prmname, done);
    processCount++;
  }

  if( node.properties.storage ) {
    addHeatmapData(data, 'storage', node.properties.storage, minMax, node.geometry.coordinates, node.properties.prmname, done);
    processCount++;
  }

  if( node.properties.flow ) {
    addHeatmapData(data, 'flow', node.properties.flow, minMax, node.geometry.coordinates, node.properties.prmname, done);
    processCount++;
  }

  //callback();
  //checkDone();
}

function create(date, callback) {
  if( created[date] ) {
    callback();
  } else {
    created[date] = 1;
    collection.insert({
      date : date,
      data : []
    }, callback);
  }
}

function addHeatmapData(data, type, array, minMax, coords, prmname) {
  if( !array ) {
    return;
  }

  //async.eachSeries(array, function(row, next){
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
    //create(date, function(){
    //  collection.update(
    //    {date: date},
    //    { $push: {data: entry}},
    //    {writeConcern: 0}, // speed this up...
    //    next);
    //});
  //},function(err){
  //  callback();
  //});
}

  /*var geojson = getGeojson(coords);
  var date;

  for( var i = 0; i < array.length; i++ ) {
    if( i === 0 && typeof array[i][1] === 'string' ) {
      continue;
    }
    if( array[i][1] === 0 ) {
      continue;
    }

    date = array[i][0].replace(/-\d\d$/,'');
    if( !data[date] ) {
      data[date] = {};
    }

    var l = getLocation(data[date], geojson, date);
    l.properties.prmnames.push(prmname);

    if( l.properties[type] ) {
      l.properties[type] += array[i][1];
    } else {
      l.properties[type] = array[i][1];
    }

    // update min / max for type
    if( !minMax[type] ) {
      minMax[type] = {
        min : array[i][1],
        max : array[i][1]
      };
    }
    if ( minMax[type].min > l.properties[type] ) {
      minMax[type].min = l.properties[type];
    }
    if ( minMax[type].max < l.properties[type] ) {
      minMax[type].max = l.properties[type];
    }

  }
}*/

/*
function getLocation(array, geojson, date) {
  if( array[geojson.properties.id] ) {
    return array[geojson.properties.id];
  }

  var clone = extend(true, {}, geojson);
  array[clone.properties.id] = clone;
  return clone;
}
*/

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

/*function getGeojson(coords) {
  var coord;
  if( typeof coords[0] === 'number' ) {
    coord = [trim(coords[0]), trim(coords[1])];
    return {
      geometry : {
        type : 'Point',
        coordinates : coord
      },
      properties : {
        id : md5(JSON.stringify(coord)),
        prmnames : []
      }
    };
  }

  coord = [
    [trim(coords[0][0]), trim(coords[0][1])],
    [trim(coords[1][0]), trim(coords[1][1])]
  ];

  return {
    geometry : {
      type : 'LineString',
      coordinates : coord
    },
    properties : {
      id : md5(JSON.stringify(coord)),
      prmnames : []
    }
  };
}*/

function trim(num) {
  return Number(num.toFixed(4));
}

module.exports = {
  process : processNodeHeatmap
};

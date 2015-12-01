'use strict';

var csv = require('csv-stringify');
var request = require('superagent');
var path = require('path');
var fs = require('fs');

var url = 'http://cwn.casil.ucdavis.edu/mqe/query';
var projection = JSON.stringify({
  'properties.sinks' : 0,
  'properties.costs' : 0,
  'properties.readme' : 0,
  'properties.bounds' : 0,
  'properties.repo' : 0,
  'properties.origins' : 0,
  'properties.terminals' : 0,
  'properties.inflows' : 0,
  'properties.regions' : 0,
  'properties.evaporation' : 0,
  'properties.storage' : 0
});
var linkData = [['prmname','origin','terminus','flow']];
var nodeData = [['prmname','x','y']];
var step = 100;

function query(index) {
  request
    .get(url)
    .query({
      start: index,
      stop: index+step,
      projection: projection
    })
    .end(onResponse);
}

function onResponse(err, res){
  if( err ) {
    console.log(err);
    process.exit(-1);
  }

  res = res.body;

  var i, type;
  for( i = 0; i < res.items.length; i++ ) {
    type = res.items[i].properties.type;
    if( type === 'Diversion' || type === 'Return Flow' ) {
      addLink(res.items[i]);
    } else {
      addNode(res.items[i]);
    }
  }

  if( res.stop < res.total ) {
    console.log( ((res.stop / res.total)*100).toFixed(0)+'%' );
    query(res.stop);
  } else {
    write();
  }
}

function write() {
  csv(linkData, {}, function(err, output){
    fs.writeFileSync(path.join(process.cwd(),'links.csv'), output);
    csv(nodeData, {}, function(err, output){
      fs.writeFileSync(path.join(process.cwd(),'nodes.csv'), output);
      console.log('Done.');
    });
  });
}

function addLink(link) {
  linkData.push([
    link.properties.prmname,
    link.properties.origin,
    link.properties.terminus,
    link.properties.flow ? JSON.stringify(link.properties.flow) : ''
  ]);
}

function addNode(node) {
  nodeData.push([
    node.properties.prmname,
    node.geometry.coordinates[1],
    node.geometry.coordinates[0],
  ]);
}

query(0);

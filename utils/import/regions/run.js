'use strict';

var Region = require('./region');
var mongo = require('../../../lib/mongo');
var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var dir, branch, files;

module.exports = function(dir, branch) {
  var nodes = [];
  var regions = [];
  var regionNames = {};
  var lookup = {};

  var ca = new Region(dir);
  ca.name = 'California';

  var json = ca.toJSON();
  readNodes(dir, nodes, function(){
    nodes.forEach(function(node){
      node.properties.repo.branch = branch
      node.properties.repo.github = 'https://github.com/ucd-cws/calvin-network-data/tree/'+
        branch + node.properties.repo.dir;

      lookup[node.properties.repo.dirNodeName] = node;
      lookup[node.properties.prmname] = node;

      setOriginsTerminals(node, nodes);
    });

    processLinks(nodes, lookup);

    setRegions(json, '', regions, regionNames, lookup);

    mongo.connectForImport('mongodb://localhost:27017/calvin', function(err){
      if( err ) {
        return console.log('Unabled to connect to mongo');
      }

      mongo.updateNetwork(nodes, function(err){
        if( err ) return console.log('Unabled to update network: '+JSON.stringify(err));

        mongo.updateRegions(regions, function(err){

          if( err ) return console.log('Unabled to update regions: '+JSON.stringify(err));
          console.log('done.');
          process.exit();
        });
      });
    });
  });
}

function readNodes(dir, nodes, callback) {
  files = fs.readdirSync(dir);

  async.eachSeries(files,
    function(file, next){
      if( file.match(/^\./) ) return async.nextTick(next);
      if( file === 'region.geojson' ) return async.nextTick(next);

      var stat = fs.statSync(dir+'/'+file);

      if( stat.isDirectory() ) {
        return readNodes(dir+'/'+file, nodes, next);

      } else if ( stat.isFile() && file.match('\.geojson$') ) {

        var d = fs.readFileSync(dir+'/'+file, 'utf-8').replace(/[\r\n]/g,'');
        d = JSON.parse(d);

        if( d.type == 'FeatureCollection' ) return next();

        d.properties.repo = {
          dir : dir,
          dirNodeName : dir.replace(/.*\//,''),
          filename : file
        };

        readRefs(d.properties.repo.dir, d.properties.filename, d, 'properties', function(){

          d.properties.repo.dir = dir.replace(/.*calvin-network-data/,'');
          nodes.push(d);
          async.nextTick(next);

        });
        return;
      }

      async.nextTick(next);
    },
    function(err){
      if( err ) console.log(err);
      callback();
    }
  );
}

// set the regions array
function setRegions(region, path, regions, regionNames, lookup) {

  // make sure we have a unique name
  var c = 1;
  while( regionNames[region.name] ) {
    region.name = region.name.replace(/-.*/,'')+'-'+c;
    c++;
  }
  regionNames[region.name] = 1;

  regions.push(region);

  region.parents = path.split(' ');
  var newPath = (path.length > 0 ? path+' ' : '') + region.name;

  if( region.nodes && region.nodes.length > 0 ) {
    var min = null;
    var max = null;

    region.nodes.forEach(function(nodeName){
      if( lookup[nodeName] ) {
        var node = lookup[nodeName];
        node.properties.regions = newPath.split(' ');

        if( node.properties.type !== 'Diversion' && node.properties.type !== 'Return Flow' && node.geometry ) {
          if( min == null ) min = [node.geometry.coordinates[0], node.geometry.coordinates[1]];
          if( max == null ) max = [node.geometry.coordinates[0], node.geometry.coordinates[1]];

          updateMinMax(min, max, node.geometry.coordinates);
        }
      } else {
        console.log('Unable to find node: '+nodeName+' in region '+newPath);
      }
    });

    // set a bounding box if no geometry given
    if( Object.keys(region.geo).length == 0 && min && max ) {
      region.geo = {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            min,
            [min[0], max[1]],
            max,
            [max[0], min[1]],
            min
          ]]
        },
        "properties": {
          id : region.name
        }
      };
    } else if( region.geo ) {
      if( !region.geo.properties ) region.geo.properties = {};
      region.geo.properties.id = region.name;
    }
  }

  if( !region.subregions ) return;

  for (var i = region.subregions.length - 1; i >= 0; i--) {
    setRegions(region.subregions[i], newPath, regions, regionNames, lookup);

    // now just set object as name reference
    region.subregions[i] = region.subregions[i].name;
  };
}

// process $ref pointers
function readRefs(dir, filename, parent, attr, callback) {
  //for( var key in parent[attr] ) {
  var keys = Object.keys(parent[attr]);

  async.eachSeries(keys,
    function(key, next) {

      if( key === '$ref' ) {
        try {
          var file, parts = [];
          if( parent[attr].$ref.match(/^\.\/.*/) ) {
            file = dir+'/'+parent[attr].$ref.replace(/^\.\//,'');
            parts.push(parent[attr].$ref.replace(/^\.\//,''));
            readFile(file, parent, attr, next);
            return;
          } else {
            file = dir+'/'+parent[attr].$ref;
            parts.push(filename);
            parts.push(parent[attr].$ref);

            readFile(file, parent, attr, next);
            return;
          }
        } catch(e) {
          console.log('Unabled to read: "'+file+'" ('+parent[attr].$ref+') '+JSON.stringify(parts));
          parent[attr] = 'Unabled to read: '+file;
        }

      } else if( typeof parent[attr][key] === 'object' && parent[attr][key] !== null ) {
        return readRefs(dir, filename, parent[attr], key, next);
      }

      async.nextTick(next);
    },
    callback
  );
}

function readFile(file, object, attr, callback) {
  if( file.match(/.*\.csv$/i) ) {
    object[attr] = fs.readFileSync(file, 'utf-8');

    parse(object[attr], {comment: '#', delimiter: ','}, function(err, data){
      if( attr == '' ) { // hack need to fix
        console.log('Attempting to set empty attr name, switching to "data": '+file);
        delete object[attr];
        attr = 'data';
      }

      if( err ) object[attr] = err;
      else object[attr] = parseInts(data);
      callback();
    });
  } else {
    object[attr] = fs.readFileSync(file, 'utf-8');
    callback();
  }
}

function parseInts(data) {
  for( var i = 0; i < data.length; i++ ) {
    for( var j = 0; j < data[i].length; j++ ) {
      if( data[i][j].match(/^-?\d+\.?\d*$/) || data[i][j].match(/^-?\d*\.\d+$/) ) {
        var t = parseFloat(data[i][j]);
        if( !isNaN(t) ) data[i][j] = t;
      }
    }
  }
  return data;
}

// process links.  currently they have no geometry information
function processLinks(nodes, lookup) {
  var removeList = []

  nodes.forEach(function(node){
    if( node.geometry !== null ) return;

    if( node.properties.origin && node.properties.terminus ) {
      var origin = lookup[node.properties.origin];
      var terminus = lookup[node.properties.terminus];

      if( !origin || !terminus ) {
        return console.log('Found link but nodes are missing geo: '+node.prmname);
      }

      node.geometry = {
        "type": "LineString",
        "coordinates": [
          origin.geometry.coordinates, terminus.geometry.coordinates
        ]
      };

    } else {
      console.log('Found node with missing geo but not link: '+node.properties.prmname);
      removeList.push(node);
    }
  });

  removeList.forEach(function(node){
    nodes.splice(nodes.indexOf(node), 1);
  });
}

function setOriginsTerminals(node, nodes) {
  if( node.properties.type == 'Diversion' || node.properties.type == 'Return Flow' ) return;

  var origins = [];
  var terminals = [];
  for( var i = 0; i < nodes.length; i++ ) {
    if( nodes[i].properties.terminus == node.properties.prmname ) {
      origins.push({
        prmname : nodes[i].properties.origin,
        link_prmname : nodes[i].properties.prmname
      });
    } else if ( nodes[i].properties.origin == node.properties.prmname ) {
      terminals.push({
        prmname : nodes[i].properties.terminus,
        link_prmname : nodes[i].properties.prmname
      });
    }
  }

  node.properties.origins = origins;
  node.properties.terminals = terminals;
}

// find the min / max for a region.  if the region does not contain a geometry
// a bounding box will be assigned using the min / max values
function updateMinMax(min, max, coord) {
  if( min[0] < coord[0] ) min[0] = coord[0];
  if( min[1] > coord[1] ) min[1] = coord[1];

  if( max[0] > coord[0] ) max[0] = coord[0];
  if( max[1] < coord[1] ) max[1] = coord[1];
}

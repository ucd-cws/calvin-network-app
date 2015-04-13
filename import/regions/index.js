var Region = require('./Region');
var mongo = require('../../server/lib/mongo');
var fs = require('fs');

var dir = process.argv[2], files;

var nodes = [];
var regions = [];
var ca = new Region(dir);
ca.name = 'California';

var json = ca.toJSON();
readNodes(dir);

var lookup = {};

nodes.forEach(function(node){
  lookup[node.properties.filename] = node;
  lookup[node.properties.prmname] = node;
});

processLinks();


setRegions(ca, '');

mongo.connect(function(err){
  if( err ) {
    return console.log('Unabled to connect to mongo');
  }

  mongo.updateNetwork(nodes, function(err){
    if( err ) return console.log('Unabled to update network: '+JSON.stringify(err));

    mongo.updateRegions(regions, function(err){

      if( err ) return console.log('Unabled to update regions: '+JSON.stringify(err));
      console.log('done.');
      process.exit(1);
    });
  });
});



function readNodes(dir) {
  files = fs.readdirSync(dir);

  files.forEach(function(file){
      if( file.match(/^\./) ) return;
      if( file === 'region.geojson' ) return;

      var stat = fs.statSync(dir+'/'+file);

      if( stat.isDirectory() ) {
        readNodes(dir+'/'+file);

      } else if ( stat.isFile() && file.match('\.geojson$') ) {

        var d = fs.readFileSync(dir+'/'+file, 'utf-8').replace(/[\r\n]/g,'');
        d = JSON.parse(d);

        d.properties.dir = dir;
        d.properties.filename = file.replace('\.geojson', '');

        readRefs(d.properties.dir, d.properties.filename, d, 'properties');

        nodes.push(d);
      }
  }.bind(this));
}

// set the regions array
function setRegions(region, path) {
  regions.push(region);

  var newPath = (path.length > 0 ? path+' ' : '') + region.name;

  if( region.nodes ) {
    region.nodes.forEach(function(nodeName){
      if( lookup[nodeName] ) lookup[nodeName].properties.regions = newPath.split(' ');
      else console.log('Unable to find node: '+nodeName+' in region '+newPath);
    });
  }

  if( !region.subregions ) return;

  for (var i = region.subregions.length - 1; i >= 0; i--) {
    setRegions(region.subregions[i], newPath);

    // now just set object as name reference
    region.subregions[i] = region.subregions[i].name;
  };
}

// process $ref pointers
function readRefs(dir, filename, parent, attr) {
  for( var key in parent[attr] ) {

    if( key === '$ref' ) {


      try {
        var file;
        if( parent[attr].$ref.match(/^\.\/.*/) ) {
          file = dir+'/'+parent[attr].$ref.replace(/^\.\//,'');
          //console.log('Reading: '+file+' from '+filename+'.geojson');
          parent[attr] = fs.readFileSync(file, 'utf-8');
        } else {
          file = dir+'/'+filename+'/'+parent[attr].$ref;
          //console.log('Reading: '+file);
          parent[attr] = fs.readFileSync(file, 'utf-8');
        }
      } catch(e) {
        parent[attr] = 'Unabled to read: '+file;
      }



    } else if( typeof parent[attr][key] === 'object' && parent[attr][key] !== null ) {
      readRefs(dir, filename, parent[attr], key);
    }
  }
}

// process links.  currently they have no geometry information
function processLinks() {
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

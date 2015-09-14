'use strict';
var finder = require('findit');
var path = require('path');
var fs = require('fs');

module.exports = function() {
    return {
        editLocation : editLocation,
        editProperties : editProperties
    };
};

//node cmd -m node -f edit_properties sr_sac/u202 {description:"This is new"}
function editProperties(dataRepoRootPath, prmname, properties, callback) {
  getNode(dataRepoRootPath, prmname, function(err, path, node){
    if( !node.properties ) {
      node.properties = {};
    }

    for( var key in properties ) {
      node.properties[key] = properties[key];
    }

    fs.writeFileSync(path, JSON.stringify(node, '  ', '  '));
    callback(null, 'success!\n'+path);
  });
}

// actually update a nodes location
function editLocation(dataRepoRootPath, prmname, latlng, reverse, callback) {
  if( typeof reverse === 'function' ) {
    callback = reverse;
    reverse = false;
  }

  if( typeof latlng === 'string' ){
    latlng = latlng.split(',');
    latlng = [parseFloat(latlng[0]), parseFloat(latlng[1])];
  }

  if( reverse ) {
    latlng = [latlng[1], latlng[0]];
  }

  getNode(dataRepoRootPath, prmname, function(err, path, node){
    if( err ) {
      return callback(err);
    }

    node.geometry.coordinates = latlng;

    fs.writeFileSync(path, JSON.stringify(node, '  ', '  '));
    callback(null, 'success!\n'+path);
  });
}

function getNode(dataRepoRootPath, prmname, callback) {
  prmname = prmname.toLowerCase();

  if( dataRepoRootPath === '.' ) {
    dataRepoRootPath = path.join(__dirname,'..','..','..','calvin-network-data','data');
  }

  var walk = finder(dataRepoRootPath);
  walk.on('directory', function (dir, stat, stop) {
      var base = path.basename(dir).toLowerCase();

      if (base === prmname ) {
        base = path.join(dir, 'node.geojson');

        var node = eval('('+fs.readFileSync(base, 'utf-8')+')');
        callback(null, base, node);

        stop();
        walk.stop();
      }
  });

  walk.on('end', function() {
    callback({
      error : true,
      message : 'Error: unable to find '+prmname+' in '+dataRepoRootPath
    });
  });
}

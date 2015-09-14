'use strict';
var finder = require('findit');
var path = require('path');
var fs = require('fs');

module.exports = function() {
    return {
        editLocation : editLocation
    };
};

// actually update a nodes location
function editLocation(dataRepoRootPath, prmname, latlng, reverse, callback) {
  if( typeof reverse === 'function' ) {
    callback = reverse;
    reverse = false;
  }

  prmname = prmname.toLowerCase();

  if( dataRepoRootPath === '.' ) {
    dataRepoRootPath = path.join(__dirname,'..','..','..','calvin-network-data','data');
  }

  if( typeof latlng === 'string' ){
    latlng = latlng.split(',');
    latlng = [parseFloat(latlng[0]), parseFloat(latlng[1])];
  }

  if( reverse ) {
    latlng = [latlng[1], latlng[0]];
  }

  var walk = finder(dataRepoRootPath);
  walk.on('directory', function (dir, stat, stop) {
      var base = path.basename(dir).toLowerCase();

      if (base === prmname ) {
        base = path.join(dir, 'node.geojson');
        var node = eval('('+fs.readFileSync(base, 'utf-8')+')');
        node.geometry.coordinates = latlng;

        fs.writeFileSync(base, JSON.stringify(node, '  ', '  '));

        stop();
        walk.stop();
        callback(null, 'success!\n'+base);
      }
  });

  walk.on('end', function() {
    callback({
      error : true,
      message : 'Error: unable to find '+prmname+' in '+dataRepoRootPath
    });
  });
}

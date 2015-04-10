var Region = require('./Region');
var fs = require('fs');

var dir = process.argv[2];


var ca = new Region(dir);
ca.name = 'California';

var json = ca.toJSON();
var geojson = [];

extractGeo(json);

fs.writeFileSync(__dirname+'/../../app/regions.json', JSON.stringify(json));
fs.writeFileSync(__dirname+'/../../app/regions.geojson', JSON.stringify(geojson));

console.log('done.');

function extractGeo(region) {
    if( region.geo ) {
        geojson.push(region.geo);
        delete region.geo;
    }

    if( !region.subregions ) return;
    
    for (var i = region.subregions.length - 1; i >= 0; i--) {
        extractGeo(region.subregions[i]);
    };
}
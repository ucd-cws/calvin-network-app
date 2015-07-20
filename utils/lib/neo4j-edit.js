/* takes a list of geojson and either updates nodes or inserts new nodes */

/* definitions for edit routine */
var def = {
    // fields to be moved into the climate blob
    climateAttrs : ['inflows', 'el_ar_cap'],
    // fields to be moved into the cost blob
    costAttrs : ['costs','constraints'],
    // fields to become neo4js searchable
    searchAttrs : ['prmname','type','network','origin','terminus'],
    // fields required by both root and geojson.properties
    requiredProps : ['type','prmname','network'],
    requiredGeojson : ['type', 'geometry', 'properties'],
    links : ['Diversion', 'Return Flow']
}

// move things around and set placeholders
function transpose() {
    var climate = {};
    for( var j = 0; j < def.climateAttrs.length; j++ ) {
        if( geojson[def.climateAttrs[j]] ) {
            climate[def.climateAttrs[j]] = geojson[def.climateAttrs[j]];
            delete geojson[def.climateAttrs[j]];
            geojson.properties.hasClimate = true;
        }
    }
    item.climate = JSON.stringify(climate);

    // now create cost blob, removing info from geojson
    var costs = {};
    for( var j = 0; j < def.costAttrs.length; j++ ) {
        if( geojson.properties[def.costAttrs[j]] ) {
            costs[def.costAttrs[j]] = geojson.properties[def.costAttrs[j]];
            delete geojson.properties[def.costAttrs[j]];
            geojson.properties.hasCosts = true;
        }
    }
    item.costs = JSON.stringify(costs);

    // make sure all required feilds are set
    for( var i = 0; i < def.requiredProps.length; i++ ) {
        if( !item.geojson.properties[def.requiredProps[i]] ) return sendError(resp, 'missing geojson.properties.'+def.requiredProps[i]);
    }

    item.geojson = JSON.stringify(geojson);
}
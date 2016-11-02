var EventEmitter = require('events');
var events = new EventEmitter();

var nodeCollection = require('../collections/nodes');
var regionsCollection = require('../collections/regions');
var rest = require('../rest');

function loadNetwork(callback) {
  api.loading = true;
  events.emit('loading');

  rest.loadNetwork((data) => {
    nodeCollection.init(data.network);
    processNodesLinks(data.network);

    regionsCollection.init(data.regions);
    data.regions.forEach(processRegion);

    api.loading = false;
    events.emit('loading-complete');
    if( callback ) callback();
  });
}

function processNodesLinks(nodes) {
  for( var i = 0; i < nodes.length; i++ ) {
    if( !nodes[i].properties.description ) {
        nodes[i].properties.description = '';
    }
    
    markCalibrationNode(nodes[i]);

    if( nodes[i].properties.hobbes.type === 'link' ) {
      markLinkTypes(nodes[i]);
    }
  }
}

function markCalibrationNode(node) {
    // TODO: how do we remove this prmname 
    if( node.properties.prmname.indexOf('_') > -1 ) {
        var parts = node.properties.prmname.split('_');
        if( !(parts[0].match(/^CN.*/) || parts[1].match(/^CN.*/)) ) {
            return;
        }
    } else if( !node.properties.prmname.match(/^CN.*/) ) {
        return;
    }

    var hasIn = false;
    var hasOut = false;

    if( node.properties.terminals ) {
        for( var i = 0; i < node.properties.terminals.length; i++ ) {
            if( node.properties.terminals[i] != null ) {
                hasOut = true;
                break;
            }
        }
    }
    if( node.properties.origins ) {
        for( var i = 0; i < node.properties.origins.length; i++ ) {
            if( node.properties.origins[i] != null ) {
                hasIn = true;
                break;
            }
        }
    }

    node.properties.calibrationNode = true;
    if( !hasIn && !hasOut ) return;

    if( hasIn && hasOut ) node.properties.calibrationMode = 'both';
    else if ( hasIn ) node.properties.calibrationMode = 'in';
    else if ( hasOut ) node.properties.calibrationMode = 'out';
}

function markLinkTypes(link) {
  link.properties.renderInfo = {
      cost : link.properties.hasCosts ? true : false,
      amplitude : link.properties.amplitude ? true : false,
      // TODO: parser needs to sheet shortcut for contraint type
      // data will still need to be loaded on second call
      constraints : link.properties.hasConstraints ? true : false,
      environmental : link.properties.hasClimate ? true : false
  };

  try {

      // Flow to a sink
      if( nodeCollection.getById(link.properties.hobbes.terminus) &&
          nodeCollection.getById(link.properties.hobbes.terminus).properties.type == 'Sink' ) {
          link.properties.renderInfo.type = 'flowToSink';

      } else if( link.properties.type == 'Return Flow' ) {
          link.properties.renderInfo.type = 'returnFlowFromDemand';

      } else if ( isGWToDemand(link) ) {
          link.properties.renderInfo.type = 'gwToDemand';

      } else if( nodeCollection.getById(link.properties.origin) &&
          (nodeCollection.getById(link.properties.hobbes.origin).properties.calibrationMode == 'in' ||
          nodeCollection.getById(link.properties.hobbes.origin).properties.calibrationMode == 'both') ) {

          link.properties.renderInfo.type = 'artificalRecharge';
      } else {

          link.properties.renderInfo.type = 'unknown';
      }

  } catch(e) {
      debugger;
  }

  if( !link.geometry ) return;
  else if( !link.geometry.coordinates ) return;

  // finally, mark the angle of the line, so we can rotate the icon on the
  // map accordingly
  var width = link.geometry.coordinates[1][0] - link.geometry.coordinates[0][0];
  var height = link.geometry.coordinates[1][1] - link.geometry.coordinates[0][1];
  link.properties.renderInfo.rotate =  Math.atan(width / height) * (180 / Math.PI);
}

function isGWToDemand(link) {
    var origin = nodeCollection.getById(link.properties.hobbes.origin);
    var terminal = nodeCollection.getById(link.properties.hobbes.terminus);

    if( !origin || !terminal ) return false;

    if( origin.properties.type != 'Groundwater Storage' ) return false;
    if( terminal.properties.type == 'Non-Standard Demand' ||
        terminal.properties.type == 'Agricultural Demand' ||
        terminal.properties.type == 'Urban Demand' ) return true;

    return false;
}

function processRegion(region) {
    if( region.properties.subregions ) {
      region.properties.subregions.sort();
    }

    if( !region.geometry ) return;

    var polys = getXYPolygons(region);

    region.properties.simplified = [];
    for( var i = 0; i < polys.length; i++ ) {
      if( polys[i].length > 100 ) {
        region.properties.simplified.push(L.LineUtil.simplify(polys[i], 0.001));
      } else {
        region.properties.simplified.push(polys[i]);
      }
    }

    region.properties.center = getCenter(region.properties.simplified[0]);

    // todo calc bbox so we know if we need to render geometry or not
    for( var i = 0; i < region.properties.simplified.length; i++ ) {
      for( var j = 0; j < region.properties.simplified[i].length; j++ ) {
        region.properties.simplified[i][j] = [region.properties.simplified[i][j].x, region.properties.simplified[i][j].y]
      }
    }

    // HACK
    if( isNaN(region.properties.center[0]) ) region.properties.center = region.properties.simplified[0][0];
}

function getXYPolygons(geojson) {
  var polys = [], tmp = [], i, j, p;
  if( geojson.geometry.type == 'Polygon' ) {
    // we only care about the outer ring.  no holes allowed.
    for( i = 0; i < geojson.geometry.coordinates[0].length; i++ ) {
      tmp.push({
        x : geojson.geometry.coordinates[0][i][0],
        y : geojson.geometry.coordinates[0][i][1]
      });
    }
    polys.push(tmp);

  } else if( geojson.geometry.type == 'MultiPolygon' ) {
    // we only care about the outer ring.  no holes allowed.
    for( i = 0; i < geojson.geometry.coordinates.length; i++ ) {
      tmp = [];
      p = geojson.geometry.coordinates[i][0];

      for( j = 0; j < p.length; j++ ) {
        tmp.push({
          x : p[j][0],
          y : p[j][1]
        });
      }

      polys.push(tmp);
    }
  }
  return polys;
}

function getCenter(points) {
    var i, j, len, p1, p2, f, area, x, y,
    // polygon centroid algorithm; uses all the rings, may works better for banana type polygons

    area = x = y = 0;

    for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
      p1 = points[i];
      p2 = points[j];

      f = p1.y * p2.x - p2.y * p1.x;
      x += (p1.x + p2.x) * f;
      y += (p1.y + p2.y) * f;
    }

    f = getArea(points) * 6;
    return [-1 * (x / f), -1 * (y / f)];
}

/** helper for processing region center **/
function getArea(points){
    var area = 0;
    var lengthPoints = points.length;
    var j = lengthPoints - 1;
    var p1; var p2;
    for (var i = 0; i < lengthPoints; j = i++) {
        p1 = points[i]; p2 = points[j];
        area += p1.x * p2.y;
        area -= p1.y * p2.x;
    }
    area /= 2;
    return area;
}

var api = {
  loading : true,
  load: loadNetwork,
  on : function(evt, fn) {
      events.on(evt, fn);
  },
  onLoad : function(callback) {
      this.on('loading-complete', callback);

      if( this.loading ) {
          return;
      }

      callback();
  }
}

module.exports = api;
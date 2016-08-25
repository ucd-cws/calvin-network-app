(function(){


CWN.map = {};
CWN.map.renderer = {};

CWN.map.renderer.basic = function(ctx, xyPoints, map, feature) {
  var render = feature.geojson.properties._render || {};

  if( feature.geojson.geometry.type == 'Point' ) {
    renderBasicPoint(ctx, xyPoints, map, feature, render);
  } else if ( feature.geojson.geometry.type == 'LineString' ) {
    console.log(feature.geojson.properties.type);
    if( feature.geojson.properties.type === 'Region Link' ) {
      renderRegionLine(ctx, xyPoints, map, feature, render);
    } else {
      renderBasicLine(ctx, xyPoints, map, feature, render);
    }
  } else if ( feature.geojson.geometry.type == 'Polygon' ) {
    renderBasicPolygon(ctx, xyPoints, map, feature, render);
  } else if ( feature.geojson.geometry.type == 'MultiPolygon' ) {
    //debugger;
    xyPoints.forEach(function(points){
      renderBasicPolygon(ctx, points, map, feature, render);
    });
  }
}

function renderRegionLine(ctx, xyPoints, map, feature, render) {
  ctx.beginPath();
  ctx.strokeStyle = CWN.colors.orange;
  ctx.lineWidth = 2;
  ctx.moveTo(xyPoints[0].x, xyPoints[0].y);
  ctx.lineTo(xyPoints[1].x, xyPoints[1].y);
  ctx.stroke();
}

function renderBasicPoint(ctx, xyPoints, map, feature, render) {
  o = render.oneStep ? .3 : .7;

  render.point = xyPoints;
  ms = (feature.size || 20) * (render.multipier || 1);
  buffer = ms / 2;

  // TODO: set feature.size and you want have to worry about -10 offset here
  CWN.render[feature.geojson.properties.type](ctx, {
      x: xyPoints.x - 10,
      y: xyPoints.y - 10,
      width: ms,
      height: ms,
      opacity: o,
      fill : render.fill,
      stroke : render.stroke,
      lineWidth : render.lineWidth,
  });
}

function renderBasicLine(ctx, xyPoints, map, feature, render) {
  color = 'white';
  if( render.highlight ) {
      if( render.highlight == 'origin' ) color = 'green';
      else color = 'red';
  }

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.moveTo(xyPoints[0].x, xyPoints[0].y);
  ctx.lineTo(xyPoints[1].x, xyPoints[1].y);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = getLineColor(feature.geojson);
  ctx.lineWidth = 2;
  ctx.moveTo(xyPoints[0].x, xyPoints[0].y);
  ctx.lineTo(xyPoints[1].x, xyPoints[1].y);
  ctx.stroke();
}

function renderBasicPolygon(ctx, xyPoints, map, feature, render) {
  var point;
  if( xyPoints.length <= 1 ) return;

  ctx.beginPath();

  point = xyPoints[0];
  ctx.moveTo(point.x, point.y);
  for( var i = 1; i < xyPoints.length; i++ ) {
    ctx.lineTo(xyPoints[i].x, xyPoints[i].y);
  }
  ctx.lineTo(xyPoints[0].x, xyPoints[0].y);

  ctx.strokeStyle = render.hover ? 'red' : 'rgba('+CWN.colors.rgb.blue.join(',')+',.6)';
  ctx.fillStyle = render.fillStyle ? render.fillStyle : 'rgba('+CWN.colors.rgb.lightBlue.join(',')+',.6)';
  ctx.lineWidth = 4;

  ctx.stroke();
  ctx.fill();

  // draw center
  /*if( !config.noCenteriod ) {
    ctx.beginPath();
    try {
      point = this.map.latLngToContainerPoint([region.center[1], region.center[0]]);
    } catch(e) {
      debugger;
    }
    ctx.arc(point.x, point.y, 25, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();

    // add name
    ctx.fillStyle = '#333333';
    ctx.font="14px \"Helvetica Neue\",Helvetica,Arial,sans-serif";
    ctx.fillText(region.name, point.x - 20, point.y + 40 );
  }*/
}

function getLineColor(feature) {
    var color = 'white';

    var origin = CWN.ds.lookupMap[feature.properties.origin];
    var terminus = CWN.ds.lookupMap[feature.properties.terminus];

    if( feature.properties.renderInfo ) {
        if( terminus && terminus.properties.type == 'Sink' ) {
          color = CWN.colors.darkCyan;
        } else if( origin && origin.properties.type.match(/demand/i) ) {
            color = CWN.colors.red;
        } else if( origin && terminus && terminus.properties.type.match(/demand/i) && origin.properties.type == 'Groundwater Storage' ) {
            color = CWN.colors.lightGrey;
        } else if( feature.properties.description.match(/recharge/i, '') ) {
            color = CWN.colors.green;
        }
    }

    var line = {
        color: color,
        weight: 3,
        opacity: 0.4,
        smoothFactor: 1
    }

    //if( feature.properties.calibrationNode && this.mapFilters.calibrationMode ) {
    if( feature.properties.calibrationNode ) {
        line.color = 'blue';
    }

    return color;
}


})();

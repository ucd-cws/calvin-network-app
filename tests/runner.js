var map = L.map('map').setView([39, -121], 7);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var markerLayer = new L.CanvasLayer();
markerLayer.addTo(map);

var geojson = {
  "type": "Feature",
  "geometry": {"type": "Point", "coordinates": [-121, 39]},
  "properties": {"prop0": "value0"}
};

var feature = {
  geojson : geojson,
  render : function(cxt, point, map) {

    cxt.beginPath();
    cxt.arc(point.x, point.y, 70, 0, 2 * Math.PI, false);
    cxt.fillStyle = 'green';
    cxt.fill();
    cxt.lineWidth = 5;
    cxt.strokeStyle = '#003300';
    cxt.stroke();

  }
};
markerLayer.addFeature(feature);


$.get('http://localhost:3007/rest/getRegions', function(resp){

  for( var i = 0; i < resp.length; i++ ) {

    var feature = {
      geojson : resp[i].geo,
      render : function(ctx, xyPoints, map) {
        if( this.geojson.geometry.type != 'Polygon' ) return;

        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'red';
        ctx.lineWidth = 4;

        if( xyPoints.length > 500 ) {
          for( j = 0; j < xyPoints.length; j += 50 ) {
            if( j == 0 ) ctx.moveTo(xyPoints[j].x, xyPoints[j].y);
            else ctx.lineTo(xyPoints[j].x, xyPoints[j].y);
          }
        } else {
          for( j = 0; j < xyPoints.length; j++ ) {
            if( j == 0 ) ctx.moveTo(xyPoints[j].x, xyPoints[j].y);
            else ctx.lineTo(xyPoints[j].x, xyPoints[j].y);
          }
        }



        ctx.stroke();
        ctx.fill();
      }
    }

    markerLayer.addFeature(feature);
  }

  console.log(markerLayer.features);
  markerLayer.render();
});

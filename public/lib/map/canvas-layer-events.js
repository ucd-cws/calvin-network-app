var behavior = {
  onLayerClick : function(features, e) {
    if( features.length == 0 ) return;

    var type = features[0].geojson.geometry.type;

    if( features.length == 1 && type == 'Polygon' || type == 'MultiPolygon' ) {
      if( this.shiftPessed ) {
        window.location.href = '#info/' + features[0].geojson.properties.name;
        return;
      }

      if( !features[0].geojson.properties._render ) features[0].geojson.properties._render = {};
      features[0].geojson.properties._render.hover = true;
      this.markerLayer.render();

      setTimeout(function(){
        this.onRegionClick(features[0].geojson.properties.hobbes.id);

        features[0].geojson.properties._render.hover = false;
        this.markerLayer.render();

      }.bind(this), 0);
      return;
    }

    if( features.length == 1 && features[0].geojson.properties.prmname ) {
      window.location.href = '#info/' + features[0].geojson.properties.prmname;
      return;
    }

    this.selector.onClick(features);
  },

  onLayerMouseMove : function(features, e) {
    var label = [], linkLabel = '', regionLabel = '';
    var i, f;

    for( i = 0; i < features.length; i++ ) {
      f = features[i].geojson.properties;

      if( f.type == 'Diversion' || f.type == 'Return Flow' ) label.push(f.type+' <b>'+f.prmname+'</b>');
      else if( f.type == 'Link Group' ) label.push(f.type+' <b>Count: '+f.lines.length+'</b>');
      else if ( f.type == 'Region' ) label.push(f.type+' <b>'+f.name+'</b>');
      else label.push(f.type+' <b>'+f.prmname+'</b>');
    }

    if( features.length > 0 ) {
      this.showHoverLabel(true, label.join('<br />'), e.containerPoint);
      this.$.leaflet.style.cursor = 'pointer';
    } else {
      this.showHoverLabel(false);
      this.$.leaflet.style.cursor = '-webkit-grab';
    }
  },

  onLayerMouseOver : function(features, e) {
    var i, f;

    for( i = 0; i < features.length; i++ ) {
      f = features[i].geojson.properties;

      if( !f._render ) f._render = {};
      f._render.hover = true;
    }
  },

  onLayerMouseOut : function(features) {
    for( var i = 0; i < features.length; i++ ) {
      if( !features[i].geojson.properties._render ) features[i].geojson.properties._render = {};
      features[i].geojson.properties._render.hover = false;
    }
  },

  showHoverLabel : function(show, label, pos) {
    if( show ) {
      this.$.hoverLabel.style.display = 'block';
      this.$.hoverLabel.style.left = (pos.x+10)+'px';
      this.$.hoverLabel.style.top = (pos.y+10)+'px';
      this.$.hoverLabel.innerHTML = label;
    } else {
      this.$.hoverLabel.style.display = 'none';
    }
  }
}

module.exports = behavior;
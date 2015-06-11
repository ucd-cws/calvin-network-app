if(typeof(L) !== 'undefined') {
  /**
   * full canvas layer implementation for Leaflet
   * From: https://github.com/CartoDB/Leaflet.CanvasLayer
   * No bower or npm module :(
   */

  L.CanvasLayer = L.Class.extend({


    includes: [L.Mixin.Events],

    features : [],

    options: {
        minZoom: 0,
        maxZoom: 28,
        tileSize: 256,
        subdomains: 'abc',
        errorTileUrl: '',
        attribution: '',
        zoomOffset: 0,
        opacity: 1,
        unloadInvisibleTiles: L.Browser.mobile,
        updateWhenIdle: L.Browser.mobile
        //tileLoader: false // installs tile loading events
    },

    initialize: function (options) {
      var self = this;

      options = options || {};

      this.render = this.render.bind(this);
      L.Util.setOptions(this, options);
      this._canvas = this._createCanvas();
      // backCanvas for zoom animation
      this._backCanvas = this._createCanvas();
      this._ctx = this._canvas.getContext('2d');
      /*this.currentAnimationFrame = -1;
      this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                                      return window.setTimeout(callback, 1000 / 60);
                                  };
      this.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
                                  window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(id) { clearTimeout(id); };
      */
    },

    _createCanvas: function() {
      var canvas;
      canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = this.options.zIndex || 0;
      var className = 'leaflet-tile-container leaflet-zoom-animated';
      canvas.setAttribute('class', className);
      return canvas;
    },

    onAdd: function (map) {
      this._map = map;

      // add container with the canvas to the tile pane
      // the container is moved in the oposite direction of the
      // map pane to keep the canvas always in (0, 0)
      var tilePane = this._map._panes.tilePane;
      var _container = L.DomUtil.create('div', 'leaflet-layer');

      _container.appendChild(this._canvas);
      _container.appendChild(this._backCanvas);
      this._backCanvas.style.display = 'none';
      tilePane.appendChild(_container);

      this._container = _container;

      // hack: listen to predrag event launched by dragging to
      // set container in position (0, 0) in screen coordinates
      if (map.dragging.enabled()) {
        map.dragging._draggable.on('predrag', function() {
          var d = map.dragging._draggable;
          L.DomUtil.setPosition(this._canvas, { x: -d._newPos.x, y: -d._newPos.y });
        }, this);
      }

      map.on({ 'viewreset': this._reset }, this);
      map.on('move', this.render, this);
      map.on('resize', this._reset, this);
      map.on({
          'zoomstart': this._startZoom,
          'zoomend': this._endZoom
      }, this);
      map.on('mousemove', this.intersects, this);
      map.on('click', this.intersects, this);


      this._reset();
    },

    _startZoom: function() {
      this._canvas.style.visibility = 'hidden';
      this.zooming = true;
    },

    _endZoom: function () {
      this._canvas.style.visibility = 'visible';
      this.zooming = false;
      setTimeout(this.render.bind(this), 50);
    },

    getCanvas: function() {
      return this._canvas;
    },

    getAttribution: function() {
      return this.options.attribution;
    },

    draw: function() {
      return this._reset();
    },

    onRemove: function (map) {
      this._container.parentNode.removeChild(this._container);
      map.off({
        'viewreset': this._reset,
        'move': this._render,
        'resize': this._reset,
        'zoomanim': this._animateZoom,
        'zoomend': this._endZoomAnim
      }, this);
    },

    addTo: function (map) {
      map.addLayer(this);
      return this;
    },

    setOpacity: function (opacity) {
      this.options.opacity = opacity;
      this._updateOpacity();
      return this;
    },

    setZIndex: function(zIndex) {
      this._canvas.style.zIndex = zIndex;
    },

    bringToFront: function () {
      return this;
    },

    bringToBack: function () {
      return this;
    },

    _reset: function () {
      var size = this._map.getSize();
      this._canvas.width = size.x;
      this._canvas.height = size.y;

      // fix position
      var pos = L.DomUtil.getPosition(this._map.getPanes().mapPane);
      if (pos) {
        L.DomUtil.setPosition(this._canvas, { x: -pos.x, y: -pos.y });
      }
      this.onResize();
      this.render();
    },


    _updateOpacity: function () {},
    onResize: function() {},


    redraw: function(diff) {
      // objects should keep track of last bbox and zoom of map
      // if this hasn't changed the ll -> container pt is not needed

      var bounds = this._map.getBounds();
      var zoom = this._map.getZoom();

      for( var i = 0; i < this.features.length; i++ ) {
        this.redrawFeature(this.features[i], bounds, zoom, diff);
      }
    },

    redrawFeature : function(feature, bounds, zoom, diff) {
      // ignore anything flagged as hidden
      if( !feature.visible ) return;

      // now lets check cache to see if we need to reproject the
      // xy coordinates
      var reproject = true;
      if( feature.cache ) {
        if( feature.cache.zoom == zoom &&
            feature.cache.geoXY ) {

          reproject = false;
        }
      }

      // actually project to xy if needed
      if( reproject ) {

        if( !feature.cache ) feature.cache = {};

        feature.cache.zoom = zoom;

        if( feature.geojson.geometry.type == 'Point' ) {

          feature.cache.geoXY = this._map.latLngToContainerPoint([
              feature.geojson.geometry.coordinates[1],
              feature.geojson.geometry.coordinates[0]
          ]);

          // TODO: calculate bounding box if zoom has changed
          if( feature.size ){

          }

        } else if( feature.geojson.geometry.type == 'LineString' ) {
          feature.cache.geoXY = this.projectLine(feature.geojson.geometry.coordinates);
        } else if ( feature.geojson.geometry.type == 'Polygon' ) {
          feature.cache.geoXY = this.projectLine(feature.geojson.geometry.coordinates[0]);
        }
      }

      if( diff && !reproject ) {
        if( feature.geojson.geometry.type == 'Point' ) {
          feature.cache.geoXY.x += diff.x;
          feature.cache.geoXY.y += diff.y;

        } else if( feature.geojson.geometry.type == 'LineString' ) {
          this.moveLine(feature.cache.geoXY, diff);
        } else if ( feature.geojson.geometry.type == 'Polygon' ) {
          this.moveLine(feature.cache.geoXY, diff);
        }
      }

      // ignore anything not in bounds
      if( feature.geojson.geometry.type == 'Point' ) {
        if( !bounds.contains(feature.latlng) ) {
          //feature.outOfBounds = true;
          return;
        }
      } else {
        if( !bounds.contains(feature.bounds) && !bounds.intersects(feature.bounds) ) {
          //feature.outOfBounds = true;
          return;
        }
      }

      // if the feature was out of bounds last time we want to reproject
      //feature.outOfBounds = false;

      // call feature render function in feature scope;
      feature.render.call(feature, this._ctx, feature.cache.geoXY, this._map);
    },

    addFeatures : function(features) {
      for( var i = 0; i < this.features.length; i++ ) {
        this.addFeature(this.features[i]);
      }
    },


    /**
      A Feature should have the following:

      feature = {
        visible : Boolean,
        size : Number, // points only, used for mouse interact
        geojson : {}
        render : function(context, coordinatesInXY, map) {} // called in feature scope
      }

      geoXY and leaflet will be assigned
    **/
    addFeature : function(feature) {
      if( !feature.geojson ) return;
      if( !feature.geojson.geometry ) return;

      if( typeof feature.visible === 'undefined' ) feature.visible = true;
      feature.cache = null;

      if( feature.geojson.geometry.type == 'LineString' ) {
        feature.bounds = this.calcBounds(feature.geojson.geometry.coordinates);
      } else if ( feature.geojson.geometry.type == 'Polygon' ) {
        feature.bounds = this.calcBounds(feature.geojson.geometry.coordinates[0]);
      } else if ( feature.geojson.geometry.type == 'Point' ) {
        feature.latlng = L.latLng(feature.geojson.geometry.coordinates[1], feature.geojson.geometry.coordinates[0]);
      } else {
        console.log('GeoJSON feature type "'+feature.geojson.geometry.type+'" not supported.');
        console.log(feature.geojson);
        return;
      }

      this.features.push(feature);
    },


    moveLine : function(coords, diff) {
      for( var i = 0; i < coords.length; i++ ) {
        coords[i].x += diff.x;
        coords[i].y += diff.y;
      }
    },

    projectLine : function(coords) {
      var xyLine = [];

      for( var i = 0; i < coords.length; i++ ) {
        xyLine.push(this._map.latLngToContainerPoint([
            coords[i][1], coords[i][0]
        ]));
      }

      return xyLine;
    },

    calcBounds : function(coords) {
      var xmin = xmax = coords[0][1];
      var ymin = ymax = coords[0][0];

      for( var i = 1; i < coords.length; i++ ) {
        if( xmin > coords[i][1] ) xmin = coords[i][1];
        if( xmax < coords[i][1] ) xmax = coords[i][1];

        if( ymin > coords[i][0] ) ymin = coords[i][0];
        if( xmax < coords[i][0] ) ymax = coords[i][0];
      }

      var southWest = L.latLng(xmin, ymin);
      var northEast = L.latLng(xmax, ymax);

      return L.latLngBounds(southWest, northEast);
    },

    lastCenterLL : null,

    render: function(e) {
      var t = new Date().getTime();

      var diff = null;
      if( e && e.type == 'move' ) {
        var center = this._map.getCenter();

        var pt = this._map.latLngToContainerPoint(center);
        if( this.lastCenterLL ) {
          var lastXy = this._map.latLngToContainerPoint(this.lastCenterLL);
          diff = {
            x : lastXy.x - pt.x,
            y : lastXy.y - pt.y
          }
        }

        this.lastCenterLL = center;
      }

      var topLeft = this._map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(this._canvas, topLeft);

      var canvas = this.getCanvas();
      var ctx = canvas.getContext('2d');

      // clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if( !this.zooming ) this.redraw(diff);

      var diff = new Date().getTime() - t;

      var c = 0;

      for( var i = 0; i < this.features.length; i++ ) {
        if( Array.isArray(this.features[i].cache.geoXY) ) c += this.features[i].cache.geoXY.length;
      }
      console.log('Rendered '+c+' pts in '+diff+'ms');

    },

    intersects : function(e) {
      console.log(e);

      var mpp = this.metersPerPx(e.latlng);
      var r = mpp * 5; // 5 px radius buffer;

      var center = {
        type : 'Point',
        coordinates : [e.latlng.lng, e.latlng.lat]
      }

      var f;
      var intersects = [];
      for( var i = 0; i < this.features.length; i++ ) {
        f = this.features[i];
        if( !f.visible ) continue;
        if( !f.geojson.geometry ) continue;
        if( f.bounds && !f.bounds.contains(e.latlng) ) continue;

        if( this.geometryWithinRadius(f.geojson.geometry, center, r) ) {
          intersects.push(f.geojson);
        }
      }
      console.log(intersects);
    },

    geometryWithinRadius : function(geometry, center, radius) {
      if (geometry.type == 'Point') {
        return GeoJSONUtils.pointDistance(geometry, center) <= radius;
      } else if (geometry.type == 'LineString' ) {
        return false;
      } else if (geometry.type == 'Polygon') {
        return GeoJSONUtils.pointInPolygon(center, geometry);
      }
    },

    // http://math.stackexchange.com/questions/275529/check-if-line-intersects-with-circles-perimeter
    lineIntersectsCircle : function() {
      return (Math.abs((l2.lat() - l1.lat())*c.lat() +  c.lng()*(l1.lng() -
       l2.lng()) + (l1.lat() - l2.lat())*l1.lng() +
       (l1.lng() - l2.lng())*c.lat())/ Math.sqrt((l2.lat() - l1.lat())^2 +
       (l1.lng() - l2.lng())^2) <= r)
    },

    // http://wiki.openstreetmap.org/wiki/Zoom_levels
    // http://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level
    metersPerPx : function(ll, zoom) {
      var pointC = map.latLngToContainerPoint(ll); // convert to containerpoint (pixels)
      var pointX = [pointC.x + 1, pointC.y]; // add one pixel to x

      // convert containerpoints to latlng's
      var latLngC = map.containerPointToLatLng(pointC);
      var latLngX = map.containerPointToLatLng(pointX);

      var distanceX = latLngC.distanceTo(latLngX); // calculate distance between c and x (latitude)
      return distanceX;
    }


  });

} //L defined

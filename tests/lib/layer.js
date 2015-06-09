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
        updateWhenIdle: L.Browser.mobile,
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

      this._reset();
    },

    _startZoom: function() {
      this._canvas.style.visibility = 'hidden';
    },

    _endZoom: function () {
        this._canvas.style.visibility = 'visible';
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


    redraw: function(force) {
      // objects should keep track of last bbox and zoom of map
      // if this hasn't changed the ll -> container pt is not needed

      var bounds = this._map.getBounds();
      var boundsStr = bounds.toBBoxString();
      var zoom = this._map.getZoom();

      for( var i = 0; i < this.features.length; i++ ) {
        this.redrawFeature(this.features[i], bounds, boundsStr, zoom);
      }
    },

    redrawFeature : function(feature, bounds, boundsStr, zoom) {
      // ignore anything flagged as hidden
      if( !feature.visible ) return;

      // ignore anything not in bounds
      if( feature.geojson.type == 'Point' ) {
        if( !bounds.contains(feature.latlng) ) return;
      } else {
        if( !bounds.contains(feature.bounds) ) return;
      }

      // now lets check cache to see if we need to reproject the
      // xy coordinates
      var reproject = true;
      if( feature.cache ) {
        if( feature.cache.bboxString == boundsStr &&
            feature.cache.zoom == zoom &&
            feature.cache.geoXY ) {

          reproject = false;
        }
      }

      // actually project to xy if needed
      if( reproject ) {
        feature.cache.bboxString = boundsStr;
        feature.cache.zoom = zoom;

        if( feature.geojson.type == 'Point' ) {
          feature.cache.geoXY = this._map.latLngToContainerPoint([
              feature.geojson.coordinates[1],
              feature.geojson.coordinates[0]
          ]);
        } else if( feature.geojson.type == 'LineString' ) {
          feature.cache.geoXY = this.projectLine(feature.geojson.coordinates);
        } else if ( feature.geojson.type == 'Polygon' ) {
          feature.cache.geoXY = this.projectLine(feature.geojson.coordinates[0]);
        }
      }

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
    **/
    addFeature : function(feature) {
      if( feature.visible === 'undefined' ) feature.visible = true;
      feature.cache = null;

      if( feature.geojson.type == 'LineString' ) {
        feature.bounds = this.calcBounds(feature.geojson.coordinates);
      } else if ( feature.geojson.type == 'Polygon' ) {
        feature.bounds = this.calcBounds(feature.geojson.coordinates[0]);
      } else if ( feature.geojson.type == 'Point' ) {
        feature.latlng = L.latlng(feature.geojson.coordinates[1], feature.geojson.coordinates[0]);
      } else {
        console.log('GeoJSON feature type "'+feature.geojson.type+'" no supported.');
        console.log(feature.geojson);
        return;
      }

      this.features.push(feature);
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

      var southWest = L.latlng(ymin, xmin);
      var northEast = L.latlng(ymax, xmax);

      return L.latLngBounds(southWest, northEast);
    }




  });

} //L defined

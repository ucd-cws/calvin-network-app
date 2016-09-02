var collections = require('../collections');
var renderer = require('./renderer');

var behavior = {
  updateRenderState : function() {
    this.renderState = {
      points : [],
      lines : [],
      polygons : []
    }
    this.clearRegionLinks();

    this._updateRenderState('California');

    var f = null, render;
    for( var i = 0; i < this.markerLayer.features.length; i++ ) {
      f = this.markerLayer.features[i];
      r = f.geojson.properties._render || {};

      if( (this.renderState.points.indexOf(f.id) > -1 ||
        this.renderState.lines.indexOf(f.id) > -1 ||
        this.renderState.polygons.indexOf(f.id) > -1) &&
        r.show !== false ) {

          f.visible = true;
      } else {
        f.visible = false;
      }
    }

    this.markerLayer.render();
  },

  _updateRenderState : function(id) {
    var region = collections.regions.getById(id);
    var state = this.menu.state;

    if( state.enabled.indexOf(id) > -1 ) {
      this._addStateNodes(region.properties.hobbes.nodes, state);

      if( !region.properties.hobbes.subregions ) return;

      for( var i = 0; i < region.properties.hobbes.subregions.length; i++ ) {
        this._updateRenderState(region.properties.hobbes.subregions[i]);
      }
    } else {

      if( name != 'California' ) this.renderState.polygons.push(region.properties.hobbes.id);
    }
  },

  _addStateNodes : function(nodes, state) {
    var self = this;

    // find first region and insert after
    var index = 0, type;
    for( var i = 0; i < this.markerLayer.features.length; i++ ) {
      type = this.markerLayer.features[i].geojson.geometry.type;
      if( type != 'Polygon' && type != 'MultiPolygon' ) {
        index = i;
        break;
      }
    }

    for( var id in nodes ) {
      var node = collections.nodes.getById(id);
      if( !node ) node = collections.nodes.getByPrmname(id);
      if( !node ) continue;

      var render = node.properties._render || {};
      if( render.show === false ) continue;

      if( node.properties.hobbes.type === 'link' ) {
        var terminal = this._getStateNodeLocation(node.properties.terminus, state);
        var origin = this._getStateNodeLocation(node.properties.origin, state);

        if( !terminal || !origin ) continue;

        var lineFeature;
        if( terminal.isNode && origin.isNode ) {
          lineFeature = this.createNodeLink(origin.center, terminal.center, node, index);
          this.customLines[node.properties.origin+'_'+node.properties.terminus] = lineFeature;
        } else {
          // if this line already exists, a null value will be returned
          lineFeature = this.createRegionLink(origin, terminal, node, index);
        }

        if( lineFeature ) {
          this.renderState.lines.push(lineFeature.geojson.properties.hobbes.id);
        }

      } else {
        this.renderState.points.push(node.properties.hobbes.id);
      }
    }
  },

  createNodeLink : function(origin, terminal, node, index) {
    var link = {
      geojson : {
        "type" : "Feature",
        "geometry" : {
          "type" : "LineString",
          coordinates : [origin, terminal]
        },
        properties : $.extend(true, {}, node.properties)
      },
      renderer : renderer
    };
    
    this.markerLayer.addCanvasFeature(new L.CanvasFeature(link, link.geojson.properties.hobbes.id), index);

    return link;
  },

  createRegionLink : function(origin, terminal, node, index) {
    var self = this;
    var feature = null;
    if( this.customLines[origin.name+'_'+terminal.name] ) {
      feature = this.customLines[origin.name+'_'+terminal.name];
    } else if ( this.customLines[terminal.name+'_'+origin.name] ) {
      feature = this.customLines[terminal.name+'_'+origin.name];
    }

    if( !feature ) {
      feature = {
        geojson : {
          "type" : "Feature",
          "geometry" : {
            "type" : "LineString",
            coordinates : [origin.center, terminal.center]
          },
          properties : {
            hobbes : {
              id : origin.name+'--'+terminal.name,
              type : 'link'
            },
            prmname : origin.name+'--'+terminal.name,
            type : 'Region Link',
            lines : [$.extend(true, {}, node.properties)],
          }
        },
        renderer : renderer
      }

      this.customLines[origin.name+'_'+terminal.name] = feature;
      this.markerLayer.addCanvasFeature(new L.CanvasFeature(feature, feature.geojson.properties.hobbes.id), index);

      return feature;
    }

    feature.geojson.properties.lines.push($.extend(true, {}, node.properties));
  },

  clearRegionLinks : function() {
    var properties;
    for( var i = this.markerLayer.features.length-1; i >= 0; i-- ) {
      properties = this.markerLayer.features[i].geojson.properties;
      if( properties.hobbes.type === 'link' ) {
        this.markerLayer.features.splice(i, 1);
      }
    }

    this.markerLayer.rebuildIndex(this.markerLayer.features);
    this.customLines = {};
  },

  _getStateNodeLocation : function(name, state) {
    var node = collections.nodes.getByPrmname(name);

    if( !node ) return null;

    for( var i = 0; i < node.properties.hobbes.regions.length; i++ ) {
      if( state.disabled.indexOf(node.properties.hobbes.regions[i]) > -1 ) {
        if( collections.regions.getById(node.properties.hobbes.regions[i]).properties.center ) {
          return {
            center: collections.regions.getById(node.properties.hobbes.regions[i]).properties.center,
            name: node.properties.hobbes.regions[i],
            isRegion : true
          };
        }
      }
    }

    return {
      center : node.geometry.coordinates || [0,0],
      name : name,
      isNode : true
    }
  },
}

module.exports = behavior;
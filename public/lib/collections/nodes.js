var rest = require('../rest');

function NodeCollection(){

    this.nodes = [];
    this.links = [];
    this.extras = {}; // extra data for node

    this.index = {
      id : {},
      origins : {},
      terminals : {},
      // only nodes in specified region
      regions : {},
      // nodes and links in region and child regions
      nestedRegions : {}
    };

    this.init = function(nodes) {
      this.nodes = [];
      this.links = [];
      this.extras = {};

      this.index = {
        id : {},
        origins : {},
        terminals : {},
        regions : {},
        nestedRegions : {
          'California' : []
        }
      };

      nodes.forEach((node) => {
        this.index.id[node.properties.hobbes.id] = node;

        this._addNestedRegions(node);

        if( node.properties.hobbes.type === 'link' ) {
          this.links.push(node);
          this.setLinkIndexes(node);
        } else {
          if( !node.properties.hobbes.region ) {
            node.properties.hobbes.region = 'California';
          }

          if( !this.index.regions[node.properties.hobbes.region] ) {
            this.index.regions[node.properties.hobbes.region] = [];
          }
          this.index.regions[node.properties.hobbes.region].push(node);
          this.nodes.push(node);
        }
      });
    }

    this._addNestedRegions = function(node) {
      this.index.nestedRegions.California.push(node);

      var regions = node.properties.hobbes.regions;
      regions.forEach(function(region) {
        if( !this.index.nestedRegions[region] ) {
          this.index.nestedRegions[region] = [];
        }
        this.index.nestedRegions[region].push(node);
      }.bind(this));

      if( !this.index.nestedRegions[node.properties.hobbes.region] ) {
        this.index.nestedRegions[node.properties.hobbes.region] = [];
      }
      this.index.nestedRegions[node.properties.hobbes.region].push(node);
    }

    this.setLinkIndexes = function(link) {
        if( !this.index.origins[link.properties.hobbes.origin] ) {
            this.index.origins[link.properties.hobbes.origin] = [link];
        } else {
            this.index.origins[link.properties.hobbes.origin].push(link);
        }

        if( !this.index.terminals[link.properties.hobbes.terminus] ) {
            this.index.terminals[link.properties.hobbes.terminus] = [link];
        } else {
            this.index.terminals[link.properties.hobbes.terminus].push(link);
        }
    }

    this.getExtras = function(id, callback) {
      if( this.extras[id] ) {
        if( this.extras[id].__loading__ ) {
          this.extras[id].handlers.push(callback);
        } else {
          callback(this.extras[id]);
        }
        return;
      }

      this.extras[id] = {
        __loading__ : true,
        handlers : [callback]
      };

      rest.getExtras(id, (resp) => {
        for( var i = 0; i < this.extras[id].handlers.length; i++ ) {
          this.extras[id].handlers[i](resp);
        }
        this.extras[id] = resp;
      });
    }

    this.getByRegion = function(id) {
      return this.index.regions[id] || [];
    }

    this.getAllNestedForRegion = function(id) {
      return this.index.nestedRegions[id] || [];
    }

    this.getById = function(id) {
      return this.index.id[id];
    }

    this.getOrigins = function(id) {
      return this.index.origins[id] || [];
    }

    this.getTerminals = function(id) {
      return this.index.terminals[id] || [];
    }
}

module.exports = new NodeCollection();
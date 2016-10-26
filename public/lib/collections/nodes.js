var rest = require('../rest');

function NodeCollection(){

    this.nodes = [];
    this.links = [];
    this.extras = {}; // extra data for node

    this.index = {
      prmname : {},
      hobbesId : {},
      origins : {},
      terminals : {},
      regions : {}
    };

    this.init = function(nodes) {
      this.nodes = [];
      this.links = [];
      this.extras = {};

      this.index = {
        prmname : {},
        hobbesId : {},
        origins : {},
        terminals : {},
        regions : {}
      };

      nodes.forEach((node) => {
        this.index.prmname[node.properties.prmname] = node;
        this.index.hobbesId[node.properties.hobbes.id] = node;

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

    this.setLinkIndexes = function(link) {
        if( !this.index.origins[link.properties.origin] ) {
            this.index.origins[link.properties.origin] = [link];
        } else {
            this.index.origins[link.properties.origin].push(link);
        }

        if( !this.index.terminals[link.properties.terminus] ) {
            this.index.terminals[link.properties.terminus] = [link];
        } else {
            this.index.terminals[link.properties.terminus].push(link);
        }
    }

    this.getExtras = function(prmname, callback) {
      if( this.extras[prmname] ) {
        if( this.extras[prmname].__loading__ ) {
          this.extras[prmname].handlers.push(callback);
        } else {
          callback(this.extras[prmname]);
        }
        return;
      }

      this.extras[prmname] = {
        __loading__ : true,
        handlers : [callback]
      };

      rest.getExtras(prmname, (resp) => {
        for( var i = 0; i < this.extras[prmname].handlers.length; i++ ) {
          this.extras[prmname].handlers[i](resp);
        }
        this.extras[prmname] = resp;
      });
    }

    this.getByRegion = function(id) {
      return this.index.regions[id] || [];
    }

    this.getByPrmname = function(prmname) {
      return this.index.prmname[prmname];
    }

    this.getById = function(id) {
      return this.index.hobbesId[id];
    }

    this.getOrigins = function(prmname) {
      return this.index.origins[prmname];
    }

    this.getTerminals = function(prmname) {
      return this.index.terminals[prmname];
    }
}

module.exports = new NodeCollection();
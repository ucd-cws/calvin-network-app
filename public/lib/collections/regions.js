var rest = require('../rest');

function RegionCollection(){
    this.index = {
      name : {},
      hobbesId : {},
      regions : {}
    };

    this.data = [],
    this.aggregate = {};

    this.init = function(regions) {
      this.index = {
        name : {},
        hobbesId : {},
        regions : {}
      };
      this.aggregate = {};

      regions.forEach((region) => {
        this.index.name[region.properties.name] = region;
        this.index.hobbesId[region.properties.hobbes.id] = region;

        if( !region.properties.hobbes.region && region.properties.hobbes.id !== 'California' ) {
          region.properties.hobbes.region = 'California';
        }

        if( !this.index.regions[region.properties.hobbes.region] ) {
          this.index.regions[region.properties.hobbes.region] = [];
        }
        this.index.regions[region.properties.hobbes.region].push(region);
      });

      this.data = regions;
    }

    this.loadAggregate = function(type, origin, terminus, callback) {
      var id = origin;
      if( typeof terminus === 'string' ) {
        id = id+'--'+terminus;
      } else {
        callback = terminus;
      }


      if( !this.aggregate[type] ) {
        this.aggregate[type] = {};
      }

      if( this.aggregate[type][id] ) {
        if( this.aggregate[type][id].__loading__ ) {
          this.aggregate[type][id].handlers.push(callback);
        } else {
          callback(this.aggregate[type][id]);
        }
        return;
      }

      this.aggregate[type][id] = {
        __loading__ : true,
        handlers : [callback]
      };

      if( typeof terminus !== 'string' ) {
        rest.getAggregate({type: type, region: origin}, (resp) => {
          for( var i = 0; i < this.aggregate[type][id].handlers.length; i++ ) {
            this.aggregate[type][id].handlers[i](resp);
          }
          this.aggregate[type][id] = resp;
        });

      } else {
        rest.getAggregate({type: 'flow', origin: origin, terminus: terminus}, (resp1) => {
          rest.getAggregate({type: 'flow', origin: terminus, terminus: origin}, (resp2) => {
            var data = {
              origin : resp1,
              terminus : resp2
            };

            for( var i = 0; i < this.aggregate[type][id].handlers.length; i++ ) {
              this.aggregate[type][id].handlers[i](data);
            }
            this.aggregate[type][id] = data;
          });
        });
      }
    }

    this.getByRegion = function(id) {
      return this.index.regions[id] || [];
    }

    this.getByName = function(name) {
      return this.index.name[name];
    }

    this.getById = function(id) {
      return this.index.hobbesId[id];
    }
}

module.exports = new RegionCollection();
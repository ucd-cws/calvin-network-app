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
      var prmname = origin;
      if( typeof terminus === 'string' ) {
        prmname = prmname+'--'+terminus;
      } else {
        callback = terminus;
      }


      if( !this.aggregate[type] ) {
        this.aggregate[type] = {};
      }

      if( this.aggregate[type][prmname] ) {
        if( this.aggregate[type][prmname].__loading__ ) {
          this.aggregate[type][prmname].handlers.push(callback);
        } else {
          callback(this.aggregate[type][prmname]);
        }
        return;
      }

      this.aggregate[type][prmname] = {
        __loading__ : true,
        handlers : [callback]
      };

      if( typeof terminus !== 'string' ) {
        rest.getAggregate({type: type, region: origin}, (resp) => {
          for( var i = 0; i < this.aggregate[type][prmname].handlers.length; i++ ) {
            this.aggregate[type][prmname].handlers[i](resp);
          }
          this.aggregate[type][prmname] = resp;
        });

      } else {
        rest.getAggregate({type: 'flow', origin: origin, terminus: terminus}, (resp1) => {
          rest.getAggregate({type: 'flow', origin: terminus, terminus: origin}, (resp2) => {
            var data = {
              origin : resp1,
              terminus : resp2
            };

            for( var i = 0; i < this.aggregate[type][prmname].handlers.length; i++ ) {
              this.aggregate[type][prmname].handlers[i](data);
            }
            this.aggregate[type][prmname] = data;
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
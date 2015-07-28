CWN.MapController = function(config){
    var map = config.map;

    this.regions = regions;
    this.lookup = {};

    this.initLookup = function(region) {
        this.lookup[region.name] = region;
        if( !region.subregions ) return;
        region.subregions.forEach(this.initLookup.bind(this));
    }

    this.initLookup(regions);
};

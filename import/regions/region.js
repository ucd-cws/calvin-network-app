var fs = require('fs');

var Region = function(root, name) {

    this.subregions = [];
    this.nodes = [];
    this.geo = {};
    this.isARegion = false;

    this.root = root;
    this.name = name;

    var dir = root + (name ? '/'+name : '');
    files = fs.readdirSync(dir);

    files.forEach(function(file){
        if( file.match(/^\./) ) return;

        if( file === 'region.geojson' ) {
            var json = fs.readFileSync(dir+'/'+file, 'utf-8');
            this.geo = JSON.parse(json);
            this.geo.properties.id = name;
            this.isARegion = true;
            return;
        }

        var stat = fs.statSync(dir+'/'+file);

        if( stat.isDirectory() && file !== 'regions' ) {

          var r = new Region(dir, file);
          if( r.isARegion ) {
            this.subregions.push(r);
            this.isARegion = true;
          }

        } else if ( stat.isFile() && file.match('\.geojson$') ) {
          this.isARegion = true;
          //console.log('-- '+dir+' '+file);
          //this.nodes.push(file.replace(/\.geojson/, ''));
          this.nodes.push(dir.replace(/.*\//, ''));
        }
    }.bind(this));

    this.toJSON = function() {
        var sub = [];
        for (var i = this.subregions.length - 1; i >= 0; i--) {
            sub.push(this.subregions[i].toJSON());
        };

        var json = {
            name : this.name,
            //root : this.root,
            nodes : this.nodes,
            geo : this.geo
        }
        if( sub.length > 0 ) json.subregions = sub;
        return json;
    }
}
module.exports = Region;

var fs = require('fs');

var Region = function(root, name) {

    this.subregions = [];
    this.nodes = [];
    this.geo = {};

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
            return;
        }

        var stat = fs.statSync(dir+'/'+file);

        if( stat.isDirectory() ) {
            this.subregions.push(new Region(dir, file));
        } else if ( stat.isFile() ) {
            this.nodes.push(file.replace(/\.geojson/, ''));
        }
    }.bind(this));

    this.toJSON = function() {
        var sub = [];
        for (var i = this.subregions.length - 1; i >= 0; i--) {
            sub.push(this.subregions[i].toJSON());
        };

        var json = {
            name : this.name,
            root : this.root,
            nodes : this.nodes,
            geo : this.geo
        }
        if( sub.length > 0 ) json.subregions = sub;
        return json;
    }
}
module.exports = Region;
var fs = require('fs');

var Region = function(root, name, branch) {

    this.subregions = [];
    this.nodes = {};
    this.geo = {};
    this.isARegion = false;
    this.isAFakeRegion = true; // a sub directory, no nodes or links or region file children

    this.root = root;
    this.name = name;

    var dir = root + (name ? '/'+name : '');
    files = fs.readdirSync(dir);

    files.forEach(function(file){
        if( file.match(/^\./) ) return;

        if( file === 'region.geojson' ) {
            var json = fs.readFileSync(dir+'/'+file, 'utf-8');

            var prmname = name.replace(/-/g,'_');
            this.geo = JSON.parse(json);
            this.geo.properties.id = prmname;
            this.isARegion = true;
            this.isAFakeRegion = false;
            return;
        }

        var stat = fs.statSync(dir+'/'+file);

        var childIsLink = fs.existsSync(dir+'/'+file+'/link.geojson');
        var childIsNode = fs.existsSync(dir+'/'+file+'/node.geojson');

        if( stat.isDirectory() && !childIsNode && !childIsLink ) {

          var r = new Region(dir, file, branch);
          if( r.isARegion ) {
            this.subregions.push(r);
            this.isARegion = true;
          } else if ( r.isAFakeRegion ) {
            for( var prmname in r.nodes ) {
              this.nodes[prmname] = r.nodes[prmname];
            }
          }

        } else if ( stat.isDirectory() && (childIsNode || childIsLink) ) {
          // read in prmname
          var prmname = file, filename = '';
          if( childIsNode ) {
            filename = dir+'/'+file+'/node.geojson';
          } else {
            filename = dir+'/'+file+'/link.geojson';
          }

          try {
            var n = eval('('+ fs.readFileSync(filename,'utf-8').replace(/[\r\n]/g,'') +')');
            this.nodes[n.properties.prmname] = n.properties.type;

          } catch(e) {
            console.log('JSON parse error: '+dir+' '+file);
          }


        } else {
          console.log('Ignored: '+dir+' '+file);
        }
    }.bind(this));

    this.toJSON = function() {

        var sub = [];
        for (var i = this.subregions.length - 1; i >= 0; i--) {
            sub.push(this.subregions[i].toJSON());
        };

        var repoDir = this.root.replace(/.*calvin-network-data/, '')+'/'+this.name;

        if( this.geo && this.geo.properties ) {
          this.geo.properties.repo = {
            dir : repoDir,
            github : 'https://github.com/ucd-cws/calvin-network-data/tree/'+branch + repoDir
          };
        }

        var json = {
            name : this.name.replace(/-/g,'_'),
            //root : this.root,
            nodes : this.nodes,
            geo : this.geo
        }
        if( sub.length > 0 ) json.subregions = sub;
        return json;
    }
}
module.exports = Region;

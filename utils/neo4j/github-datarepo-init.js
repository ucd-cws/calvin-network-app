/**
 *  Generate to github data repo from the visualization source
 **/
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var rimraf = require('rimraf');
var request = require('request');
var csv = require('fast-csv');
var async = require('async');

/** CONFIG **/
var vizUrl = 'http://watershed.ice.ucdavis.edu/vizsource/rest';
// geojson column - column in vizsource of geojson
var geojsonCol = 3;
// attributes that should be turned into cvs or json files
var dataAttributes = ['inflows', 'el_ar_cap', 'costs','constraints'];

var geojson = { 
    type: "FeatureCollection",
    features : []
};

if( !argv.dir ) return console.log('No --dir provided [dirname]');
console.log('Using: '+argv.dir);

initDir(argv.dir, function(){
    console.log('Directory initialized, querying data');
    if( fs.existsSync('./query.js') && argv.useCache ) {
        console.log('Using cached query.js files');
        var body = fs.readFileSync('./query.js',{encoding: 'utf8'});
        processData(dtToArray(eval('('+body+')')));
    } else {
        request.get({
                url : vizUrl, 
                qs : {
                    view : 'geojson',
                    tq : 'SELECT *'
                }
            },
            function (error, response, body) {
                console.log('Query received from server');
                if (!error && response.statusCode == 200) {
                    body = body.replace(/google\.visualization\.Query\.setResponse\(/g,'').replace(/\);$/,'');
                    fs.writeFileSync('./query.js',body);
                    processData(dtToArray(eval('('+body+')')));
                    return;
                } 
                console.log(4);
                console.log('Error getting vizsource json');
            }
        );
    }
});


function processData(data) {
    var node = '';

    async.eachSeries(
        data.nodes,
        function(node, next) {
            processNode(node, false, next);
        }, function(err){
            if( err ) console.log(err);

            async.eachSeries(
                data.links,
                function(link, next) {
                    processNode(link, true, next);
                },
                function(err){
                    if( fs.existsSync(argv.dir+'/network.geojson') ) {
                        fs.unlinkSync(argv.dir+'/network.geojson')
                    }
                    fs.writeFile(argv.dir+'/network.geojson', JSON.stringify(geojson));
                    console.log('done.');   
                }
            );
        }
    );

}

function processNode(node, isLink, callback) {
    var overview = {
        geometry : node.geometry,
        type : node.type,
        properties : {}
    };
    var files = [];

    var dirname;
    if( !isLink ) dirname = node.properties.prmname.replace(/\W/g, '_');
    else dirname = node.properties.origin.replace(/\W/g, '_') + '_' +
                    node.properties.terminus.replace(/\W/g, '_');

    var c = 1;
    while( fs.existsSync(argv.dir+'/data/'+(isLink ? 'links/' : 'nodes/')+dirname) ) {
        dirname = dirname.replace('_\d$', '') + '_' + c;
    }
    
    var dir = argv.dir+'/data/'+(isLink ? 'links/' : 'nodes/')+dirname;
    fs.mkdirSync(dir);
    console.log(dirname);
    for( var key in node.properties ) {
        if( typeof node.properties[key] != 'object' ) {
            overview.properties[key] = node.properties[key];
        }
    }

    processAttribute('', node, node.properties, files);

    fs.writeFileSync(dir+'/'+(isLink ? 'link' : 'node')+'.geojson', JSON.stringify(node, '', '  '));



    var csvFiles = [];
    for( var i = 0; i < files.length; i++ ) {
        if( files[i].json ) {
        //    fs.writeFileSync(dir+'/'+files[i].name, JSON.stringify(files[i].data, '', '  '));
        } else if( files[i].csv ) {
            csvFiles.push(files[i]);
        }
    }


    //
    //callback();

    if( csvFiles.length == 0) {
        geojson.features.push(overview);
        callback();
    } else {
        async.eachSeries(
            csvFiles,
            function(file, next){

                try {
                    var ws = fs.createWriteStream(dir+'/'+file.name);
                    //console.log(dir+'/'+file.name);
                    csv
                        .writeToStream(ws, file.data, {headers: true})
                        .on('finish', function(){
                            next();
                        });
                        
                } catch(e) {
                    console.log(e);
                }
                
            },
            function(err) {
                if( err ) console.log(err);

                geojson.features.push(overview);
                callback();
            }
        );
    }
}

/*
properties.inflows = [{
    name : ''
    date : [],
    inflow : []
}]

properties.constraint: {
    "bound_type": "Monthly",
    "bound": []
}

properties.constraints: {
  "constraint_type": "Bounded",
  "lower": {
    "bound_type": "None"
  },
  "upper": {
    "bound_type": "Monthly",
    "bound": {
      "$ref": "constraints_upper_bound.json"
    }
  }
}

properties.constraints : {
  "constraint_type": "Bounded",
  "lower": {
    "bound_type": "None"
  },
  "upper": {
    "bound_type": "TimeSeries",
    "date": {
      "$ref": "constraints_upper_date.json"
    },
    "bound": {
      "$ref": "constraints_upper_bound.json"
    }
  }
}


*/

function processAttribute(path, parent, obj, files) {
    for( var key in obj ) {
        if( Array.isArray(obj[key]) && isKnownCsv(obj, key) ) {
            //console.log('  --Found: '+path+' : '+key);
            var ignore = createCsv(path, parent, obj, key, files);
            if( ignore ) return;
        } else if ( typeof obj[key] == 'object') {
            var p = (path.length > 0 ? path+'_' : '')+key;
            processAttribute(p, obj, obj[key], files)
        }
    }
    return files;
}

function createCsv(path, parent, obj, key, files) {
    console.log(key);
    if( key == 'inflows' ) {
        console.log('  --adding inflows');
        refs = [];
        for( var i = 0; i < obj.inflows.length; i++ ) {
            var data = [
                ['name', obj.inflows[i].name],
                ['',''],
                ['date','inflow']
            ];
            var flow = obj.inflows[i];

            for( var j = 0; j < flow.date.length; j++ ) {
                data.push([flow.date[j], flow.inflow[j]]);
            }

            var name = (path.length > 0 ? path+'_' : '')+key+'_'+i+'.csv'
            files.push({
                csv : true,
                name : name,
                data : data
            });
            refs.push({'$ref': name});
        }
        obj.inflows = refs;
        return false;
    } else if ( obj.bound_type == 'TimeSeries' ) {
        console.log('  --adding TimeSeries');
        var data = [
            ['bound_type', 'TimeSeries'],
            ['',''],
            ['date','bound']
        ];

        for( var i = 0; i < obj.date.length; i++ ) {
            data.push([obj.date[i], obj.bound[i]]);
        }

        var name = (path.length > 0 ? path+'_' : '')+key+'.csv'
        files.push({
            csv : true,
            name : name,
            data : data
        });
        
        var parts = path.split('_');
        var pKey = parts[parts.length-1];
        parent[pKey] = {'$ref': name};
        return true;
    } else if ( obj.bound_type == 'Monthly' ) {
        console.log('  --adding Monthly');
        var data = [
            ['bound_type', 'Monthly'],
            ['',''],
            ['bound','']
        ];

        for( var i = 0; i < obj.bound.length; i++ ) {
            data.push([obj.bound[i], '']);
        }

        var name = (path.length > 0 ? path+'_' : '')+key+'.csv'
        files.push({
            csv : true,
            name : name,
            data : data
        });

        var parts = path.split('_');
        var pKey = parts[parts.length-1];
        parent[pKey] = {'$ref': name};
        return true;
    } else if ( key == 'el_ar_cap' ) {
        console.log('  --adding el_ar_cap');
        var data = [
            ['elevation', 'area', 'capacity']
        ];

        for( var i = 0; i < obj.el_ar_cap.length; i++ ) {
            data.push([
                obj.el_ar_cap[i].elevation,
                obj.el_ar_cap[i].area,
                obj.el_ar_cap[i].capacity
            ]);
        }

        var name = (path.length > 0 ? path+'_' : '')+key+'.csv'
        files.push({
            csv : true,
            name : name,
            data : data
        });

        obj[key] = {'$ref': name};
        return false;
    }
}


function isKnownCsv(obj, key) {
    if( key == 'inflows' ) return true;
    if( key == 'el_ar_cap' ) return true;
    if( obj.bound_type && (obj.bound_type == 'TimeSeries' || obj.bound_type == 'Monthly') ) return true;
    return false;
}


function dtToArray(dt) {
  var nodes = [];
  var links = [];

  for( var i = 0; i < dt.table.rows.length; i++ ) {
    var item = JSON.parse(dt.table.rows[i].c[geojsonCol].v);
    
    if( item.properties.type == 'Diversion' || item.properties.type == 'Return Flow' ) {
        links.push(item);
    } else {
        nodes.push(item);
    }
  }

  return {
    nodes : nodes,
    links : links
  }
}

function initDir(dir, callback) {
    if( !fs.existsSync(dir) ) {
        console.log('Looks like a fresh build, creating: '+dir);
        fs.mkdirSync(dir);
    }

    if( !fs.existsSync(dir+'/data') ) {
        fs.mkdirSync(dir+'/data');    
    }

    initDataDir(dir+'/data/nodes', function(){
        initDataDir(dir+'/data/links', callback);
    });
}

function initDataDir(dir, callback) {
    if( !fs.existsSync(dir) ) {
        fs.mkdirSync(dir);
        callback();  
    } else {
        rimraf(dir, function(){
            fs.mkdirSync(dir);
            callback();
        });
    }
}
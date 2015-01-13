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
        processNode,
        function(err){
            if( err ) console.log(err);

            async.eachSeries(
                data.links,
                processNode,
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

function processNode(node, callback) {
    var overview = {
        geometry : node.geometry,
        type : node.type,
        properties : {}
    };
    var files = [];

    var dirname = node.properties.prmname.replace(/\W/g, '_');
    console.log(dirname);
    var dir = argv.dir+'/data/'+dirname;
    fs.mkdirSync(dir);

    for( var key in node.properties ) {
        if( typeof node.properties[key] != 'object' ) {
            overview.properties[key] = node.properties[key];
        } else {
            processAttribute(key, node.properties[key], files);
            files.push({
                json : true,
                name : key+'.json',
                data : node.properties[key]
            });
            node.properties[key] = {'$ref' : key+'.json'}
        }
    }

    fs.writeFileSync(dir+'/node.json', JSON.stringify(node));

    var csvFiles = [];
    for( var i = 0; i < files.length; i++ ) {
        if( files[i].json || files[i].csv ) {
            fs.writeFileSync(dir+'/'+files[i].name, JSON.stringify(files[i].data));
        } else if( files[i].csv ) {
            csvFiles.push(files[i]);
        }
    }

    callback();

    /*if( csvFiles.length == 0) {
        callback();
    } else {
        async.eachSeries(
            csvFiles,
            function(file, next){

                try {
                    console.log(1);

                    var ws = fs.createWriteStream(dir+'/'+file.name);
                    console.log(dir+'/'+file.name);
                    console.log(file.data);
                    csv
                        .writeToStream(ws, [['shit','fuck']], {headers: true})
                        .on('finish', function(){
                            console.log(6);
                            next();
                        });
                    console.log(4);
                        
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
    }*/
}

function processAttribute(path, obj, files) {
    for( var key in obj ) {
        if( Array.isArray(obj[key]) ) {
            files.push({
                csv : true,
                name : path+'_'+key+'.json',
                data : obj[key]
            });
            obj[key] = {'$ref': path+'_'+key+'.json'};
        } else if ( typeof obj[key] == 'object') {
            processAttribute(path+'_'+key, obj[key], files)
        }
    }
    return files;
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
        callback();
    } else {
        console.log('Cleaning : '+dir+'/data');
        rimraf(dir+'/data', function(){
            fs.mkdirSync(dir+'/data');
            callback();
        });

    }
}
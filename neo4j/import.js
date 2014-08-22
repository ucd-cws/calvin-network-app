var neo4j = require('neo4j');
var request = require('request');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var async = require('async');
var fs = require('fs');

// fields to be moved into the climate blob
var climateAttrs = ['inflows'];
// fields to be moved into the climate blob
var costAttrs = ['costs'];
// fields to become neo4js searchable
var searchAttrs = ['prmname','type'];
// geojson column - column in vizsource of geojson
var geojsonCol = 3;

if( fs.existsSync('./query.js') ) {
    var body = fs.readFileSync('./query.js',{encoding: 'utf8'});
    dropAllNodes(function(){
         dtToArray(eval('('+body+')'));
    });
} else {
    request.get({
        url : 'http://watershed.ice.ucdavis.edu/vizsource/rest', 
        qs : {
            view : 'geojson',
            tq : 'SELECT *'
        }},
        function (error, response, body) {
            console.log('Query received from server');
            if (!error && response.statusCode == 200) {
                dropAllNodes(function(){
                    body = body.replace(/google\.visualization\.Query\.setResponse\(/g,'').replace(/\);$/,'');
                    fs.writeFileSync('./query.js',body);
                    dtToArray(eval('('+body+')'));
                });
                return;
            } 
            console.log(4);
            console.log('Error getting vizsource json');
    });
}

function dropAllNodes(callback) {
    var query = [
        'MATCH (n)',
        'OPTIONAL MATCH (n)-[r]-()',
        'DELETE n,r'
    ].join('\n');

    console.log('dropping all nodes');
    db.query(query, {}, function (err, results) {
        if (err) throw err;
        console.log(results);
        callback();
    });
}

function dtToArray(dt) {
  var arr = [];

  for( var i = 0; i < dt.table.rows.length; i++ ) {
    var node = {};

    var item = JSON.parse(dt.table.rows[i].c[geojsonCol].v);

    // split up item
    // first set first class citizen attributes
    for( var j = 0; j < searchAttrs.length; j++ ) {
        if( item.properties[searchAttrs[j]] ) {
            node[searchAttrs[j]] = item.properties[searchAttrs[j]];
        }
    }

    // now create climate blob, removing info from geojson
    var climate = {};
    for( var j = 0; j < climateAttrs.length; j++ ) {
        if( item.properties[climateAttrs[j]] ) {
            climate[climateAttrs[j]] = item.properties[climateAttrs[j]];
            delete item.properties[climateAttrs[j]];
            item.properties.hasClimate = true;
        }
    }
    node.climate = JSON.stringify(climate);

    // now create cost blob, removing info from geojson
    var costs = {};
    for( var j = 0; j < costAttrs.length; j++ ) {
        if( item.properties[costAttrs[j]] ) {
            costs[costAttrs[j]] = item.properties[costAttrs[j]];
            delete item.properties[costAttrs[j]];
            item.properties.hasCosts = true;
        }
    }
    node.costs = JSON.stringify(costs);

    // set cleaned up geojson
    node.geojson = JSON.stringify(item);
    arr.push(node);
  }

  insert(arr);
}

var nodeMap = {};
function insert(arr) {
    console.log('Inserting....');

    async.eachSeries(arr,
        function(json, next) {
            var node = db.createNode(json);     // instantaneous, but...

            nodeMap[json.prmname] = {
                json : json,
                node : node
            };

            node.save(function (err, node) {    // ...this is what actually persists.
                if (err) {

                    console.error('Error saving new node to database:', err);
                    console.log(json);
                } else {
                    console.log('Node saved to database with id:', node.id);
                }
                 next();
            });
            
        },
        function(err) {
            relate(arr);
        }
   );
}

var called = false;
function relate(arr) {
    if( called ) return;
    called = true;

    console.log('Relating nodes to ('+arr.length+')...');

    async.eachSeries(arr,
        function(json, next) {
            if( !nodeMap[json.prmname] ) return next();

            var node = nodeMap[json.prmname].node;
            relateFrom(json.prmname, node, json.origins, function(){
                next();
            });
        },
        function(err) {
            relateMore(arr);
        }
    );
}

function relateMore(arr) {
    console.log('Relating nodes from ('+arr.length+')...');

    async.eachSeries(arr,
        function(json, next) {
            if( !nodeMap[json.prmname] ) return next();

            var node = nodeMap[json.prmname].node;
            relateTo(json.prmname, node, json.terminals, function(){
                next();
            });
        },
        function(err) {
            console.log('done');
        }
    );
}



function relateFrom(name, node, origins, callback) {
    if( !origins ) return callback();

    async.eachSeries(origins,
        function(origin, next) {
            if( !origin ) return next();
            var originName = origin.replace(name+'_','');

            if( !nodeMap[originName] ) {
                console.log('  Node '+originName+' not found to relate too...');
                return next();
            }

            node.createRelationshipFrom(nodeMap[originName].node, 'origin', function(err, rel) {
                if( err ) console.log('Error creating origin '+originName+' -> '+name);
                console.log('Created origin '+originName+' -> '+name);
                next();
            });
        },
        function(err) {
            callback();
        }
    );
}

function relateTo(name, node, terminals, callback) {
    if( !terminals ) return callback();

    async.eachSeries(terminals,
        function(terminal, next) {
            if( !terminal ) return next();
            var terminalName = terminal.replace('_'+name,'');

            if( !nodeMap[terminalName] ) {
                console.log('  Node '+terminalName+' not found to relate too...');
                return next();
            }

            node.createRelationshipTo(nodeMap[terminalName].node, 'terminal', function(err, rel) {
                if( err ) console.log('Error creating terminal '+name+' -> '+terminalName);
                console.log('Created terminal '+name+' -> '+terminalName);
                next();
            });
        },
        function(err) {
            callback();
        }
    );
}




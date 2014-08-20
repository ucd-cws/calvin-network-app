var neo4j = require('neo4j');
var request = require('request');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var async = require('async');
var fs = require('fs');

console.log(1);

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
            console.log(2);
            if (!error && response.statusCode == 200) {
                console.log(3);
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
    var item = JSON.parse(dt.table.rows[i].c[2].v);
    for( var key in item.properties ) {
        if( typeof item.properties[key] == 'object' && !Array.isArray(item.properties[key]) ) continue;
        if( Array.isArray(item.properties[key]) && typeof item.properties[key][0] != 'string') continue;
        node[key] = item.properties[key];
    }
    node.geojson = JSON.stringify(item);
    arr.push(node);
  }

  insert(arr);
}

var nodeMap = {};
function insert(arr) {
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




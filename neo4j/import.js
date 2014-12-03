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
var searchAttrs = ['prmname','type','origin','terminus'];
// geojson column - column in vizsource of geojson
var geojsonCol = 3;

var useCache = false;
process.argv.forEach(function (val, index, array) {
    if( val == '--cache' ) useCache = true;
});

if( fs.existsSync('./query.js') && useCache ) {
    console.log('Using cached query.js files');
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
  var nodes = [];
  var links = [];

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
    
    if( node.type == 'Diversion' || node.type == 'Return Flow' ) {
        links.push(node);
    } else {
        nodes.push(node);
    }
  }

  insertNodes(nodes, links);
}


function insertNodes(nodes, links) {
    var nodeMap = {};
    console.log('Inserting Nodes....');

    async.eachSeries(nodes,
        function(json, next) {
            var node = db.createNode(json);     // instantaneous, but...

            nodeMap[json.prmname] = {
                json : json,
                node : node
            };

            //console.log('Creating node from '+json.prmname);

            node.save(function (err, node) {    // ...this is what actually persists.
                if (err) {
                    console.error('Error saving new node to database:', err);
                    console.log(json);
                }
                next();
            });
            
        },
        function(err) {
            insertLinks(nodes, links, nodeMap);
        }
   );
}

function insertLinks(nodes, links, map) {
    console.log('Inserting Links....');

    var unknowns = [];

    async.eachSeries(links,
        function(link, next) {
            if( map[link.origin] && map[link.terminus] ) {
                //console.log('Creating link from '+link.origin+' -> '+link.terminus);

                var node = map[link.origin].node;

                node.createRelationshipTo(map[link.terminus].node, link.type, link, function(err, rel) {
                    if( err ) console.log('Error creating terminal '+link.origin+' -> '+link.terminus);
                    next();
                });

            } else {
                if( !map[link.origin] ) unknowns.push(link.prmname+' origin:'+link.origin);
                if( !map[link.terminus] ) unknowns.push(link.prmname+' terminus:'+link.terminus);
                next();
            }
        },
        function(err) {
            if( err ) console.log(err);
            console.log('Done.');

            console.log('Unknowns: '+unknowns.length);
            console.log(unknowns);
        }
   );
}


// express js
var express = require('express');
var app = express();
var session = require('express-session')
var bodyParser = require('body-parser')
// neo4j
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

// redis
// start of auth logins
//var redis = require("redis");
//var redisClient = redis.createClient();
//var RedisStore = require('connect-redis')(session);


var dir = __dirname + '/dist';
process.argv.forEach(function(val){
    if( val == '--dev' ) dir = __dirname + '/app';
});

// start of auth login/
/*app.use(session({
  key: 'app.sess',
  store: new RedisStore(),
  secret: 'SEKR37',
  resave: false,
  saveUninitialized: true
}));*/
app.use(express.static(dir));
app.use(bodyParser.json());

app.get('/rest/getNetworks', function(req, resp){
    var nodeQuery = 'MATCH n RETURN DISTINCT n.network';
    var linkQuery = 'MATCH ()-[r]-() RETURN DISTINCT r.network';

    var networks = [];

    //db.query(nodeQuery, {networkName: networkName}, function (err, results) {
    db.query(nodeQuery, function (err, results) {
        if (err) return sendError(resp, err);

        for( var i = 0; i < results.length; i++ ) {
            for( var key in results[i] ) {
                if( results[i][key] ) networks.push(results[i][key]);
            }
        }
        
        //db.query(linkQuery, {networkName: networkName}, function (err, results) {
        db.query(linkQuery, function (err, results) {
            if (err) return sendError(resp, err);

            for( var i = 0; i < results.length; i++ ) {
                for( var key in results[i] ) {
                    if( results[i][key] && networks.indexOf(results[i][key]) == -1 ) {
                        networks.push(results[i][key]);
                    }
                }
            }

            resp.send(networks);
        });
    });
});

app.get('/rest/getNetwork', function(req, resp){
    //var networkName = req.query.network || 'default';

    // see blow
    //var nodeQuery = 'MATCH (n {network: {networkName}}) RETURN n.geojson';
    //var linkQuery = 'MATCH ()-[r {network: {networkName}}]->() return r.geojson';
    var nodeQuery = 'MATCH (n) RETURN n.geojson';
    var linkQuery = 'MATCH ()-[r]->() return r.geojson';

    var network = {
        nodes : [],
        links : []
    };

    //db.query(nodeQuery, {networkName: networkName}, function (err, results) {
    db.query(nodeQuery, function (err, results) {
        if (err) return sendError(resp, err);

        for( var i = 0; i < results.length; i++ ) {
            network.nodes.push(results[i]['n.geojson']);
        }
        
        //db.query(linkQuery, {networkName: networkName}, function (err, results) {
        db.query(linkQuery, function (err, results) {
            if (err) return sendError(resp, err);
            
            for( var i = 0; i < results.length; i++ ) {
                network.links.push(results[i]['r.geojson']);
            }

            resp.send(network);
        });
    });
});

app.get('/rest/getAttribute', function(req, resp){
    //var networkName = req.query.network || 'default';
    var name = req.query.prmname;
    var type = req.query.type;
    var attribute = req.query.attribute;


    if( !name || !type || !attribute) {
        
        return sendError(resp, 'You must provide a prmname, attribute and type parameter.  Type should be "node" or "link"');
    }
    attribute = attribute.replace(/[^a-z0-9_]+$/i,'');

    var query = '';
    if( type == 'link' ) {
        //query = 'MATCH (n)-[r { prmname: {name}, network: {networkName} }]->() RETURN r.'+attribute;
        query = 'MATCH (n)-[r { prmname: {name}}]->() RETURN r.'+attribute;
    } else {
        //query ='MATCH (n { prmname: {name}, network: {networkName} }) RETURN n.'+attribute;
        query ='MATCH (n { prmname: {name} }) RETURN n.'+attribute;
    }

    db.query(query, {name: name}, function (err, results) {
        if (err) return sendError(resp, err);

        var result = {};
        if( results.length > 0 ) {
            if( type == 'link' ) result[attribute] = results[0]['r.'+attribute]
            else result[attribute] = results[0]['n.'+attribute]
        } else {
            result[attribute] = '';
        }
        resp.send(result);
    });
});


/*
app.get('/rest/edit', function(req, resp){
    var geojson = req.body;
    var item = {};

    // make sure we have the basics
    if( !geojson ) return sendError(resp, 'missing body');

    // make sure all required feilds are set
    for( var i = 0; i < def.requiredGeojson.length; i++ ) {
        if( !item[def.requiredGeojson[i]] ) return sendError(resp, 'missing '+def.requiredGeojson[i]);
    }

    // first set first class citizen attributes
    for( var j = 0; j < def.searchAttrs.length; j++ ) {
        if( geojson.properties[def.searchAttrs[j]] ) {
            item[def.searchAttrs[j]] = geojson[searchAttrs[j]];
        }
    }

    

    // TODO
    // finally verify user has access to edit network

    if( def.links.indexOf(item.type) ) {
        editLink(item);
    } else {
        editNode(item);
    }


    var query = '';
    if( type == 'link' ) {
        query = 'MATCH (n)-[r { prmname: {name}, network: {networkName} }]->() RETURN r.'+attribute;
    } else {
        query ='MATCH (n { prmname: {name}, network: {networkName} }) RETURN n.'+attribute;
    }

    db.query(query, {name: name, networkName: networkName}, function (err, results) {
        if (err) return sendError(resp, err);

        var result = {};
        if( results.length > 0 ) {
            if( type == 'link' ) result[attribute] = results[0]['r.'+attribute]
            else result[attribute] = results[0]['n.'+attribute]
        } else {
            result[attribute] = '';
        }
        resp.send(result);
    });
});

function editNode(node) {
    
}
*./


/*
app.get('/rest/traverse', function(req, resp){
    var networkName = req.params.network || 'default';
    var name = req.params.prmname;
    var type = req.params.type;
    var attribute = req.params.attribute;

    if( !name || !type || !attribute) {
        return sendError(resp, 'You must provide a prmname, attribute and type parameter.  Type should be "node" or "link"');
    }
    attribute = attribute.replace(/^[a-z0-9_]+$/i,'');

    var query = '';
    if( type == 'node' ) {
        query = 'MATCH (n)-[r { prmname: {name} }]->() RETURN r.'+attribute;
    } else {
        query ='MATCH (n { prmname: {name} }) RETURN n.'+attribute;
    }

    db.query(nodeQuery, {name: name}, function (err, results) {
        if (err) return sendError(resp, err);
        resp.send(results);
    });
});
*/


function sendError(resp, msg) {
    resp.send({error:true, message: msg});
}

app.listen(3006);
console.log('Serving '+dir+' @ http://localhost:3006');
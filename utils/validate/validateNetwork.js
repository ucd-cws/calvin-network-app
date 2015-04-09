'use strict'

var request = require('request');
var jjv = require('jjv');
var async = require('async');
var colors = require('colors');

var schemaUrl = 'http://watershed.ice.ucdavis.edu/json/calvin.json';
var networkUrl = 'http://cwn.casil.ucdavis.edu/rest/getNetwork';
var docsonUrl = 'http://watershed.ice.ucdavis.edu/docson/#/json/calvin.json';

var data = {};
var requests = [
    {name : 'schema', url: schemaUrl}, 
    {name : 'network', url: networkUrl}
];

// load data
async.each(requests, loadJson, run);

function run(err) {
    if( err ) {
        console.log(colors.red('Error loading data.'));
        return console.log(error);
    }

    console.log('data loaded. validating...');

    var hasError = false;
    var env = jjv();
    env.addSchema('calvin', data.schema);

    for( var i = 0; i < data.network.nodes.length; i++ ) {

        // this is stringify'd geojson, we just care about the properties
        var node = JSON.parse(data.network.nodes[i]).properties;
	console.log(node);

        var errors = env.validate('calvin', node);

        // validation was successful
        if( !errors ) {
            console.log(colors.green('PASSED: '+node.prmname));
        } else {
            hasError = true;
            console.log(colors.red('FAILED: '+node.prmname));
            console.log(colors.gray('    ' + JSON.stringify(errors)));
        }
    }

    console.log('done.\n');
    if( hasError ) console.log('Visit '+docsonUrl+' for full schema visualization.\n');
}

function loadJson(item, callback) {
    var json = '';
    request.get(item.url)
        .on('data', function(chunk) {
            json += chunk;
        })
        .on('end', function(){
            data[item.name] = JSON.parse(json);
            console.log('Setting '+item.name);
            callback();
        });
}

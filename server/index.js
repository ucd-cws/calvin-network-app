// express js
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('./lib/mongo');


// global ns provided by mqe
var app = global.app;
var mqe = global.mqe;
var config = global.appConfig;
var express = global.express;
var logger = global.logger;


// express app
exports.bootstrap = function() {
  var db = global.db;

  mongo.connect(db, config);

  var dir = __dirname + '/../dist';
  if( config.dev ) dir = __dirname + '/../app';

  app.use(express.static(dir));
  //app.use(bodyParser.json());

  app.get('/rest/getRegions', function(req, resp){
    resp.header("Access-Control-Allow-Origin", "*");

    mongo.getRegions(function(err, result){
      if( err ) return sendError(resp, 'Error retrieving CALVIN network region data :(');
      resp.send(result);
    });
  });

  app.get('/rest/getNetwork', function(req, resp){
    resp.header("Access-Control-Allow-Origin", "*");

    mongo.getNetwork(function(err, result){
      if( err ) return sendError(resp, 'Error retrieving CALVIN network data :(');
      resp.send(result);
    });
  });

  app.get('/rest/getAttribute', function(req, resp){
    var prmname = req.query.prmname;
    var attribute = req.query.attribute;

    if( !prmname || attribute ) {
      return sendError(resp, 'You must provide a prmname and a attribute');
    }

    mongo.getAttribute(prmname, attribute, function(err, result){
      if( err ) return sendError(resp, 'Error retrieving attribute '+attribute+' from '+prmname);
      resp.send(result);
    });
  });


  console.log('Serving '+dir);
};

function sendError(resp, msg) {
    resp.send({error:true, message: msg});
}

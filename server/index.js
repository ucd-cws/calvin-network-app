// express js
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongo = require('./lib/mongo');


mongo.connect(function(err){
  if( err ) {
    console.log(err);
    console.log('Error connecting to mongo :(');
    return;
  }

  var dir = __dirname + '/../dist';
  process.argv.forEach(function(val){
      if( val == '--dev' ) dir = __dirname + '/../app';
  });

  app.use(express.static(dir));
  app.use(bodyParser.json());

  app.get('/rest/getRegions', function(req, resp){
    mongo.getRegions(function(err, result){
      if( err ) return sendError(resp, 'Error retrieving CALVIN network region data :(');
      resp.send(result);
    });
  });

  app.get('/rest/getNetwork', function(req, resp){
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

  app.listen(3006);
  console.log('Serving '+dir+' @ http://localhost:3006');
});

function sendError(resp, msg) {
    resp.send({error:true, message: msg});
}

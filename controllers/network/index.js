'use strict';

var NetworkModel = require('../../models/network');


module.exports = function (router) {

    var model = new NetworkModel();

    /**
     * Return the entire water network
     */
    router.get('/get', function (req, res) {
      model.get(function(err, network){
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.send(network);
        }
      });
    });

    router.get('/output', function (req, res) {
      var prmname = req.query.prmname;
      if( !prmname ) {
        return res.send({error:true, message:'prmname required'});
      }

      model.getOutput(prmname, function(err, data){
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.send(data);
        }
      });
    });

};

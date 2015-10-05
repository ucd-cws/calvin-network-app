'use strict';

var RegionsModel = require('../../models/regions');


module.exports = function (router) {

    var model = new RegionsModel();

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

    router.get('/aggregate', function (req, res) {
      var origin = req.query.origin;
      var terminus = req.query.terminus;
      if( !origin || !terminus ) {
        return res.send({error:true, message:'origin and terminus required'});
      }

      model.getAggergate(origin, terminus, function(err, data){
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.send(data);
        }
      });
    });

};

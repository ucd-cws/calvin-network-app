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
      var type = req.query.type;

      var region = req.query.region;
      if( !region ) {
        region = req.query.origin;
      }
      var terminus = req.query.terminus;

      if( !type ) {
        return res.send({error:true, message:'aggregate type required'});
      }

      if( !region ) {
        return res.send({error:true, message:'region or origin required'});
      }

      model.aggregate(type, region, terminus, function(err, data){
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.send(data);
        }
      });
    });

    router.get('/aggregateRegion', function (req, res) {
      var region = req.query.region;

      if( !region ) {
        return res.send({error:true, message:'region required'});
      }

      model.aggregateRegion(region, function(err, data){
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.send(data);
        }
      });
    });

    router.get('/aggregateLinks', function (req, res) {
      var r1 = req.query.origin;
      var r2 = req.query.terminus;

      if( !r1 || !r2 ) {
        return res.send({error:true, message:'origin & terminus required'});
      }

      model.aggregateRegionLinks(r1, r2, function(err, data){
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.send(data);
        }
      });
    });

};

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

    router.get('/extras', function (req, res) {
      var id = req.query.id;
      if( !id ) {
        return res.send({error:true, message:'id required'});
      }

      model.getExtras(id, function(err, data) {
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.send(data);
        }
      });
    });

    router.get('/timeslice', function (req, res) {
      var date = req.query.date;
      if( !date ) {
        return res.send({error:true, message:'date required'});
      }

      model.getTimeslice(date, function(err, data) {
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.send(data);
        }
      });
    });

    router.get('/timesliceMinMax', function (req, res) {
      model.getTimesliceMinMax(function(err, data) {
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.send(data);
        }
      });
    });

};

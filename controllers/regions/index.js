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

};

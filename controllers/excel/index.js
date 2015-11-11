'use strict';

var ExcelModel = require('../../models/excel');
var fs = require('fs');

module.exports = function(router) {

    var model = new ExcelModel();

    /**
     * Return the entire water network
     */
    router.get('/create', function (req, res) {
      model.create(req.query.prmname, function(err, path){
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.download(path, req.query.prmname+'.xlsx', function(){
            fs.unlink(path);
          });
        }
      });
    });
};

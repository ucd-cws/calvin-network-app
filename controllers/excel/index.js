'use strict';

var ExcelModel = require('../../models/excel');
var fs = require('fs');

module.exports = function(router) {

    var model = new ExcelModel();

    /**
     * Return the entire water network
     */
    router.get('/create', function (req, res) {
      model.create(req.query.id, function(err, path){
        console.log(path);
        if( err ) {
          res.send({error: true, message: err});
        } else {
          res.download(path, 'export.xlsx', function(){
            fs.unlink(path);
          });
        }
      });
    });
};

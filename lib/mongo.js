/**
 * A custom library to establish a database connection
 */
'use strict';
var MongoClient = require('mongodb').MongoClient;

var db = function () {
    return {

        /**
         * Open a connection to the database
         * @param conf - mqe config
         */
        config: function (config, callback) {
            MongoClient.connect(config.db.url, function(err, database) {
              if( err ) {
                return callback(err);
              }
              callback(null, database);
            });
        }
    };
};

module.exports = db();

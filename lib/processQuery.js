'use strict';

module.exports = function(database) {

  var collection = database.collection('node-extras');

  return {
    get : function(queryParams, result, callback) {
      if( queryParams.includeExtras && result.properties.extras ) {
        collection.findOne(
          {prmname: result.properties.prmname},
          {_id: 0},
          function(err, extras) {
            if( err ) {
              return callback(result);
            }

            for( var key in extras) {
              result.properties[key] = extras[key];
            }
            callback(result);
          }
        );
      } else {
        callback(result);
      }
    },

    query : function(queryParams, results, callback ) {


      if( queryParams.includeExtras ) {
        var ids = [];

        for( var i = 0; i < results.length; i++ ) {
          ids.push(results[i].properties.prmname);
        }
console.log(ids);
        collection.find(
          { prmname: {
              '$in' : ids
            }
          },
          {_id: 0})
          .toArray(function(err, extras) {
            console.log(err);
            console.log(extras);
            if( err ) {
              return callback(results);
            }

            for( var i = 0; i < extras.length; i++ ) {
              var e = extras[i];
              var result = getByPrmname(e.prmname, results);

              for( var key in e) {
                result.properties[key] = e[key];
              }
            }

            callback(results);
          });
      } else {
        callback(results);
      }
    }
  }
}

function getByPrmname(id, list) {
  for( var i = 0; i < list.length; i++ ) {
    if( list[i].properties.prmname === id ) {
      return list[i];
    }
  }
  return null;
}

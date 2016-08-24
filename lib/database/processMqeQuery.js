'use strict';

module.exports = function(database) {

  var collection = database.collection('node-extras');

  return {
    get : function(queryParams, result, callback) {

      if( result.properties.extras ) {
        var projection = getProjection(queryParams);

        delete result.properties.extras;
        collection.findOne(
          {prmname: result.properties.prmname},
          {_id: 0},
          function(err, extras) {
            if( err ) {
              return callback(result);
            }

            for( var key in extras) {
              if( projection['properties.'+key] === 0 ) {
                continue;
              }
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

      var projection = getProjection(queryParams);
      var ids = [];

      for( var i = 0; i < results.length; i++ ) {
        ids.push(results[i].properties.prmname);
      }

      collection.find(
        { prmname: {
            '$in' : ids
          }
        },
        {_id: 0})
        .toArray(function(err, extras) {

          if( err ) {
            return callback(results);
          }

          for( var i = 0; i < extras.length; i++ ) {
            var e = extras[i];
            var result = getByPrmname(e.prmname, results);

            for( var key in e) {
              if( projection['properties.'+key] === 0 ) {
                continue;
              }
              result.properties[key] = e[key];
            }
            delete result.properties.extras;
          }

          callback(results);
        });
    }
  }
}

function getProjection(params) {
  if( !params.projection ) {
    return {};
  }

  try {
    return JSON.parse(params.projection);
  } catch(e) {}

  return {};
}

function getByPrmname(id, list) {
  for( var i = 0; i < list.length; i++ ) {
    if( list[i].properties.prmname === id ) {
      return list[i];
    }
  }
  return null;
}

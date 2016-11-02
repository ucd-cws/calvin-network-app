/**
 * A custom library to establish a database connection
 */
'use strict';

var extras = {
  collection : 'node-extras',
  properties : ['flow','inflows','bounds','evaporation','sinks','readme','storage']
};

function splitExtras(node) {
  var extraData = {
    id : node.properties.hobbes.id
  };
  var extraReference = {};

  extras.properties.forEach(function(prop){
    if( node.properties[prop] !== undefined && node.properties[prop] !== null ) {
      extraData[prop] = node.properties[prop];
      extraReference[prop] = true;
      delete node.properties[prop];
    }
  });

  if( Object.keys(extraReference).length > 0 ) {
    node.properties.extras = extraReference;
    return extraData;
  }

  return null;
}

module.exports = splitExtras;
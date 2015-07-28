'use strict';

var collection = global.setup.database.collection('regions');

module.exports = function() {
    return {
        name: 'regions',
        get : getRegions
    };
};

function getRegions(callback) {
  collection.find({}).toArray(callback);
}

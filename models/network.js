'use strict';


module.exports = function() {
    return {
        name: 'network',
        get : getNetwork
    };
};

function getNetwork(callback) {
  global.setup.collection.find({}).toArray(callback);
}

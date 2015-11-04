'use strict';

module.exports = function(amplitude, flow) {
  if( amplitude === 0 ) {
    return 1;
  }
  return ( (1 / amplitude) - 1 ) * flow;
};

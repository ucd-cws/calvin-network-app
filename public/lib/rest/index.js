var request = require('superagent');

function loadNetwork(callback) {
  var network, regions;
  var regions = false;
  
  function done() {
    if( network && regions ) {
      callback({
        network : network,
        regions : regions
      });
    }
  };

  request
    .get('/network/get')
    .end(function(err, resp){
      networkLoaded = true;

      if( err || resp.error ) {
          alert('Server error loading network :(');
          return done();
      }

      network = resp.body || []

      done();
    });

  request
    .get('/regions/get')
    .end(function(err, resp){
      networkLoaded = true;

      if( err || resp.error ) {
          alert('Server error loading regions :(');
          return done();
      }

      regions = resp.body || []

      done();
    });
}

function getExtras(id, callback) {
  request
    .get('/network/extras')
    .query({id: id})
    .end((err, resp) => {
      callback(resp.body);
    });
}

function getAggregate(query, callback) {
  request
    .get('/regions/aggregate')
    .query(query)
    .end((err, resp) => {
      callback(resp.body);
    });
}

module.exports = {
  loadNetwork : loadNetwork,
  getExtras : getExtras,
  getAggregate : getAggregate
}
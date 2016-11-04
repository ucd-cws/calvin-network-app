
require('./sigma-cwn-plugin');

var api = {
  collections : require('./collections'),
  controllers : require('./controllers'),
  map : require('./map'),
  renderer : require('./renderer'),
  chartLoadHandlers : require('./charts')
}

module.exports = api;

$(document).ready(function(){
    api.controllers.network.load();
});
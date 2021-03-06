'use strict';

var express = require('express');
var kraken = require('kraken-js');
var http = require('http');

var db = require('./lib/database');
var sprintf = require('sprintf');

var options, app, server, logger, conf;

console.log(require('./lib/logo'));

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
      conf = config;

      require('./lib/config').init(config);

      // allow command line switch from serving /dist to /app
      if( config.get('dev') ) {
        var middleware = config.get('middleware').static;
        middleware.module.arguments[0] = middleware.module.arguments[0].replace(/dist$/,'public');
      }

      db.init(config, function(err, database) {
        next(null, config);
        onReady(config);
      });
    }
};

app = express();
app.use(kraken(options));
app.on('start', function () {
  console.log(sprintf('%-40.40s%10s', 'Server Root:', conf.get('middleware').static.module.arguments[0]));
});


/*
 * Create and start HTTP server.
 */
function onReady(config) {
  server = http.createServer(app);

  var devCon = require('./lib/dev');
  if( conf.get('dev') || config.get('local') ) {
    devCon.init(server, app);
  } else {
    devCon.prod(app);
  }

  server.listen(config.get('server').port || process.env.PORT || 8000);
  server.on('listening', function () {
    console.log(sprintf('%-40.40s%10s', 'Server Url:', `http://localhost:${this.address().port}`));

    if( (conf.get('dev') || conf.get('local')) && !config.get('noautostart') ) {
      var spawn = require('child_process').spawn
      if( process.platform === 'linux' ) {
        spawn('xdg-open', [`http://localhost:${this.address().port}`]);
      } else {
        spawn('open', [`http://localhost:${this.address().port}`]);
      }
    }
  });
}

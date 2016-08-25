'use strict';
var express = require('express');
var kraken = require('kraken-js');
var http = require('http');

var db = require('./lib/database');
var devCon = require('./lib/dev');
//var mqeLib = require('mongo-query-engine');
var mqeLib = require('mongo-query-engine');

var options, app, server, logger, conf;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
      conf = config;

      // allow command line switch from serving /dist to /app
      if( config.get('dev') ) {
        var middleware = config.get('middleware').static;
        middleware.module.arguments[0] = middleware.module.arguments[0].replace(/dist$/,'public');
      }

      // command line override of mqe config
      if( config.get('mqe-local') ) {
        config.use(require(config.get('mqe-local')));
      }

      db.init(config, function(err, database) {

        if( config.get('dev') ) {
          logger = {
            info : function(msg) {
              console.log(msg);
            }
          }
          next(null, config);
          onReady(config);
          return;
        }

        var mqeConfig = config.get('mqe');
        mqeConfig.rest.getParamParser = function(query) {
          if( query.id ) {
            return {'_id': query.id };
          } else if ( query.prmname ) {
            return {'properties.prmname': query.prmname};
          }
          return {'_id': query._id};
        };

        var processor = require('./lib/database/processMqeQuery')(database);

        mqeLib.init({
            config: config.get('mqe'),
            app: app,
            express: express,
            mongo: database,
            process : processor
          }, function(){
            global.setup = mqeLib.getSetup();
            logger = global.setup.logger;
            /*
             * Add any additional config setup or overrides here. `config` is an initialized
             * `confit` (https://github.com/krakenjs/confit/) configuration object.
             */
            next(null, config);

            onReady(config);
        });

      });
    }
};

app = express();
app.use(kraken(options));
app.on('start', function () {
    logger.info('Application ready to serve requests.');
    logger.info('Environment: %s', app.kraken.get('env:env'));
    logger.info('Static root: '+conf.get('middleware').static.module.arguments[0]);
});


/*
 * Create and start HTTP server.
 */
function onReady(config) {
  server = http.createServer(app);

  if( conf.get('dev') ) {
    devCon.init(server, app);
  } else {
    devCon.prod(app);
  }

  server.listen(config.get('mqe').server.localport || process.env.PORT || 8000);
  server.on('listening', function () {
      logger.info(`Server listening on http://localhost:${this.address().port}`);
  });
}

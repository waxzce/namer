var express = require('express')
    , configurations = module.exports
    , app = express()
    , server = require('http').createServer(app)
    , nconf = require('nconf')
    , winston = require('winston');

// Logging
var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({colorize:true}) ] });

// load the settings
require('./settings')(app, configurations, express, logger);

// merge nconf overrides with the configuration file.
nconf.argv().env().file({ file: 'local.json' });

// Routes
require('./index')(app, server);

logger.info('listening on', nconf.get('port'));

server.listen(process.env.PORT || nconf.get('port'));
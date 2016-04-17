/**
 * Main application file
 */

'use strict';

//Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var dal = require('./dal');
var log = require('./logger').logger;

log.info('Starting app in', process.env.NODE_ENV, 'environment');

//Initialize database abstraction layer
dal.init();

//Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

//Start server
server.listen(config.port, config.ip, function () {
  log.info('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

//Expose app
exports = module.exports = app;

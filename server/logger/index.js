/**
 * Winston logger configuration
 */
var winston = require('winston');

var options = {
	transports: []
};

if(process.env.NODE_ENV === 'production'){
	//In production we want to keep logs in file
	options.transports.push(new (winston.transports.File)({
		filename: 'app.log',
		level: 'info'
	}));
}
else{
	//By default we log to console only
	options.transports.push(new (winston.transports.Console)({
		level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
	}));
}

var logger = new (winston.Logger)(options);

exports.logger = logger;

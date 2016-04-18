'use strict';

// Production specific configuration
// =================================
module.exports = {
	// Server IP
	ip:       process.env.IP ||
						undefined,

	// Server port
	port:     process.env.PORT ||
						8080,

	// MongoDB connection options
	mongo: {
		uri: 'mongodb://localhost/ubercodingchallenge'
	},
	external: {
		sfOpenDataToken: 'ngYbG7Fgd8eQBXzhMs8P7iYrA',
		sfOpenDataSecret: '_4nxcJxs092iAVG1vxSIdKr-LhNs8MVM4Y6w'
	}
};
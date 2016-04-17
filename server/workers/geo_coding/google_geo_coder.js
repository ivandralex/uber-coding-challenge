var log = require('../../logger').logger;
var config = require('../../config/environment');

var util = require('util');

var request = require('request-promise');

exports.geoCodeTruck = function(truck){
	log.info('Geocode truck with address', truck.address);

	var url = util.format(config.external.geoCodingEndpoint, encodeURIComponent(truck.address));

	return request(url)
	.then(function(body){
		var response = JSON.parse(body);

		if(response.status !== 'OK'){
			log.error('Google geo coding API responded with status %s and error message: %s', response.status, response.error_message);

			//TODO: error handling
			throw response.status;
		}

		var location = response.results[0].geometry.location;

		truck.loc = {
			type: 'Point',
			coordinates: [location.lng, location.lat]
		};

		return truck;
	});
}

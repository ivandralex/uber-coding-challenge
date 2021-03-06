var log = require('../../logger').logger;
var config = require('../../config/environment');

var util = require('util');

var request = require('request-promise');

exports.geoCodeTruck = function(truck){
	log.info('Geocode truck with address', truck.address);

	if(truck.cantGeoCode){
		log.info('Cant geo code %s. Last status: %s', truck._id, truck.geoCodeStatus);
		return truck;
	}

	var url = util.format(config.workers.geoCoding.url, encodeURIComponent(truck.address));

	return request(url)
	.then(function(body){
		var response = JSON.parse(body);

		if(response.status !== 'OK'){
			log.error('Google geo coding API responded with status %s and error message: %s', response.status, response.error_message);

			if(response.status === 'ZERO_RESULTS'){
				truck.geoCodeStatus = response.status;
				truck.cantGeoCode = true;
			}
		}
		else{
			var location = response.results[0].geometry.location;

			truck.loc = {
				type: 'Point',
				coordinates: [location.lng, location.lat]
			};
		}

		return truck;
	});
}

var log = require('../../logger').logger;
var config = require('../../config/environment');

var util = require('util');

var request = require('request-promise');

/**
 * Requests data from SF OpenData, validates and parses it
 */
exports.load = function(offset, limit){
	var url = util.format(config.workers.openData.url, limit, offset);

	log.debug('url', url);

	return request(url)
	.then(function(response){
		var permit;
		var permits = JSON.parse(response);

		var loc;
		var foodTrucks = [];

		for(var i = 0, pLength = permits.length; i < pLength; i++){
			permit = permits[i];

            if(permit.longitude && permit.latitude){
                loc = {
                    type: 'Point',
                    coordinates: [Number(permit.longitude), Number(permit.latitude)]
                };
            }
            else{
            	loc = undefined;
            }

            var foodItem;
            var foodItems = [];

            //Parse food items
            var rawFoodItems = permit.fooditems ? permit.fooditems.split(':') : [];

            for(var j = 0, rLength = rawFoodItems.length; j < rLength; j++){
            	foodItem = rawFoodItems[j];

            	if(!foodItem){
            		continue;
            	}

            	foodItem = foodItem.trim();

            	foodItems.push(foodItem.toLowerCase());
            }

			foodTrucks.push({
				title: permit.applicant,
				address: permit.address,
				locationDescription: permit.locationdescription,
				foodItems: foodItems,
				externalObjectId: permit.objectid,
				schedule: permit.schedule,
				loc: loc,
				type: permit.facilitytype,
				permitExpirationDate: permit.expirationDate,
				daysHours: permit.dayshours
			});
		}

		return foodTrucks;
	});
}

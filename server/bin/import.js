var request = require('request');

var config = require('../config/environment');

var FoodTruck = require('../api/foodtruck/foodtruck.model');

exports.import = function(){
	//TODO: add logging
	//TODO: checking if objectId not duplicated
	request(config.external.foodTrucksEndpoint, function(error, response, body){
		if (!error && response.statusCode === 200){
			var permit;
			var permits = JSON.parse(body);

			var foodTrucks = [];

			for(var i = 0, pLength = permits.length; i < pLength; i++){
				permit = permits[i];

				if(permit.status !== 'APPROVED'){
					continue;
				}

				foodTrucks.push({
					title: permit.applicant,
					address: permit.address,
					locationDescription: permit.locationdescription,
					foodItems: permit.fooditems,
					externalObjectId: permit.objectid,
					schedule: permit.schedule,
					location: permit.longitude  && permit.latitude ?
						[Number(permit.longitude), Number(permit.latitude)] : undefined,
					type: permit.facilitytype,
					permitExpirationDate: permit.expirationDate,
					daysHours: permit.dayshours
				});
			}

			FoodTruck.insertMany(foodTrucks, function(err, res){
				if(err){
					console.log('Error inserting docs:', err);
				}

				console.log('Imported Food Trucks!!!');
			});
		}
	});
}

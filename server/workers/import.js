var request = require('request');

var config = require('../config/environment');

var FoodTruck = require('../api/foodtruck/foodtruck.model');

exports.import = function(){
	importPermits();
}

function importPermits(){
	//TODO: add logging
	//TODO: checking if objectId not duplicated
	request(config.external.foodTrucksEndpoint, function(error, response, body){
		if (!error && response.statusCode === 200){
			var permit;
			var permits = JSON.parse(body);

			var loc;
			var foodTrucks = [];

			for(var i = 0, pLength = permits.length; i < pLength; i++){
				permit = permits[i];

				if(permit.status !== 'APPROVED'){
					continue;
				}

                if(permit.longitude && permit.latitude){
                    loc = {
                        type: 'Point',
                        coordinates: [Number(permit.longitude), Number(permit.latitude)]
                    };
                }
                else{
                	//TODO: add to queue
                	loc = undefined;
                }

                var foodItem;
                var foodItems = [];
                var rawFoodItems = permit.fooditems.split(':');

                for(var j = 0, rLength = rawFoodItems.length; j < rLength; j++){
                	foodItem = rawFoodItems[j];

                	if(!foodItem){
                		continue;
                	}

                	foodItem = foodItem.trim()

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

			FoodTruck.insertMany(foodTrucks, function(err, res){
				if(err){
					console.log('Error inserting docs:', err);
				}

				console.log('Imported Food Trucks!!!');
			});
		}
	});
}

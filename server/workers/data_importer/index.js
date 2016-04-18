'use strict'

//Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var log = require('../../logger').logger;
var config = require('../../config/environment');
var dal = require('../../dal');

var trucksLoader = require('./trucks_loader');

log.info('Starting data importer worker');

//Initialize DAL
dal.init();

//Get queue
dal.getTaskQueue(config.workers.openData.channelId)
.then(function(queue){
	//Setup job handler
  	queue.dequeue(handleJob);
})
.catch(function(err){
  log.error('Error:', err);
});

function handleJob(message, callback){
	log.info('Start data import');

	handleNextPage(0, config.workers.openData.pageLimit)
	.then(function(){
		log.info('Finished data import');
		//Acknowledge job
		callback();
	})
	.catch(function(err){
		log.error('Data import error:', err);
		callback('DATA_IMPORT_ERROR');
	});
}

/**
 * Request next chunk of food trucks, analyze them, save them, request next chunk
 */
function handleNextPage(offset, limit){
	return trucksLoader.load(offset, limit)
	.then(analyzePage)
	.then(storePage)
	.then(function(foodTrucks){
		if(foodTrucks.length !== 0){
			return handleNextPage(offset + limit, limit);	
		}
	});
}

function analyzePage(foodTrucks){
	var foodTruck;

	for(var i = 0, fLength = foodTrucks.length; i < fLength; i++){
		foodTruck = foodTrucks[i];

		if(!foodTruck.loc){
			log.debug('Need to geocode', foodTruck.address);
		}
	}

	return foodTrucks;
}

function storePage(foodTrucks){
	log.debug('FOOD TRUCLS 2', foodTrucks.length)
	return foodTrucks;
	/*
	FoodTruck.insertMany(foodTrucks, function(err, res){
		if(err){
			console.log('Error inserting docs:', err);
		}

		console.log('Imported Food Trucks!!!');
	});
	*/
}

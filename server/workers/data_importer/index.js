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

var queue;

//Get queue
dal.getTaskQueue()
.then(function(q){
	queue = q;
	//Setup job handler
  	queue.dequeue(config.workers.openData.channelId, handleJob);
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
	.then(function(result){
		if(!result.exhausted){
			return handleNextPage(offset + limit, limit);	
		}
	});
}

function analyzePage(foodTrucks){
	var result = {
		exhausted: foodTrucks.length === 0,
		filtered: []
	};
	var foodTruck;

	for(var i = 0, fLength = foodTrucks.length; i < fLength; i++){
		foodTruck = foodTrucks[i];

		//We are not interested in trucks with unapproved status
		if(foodTruck.permitStatus !== 'APPROVED'){
			continue;
		}

		result.filtered.push(foodTruck);
	}

	log.debug('FOOD TRUCKS ANALYZED', result.exhausted, result.filtered.length);

	return result;
}

function storePage(result){
	log.debug('FOOD TRUCKS 2', result.filtered.length)

	return dal.saveFoodTrucks(result.filtered)
	.then(function(foodTrucks){
		var foodTruck;

		log.debug('Stored', foodTrucks && foodTrucks.length);

		for(var i = 0, fLength = foodTrucks.length; i < fLength; i++){
			foodTruck = foodTrucks[i];

			if(!foodTruck.loc || !foodTruck.loc.type){
				log.debug('Need to geocode', foodTruck.address);
				queue.enqueue(config.workers.geoCoding.channelId, foodTruck._id.toString());
			}
		}

		return result;
	});
}

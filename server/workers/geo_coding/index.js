'use strict'

//Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var log = require('../../logger').logger;
var config = require('../../config/environment');
var dal = require('../../dal');

var geoCoder = require('./truck_geo_coder');

log.info('Starting geocoding worker');

//Initialize DAL
dal.init();

//Get queue
dal.getTaskQueue(config.workers.geoCoding.channelId)
.then(function(queue){
	//Setup job handler
  	queue.dequeue(handleJob);
})
.catch(function(err){
  log.error('Error:', err);
});

function handleJob(truckId, callback){
	log.info('Start geo coding of', truckId);

	//Find food truck
	dal.findFoodTruckById(truckId)
	.then(geoCoder.geoCodeTruck)
	.then(dal.saveFoodTruck)
	.then(function(){
		log.info('Finished geo coding of', truckId);
		//Acknowledge job
		callback();
	})
	.catch(function(err){
		log.error('Geo coding error:', err);
		callback('GEO_CODING_ERROR');
	});
}

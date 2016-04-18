/**
 * Database abstraction layer.
 */
var log = require('../logger').logger;

var _ = require('lodash');
var config = require('../config/environment');

var Promise = require('bluebird').Promise;

//Mongo
var mongoose = require('mongoose');
var FoodTruck = require('./mongo/foodtruck.model');
var ImportScheduleJournal = require('./mongo/import.model');

//RabbitMQ
var RabbitTaskQueue = require('./rabbit/task_queue').RabbitTaskQueue;

/**
 * DAL initialization method.
 */
exports.init = function(){
	log.info('Initializing DAL');
	// Connect to Mongo
	mongoose.connect(config.mongo.uri, config.mongo.options);
	mongoose.connection.on('error', function(err){
			log.error('MongoDB connection error: ' + err);
			process.exit(-1);
		}
	);
}

/**
 * Finds food trucks around specified point.
 * @param {number} logitude Point longitude.
 * @param {number} logitude Point latitude.
 * @param {number} radius Radius in meters.
 */
exports.findFoodTrucksByLocation = function(longitude, latitude, radius){
	//In order to convert meters to radians we divide them by equatorial radius of the Earth
	radius = Number(radius) / 6378137;

	//Find trucks located winthin a sphere with specified center and radius
	var query = {
		loc: {
			$geoWithin: {
				$centerSphere: [[longitude, latitude], radius]
			}
		}
	};

	return FoodTruck.find(query);
}

/**
 * Finds food truck by id.
 * @param {string} truckId Truck identifier.
 * @param {number} logitude Point latitude.
 * @param {number} radius Radius in meters.
 */
exports.findFoodTruckById = function(truckId){
	return FoodTruck.findById(truckId);
}

/**
 * Saves food truck changes.
 * @param {FoodTruck} truck Truck to be saved.
 */
exports.saveFoodTruck = function(truck){
	return FoodTruck.findById(truck._id)
	.then(function(persistedTruck){
		var merged = _.merge(persistedTruck, truck);

		return persistedTruck.save();
	});
	//return truck.save();
}

/**
 * Bulk operation for saving food trucks.
 * @param {FoodTruck} truck Truck to be saved.
 */
exports.saveFoodTrucks = function(foodTrucks){
	if(foodTrucks.length === 0){
		return Promise.resolve(foodTrucks);
	}

	var bulk = FoodTruck.collection.initializeUnorderedBulkOp();

	var foodTruck;
	var externalObjectIds = [];

	for(var i = 0, fLength = foodTrucks.length; i < fLength; i++){
		foodTruck = foodTrucks[i];
		externalObjectIds.push(foodTruck.externalObjectId);
		bulk.find({externalObjectId: foodTruck.externalObjectId}).upsert().replaceOne(foodTruck);
	}

	//Not a good practise to use 'new Promise(...)'
	return new Promise(function(resolve, reject){
		bulk.execute(function(err, persisted){
			if(err){
				reject(err);
			}
			else{
				resolve(persisted);
			}
		});
	})
	.then(function(){
		log.debug('Reading just persisted results', externalObjectIds.length);
		return FoodTruck.find({externalObjectId: {$in: externalObjectIds}});
	});
}

/**
 * Get last import journal record.
 */
exports.getLastImportJournalRecord = function(){
	return ImportScheduleJournal.findOne().sort({_id: -1});
}

/**
 * Save import journal record.
 */
exports.saveImportJournalRecord = function(data){
	var record = new ImportScheduleJournal(data);
	return record.save();
}

/**
 * Task queue factory method.
 */
exports.getTaskQueue = function(){
	//Create and initialize RabbitTaskQueue
	var queue = new RabbitTaskQueue();

	return queue.connect(config.rabbit.url)
}

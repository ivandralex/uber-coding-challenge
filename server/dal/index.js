/**
 * Database abstraction layer.
 */
var log = require('../logger').logger;

var config = require('../config/environment');

//Mongo
var mongoose = require('mongoose');
var FoodTruck = require('./mongo/foodtruck.model');

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
    radius = Number(radius)/6378137;

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
 * Task queue factory method. Returns promise of queue connected to specified channel.
 * @param {string} channelId Channel identifier.
 */
exports.getTaskQueue = function(channelId){
    //Create and initialize RabbitTaskQueue
    var queue = new RabbitTaskQueue();

    return queue.connect(config.rabbit.url, channelId)
    .then(function(){
        return queue;
    });
}

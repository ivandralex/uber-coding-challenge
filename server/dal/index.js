/**
 * Database abstraction layer.
 */
var log = require('../logger').logger;

var config = require('../config/environment');

//Mongo
var mongoose = require('mongoose');
var FoodTruck = require('./mongo/foodtruck.model');

//RabbitMQ

/**
 * DAL initialization method.
 */
exports.init = function(){
    log.info('Initializing DAL');
    // Connect to database
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
exports.findFoodTrucksByLocation = function(longitude, latitude, radius, callback){
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

    FoodTruck.find(query, function(err, foodTrucks){
        if(err){
            log.error('Failed to find food trucks by location', err);
            callback('FIND_TRUCK_ERROR');
            return;
        }

        if(!foodTrucks){
            return callback();
        }

        callback(undefined, foodTrucks);
    });
}

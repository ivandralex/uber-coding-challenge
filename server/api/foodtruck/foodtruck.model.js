'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoodTruckSchema = new Schema({
	title: String,
	address: String,
	locationDescription: String,
	foodItems: String,
	externalObjectId: String,
	schedule: String,
	location: {type: [Number], required: false},
	type: String,
	permitExpirationDate: String,
	daysHours: String
});

FoodTruckSchema.index({ location: '2d' });

module.exports = mongoose.model('FoodTruck', FoodTruckSchema);
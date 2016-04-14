'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoodTruckSchema = new Schema({
	title: String,
	address: String,
	locationDescription: String,
	foodItems: [String],
	externalObjectId: String,
	schedule: String,
	loc: {
		'type': {
			type: String,
			enum: ['Point', 'LineString', 'Polygon']
		},
		coordinates: [Number],
		required: false
	},
	type: String,
	permitExpirationDate: String,
	daysHours: String
});

FoodTruckSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('FoodTruck', FoodTruckSchema);
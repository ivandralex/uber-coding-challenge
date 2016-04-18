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
	daysHours: String,
	geoCodeStatus: {type: 'String', required: false},
	cantGeoCode: {type: Boolean, required: false}
});

FoodTruckSchema.index({loc: '2dsphere' }, {sparse: true});
FoodTruckSchema.index({externalObjectId: 1}, {unique: true});

module.exports = mongoose.model('FoodTruck', FoodTruckSchema);
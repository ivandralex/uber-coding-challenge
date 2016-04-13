'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoodTruckSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('FoodTruck', FoodTruckSchema);
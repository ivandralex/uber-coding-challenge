'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoodTruckSchema = new Schema({
  status: String,
  expirationdate: Date,
  permit: String,
  block: String,
  received: String,
  facilitytype: String,
  blocklot: String,
  locationdescription: String,
  cnn: String,
  priorpermit: String,
  approved: String,
  schedule: String,
  address: String,
  applicant: String,
  lot: String,
  fooditems: String,
  longitude: String,
  latitude: String,
  objectid: String,
  dayshours: String,
  x: String,
  y: String,
  location: Object
});

module.exports = mongoose.model('FoodTruck', FoodTruckSchema);
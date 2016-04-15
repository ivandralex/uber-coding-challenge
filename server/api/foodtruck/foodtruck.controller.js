'use strict';

var _ = require('lodash');
var FoodTruck = require('./foodtruck.model');

// Performs search
exports.search = function(req, res){
  if(req.method === 'GET'){
    return res.status(405).json({description: 'Method not allowed'});
  }

  //TODO: more strict validation
  if(!req.body.latitude || !req.body.longitude || !req.body.radius){
      return res.status(400).json({description: 'longitude and latitude are mandatory parameters'});
  }

  var longitude = Number(req.body.longitude);
  var latitude = Number(req.body.latitude);
  //In order to convert meters to radians we divide them by equatorial radius of the Earth
  var radius = Number(req.body.radius)/6378137;

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
      console.log(err)
      return handleError(res, err);
    }
    if(!foodTrucks){
      return res.status(404).json({description: 'Not found'});
    }

    return res.status(200).json(foodTrucks);
  });
};

exports.searchMethodNotAllowed = function(req, res){
  //We MUST include Allow header that contains valid verbs
  res.setHeader('Allow', 'POST');
  return res.status(405).json({description: 'Method not allowed'});
}

function handleError(res, err){
  return res.status(500).send(err);
}

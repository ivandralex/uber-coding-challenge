'use strict';

var _ = require('lodash');
var FoodTruck = require('./foodtruck.model');

// Performs search
exports.search = function(req, res){
  if(req.method === 'GET'){
    return res.status(405).json({description: 'Method not allowed'});
  }

  console.log(req.params)

  if(!req.params.latitude || !req.params.longitude){
      return res.status(400).json({description: 'longitude and latitude are mandatory parameters'});
  }

  //Find food trucks by coordinates
  FoodTruck.find({locaction: { $near: [req.params.latitude, req.params.longitude]}}, function(err, foodTrucks){
    if(err){
      return handleError(res, err);
    }
    if(!foodTrucks){
      return res.status(404).json({description: 'Not found'});
    }

    return res.status(200).json(foodTrucks);
  });
};

exports.searchMethodNotAllowed = function(req, res){
  //We MUST include Allow headers that contains valid verbs
  res.setHeader('Allow', 'POST');
  return res.status(405).json({description: 'Method not allowed'});
}

function handleError(res, err){
  return res.status(500).send(err);
}

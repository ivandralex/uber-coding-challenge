'use strict';

var _ = require('lodash');
var FoodTruck = require('./foodtruck.model');

// Performs search
exports.search = function(req, res){
  if(req.method === 'GET'){
    return res.status(405).json({description: 'Method not allowed'});
  }

  console.log(req.params, req.body)

  if(!req.body.latitude || !req.body.longitude){
      return res.status(400).json({description: 'longitude and latitude are mandatory parameters'});
  }

  var query = {
    loc: {
      $geoWithin: {
        $centerSphere: [[Number(req.body.longitude), Number(req.body.latitude)], 1/3963.2]
      }
    }
  };

  //Find food trucks by coordinates
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

'use strict';

var log = require('../../logger').logger;

var _ = require('lodash');
var dal = require('../../dal');

// Performs search
exports.search = function(req, res){
  if(req.method === 'GET'){
    return res.status(405).json({description: 'Method not allowed'});
  }

  //Check if parameters are numbers
  if(typeof req.body.latitude !== 'number' || typeof req.body.longitude !== 'number' || typeof req.body.radius !== 'number'){
    return res.status(400).json({description: 'longitude, latitude and radius must be numbers'});
  }

  var longitude = req.body.longitude;
  var latitude = req.body.latitude;
  var radius = req.body.radius;

  //Check bounds
  if(latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180 || radius <= 0){
    return res.status(400).json({description: 'Parameters are out of bounds'});
  }

  log.info('Find trucks by location', longitude, latitude, radius);

  dal.findFoodTrucksByLocation(longitude, latitude, radius)
  .then(function(foodTrucks){
    if(!foodTrucks){
      return res.status(404).json({description: 'Not found'});
    }

    return res.status(200).json(foodTrucks);
  })
  .catch(function(err){
    log.error('Trucks search error:', err);
    return handleError(res, err);
  })
};

exports.searchMethodNotAllowed = function(req, res){
  //We MUST include Allow header that contains valid verbs
  res.setHeader('Allow', 'POST');
  return res.status(405).json({description: 'Method not allowed'});
}

function handleError(res, err){
  return res.status(500).send(err);
}

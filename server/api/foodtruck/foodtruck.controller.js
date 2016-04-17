'use strict';

var log = require('../../logger').logger;

var _ = require('lodash');
var dal = require('../../dal');

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
  var radius = Number(req.body.radius);

  log.info('Find trucks by location', longitude, latitude, radius);

  dal.findFoodTrucksByLocation(longitude, latitude, radius, function(err, foodTrucks){
    if(err){
      log.error('Trucks searh error:', err);
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

'use strict';

var _ = require('lodash');
var Foodtruck = require('./foodtruck.model');

// Get list of foodtrucks
exports.index = function(req, res) {
  Foodtruck.find(function (err, foodtrucks) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(foodtrucks);
  });
};

// Get a single foodtruck
exports.show = function(req, res) {
  Foodtruck.findById(req.params.id, function (err, foodtruck) {
    if(err) { return handleError(res, err); }
    if(!foodtruck) { return res.status(404).send('Not Found'); }
    return res.json(foodtruck);
  });
};

// Creates a new foodtruck in the DB.
exports.create = function(req, res) {
  Foodtruck.create(req.body, function(err, foodtruck) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(foodtruck);
  });
};

// Updates an existing foodtruck in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Foodtruck.findById(req.params.id, function (err, foodtruck) {
    if (err) { return handleError(res, err); }
    if(!foodtruck) { return res.status(404).send('Not Found'); }
    var updated = _.merge(foodtruck, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(foodtruck);
    });
  });
};

// Deletes a foodtruck from the DB.
exports.destroy = function(req, res) {
  Foodtruck.findById(req.params.id, function (err, foodtruck) {
    if(err) { return handleError(res, err); }
    if(!foodtruck) { return res.status(404).send('Not Found'); }
    foodtruck.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
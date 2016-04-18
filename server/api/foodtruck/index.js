'use strict';

var express = require('express');
var controller = require('./foodtruck.controller');

var router = express.Router();

router.post('/search', controller.search);
router.get('/search', controller.searchMethodNotAllowed);
router.delete('/search', controller.searchMethodNotAllowed);
router.put('/search', controller.searchMethodNotAllowed);
router.patch('/search', controller.searchMethodNotAllowed);

module.exports = router;

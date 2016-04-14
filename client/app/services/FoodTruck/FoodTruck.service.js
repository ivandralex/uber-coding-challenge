'use strict';

angular.module('uberCodingChallengeApp')
  .factory('FoodTruck', function ($resource) {
    return $resource('/api/foodtrucks/:action', {}, {
        search: {
            method: 'POST',
            isArray: true,
            params: {
                action: 'search'
            }
        }
    });
  });

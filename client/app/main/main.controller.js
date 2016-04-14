'use strict';

angular.module('uberCodingChallengeApp')
  .controller('MainCtrl', function ($scope, FoodTruck) {
    $scope.foodTrucks = FoodTruck.search({longitude: 37.7642669, latitude: -122.4427585});
  });

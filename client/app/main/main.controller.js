'use strict';

angular.module('uberCodingChallengeApp')
  .controller('MainCtrl', function ($scope, FoodTruck) {
    $scope.foodTrucks = FoodTruck.search({longitude: 10, latitude: -120});
  });

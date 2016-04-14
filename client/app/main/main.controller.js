'use strict';

angular.module('uberCodingChallengeApp')
  .controller('MainCtrl', function ($scope, FoodTruck, uiGmapGoogleMapApi) {
    $scope.foodTrucks = FoodTruck.search({
      latitude: -122.4427585,
      longitude: 37.7642669
    });

    $scope.map = {
      center: {
        latitude: 37.7832003,
        longitude: -122.42959
      },
      zoom: 14
    };

    uiGmapGoogleMapApi.then(function(maps) {
      console.log('maps are ready', maps);
    });
  });

'use strict';

angular.module('uberCodingChallengeApp')
  .controller('MainCtrl', function ($scope, FoodTruck, uiGmapGoogleMapApi) {
    $scope.map = {
      center: {
        latitude: 37.7832003,
        longitude: -122.42959
      },
      zoom: 14,
      options: {
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false
      }
    };

    $scope.foodTrucks = FoodTruck.search($scope.map.center);

    /*
    uiGmapGoogleMapApi.then(function(maps) {
      //Map is ready
    });
    */

    $scope.onTruckClick = function(event){
      console.log('click', event.model._id, event.model.foodItems.length);
      $scope.currentTruck = event.model;
      $scope.truckInfoVisible = true;
    }
  });

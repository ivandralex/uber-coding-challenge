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
      },
      events: {
        click: function(instance, eventName, handler){
          $scope.foodTrucks = FoodTruck.search({
            longitude: handler[0].latLng.lng(),
            latitude: handler[0].latLng.lat()
          });
        }
      }
    };

    $scope.foodTrucks = FoodTruck.search($scope.map.center);

    $scope.onTruckClick = function(event, eventName, model){
      $scope.currentTruck = model;
      $scope.truckInfoVisible = true;
    }
  });

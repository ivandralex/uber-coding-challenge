'use strict';

angular.module('uberCodingChallengeApp')
  .controller('MainCtrl', function ($scope, FoodTruck) {
    //Default radius is 1 mile or approximately 20 minutes of walking
    var DEFAULT_RADIUS_METERS = 1609;
    //Map settings
    $scope.map = {
      //Default center of the map
      center: {
        longitude: -122.42,
        latitude: 37.78
      },
      zoom: 14,
      //Hide standard controls irrelevant for the app
      options: {
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false
      },
      //Custom style to hide standard poi and transit signs on the map
      styles: [
          {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [
                    { visibility: 'off' }
              ]
          },
          {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [
                    { visibility: 'off' }
              ]
          }
      ],
      events: {
        //Map click handler
        click: function(instance, eventName, handler){
          //Hide info window
          $scope.truckInfoVisible = false;
          //Start new trucks search with coords of the click
          $scope.searchPoint = {
            longitude: handler[0].latLng.lng(),
            latitude: handler[0].latLng.lat(),
            radius: DEFAULT_RADIUS_METERS
          };
          $scope.foodTrucks = FoodTruck.search($scope.searchPoint);
        }
      },
      circle: {
        radius: DEFAULT_RADIUS_METERS,
        stroke: {
            color: '#08B21F',
            weight: 2,
            opacity: 1
        },
        fill: {
            color: '#08B21F',
            opacity: 0.3
        }
      }
    };

    //Start initial search
    $scope.searchPoint = {
      longitude: $scope.map.center.longitude,
      latitude: $scope.map.center.latitude,
      radius: DEFAULT_RADIUS_METERS
    };
    $scope.foodTrucks = FoodTruck.search($scope.searchPoint);

    //Marker click handler
    $scope.onTruckClick = function(event, eventName, model){
      $scope.currentTruck = model;
      $scope.truckInfoVisible = true;
    };
  });

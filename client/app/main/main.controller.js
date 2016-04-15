'use strict';

angular.module('uberCodingChallengeApp')
  .controller('MainCtrl', function ($scope, FoodTruck, uiGmapGoogleMapApi) {
    //Map settings
    $scope.map = {
      //Default center of the map
      center: {
        latitude: 37.7832003,
        longitude: -122.42959
      },
      zoom: 14,
      //Hide standard controls irrelevant for the app
      options: {
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false
      },
      //Custom style to hide standard poi on the map
      styles: [
          {
              featureType: "poi",
              elementType: "labels",
              stylers: [
                    { visibility: "off" }
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
            latitude: handler[0].latLng.lat()
          };
          $scope.foodTrucks = FoodTruck.search($scope.searchPoint);
        }
      },
      circle: {
        radius: 1609,
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
    $scope.searchPoint = $scope.map.center;
    $scope.foodTrucks = FoodTruck.search($scope.searchPoint);

    //Marker click handler
    $scope.onTruckClick = function(event, eventName, model){
      $scope.currentTruck = model;
      $scope.truckInfoVisible = true;
    }
  });

'use strict';

angular.module('uberCodingChallengeApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/foodtrucks').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/foodtrucks', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/foodtrucks/' + thing._id);
    };
  });

'use strict';

angular.module('uberCodingChallengeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'uiGmapgoogle-maps'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  })
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDuqmS410C7CLFP0Vj6mvwb-p-wIKAX2PA',
        libraries: 'weather,geometry,visualization'
    });
  });

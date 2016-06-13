'use strict';

/**
 * @ngdoc overview
 * @name yeoApp
 * @description
 * # yeoApp
 *
 * Main module of the application.
 */
angular
  .module('tannedApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/over', {
        templateUrl: 'views/over.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

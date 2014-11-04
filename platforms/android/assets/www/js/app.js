'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'myApp.controllers',
    'ngRoute',
    'ngTouch',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'ng-iscroll',
    'ng-color-thief',
    'LocalStorageModule'
]).run(function() {
    FastClick.attach(document.body);
}).config(['$routeProvider', 'localStorageServiceProvider', function($routeProvider, localStorageServiceProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/menu.html'});
        $routeProvider.when('/underConstruction', {templateUrl: 'partials/underConstruction.html'});
        $routeProvider.otherwise({redirectTo: '/'});
        localStorageServiceProvider.setPrefix('oMenu');
    }]);

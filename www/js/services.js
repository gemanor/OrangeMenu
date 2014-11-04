'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var OrangeMenuSvcs = angular.module('myApp.services', []);

OrangeMenuSvcs.factory('MessagesService', function($rootScope) {
    var service = {};
    service.notification = '';
    service.sendNotification = function(value) {
        this.notification = value;
        $rootScope.$broadcast("notificationSent");
    };
    return service;
});
OrangeMenuSvcs.factory('ActionsMenuService', function() {
    var menuOpened = false;
    return{
        'getMenuState': function() {
            return menuOpened;
        }
        ,
        'toggleMenu': function() {
            return menuOpened === false ? menuOpened = true : menuOpened = false;
        }
    };
});
OrangeMenuSvcs.factory('cordovaReady', [function() {
        return function(fn) {
            var queue = [],
                    impl = function() {
                        queue.push([].slice.call(arguments));
                    };

            document.addEventListener('deviceready', function() {
                queue.forEach(function(args) {
                    fn.apply(this, args);
                });
                impl = fn;
            }, false);

            return function() {
                return impl.apply(this, arguments);
            };
        };
    }]);

OrangeMenuSvcs.factory('cordovaResume', [function() {
        return function(fn) {
            var queue = [],
                    impl = function() {
                        queue.push([].slice.call(arguments));
                    };

            document.addEventListener('resume', function() {
                queue.forEach(function(args) {
                    fn.apply(this, args);
                });
                impl = fn;
            }, false);

            return function() {
                return impl.apply(this, arguments);
            };
        };
    }]);


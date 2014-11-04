'use strict';
/* Directives */


var myAppDirectives = angular.module('myApp.directives', []);
myAppDirectives.directive('ngFontSizeStyle', [function() {
        return{
            link: function(scope, element) {
                var height = (element[0].clientHeight) * 0.8;
                element[0].style.fontSize = height + 'px';
            }};
    }]);
myAppDirectives.directive('actionsMenu', function() {
    return {
        restrict: 'EA',
        templateUrl: 'partials/actionsMenu.html'
    };
});
myAppDirectives.directive('notification', function($compile) {
    return{
        restrict: 'E',
        transclude: true,
        controller: function($scope, MessagesService, $timeout, $transclude, $element) {
            $scope.displayNotif = false;
            $scope.notification = MessagesService.notification;
            $scope.$on('notificationSent', function() {
                $scope.notification = MessagesService.notification;
                $scope.displayNotif = true;
                $timeout(function() {
                    $scope.displayNotif = false;
                }, 2000);
            });
        },
        template: '<span class="notification" ng-class="{display:displayNotif}">{{notification}}</span>'
    };
});
myAppDirectives.directive('ngCycle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var attrs = attrs;
            function setCycle() {
                var slideAttrs,
                        visibleElements = attrs.cycleVisible || 0;
                if (visibleElements < $(element).children().length) {
                    if (attrs.ngCycle === 'mainSlide') {
                        slideAttrs = {
                            slides: "> li",
                            log: false
                        };
                    }
                    $(element).cycle(slideAttrs);
                }
            }

            scope.$watch(attrs.ngCycle, function()
            {
                setTimeout(function() {
                    setCycle();
                }, 1);
            });
        }
    };
});

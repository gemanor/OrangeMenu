'use strict';

/* Controllers */

var OrangeMenuCtrls = angular.module('myApp.controllers', []);
OrangeMenuCtrls.controller('mainCtrl', ['$scope', '$window', '$interval', '$timeout', 'ActionsMenuService', function($scope, $window, $interval, $timeout, ActionsMenuService) {
        $scope.toggleMenu = function() {
            ActionsMenuService.toggleMenu();
        };
        $scope.resturantID,
                $scope.wifiArray,
                $scope.loggedInState = false,
                $scope.resturantsWifi = [];
        var makeLoginProccess = function() {
            if (typeof $window.wifi === 'undefined') {
                if (typeof window.cordova === 'undefined') {
                    $scope.loggedInState = 'connected';
                }
                return false;
            }
//            $scope.loggedInState = 'connected';
//            return false;
            $interval.cancel(checkWifi);
            analyseWifiNetworks();
        };
        var getResturantsWifiFromNetworksArray = function(networksArray) {
            var resturantsAllowedWifi = [
                'orange-TGWN',
                'orange-1234'
            ];
            var resturantsNames = [
                'השף הסגול',
                'ריסטורנו'
            ];
            var resturantsWifi = [];
            for (var i = 0, len = networksArray.length, j = 0; i < len; i++) {
                if (resturantsAllowedWifi.indexOf(networksArray[i].SSID) >= 0) {
                    networksArray[i]['restName'] = resturantsNames[j];
                    j++;
                    resturantsWifi.push(networksArray[i]);
                }
            }
            if (resturantsWifi.length > 0) {
                $scope.resturantsWifi = resturantsWifi;
                return resturantsWifi;
            }
            return false;
        };
        var getResturantFromSSID = function(SSID) {
            if (SSID === '0x') {
                return false;
            }
            return true;
        };
        var analyseWifiNetworks = function() {
            if (typeof $window.wifi === 'undefined') {
                $scope.loggedInState = false;
            }
            $window.wifi.refresh();
            $timeout(function() {
                if ($window.wifi.networks.length === 0) {
                    $scope.loggedInState = 'disconnectedWifi';
                } else if (getResturantFromSSID($window.wifi.lan.SSID)) {
                    $scope.loggedInState = 'connected';
                } else if (getResturantsWifiFromNetworksArray($window.wifi.networks)) {
                    $scope.loggedInState = 'inRange';
                } else {
                    $scope.loggedInState = 'notInRange';
                }
            }, 1000);
        };
        var checkWifi = $interval(makeLoginProccess, 10000);
        document.addEventListener('resume', function() {
            $scope.refreshWifiLoginProccess();
        }, false);
        $scope.refreshWifiLoginProccess = function() {
            $scope.loggedInState = false;
            makeLoginProccess();
        };
        $scope.getGaussianBG = function() {
            var image = new Image;
            image.src = 'img/content/Portrait Restaurant.jpg';
            angular.element(image).bind('load', function() {
                $scope.$apply(function() {
                    $scope.menuBackground = stackBlurImage(image, 20);
                });
            });
            return $scope.menuBackground;
        };
        $scope.menuBackground = $scope.getGaussianBG();
    }]);
OrangeMenuCtrls.controller('menuCtrl', ['$scope', '$filter', '$http', '$timeout', '$window', '$element', 'localStorageService', 'MessagesService', function($scope, $filter, $http, $timeout, $window, $element, localStorageService, MessagesService) {
        $scope.halfWindow = parseInt($window.innerWidth * 0.7);
        $scope.menuColumnWidth = {
            "width": $scope.halfWindow + "px"
        };
        $scope.dishQuantity = 1;
        $scope.changeQuantity = function(action) {
            if (action === 'down') {
                $scope.dishQuantity = $scope.dishQuantity > 1 ? $scope.dishQuantity - 1 : $scope.dishQuantity;
            } else {
                $scope.dishQuantity = $scope.dishQuantity + 1;
            }
        };
        $scope.calculatePrice = function(price) {
            return price * $scope.dishQuantity;
        };
        $scope.orderedDishes = [];
        localStorageService.bind($scope, 'orderedDishes', $scope.orderedDishes);
        var changeDishStatus = function(place, status) {
            $scope.orderedDishes[place].status = status;
            localStorageService.set('orderedDishes', $scope.orderedDishes);
        };
        $scope.orderDish = function(dish, quantity) {
            var orderedDish = {};
            orderedDish.dish = dish;
            orderedDish.quantity = quantity;
            orderedDish.status = 'בהזמנה';
            var currentDish = $scope.orderedDishes.push(orderedDish);
            $timeout(function() {
                changeDishStatus(currentDish - 1, 'בהכנה');
            }, 5000);
            $timeout(function() {
                changeDishStatus(currentDish - 1, 'בהגשה');
            }, 10000);
            $timeout(function() {
                changeDishStatus(currentDish - 1, 'הוגש');
            }, 15000);
            MessagesService.sendNotification('המנה הוזמנה');
        };
        $scope.resetDishQuantity = function() {
            $scope.dishQuantity = 1;
        };
        $http.get('resturant.json').
                success(function(data) {
                    $scope.resturantMenu = data;
                    $scope.wrapperWidth = {
                        "width": $scope.halfWindow * Object.keys($scope.resturantMenu.menu).length + "px"
                    };
                    $scope.dishesLength = 0;
                    angular.forEach($scope.resturantMenu.menu, function(key, value) {
                        $scope.dishesLength += Object.keys(key.dishes).length;
                    });
                    $timeout(function() {
                        allContentLoaded();
                    }, 1);
                });
        var allContentLoaded = function() {
            var loadedCounter = 0;
            $element.find('img').bind('load', function() {
                loadedCounter++;
                if ($scope.dishesLength === loadedCounter) {
                    var key;
                    for (key in $scope.$parent.myScroll) {
                        $scope.$parent.myScroll[key].refresh();
                        if (key.indexOf('menuColumn') >= 0) {
                            $scope.$parent.myScroll[key].refresh();
                            $scope.$parent.myScroll[key].scrollTo(0, $scope.$parent.myScroll[key].maxScrollY, (Math.abs($scope.$parent.myScroll[key].maxScrollY) * 20), IScroll.utils.ease.quadratic);
                        }
                    }
                }
            });
        };
        $scope.openPopUp = function(text) {
            $scope.popUpDish = text;
            $scope.popUpOpened = true;
            $scope.endAnimate = false;
            $timeout(function() {
                $scope.startAnimate = true;
            }, 1);
        };
        $scope.closePopUp = function() {
            $scope.startAnimate = false;
            $scope.endAnimate = true;
            $timeout(function() {
                $scope.popUpOpened = false;
                $scope.resetDishQuantity();
            }, 1000);
        };
        $scope.cartState = false;
        $scope.$watch('orderedDishes', function() {
            setTimeout(function() {
                for (var i = 0; i < $scope.resturantMenu.menu.length; i++) {
                    if ($scope.$parent.myScroll['menuColumn' + i]) {
                        $scope.$parent.myScroll['menuColumn' + i].refresh();
                    }
                }
            }, 1000);
        }, true);
        $scope.toggleCart = function() {
            setTimeout(function() {
                $scope.$parent.myScroll['cartList'].refresh();
            }, 100);
            return $scope.cartState = $scope.cartState === false ? true : false;
        };
        $scope.$parent.myScrollOptions = {
            "popUpImage": {snap: false, bounce: false},
            "columnWrapper": {scrollX: true, scrollY: false, mouseWheel: true, bounce: false, snap: false}
        };
        $scope.$watch('resturantMenu', function() {
            if ($scope.resturantMenu) {
                setTimeout(function() {
                    console.log($scope.$parent.myScrollOptions['menuColumn' + i]);
                    for (var i = 0; i < $scope.resturantMenu.menu.length; i++) {
                        $scope.$parent.myScrollOptions['menuColumn' + i] = {scrollX: false, scrollY: true, mouseWheel: true, snap: false, bounce: false};
                    }
                }, 100);
            }
        }, true);
    }]);
OrangeMenuCtrls.controller('actionMenuCtrl', ['$scope', 'ActionsMenuService', function($scope, ActionsMenuService) {
        $scope.menuOpened = function() {
            return ActionsMenuService.getMenuState();
        };
        $scope.toggleMenu = function() {
            ActionsMenuService.toggleMenu();
        };
    }]);

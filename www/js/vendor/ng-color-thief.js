
angular.module('ng-color-thief', []).directive('ngColorThief', function()
{
    return {
        replace: false,
        restrict: 'A',
        link: function(scope, element, attr)
        {
            function setThiefColor() {
                var elm = angular.element(element);
                var image = angular.element(element)[0].parentElement.children[0];
                angular.element(image).bind('load', function() {
                    var colorThief = new ColorThief();
                    var color = colorThief.getColor(image);
                    switch (attr.ngColorThief) {
                        case 'border':
                            elm.parent().find('img').css({'border-top': '4px solid rgb(' + color.toString() + ')'});
                            elm.css({'border-bottom': '4px solid rgb(' + color.toString() + ')'});
                            break;
                        case 'textColor':
                            elm.css({'color': color.toString()});
                            break;
                    }
                });
            }
            // watch for 'ng-iscroll' directive in html code
            scope.$watch(attr.ngColorThief, function()
            {
                setTimeout(setThiefColor, 5);
            });
            scope.$watch(scope.popUpOpened, function() {
                setTimeout(setThiefColor, 1000);
            })
        }
    };
});
(function(angular){
	'use strict';
  angular.module('petal.home').directive('keepScroll', [
  '$state', '$timeout', 'ScrollPositions', '$ionicScrollDelegate', function($state, $timeout, ScrollPositions, $ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$on('$stateChangeStart', function() {
           ScrollPositions[$state.current.name] = $ionicScrollDelegate.getScrollPosition();
           
        });
         $timeout(function() {
          var offset;
          offset = ScrollPositions[$state.current.name];
          if (offset) {
            $ionicScrollDelegate.scrollTo(offset.left, offset.top);
          }
        });
      }
    };
  }
]).factory('ScrollPositions', [
  function() {
    return {};
  }
]).directive('isFocused', function($timeout) {
      return {
        scope: { trigger: '@isFocused' },
        link: function(scope, element) {

          scope.$watch('trigger', function(value) {
            
            if(value === 'true') {
              $timeout(function() {
                element[0].focus();

                element.on('blur', function() {
                  //alert("hello");
                  element[0].focus();
                });
              });
            }

          });
        }
      };
    });
})(window.angular);


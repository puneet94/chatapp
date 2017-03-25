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
]);
})(window.angular);


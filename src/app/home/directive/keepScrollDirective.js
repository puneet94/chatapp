(function(angular) {
	'use strict';
	angular.module('petal.home').directive('keepScroll', [
		'$state', '$timeout', 'ScrollPositions', '$ionicScrollDelegate',
		function($state, $timeout, ScrollPositions, $ionicScrollDelegate) {
			return {
				restrict: 'A',
				link: function(scope) {
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
	]).directive('isFocused', ['$timeout', function($timeout) {
		return {
			scope: { trigger: '@isFocused' },
			link: function(scope, element) {

				scope.$watch('trigger', function(value) {

					if (value === 'true') {
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
	}]).directive('lazyImg', function() {
		return {
			/*     <lazy-img src-large="http://youbaku.com/uploads/places_images/large/{{img}}" src-small="http://youbaku.com/athumb.php?file={{img}}&small" />
*/
			replace: true,
			template: '<div class="lazy-img"><div class="sm"><img src="{{imgSmall}}" class="small"/></div><div style="padding-bottom: 75%;"></div><img src="{{imgLarge}}" class="large"/></div>',
			scope: {
				imgLarge: '@srcLarge',
				imgSmall: '@srcSmall'
			},

			link: function(scope, elem) {
				var imgSmall = new Image();
				var imgLarge = new Image();
				imgSmall.src = scope.imgSmall;
				imgSmall.onload = function() {
					elem.children('.sm').find('img').css('opacity', '1');
					imgLarge.src = scope.imgLarge;
					imgLarge.onload = function() {
						elem.find('img').css('opacity', '1');
					};
				};
			}
		};
	});
})(window.angular);

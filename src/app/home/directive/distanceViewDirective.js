(function(angular) {
	'use strict';
	angular.module('petal.home')
		.directive('distanceView', ['postService', '$timeout', function(postService, $timeout) {
			return {
				restrict: 'E',
				templateUrl: 'app/home/views/distanceViewTemplate.html',
				scope: {
					positionCords: '='
				},
				replace: true,
				link: function(scope) {
					$timeout(getDistance, 1000);

					function getDistance() {
						if (scope.positionCords) {
							scope.distanceObj = {
								latitude: scope.positionCords[1],
								longitude: scope.positionCords[0],

							};
							postService.getDistance(scope.distanceObj).then(function(res) {
								scope.distanceObj.distance = res + ' mi';
							}).catch(function(err) {
								scope.distanceObj.distance = '';
							});
						} else {
							scope.distanceObj = {};
							scope.distanceObj.distance = '';
						}
					}


				}
			};
		}])
		.directive('ionicCustomSpinner',[ionicCustomSpinner]);

		function ionicCustomSpinner(){
			return {
				templateUrl: 'app/home/views/ionicCustomSpinner.html'
			};
		}
		/*.directive('expandingTextarea', [function() {
			return {
				restrict: 'A',
				controller: function($scope, $element, $attrs, $timeout) {
					$element.css('min-height', '0');
					$element.css('resize', 'none');
					$element.css('overflow-y', 'hidden');
					setHeight(0);
					$timeout(setHeightToScrollHeight);

					function setHeight(height) {
						$element.css('height', height + 'px');
						$element.css('max-height', height + 'px');
					}

					function setHeightToScrollHeight() {
						setHeight(0);
						var scrollHeight = angular.element($element)[0]
							.scrollHeight;
						if (scrollHeight !== undefined) {
							setHeight(scrollHeight);
						}
					}

					$scope.$watch(function() {
						return angular.element($element)[0].value;
					}, setHeightToScrollHeight);
				}
			};
		}])*/
})(window.angular);

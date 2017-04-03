(function(angular) {
	'use strict';
	angular.module('petal.home').directive('distanceView', ['postService', '$timeout', function(postService, $timeout) {
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
	}]);
})(window.angular);

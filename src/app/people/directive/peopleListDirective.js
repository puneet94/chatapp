(function(angular) {
	'use strict';
	angular.module('petal.people')
		.directive('peopleList', ['$ionicPopover', '$state', 'userData',peopleList]);


	function peopleList($ionicPopover, $state,userData) {
		return {
			restrict: 'E',
			templateUrl: 'app/people/views/peopleListTemplate.html',
			scope: {
				peopleList: '=peopleList'
			},
			controller: ['$scope', function($scope) {
				$scope.currentUser = userData.getUser();
				
				$ionicPopover.fromTemplateUrl('app/people/views/peoplePopover.html', {
					scope: $scope,
				}).then(function(popover) {
					$scope.popover = popover;
				});
				$scope.showPopover = function(people, $event) {
					$scope.people = people;
					$scope.popover.show($event, $scope.people);
				};
				$scope.popOverClick = function(type, id) {
					$scope.popover.hide();
					if (type == 'chat') {
						$state.go('chatBox', { user: id });
					}
					if (type == 'profile') {
						$state.go('home.user.userPage', { user: id });
					}
				};
			}]
		};
	}
})(window.angular);

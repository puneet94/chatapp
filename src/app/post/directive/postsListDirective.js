(function(angular) {
	'use strict';
	angular.module('petal.post')
		.directive('postsList', ['$ionicPopover', '$state', 'userData',postsList]);


	function postsList($ionicPopover, $state,userData) {
		return {
			restrict: 'E',
			templateUrl: 'app/post/views/postsListTemplate.html',
			scope: {
				postsList: '=postsList'
			},
			controller: ['$scope', function($scope) {
				$scope.currentUser = userData.getUser();
				
				$ionicPopover.fromTemplateUrl('app/people/views/peoplePopover.html', {
					scope: $scope,
				}).then(function(popover) {
					$scope.popover = popover;
				});
				$scope.showPopover = function(posts, $event) {
					$scope.posts = posts;
					$scope.popover.show($event, $scope.posts);
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

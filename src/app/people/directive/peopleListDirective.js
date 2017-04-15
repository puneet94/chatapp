(function(angular) {
	'use strict';
	angular.module('petal.people')
		.directive('peopleList', [ 'userData',peopleList]);


	function peopleList( userData) {
		return {
			restrict: 'E',
			templateUrl: 'app/people/views/peopleListTemplate.html',
			replace: true,
			scope: {
				listType: '@listType',
				peopleList: '=peopleList',
				peopleSearchTextSubmit: '&peopleSearchTextSubmit'
			},
			controller: ['$scope', function($scope) {
				$scope.currentUser = userData.getUser();
				$scope.setPeopleSearch = function(interest,$event){
					if($scope.peopleSearchTextSubmit){
						
						$scope.peopleSearchTextSubmit({interest:interest});	
						$event.stopPropagation();
					}
					
				};
				$scope.removeAfterDecided = function(index){
					$scope.peopleList.splice(index,1);
				};
				
			}]
		};
	}
})(window.angular);

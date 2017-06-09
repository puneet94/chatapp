(function(angular) {
	'use strict';
	angular.module('petal.people')
		.directive('requestedPeopleList', [ 'peopleService', '$ionicLoading', requestedPeopleList]);


	function requestedPeopleList( peopleService, $ionicLoading) {
		return {
			restrict: 'E',
			templateUrl: 'app/people/views/requestedPeopleList.html',
			replace: true,
			controllerAs: 'rpc',
			scope: {

			},
			controller: ['$scope', function($scope) {
				var rpc = this;
				rpc.getRequestedPeople = getRequestedPeople;
				rpc.loadMorePeople = loadMorePeople;
				activate();
				
				function getRequestedPeople() {
					peopleService.getRequestedUsers(rpc.params).then(function(response) {

						angular.forEach(response.data.docs, function(value) {
							rpc.peopleList.push(value);
						});
						rpc.noPeople = !response.data.total;
						rpc.initialSearchCompleted = true;
						if (response.data.total > rpc.peopleList.length) {
							rpc.canLoadMoreResults = true;
						} else {
							rpc.canLoadMoreResults = false;
						}
					}).catch(function(err) {
						console.log(err);

					}).finally(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$ionicLoading.hide();
					});

				}

				function loadMorePeople() {
					rpc.params.page += 1;
					getRequestedPeople();
				}

				function activate() {
					rpc.canLoadMoreResults = false;
					rpc.initialSearchCompleted = false;
					rpc.peopleList = [];
					rpc.params = {
						limit: 10,
						page: 1
					};
					getRequestedPeople();
				}


			}]
		};
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('NearbyPeopleController', ['$scope', '$state', 'peopleService','$ionicLoading', NearbyPeopleController]);

	function NearbyPeopleController($scope, $state, peopleService,$ionicLoading) {
		var apc = this;
		apc.getNearbyPeople = getNearbyPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;
		apc.releaseRange = releaseRange;
		apc.distance = 10;
		activate();

		function pullRefreshPeople() {
			activate();

		}

		function loadMorePeople() {
			apc.params.page += 1;
			getNearbyPeople();
		}
		function releaseRange(){
			activate();
		}
		function getNearbyPeople() {
			peopleService.getNearbyUsers(apc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.noPeople =!response.data.total;
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}).catch(function(err) {
				console.log(err);
			}).finally(function() {
				apc.initialSearchCompleted = true;
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});

		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.peopleList = [];
			apc.params = {
				limit: 25,
				page: 1,
				distance: apc.distance
			};
			getNearbyPeople();
		}
	}
})(window.angular);

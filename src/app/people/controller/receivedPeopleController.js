(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('ReceivedPeopleController', ['$scope', '$state', 'peopleService','$ionicLoading', ReceivedPeopleController]);

	function ReceivedPeopleController($scope, $state, peopleService,$ionicLoading) {
		var apc = this;
		apc.getReceivedPeople = getReceivedPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;


		activate();

		function pullRefreshPeople() {
			activate();

		}

		function loadMorePeople() {
			apc.params.page += 1;
			getReceivedPeople();
		}

		function getReceivedPeople() {
			peopleService.getReceivedUsers(apc.params).then(function(response) {
				
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.noPeople =!response.data.total;
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
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
				limit: 10,
				page: 1
			};
			getReceivedPeople();
		}
	}
})(window.angular);

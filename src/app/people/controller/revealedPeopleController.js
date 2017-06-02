(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('RevealedPeopleController', ['$scope', '$state', 'peopleService','$ionicLoading', RevealedPeopleController]);

	function RevealedPeopleController($scope, $state, peopleService,$ionicLoading) {
		var apc = this;
		apc.getRevealedPeople = getRevealedPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;


		activate();

		function pullRefreshPeople() {
			activate();

		}

		function loadMorePeople() {
			apc.params.page += 1;
			getRevealedPeople();
		}

		function getRevealedPeople() {
			peopleService.getRevealedUsers(apc.params).then(function(response) {
				
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.noPeople =!response.data.total;
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
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
				limit: 25,
				page: 1
			};
			getRevealedPeople();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('AllPeopleController', ['$scope', '$state', 'peopleService', AllPeopleController]);

	function AllPeopleController($scope, $state, peopleService) {
		var apc = this;
		apc.getAllPeople = getAllPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;
		apc.searchCrossSubmit = searchCrossSubmit;
		apc.peopleSearchTextSubmit = peopleSearchTextSubmit;

		activate();

		function pullRefreshPeople() {
			activate();

		}
		function searchCrossSubmit(){
			apc.peopleSearchText = '';
			apc.showSearchCross = false;
			activate();
		}
		function peopleSearchTextSubmit(interest){
			apc.showSearchCross = true;
			if(interest){
				apc.peopleSearchText = interest;	
			}
			
			activate();
		}
		function loadMorePeople() {
			apc.params.page += 1;
			getAllPeople();
		}

		function getAllPeople() {
			peopleService.getAllUsers(apc.params).then(function(response) {
				console.log(response);
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
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
			if(apc.peopleSearchText){
				apc.params.interest = 	apc.peopleSearchText;
			}
			getAllPeople();
		}
	}
})(window.angular);

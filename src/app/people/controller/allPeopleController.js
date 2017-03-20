(function(angular){
	'use strict';
	angular.module('petal.people')
		.controller('AllPeopleController',['$scope','$state','peopleService',AllPeopleController]);

	function AllPeopleController($scope,$state,peopleService){
		var apc = this;
		apc.getAllPeople = getAllPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;
		apc.peopleList = [];
		apc.params = {
			limit: 25,
			page: 1
		};
		activate();
		function pullRefreshPeople(){
			apc.params.page = 1;
			apc.peopleList = [];
			getAllPeople();

		}
		function loadMorePeople(){
			apc.params.page+=1;
			getAllPeople();
		}
		function getAllPeople() {
			peopleService.getAllUsers(apc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
			});

		}
		function activate(){
			getAllPeople();
		}
	}
})(window.angular);
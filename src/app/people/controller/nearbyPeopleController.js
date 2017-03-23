(function(angular){
	'use strict';
	angular.module('petal.people')
		.controller('NearbyPeopleController',['$scope','$state','peopleService','userData',NearbyPeopleController]);

	function NearbyPeopleController($scope,$state,peopleService,userData){

		var apc = this;
		apc.currentUser = userData.getUser();
		apc.getNearbyPeople = getNearbyPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;
		apc.peopleList = [];
		apc.params = {
			limit: 25,
			page: 1,
			distance: 1000
		};
		activate();
		function pullRefreshPeople(){
			apc.params.page = 1;
			apc.peopleList = [];
			getNearbyPeople();

		}
		function loadMorePeople(){
			apc.params.page+=1;
			getNearbyPeople();
		}
		function getNearbyPeople() {
			peopleService.getNearbyUsers(apc.params).then(function(response) {
				console.log(response);
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
			}).catch(function(err){
				console.log("nearby error");
				console.log(err);
			});

		}
		function activate(){
			getNearbyPeople();
		}
	}
})(window.angular);
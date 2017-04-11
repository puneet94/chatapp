(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('NearbyPostController',['$scope','$state','postService','$ionicLoading',NearbyPostController]);

	function NearbyPostController($scope,$state,postService,$ionicLoading){
		var apc = this;
		apc.getNearbyPosts = getNearbyPosts;
		apc.pullRefreshPosts = pullRefreshPosts;
		apc.loadMorePosts = loadMorePosts;
		apc.releaseRange = releaseRange;
		apc.distance = 10;
		activate();

		function pullRefreshPosts() {
			activate();

		}
		function releaseRange(){
			activate();
		}
		function loadMorePosts() {
			apc.params.page += 1;
			getNearbyPosts();
		}

		function getNearbyPosts() {
			postService.getNearbyPosts(apc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					apc.postsList.push(value);
				});
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.postsList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}).catch(function(err) {
				console.log(err);
				if(err.code==3){
					window.alert("Unable to acces your location");
				}
				else if(err.code==2 || err.code==1){
					window.alert("Please enable location or gps");
				}

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});


		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.postsList = [];
			apc.params = {
				limit: 10,
				page: 1,
				distance: apc.distance
			};
			getNearbyPosts();
		}
	}
})(window.angular);
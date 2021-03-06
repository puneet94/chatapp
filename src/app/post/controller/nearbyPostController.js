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
				apc.noPosts =!response.data.total;
				
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.postsList.length) {
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
				apc.initialSearchCompleted = true;
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
(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('PopularPostController',['$scope','$state','postService','$ionicLoading',PopularPostController]);

	function PopularPostController($scope,$state,postService,$ionicLoading){
		var apc = this;
		apc.getPopularPosts = getPopularPosts;
		apc.pullRefreshPosts = pullRefreshPosts;
		apc.loadMorePosts = loadMorePosts;
		activate();

		function pullRefreshPosts() {
			activate();

		}

		function loadMorePosts() {
			apc.params.page += 1;
			getPopularPosts();
		}

		function getPopularPosts() {
			postService.getPopularPosts(apc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					apc.postsList.push(value);
				});
				if(!response.data.total){
					apc.noPosts = true;
				}
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
			});


		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.postsList = [];
			apc.params = {
				limit: 3,
				page: 1
			};
			getPopularPosts();
		}
	}
})(window.angular);
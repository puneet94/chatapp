(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('PopularPostController',['$scope','$state','postService',PopularPostController]);

	function PopularPostController($scope,$state,postService){
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
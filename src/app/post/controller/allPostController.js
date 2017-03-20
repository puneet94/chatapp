(function(angular) {
	'use strict';
	angular.module('petal.post')
		.controller('AllPostController', ['$scope', '$state', 'postService', AllPostController]);

	function AllPostController($scope, $state, postService) {
		var apc = this;
		apc.getAllPosts = getAllPosts;
		apc.pullRefreshPosts = pullRefreshPosts;
		apc.loadMorePosts = loadMorePosts;
		apc.postsList = [];
		apc.params = {
			limit: 25,
			page: 1
		};
		activate();
		function pullRefreshPosts(){
			apc.params.page = 1;
			apc.postsList = [];
			getAllPosts();

		}
		function loadMorePosts(){
			apc.params.page+=1;
			getAllPosts();
		}
		function getAllPosts() {
			postService.getAllPosts(apc.params).then(function(response) {
				console.log(response);
				angular.forEach(response.data.docs, function(value) {
					apc.postsList.push(value);
				});
			});

		}
		function activate(){
			getAllPosts();
		}
	}
})(window.angular);

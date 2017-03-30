(function(angular) {
	'use strict';
	angular.module('petal.post')
		.controller('AllPostController', ['$scope', '$state', 'postService', AllPostController]);

	function AllPostController($scope, $state, postService) {
		var apc = this;
		apc.getAllPosts = getAllPosts;
		apc.pullRefreshPosts = pullRefreshPosts;
		apc.loadMorePosts = loadMorePosts;
		apc.postSearchTextSubmit = postSearchTextSubmit;
		apc.searchCrossSubmit = searchCrossSubmit;
		apc.params = {
				limit: 3,
				page: 1
			};
		activate();
		
		function pullRefreshPosts() {
			activate();

		}
		function searchCrossSubmit(){
			apc.postSearchText = '';
			apc.showSearchCross = false;
			activate();
		}
		function postSearchTextSubmit(interest){
			
			apc.showSearchCross = true;
			if(interest){
				apc.postSearchText = interest;	
			}
			
			activate();
		}
		function loadMorePosts() {
			apc.params.page += 1;
			getAllPosts();
		}

		function getAllPosts() {

			postService.getAllPosts(apc.params).then(function(response) {
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
				window.alert(JSON.stringify(err));

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
				page: 1,

			};
			if(apc.postSearchText){
				apc.params.interest = 	apc.postSearchText;
			}
			getAllPosts();
		}
	}
})(window.angular);

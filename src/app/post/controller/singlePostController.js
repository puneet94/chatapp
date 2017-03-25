(function(angular) {
	'use strict';
	angular.module('petal.post')
		.controller('SinglePostController', ['$scope', '$state', 'postService', '$stateParams','$ionicHistory','upvoteService',SinglePostController]);

	function SinglePostController($scope, $state, postService,$stateParams,$ionicHistory,upvoteService) {
		var apc = this;
		apc.getSinglePost= getSinglePost;
		apc.submitPostUpvote = submitPostUpvote;
		apc.deletePostUpvote = deletePostUpvote;
		apc.getPostDistance = getPostDistance;
		apc.back = function(){
			
			window.history.back(); 
		};
		
		activate();
		
		function getSinglePost() {
			postService.getPost($stateParams.id).then(function(response) {
				apc.post = response.data;
				apc.distanceObj = {
					latitude:apc.post.loc[1],
					longitude: apc.post.loc[0],
					diatance: 0
				};
				getPostDistance();
				
				
			});

		}
		function checkPostUpvote(){
			upvoteService.getUpvote(apc.currentPost).then(function(res){
				
				apc.postUpvoted = res.data || false;
			}).catch(function(err){
				console.log(err);
			});
		}
		function submitPostUpvote(){
			upvoteService.createUpvote(apc.currentPost).then(function(res){
				checkPostUpvote();
			}).catch(function(err){
				console.log(err);
			});
		}
		function deletePostUpvote(){
			upvoteService.deleteUpvote(apc.currentPost).then(function(res){
				checkPostUpvote();
			}).catch(function(err){
				console.log(err);
			});
		}
		function activate(){
			apc.currentPost = $stateParams.id;
			getSinglePost();
			checkPostUpvote();
			
		}
		function getPostDistance(){
			postService.getDistance(apc.distanceObj);
		}
	}
})(window.angular);

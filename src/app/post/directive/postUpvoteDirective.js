(function(angular) {
	'use strict';
	angular.module('petal.post')
		.directive('postUpvote', ['$state', 'upvoteService','$timeout',postUpvote]);


	function postUpvote( $state, upvoteService,$timeout) {
		return {
			restrict: 'E',
			templateUrl: 'app/post/views/postUpvoteTemplate.html',
			scope: {
				postId: '=postId',
				upvotesLength: '=upvotesLength'
			},
			replace: true,
			link: function (scope) {
				scope.checkPostUpvote = checkPostUpvote;
				scope.submitPostUpvote = submitPostUpvote;
				scope.deletePostUpvote = deletePostUpvote;
				activate();
				function activate() {

					scope.loadingUpvote = true;
					checkPostUpvote();					
				}


				function checkPostUpvote() {
					upvoteService.getUpvote(scope.postId).then(function(res) {
						
						scope.postUpvoted = res.data;
						scope.loadingUpvote = false;	
					}).catch(function(err) {
						console.log("check error");
						console.log(err);
					});
				}

				function submitPostUpvote() {
					scope.postUpvoted = true;
					
					upvoteService.createUpvote(scope.postId).then(function() {
						
						scope.upvotesLength+=1;	
						
					}).catch(function(err) {
						console.log("submit error");
						console.log(err);
					});
				}

				function deletePostUpvote() {
					scope.postUpvoted = false;
					upvoteService.deleteUpvote(scope.postId).then(function() {
						
						scope.upvotesLength-=1;	
						
					}).catch(function(err) {
						
						window.alert(err);
					});
				}

				

			}
		};
	}

	
})(window.angular);

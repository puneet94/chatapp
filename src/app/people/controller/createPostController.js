(function(angular) {
	'use strict';
	angular.module('petal.post')
		.controller('CreatePostController', ['$scope', '$state', 'postService', CreatePostController]);

	function CreatePostController($scope, $state, postService) {
		var cpc = this;
		cpc.submitPost = submitPost;
		cpc.post = {};
		$scope.$watch(function(){
			return cpc.post.content;
		}, function(newVal, oldVal) {
			if (newVal && newVal.length > 300) {
				cpc.post.content = oldVal;
			}
		});

		function submitPost() {
			postService.submitPost(cpc.post).then(function(response) {
				console.log(response);
			}).catch(function(err) {
				console.log("post error");
				console.log(err);
			});
		}
	}
})(window.angular);

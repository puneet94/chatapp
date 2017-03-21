(function(angular) {
	'use strict';
	angular.module('petal.post')
		.controller('SinglePostController', ['$scope', '$state', 'postService', '$stateParams','$ionicHistory',SinglePostController]);

	function SinglePostController($scope, $state, postService,$stateParams,$ionicHistory) {
		var apc = this;
		apc.getSinglePost= getSinglePost;
		
		apc.back = function(){
			$ionicHistory.goBack();
		};
		
		activate();
		
		function getSinglePost() {
			postService.getPost($stateParams.id).then(function(response) {
				console.log("singlepost");
				console.log(response);
				
			});

		}
		function activate(){
			getSinglePost();
		}
	}
})(window.angular);

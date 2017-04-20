(function(angular) {
	'use strict';
	angular.module('petal.post')
		.controller('CreatePostController', ['$scope', '$state', 'postService','$ionicLoading', 'homeService',CreatePostController]);

	function CreatePostController($scope, $state, postService,$ionicLoading,homeService) {
		var cpc = this;
		cpc.submitPost = submitPost;
		cpc.post = {};
		$ionicLoading.hide();
		cpc.goBack = function(){
			window.history.back();
		};
		$scope.$watch(function(){
			return cpc.post.content;
		}, function(newVal, oldVal) {
			if (newVal && newVal.length > 300) {
				cpc.post.content = oldVal;
			}
		});

		function submitPost() {
			$ionicLoading.show();
			postService.submitPost(cpc.post).then(function(response) {
				$state.go('home.post.latest');
			}).catch(function(err) {
				console.log("post error");
				console.log(err);
			});
		}

		
		cpc.cancelUpload = function() {
			if(cpc.post.imageId){
				homeService.deleteUpload(cpc.post.imageId).then(function(response){
					cpc.post.image = '';
					cpc.post.imageId = '';					
				});
			}

			
		};

		cpc.submitUpload = function(file, errFiles) {
			if(cpc.post.imageId){
				cpc.cancelUpload();
			}
			cpc.loadingImage = true;
			cpc.file = file;
			cpc.errFile = errFiles && errFiles[0];
			if (cpc.file) {
				homeService.submitUpload(cpc.file).then(function(response) {
					console.log("uploaded fi");
					console.log(response);
					cpc.post.image = response.data.image;
					cpc.post.imageId = response.data.imageId;
					cpc.loadingImage = false;
				});
			}

		};
		
	}
})(window.angular);

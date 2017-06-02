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
				$ionicLoading.hide();
				$state.go('home.post.latest');
			}).catch(function(err) {
				console.log("post controller error");
				console.log(err);
			}).finally(function(){
				$ionicLoading.hide();
			});
		}
		cpc.selectRandomImage = function(img){
			cpc.post.image = img;
		};
		cpc.loadRandomImages = function(imageText){
			cpc.loadingRandomImage = true;
			cpc.randomImages = [];
			homeService.getImages(imageText).then(function(response){
				cpc.randomImages = response.data;
				cpc.loadingRandomImage = false;
			}).catch(function(err){
				console.log("images err");
				console.log(err);
			});
		};
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
					cpc.post.image = response.data.image;
					cpc.post.imageId = response.data.imageId;
					cpc.loadingImage = false;
				});
			}

		};
		
	}
})(window.angular);

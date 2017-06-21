(function(angular) {
	'use strict';
	angular.module('petal.message')
		.controller('MessageRoomCreateController', ['$scope', '$state', 'messageRoomService','homeService','$window',MessageRoomCreateController]);

	function MessageRoomCreateController($scope, $state, messageRoomService,homeService,$window) {
		var acc = this;
		activate();
		acc.leaveMessageCreate = function(){
			$window.history.back();
		};
		acc.messageRoomPage = function(messageRoom){
			$state.go('messageRoom', { roomId: messageRoom._id});				
		};
		acc.createMessageRoom = function(){
			
			messageRoomService.createMessageRoom(acc.messageRoom)
				.then(function(response){
					acc.messageRoomPage(response.data.savedMessageRoom);
					console.log(response);

				}).catch(function(response){
					console.log("error response");
					window.alert(response.data.Message);
				});
		};
		acc.loadRandomImages = function(imageText){
			acc.loadingRandomImage = true;
			acc.randomImages = [];
			homeService.getImages(imageText).then(function(response){
				acc.randomImages = response.data;
				acc.loadingRandomImage = false;
			}).catch(function(err){
				console.log("images err");
				console.log(err);
			});
		};
		acc.selectRandomImage = function(img){
			acc.messageRoom.messageRoomImage = img;
		};
		acc.cancelUpload = function() {
			if(acc.messageRoom.imageId){
				homeService.deleteUpload(acc.messageRoom.imageId).then(function(response){
					acc.messageRoom.messageRoomImage = '';
					acc.messageRoom.imageId = '';					
				});
			}
		};

		acc.submitUpload = function(file, errFiles) {
			if(acc.post.imageId){
				acc.cancelUpload();
			}
			acc.loadingImage = true;
			acc.file = file;
			acc.errFile = errFiles && errFiles[0];
			if (acc.file) {
				homeService.submitUpload(acc.file).then(function(response) {
					acc.messageRoom.messageRoomImage = response.data.image;
					acc.messageRoom.imageId = response.data.imageId;
					acc.loadingImage = false;
				});
			}
		};
		function activate() {
			acc.messageRoom = {};
		}
	}
})(window.angular);

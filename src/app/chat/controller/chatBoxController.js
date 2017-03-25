(function(angular) {
	'use strict';
	angular.module('petal.chat')

	.controller('ChatBoxController', ['$scope', 'Socket', '$stateParams', 'userData', 'homeService','chatService' ,'$ionicScrollDelegate','userService','Upload',ChatBoxController]);

	function ChatBoxController($scope, Socket, $stateParams, userData, homeService,chatService,$ionicScrollDelegate,userService,Upload) {
		var cbc = this;

		cbc.currentUser = userData.getUser()._id;
		cbc.receiverUserID = $stateParams.user;
		cbc.chatList = [];
		cbc.chatRoomId = '';
		cbc.loadMoreChats = loadMoreChats;
		cbc.messageLoading = false;
		cbc.params = {
			page: 1,
			limit: 5
		};
		activate();
		function loadMoreChats(){
			cbc.params.page+=1;
			getChatMessages();
		}
		function getReceiver(){
			userService.getUser(cbc.receiverUserID).then(function(response){
				cbc.receiverUser = response.data;
			}).catch(function(err){
				window.alert(err);
				console.log(err);
			});
		}
		function getChatMessages() {
			chatService.getChatMessages(cbc.chatRoomId,cbc.params).then(function(res) {
				
				angular.forEach(res.data.docs, function(chat) {
					cbc.chatList.unshift(chat);
				});
			}).catch(function(res) {
				window.alert(res);
				console.log(res);
			}).finally(function(){
				$ionicScrollDelegate.scrollBottom(true);
				$scope.$broadcast('scroll.refreshComplete');
			});

		}
		function activate() {
			chatService.getChatRoom(cbc.receiverUserID).then(function(res) {
				console.log(res);
				cbc.chatRoomId = res.data._id;
				socketJoin();
				getChatMessages();
			}, function(res) {
				console.log('the error in getting chatroom');
				console.log(res);
			});
			getReceiver();
		}


		function socketJoin() {
			console.log("socket joined");
			Socket.emit('addToChatRoom', { 'roomId': cbc.chatRoomId });
			Socket.on('messageReceived', function(message) {
				
				cbc.chatList.push(message);
				$ionicScrollDelegate.scrollBottom(true);
				//$('.chatBoxUL').animate({ scrollTop: 99999999 }, 'slow');
			});
			Socket.on('messageSaved', function(message) {
				
				cbc.chatList.push(message);
				$ionicScrollDelegate.scrollBottom(true);
				//$('.chatBoxUL').animate({ scrollTop: 99999999 }, 'slow');
			});
		}

		cbc.clickSubmit = function() {

			cbc.messageLoading = true;
			var chatObj = { 'message': cbc.myMsg,receiver:$stateParams.user, 'roomId': cbc.chatRoomId };
			chatService.sendChatMessage(chatObj).then(function(res) {
				cbc.myMsg = ' ';
				cbc.messageLoading = false;
				console.log($('#chatInput'));
				$('#chatInput').focus();
			}).catch( function(err) {

				console.log(err);
			});


		};


		cbc.submitUpload = function(){
			cbc.file.upload = Upload.upload({
					url: homeService.baseURL + 'upload/singleUpload',
					data: { file: cbc.file }
				});

				cbc.file.upload.then(function(response) {
					cbc.file.result = response.data;
					cbc.uploadedImage = response.data;
					console.log("the banner image");
					console.log(cbc.uploadedImage);
					cbc.cancelUpload();



					var chatObj = { 'message': cbc.uploadedImage,receiver:$stateParams.user, 'roomId': cbc.chatRoomId ,type:'img'};
			chatService.sendChatMessage(chatObj).then(function(res) {
				console.log(res);
				$('#chatInput').focus();
			}).catch( function(err) {

				console.log(err);
			});

				});
		};
		cbc.cancelUpload = function(){
			cbc.showTempImage = false;
			cbc.tempImageUrl = '';
		};
		cbc.uploadSingleImage = function(file, errFiles) {
			cbc.file = file;
			cbc.errFile = errFiles && errFiles[0];
			if (file) {
				cbc.showTempImage = true;
				cbc.tempImageUrl = file;
				cbc.formBannerLoading = true;
				/*
				file.upload = Upload.upload({
					url: homeService.baseURL + 'upload/singleUpload',
					data: { file: file }
				});

				file.upload.then(function(response) {
					file.result = response.data;
					cbc.uploadedImage = response.data;
					console.log("the banner image");
					console.log(cbc.uploadedImage);
					cbc.formBannerLoading = false;

				});*/
			}
		};

	}
})(window.angular);

/*userService.getUserDetails(cbc.receiverUserIDId, { 'fields': 'displayName firstName' }).then(function(response) {
					console.log("the receiver");
					console.log(response.data);
					cbc.receiverUserID = response.data.displayName || (response.data.firstName);
				});*/

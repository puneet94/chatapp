(function(angular) {
	'use strict';
	angular.module('petal.chat')

	.controller('ChatBoxController', ['$scope', '$timeout', 'Socket', '$stateParams', 'userData', 'homeService', 'chatService', '$ionicScrollDelegate', 'userService', 'Upload', '$ionicLoading', '$window', 'blocked', ChatBoxController]);

	function ChatBoxController($scope, $timeout, Socket, $stateParams, userData, homeService, chatService, $ionicScrollDelegate, userService, Upload, $ionicLoading, $window, blocked) {
		var cbc = this;
		cbc.isBlocked = blocked;
		if (cbc.isBlocked === true) {
			window.alert("blocked profile");
		}
		cbc.currentUser = userData.getUser()._id;
		cbc.receiverUserID = $stateParams.user;
		cbc.chatList = [];
		cbc.chatRoomId = '';
		cbc.loadMoreChats = loadMoreChats;
		cbc.scrollBottom = scrollBottom;
		cbc.messageLoading = false;
		cbc.messageTryCount = 0;
		cbc.params = {
			page: 1,
			limit: 5
		};
		activate();

		function loadMoreChats() {
			cbc.params.page += 1;
			getChatMessages();
		}

		function getReceiver() {
			userService.getUser(cbc.receiverUserID).then(function(response) {
				cbc.receiverUser = response.data;
			}).catch(function(err) {

				console.log(err);
			});
		}

		function scrollBottom() {
			$timeout(function() {
				$ionicScrollDelegate.scrollBottom(true);
			});

		}

		function getChatMessages() {
			chatService.getChatMessages(cbc.chatRoomId, cbc.params).then(function(res) {

				angular.forEach(res.data.docs, function(chat) {
					cbc.chatList.unshift(chat);
				});
			}).catch(function(res) {

				console.log(res);
			}).finally(function() {
				scrollBottom();
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.hide();
			});

		}

		function activate() {
			$ionicLoading.show();
			chatService.getChatRoom(cbc.receiverUserID).then(function(res) {
				cbc.chatRoom = res.data;
				cbc.chatRoomId = res.data._id;

				socketJoin();
				getChatMessages();

			}, function(err) {
				console.log(err);
			});
			getReceiver();



		}


		function socketJoin() {
			Socket.emit('addToChatRoom', { 'roomId': cbc.chatRoomId });
			Socket.on('messageReceived', function(message) {

				cbc.chatList.push(message);
				scrollBottom();
				cbc.messageLoading = false;
			});

		}

		cbc.clickSubmit = function() {

			cbc.messageLoading = true;
			cbc.focusInput = true;

			if (window.cordova && (!window.cordova.plugins.Keyboard.isVisible)) {
				window.cordova.plugins.Keyboard.show();
			}
			scrollBottom();
			var chatObj = { 'message': cbc.myMsg, receiver: $stateParams.user, 'roomId': cbc.chatRoomId };
			chatService.sendChatMessage(chatObj).then(function(res) {
				cbc.myMsg = '';
				cbc.chatList.push(res.data.message);
				scrollBottom();
				cbc.messageTryCount = 0;
			}).catch(function(err) {
				console.log(err);
				cbc.messageTryCount += 1;

				if (cbc.messageTryCount <= 3) {
					cbc.clickSubmit();
				}

			}).finally(function() {
				cbc.messageLoading = false;
			});


		};


		cbc.submitUpload = function() {
			cbc.messageLoading = true;
			cbc.file.upload = Upload.upload({
				url: homeService.baseURL + 'upload/singleUpload',
				data: { file: cbc.file }
			});

			cbc.file.upload.then(function(response) {
				cbc.file.result = response.data;
				cbc.uploadedImage = response.data;
				cbc.cancelUpload();
				var chatObj = { 'message': cbc.uploadedImage, receiver: $stateParams.user, 'roomId': cbc.chatRoomId, type: 'img' };
				chatService.sendChatMessage(chatObj).then(function(res) {
					scrollBottom();
					cbc.chatList.push(res.data.message);
					cbc.messageLoading = false;
				}).catch(function(err) {
					console.log(err);

				});

			});
		};
		cbc.cancelUpload = function() {
			cbc.showTempImage = false;
			cbc.tempImageUrl = '';
		};
		cbc.uploadSingleImage = function(file, errFiles) {
			cbc.file = file;
			cbc.errFile = errFiles && errFiles[0];
			if (file) {
				cbc.showTempImage = true;
				cbc.tempImageUrl = file;
				scrollBottom();
			}
		};
		cbc.leaveChatBox = function() {
			Socket.emit('removeFromRoom', { 'roomId': cbc.chatRoomId });

			chatService.updateChatRoom(cbc.chatRoomId).then(function(res) {

			}).catch(function(err) {
				console.log(err);
			}).finally(function() {


			});

			$window.history.back();


		};

	}
})(window.angular);

/*userService.getUserDetails(cbc.receiverUserIDId, { 'fields': 'displayName firstName' }).then(function(response) {
					console.log("the receiver");
					console.log(response.data);
					cbc.receiverUserID = response.data.displayName || (response.data.firstName);
				});*/

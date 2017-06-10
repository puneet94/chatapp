(function(angular) {
	'use strict';
	angular.module('petal.message')

	.controller('MessageRoomController', ['$scope', '$timeout', 'Socket', '$stateParams', 'userData', 'homeService', 'messageService', '$ionicScrollDelegate', 'userService', 'Upload', '$ionicLoading', '$window', 'blocked', MessageRoomController]);

	function MessageRoomController($scope, $timeout, Socket, $stateParams, userData, homeService, messageService, $ionicScrollDelegate, userService, Upload, $ionicLoading, $window, blocked) {
		var cbc = this;
		cbc.isBlocked = blocked;
		cbc.currentUser = userData.getUser()._id;
		cbc.receiverUserID = $stateParams.user;
		cbc.messageList = [];
		cbc.messageRoomId = '';
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
			messageService.getChatMessages(cbc.messageRoomId, cbc.params).then(function(res) {

				angular.forEach(res.data.docs, function(message) {
					cbc.messageList.unshift(message);
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
			messageService.getChatRoom(cbc.receiverUserID).then(function(res) {
				cbc.messageRoom = res.data;
				cbc.messageRoomId = res.data._id;

				socketJoin();
				getChatMessages();

			}, function(err) {
				console.log(err);
			});
			getReceiver();



		}


		function socketJoin() {
			Socket.emit('addToMessagetRoom', { 'roomId': cbc.messageRoomId });
			Socket.on('roomMessageReceived', function(message) {

				cbc.messageList.push(message);
				scrollBottom();
				cbc.messageLoading = false;
			});

		}

		cbc.clickSubmit = function($event) {

			cbc.messageLoading = true;
			cbc.focusInput = true;

			if (window.cordova ) {
				
				window.cordova.plugins.Keyboard.show();
				//window.cordova.fireWindowEvent('native.keyboardshow', {'keyboardHeight': +262});
            				window.cordova.plugins.Keyboard.isVisible = true;
			}
			scrollBottom();
			var messageObj = { 'message': cbc.myMsg, receiver: $stateParams.user, 'roomId': cbc.messageRoomId };
			messageService.sendChatMessage(messageObj).then(function(res) {
				cbc.myMsg = '';
				cbc.messageList.push(res.data.message);
				scrollBottom();
				cbc.messageTryCount = 0;
			}).catch(function(err) {
				//console.log(err);
				cbc.messageTryCount += 1;

				if (cbc.messageTryCount <= 3) {
					cbc.clickSubmit();
				}

			}).finally(function() {
				cbc.messageLoading = false;
			});

			$event.preventDefault();

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
				var messageObj = { 'message': cbc.uploadedImage, receiver: $stateParams.user, 'roomId': cbc.messageRoomId, type: 'img' };
				messageService.sendChatMessage(messageObj).then(function(res) {
					scrollBottom();
					cbc.messageList.push(res.data.message);
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
		cbc.leaveMessageRoom = function() {
			Socket.emit('removeFromRoom', { 'roomId': cbc.messageRoomId });

			messageService.updateChatRoom(cbc.messageRoomId).then(function(res) {

			}).catch(function(err) {
				//console.log(err);
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
